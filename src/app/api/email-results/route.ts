import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json(
    {
      ok: false,
      error: "Direct email is temporarily unavailable. Use the device share button and choose Mail or Messages.",
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": "86400",
      },
    },
  );
}

export async function POST() {
  // This endpoint intentionally remains closed until DoveGolf has an atomic,
  // distributed IP + recipient abuse limiter in front of the email provider.
  // The public result UI uses the device share sheet and sends no email or PII
  // to DoveGolf.
  return unavailable();
}