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

    // Verify only once: only update rows that are not yet verified
    const { data, error } = await supabase
      .from("leads")
      .update({ verified_at: new Date().toISOString() })
      .eq("token_hash", token_hash)
      .is("verified_at", null)
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      // token not found OR already verified
      return NextResponse.json(
        { ok: false, error: "Invalid or already-used token" },
        { status: 400 }
      );
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // ✅ Send them back to the Results step (fit summary) with verified banner
    const redirectUrl = new URL("/diagnostic", base);
    redirectUrl.searchParams.set("verified", "1");
    redirectUrl.searchParams.set("step", "results");

    return NextResponse.redirect(redirectUrl);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
