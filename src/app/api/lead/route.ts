import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@");
  if (!localPart || !domain) return "[invalid-email]";

  const redactedLocal = `${localPart.slice(0, 2)}***`;
  return `${redactedLocal}@${domain}`;
}

function getSiteUrl(req: Request) {
  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envSiteUrl) return envSiteUrl.replace(/\/$/, "");

  const reqUrl = new URL(req.url);
  return `${reqUrl.protocol}//${reqUrl.host}`;
}

function logEmailEvent(event: string, details: Record<string, unknown>) {
  console.info(
    JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      ...details,
    })
  );
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const missingEnvVars = [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "RESEND_API_KEY",
      "RESEND_FROM",
    ].filter((key) => !process.env[key]);

    if (missingEnvVars.length > 0) {
      const error = `Missing required env vars: ${missingEnvVars.join(", ")}`;
      logEmailEvent("lead_email_config_error", { error });
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    const body = await req.json();

    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 254);
    const payload = body?.payload ?? null;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const token_hash = sha256Hex(token);

    const { error } = await supabase.from("leads").insert([
      {
        name,
        email,
        payload,
        token_hash,
      },
    ]);

    if (error) throw error;

    const verifyUrl = `${getSiteUrl(req)}/api/lead/verify?token=${token}`;

    logEmailEvent("lead_email_attempt", {
      email: maskEmail(email),
      verifyUrlHost: new URL(verifyUrl).host,
    });

    const resendResponse = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Verify your Golf Fit Summary",
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your results:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });

    logEmailEvent("lead_email_provider_response", {
      email: maskEmail(email),
      resendId: resendResponse.data?.id ?? null,
      resendError: resendResponse.error ?? null,
    });

    if (resendResponse.error) {
      return NextResponse.json(
        { ok: false, error: resendResponse.error.message || "Email provider error." },
        { status: 502 }
      );
    }

    if (!resendResponse.data?.id) {
      return NextResponse.json(
        { ok: false, error: "Email provider did not return a message id." },
        { status: 502 }
      );
    }

    const debug =
      process.env.NODE_ENV !== "production"
        ? {
            resendId: resendResponse.data.id,
            verifyUrl,
            to: maskEmail(email),
          }
        : undefined;

    return NextResponse.json({ ok: true, ...(debug ? { debug } : {}) });
  } catch (e: any) {
    logEmailEvent("lead_email_exception", {
      error: e?.message ?? "Something went wrong.",
    });

    return NextResponse.json(
      { ok: false, error: e?.message ?? "Something went wrong." },
      { status: 500 }
    );
  }
}
