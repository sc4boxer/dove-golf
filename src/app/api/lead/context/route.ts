import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const token_hash = sha256Hex(token);

    const { data: tokenRow, error: tokenRowError } = await supabase
      .from("leads")
      .select("id,email,created_at,payload")
      .eq("token_hash", token_hash)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenRowError) {
      return NextResponse.json({ ok: false, error: tokenRowError.message }, { status: 500 });
    }

    if (!tokenRow) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
    }

    const { data: latestForEmail, error: latestForEmailError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", tokenRow.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestForEmailError) {
      return NextResponse.json({ ok: false, error: latestForEmailError.message }, { status: 500 });
    }

    const createdAtMs = tokenRow.created_at ? new Date(tokenRow.created_at).getTime() : NaN;
    const tokenAgeMs = Number.isNaN(createdAtMs) ? null : Date.now() - createdAtMs;
    const isExpired = tokenAgeMs === null ? false : tokenAgeMs > TOKEN_TTL_MS;
    const isLatest = latestForEmail?.id === tokenRow.id;

    if (!isLatest || isExpired) {
      return NextResponse.json({ ok: false, error: "Token expired" }, { status: 410 });
    }

    const payload = tokenRow.payload && typeof tokenRow.payload === "object" ? tokenRow.payload : {};

    return NextResponse.json({ ok: true, payload });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Something went wrong" },
      { status: 500 }
    );
  }
}

