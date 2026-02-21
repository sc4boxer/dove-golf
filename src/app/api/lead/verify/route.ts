import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getBaseUrl(req: Request) {
  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envSiteUrl) return envSiteUrl;

  const reqUrl = new URL(req.url);
  return `${reqUrl.protocol}//${reqUrl.host}`;
}

function buildRedirectUrl(req: Request, status: string, token?: string) {
  const redirectUrl = new URL("/diagnostic", getBaseUrl(req));
  redirectUrl.searchParams.set("step", "results");
  redirectUrl.searchParams.set("verifyStatus", status);

  if (status === "verified" || status === "already_verified") {
    redirectUrl.searchParams.set("verified", "1");
  }

  if (token) {
    redirectUrl.searchParams.set("resumeToken", token);
  }

  return redirectUrl;
}

function logVerifyEvent(event: string, details: Record<string, unknown>) {
  console.info(
    JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      ...details,
    })
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing token" },
        { status: 400 }
      );
    }

    const token_hash = sha256Hex(token);

    const { data: tokenRow, error: tokenRowError } = await supabase
      .from("leads")
      .select("id,email,verified_at,created_at")
      .eq("token_hash", token_hash)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenRowError) {
      return NextResponse.json(
        { ok: false, error: tokenRowError.message },
        { status: 500 }
      );
    }

    if (!tokenRow) {
      logVerifyEvent("lead_verify_invalid", {
        found: false,
      });
      return NextResponse.redirect(buildRedirectUrl(req, "invalid"));
    }

    const createdAtMs = tokenRow.created_at
      ? new Date(tokenRow.created_at).getTime()
      : NaN;
    const tokenAgeMs = Number.isNaN(createdAtMs) ? null : Date.now() - createdAtMs;
    const isExpired = tokenAgeMs === null ? false : tokenAgeMs > TOKEN_TTL_MS;

    const { data: latestForEmail, error: latestForEmailError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", tokenRow.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestForEmailError) {
      return NextResponse.json(
        { ok: false, error: latestForEmailError.message },
        { status: 500 }
      );
    }

    const isLatest = latestForEmail?.id === tokenRow.id;

    logVerifyEvent("lead_verify_lookup", {
      found: true,
      alreadyVerified: Boolean(tokenRow.verified_at),
      tokenAgeMinutes:
        tokenAgeMs === null ? null : Math.max(0, Math.floor(tokenAgeMs / 60000)),
      isLatest,
      isExpired,
    });

    if (!isLatest || isExpired) {
      return NextResponse.redirect(buildRedirectUrl(req, "expired"));
    }

    if (tokenRow.verified_at) {
      return NextResponse.redirect(buildRedirectUrl(req, "already_verified", token));
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from("leads")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", tokenRow.id)
      .is("verified_at", null)
      .select("id")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    if (!updatedRow) {
      return NextResponse.redirect(buildRedirectUrl(req, "already_verified", token));
    }

    const redirectUrl = buildRedirectUrl(req, "verified", token);

    return NextResponse.redirect(redirectUrl);
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
