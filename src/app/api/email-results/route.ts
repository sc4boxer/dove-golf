import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildDiagnosisEmailContent,
  parseDiagnosisEmailInput,
} from "@/lib/share/diagnosisEmail";

const MAX_BODY_BYTES = 8_192;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function json(body: Record<string, unknown>, status = 200, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return NextResponse.json(body, { status, headers });
}

function hasExactKeys(value: Record<string, unknown>, keys: string[]) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function takeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (rateBuckets.size > 5_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }

  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  if (existing.count >= limit) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  }

  existing.count += 1;
  return 0;
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const allowed = new Set(["https://dovegolf.fit", "https://www.dovegolf.fit"]);
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      allowed.add(new URL(configured).origin);
    } catch {
      // Invalid optional configuration is ignored.
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) allowed.add(`https://${vercelUrl}`);
  return allowed.has(origin);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    if (!allowedOrigin(request)) {
      return json({ ok: false, error: "Request not allowed." }, 403);
    }
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ ok: false, error: "Invalid request." }, 415);
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "Request too large." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ ok: false, error: "Invalid request." }, 400);
    }

    if (
      !isPlainObject(body) ||
      !hasExactKeys(body, ["schemaVersion", "email", "website", "diagnosis"]) ||
      body.schemaVersion !== 1 ||
      typeof body.email !== "string" ||
      typeof body.website !== "string"
    ) {
      return json({ ok: false, error: "Invalid request." }, 400);
    }
    if (body.website) return json({ ok: true });

    const diagnosisInput = parseDiagnosisEmailInput(body.diagnosis);
    if (!diagnosisInput) {
      return json({ ok: false, error: "Invalid request." }, 400);
    }

    const email = body.email.trim().toLowerCase();
    if (
      email.length > 254 ||
      CONTROL_CHARACTERS.test(email) ||
      !EMAIL_PATTERN.test(email)
    ) {
      return json({ ok: false, error: "Please enter a valid email address." }, 400);
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");
    const retryAfter =
      takeRateLimit(`ip:${ipHash}`, 10, 10 * 60_000) ||
      takeRateLimit(`email:${emailHash}`, 3, 60 * 60_000);
    if (retryAfter) {
      console.info(JSON.stringify({ event: "diagnosis_email_rate_limited", requestId }));
      return json(
        { ok: false, error: "Please wait before requesting another email." },
        429,
        retryAfter,
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
    if (
      !resendApiKey ||
      !fromEmail ||
      !/@(?:[^>]*\.)?dovegolf\.fit>?$/i.test(fromEmail)
    ) {
      console.error(JSON.stringify({ event: "diagnosis_email_config_error", requestId }));
      return json({ ok: false, error: "Email is temporarily unavailable." }, 503);
    }

    const content = buildDiagnosisEmailContent(diagnosisInput);
    const safeMiss = escapeHtml(content.miss);
    const safeLabel = escapeHtml(content.insightLabel);
    const safeInsight = escapeHtml(content.insight);
    const safePlan = escapeHtml(content.rangePlan);
    const safeUrl = escapeHtml(content.shareUrl);
    const resend = new Resend(resendApiKey);
    const idempotencyDigest = crypto
      .createHash("sha256")
      .update([email, JSON.stringify(diagnosisInput), content.shareUrl].join("|"))
      .digest("hex")
      .slice(0, 48);

    const response = await resend.emails.send(
      {
        from: fromEmail,
        to: [email],
        subject: `Your DoveGolf result: ${content.miss}`,
        html: `
          <div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a">
            <div style="margin:0 auto;max-width:640px;border:1px solid #e2e8f0;border-radius:24px;background:#ffffff;padding:32px">
              <p style="margin:0 0 24px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:.12em">DOVE GOLF · YOUR RESULT</p>
              <p style="margin:0;color:#64748b;font-size:12px;font-weight:700">OBSERVED PATTERN</p>
              <h1 style="margin:8px 0 24px;font-size:32px;line-height:1.2">${safeMiss}</h1>
              <p style="margin:0;color:#64748b;font-size:12px;font-weight:700">${safeLabel.toUpperCase()}</p>
              <p style="margin:8px 0 24px;font-size:17px;line-height:1.6;color:#334155">${safeInsight}</p>
              <div style="border-top:1px solid #e2e8f0;padding-top:24px">
                <p style="margin:0 0 8px;font-weight:700">Your range plan</p>
                <p style="margin:0 0 24px;line-height:1.6;color:#334155">${safePlan}</p>
                <a href="${safeUrl}" style="color:#0f172a;font-weight:700">Open this DoveGolf tool</a>
              </div>
              <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.5">
                Educational starting point only. Test with a repeatable shot pattern.
              </p>
            </div>
          </div>
        `,
        text: [
          "DoveGolf · Your result",
          "",
          `Observed pattern: ${content.miss}`,
          `${content.insightLabel}: ${content.insight}`,
          "",
          "Your range plan",
          content.rangePlan,
          "",
          `Open this DoveGolf tool: ${content.shareUrl}`,
        ].join("\n"),
      },
      { idempotencyKey: `diagnosis/${idempotencyDigest}` },
    );

    if (response.error || !response.data?.id) {
      console.error(JSON.stringify({ event: "diagnosis_email_provider_failed", requestId }));
      return json({ ok: false, error: "Email is temporarily unavailable." }, 502);
    }

    console.info(
      JSON.stringify({
        event: "diagnosis_email_accepted",
        requestId,
        source: diagnosisInput.kind,
      }),
    );
    return json({ ok: true });
  } catch {
    console.error(JSON.stringify({ event: "diagnosis_email_exception", requestId }));
    return json({ ok: false, error: "Email is temporarily unavailable." }, 500);
  }
}
