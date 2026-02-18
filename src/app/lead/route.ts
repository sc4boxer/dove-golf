import { NextResponse } from "next/server";

function isLikelyRealEmail(email: string) {
  // Basic format + low-effort junk filters (not “verification”)
  const e = email.trim().toLowerCase();

  if (e.length > 254) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return false;

  // common obvious fakes
  const blocked = [
    "test@", "asdf@", "qwer@", "example@", "fake@", "none@", "no@", "null@",
    "mailinator", "tempmail", "10minutemail", "guerrillamail"
  ];
  if (blocked.some((b) => e.includes(b))) return false;

  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 254);
    const payload = body?.payload ?? null; // we’ll store answers/results later

    if (!isLikelyRealEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // ✅ For now: just log it (next step we’ll store in a database)
    console.log("NEW LEAD:", { name, email, payload });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}