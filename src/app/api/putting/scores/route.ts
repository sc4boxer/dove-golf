import { listScores, submitScore } from "@/lib/server/putting";
import { puttingBody, puttingFailure, puttingJson } from "@/lib/server/putting-http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get("period") === "alltime" ? "alltime" : "weekly";
  try { return puttingJson({ ok: true, entries: await listScores(period), period }); }
  catch (error) { return puttingFailure(error); }
}
export async function POST(request: Request) {
  try { return puttingJson({ ok: true, entry: await submitScore(request, await puttingBody(request)), period: "weekly" }, 201); }
  catch (error) { return puttingFailure(error); }
}
