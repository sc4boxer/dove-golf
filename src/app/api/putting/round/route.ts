import { startRound } from "@/lib/server/putting";
import { puttingBody, puttingFailure, puttingJson } from "@/lib/server/putting-http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { await puttingBody(request); return puttingJson({ ok: true, ...await startRound(request) }, 201); }
  catch (error) { return puttingFailure(error); }
}
