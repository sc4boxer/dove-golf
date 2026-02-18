import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 254);
    const payload = body?.payload ?? null;

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

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/lead/verify?token=${token}`;

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Verify your Golf Fit Summary",
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your results:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Something went wrong." },
      { status: 500 }
    );
  }
}
