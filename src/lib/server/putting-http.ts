import { NextResponse } from "next/server";
import { PuttingError } from "./putting";

export function puttingJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export function puttingFailure(error: unknown) {
  return puttingJson({ ok: false, error: error instanceof PuttingError ? error.message : "The leaderboard is temporarily unavailable. Please try again." }, error instanceof PuttingError ? error.status : 503);
}
export async function puttingBody(request: Request): Promise<unknown> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new PuttingError("Invalid request origin.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new PuttingError("Expected JSON.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new PuttingError("Invalid request.", 400);
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 6000) { await reader.cancel(); throw new PuttingError("Submission is too large.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new PuttingError("Invalid JSON.", 400); }
}
