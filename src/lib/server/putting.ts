import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { COURSE_VERSION, replayRound, type Shot } from "@/lib/putting/physics";

export type VerifiedScore = { id: string; initials: string; score: number; rank: number; achievedAt: string; courseVersion: string };
export class PuttingError extends Error {
  constructor(message: string, public status = 503) { super(message); }
}
function database() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new PuttingError("Score posting is temporarily unavailable. You can still play.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function fail(error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (error.message?.includes("putting_rate_limit")) throw new PuttingError("Too many attempts. Please try again in an hour.", 429);
  if (error.message?.includes("putting_invalid_round")) throw new PuttingError("This round has expired or was already posted. Start a new round to post another score.", 409);
  console.error("putting_database_error", { code: error.code });
  throw new PuttingError("The leaderboard is temporarily unavailable. Please try again.");
}
function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
function clientHash(request: Request) {
  // Vercel overwrites this header; do not trust arbitrary forwarded headers elsewhere.
  const address = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local-shared";
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").update(`${new Date().toISOString().slice(0, 10)}:${address ?? "unknown-shared"}`).digest("hex");
}
function entry(row: Record<string, unknown>): VerifiedScore {
  return { id: String(row.id), initials: String(row.initials), score: Number(row.score), rank: Number(row.rank ?? row.rank_at_submission), achievedAt: String(row.created_at), courseVersion: String(row.course_version) };
}
export async function startRound(request: Request) {
  const db = database();
  const token = randomBytes(32).toString("hex");
  const { data, error } = await db.rpc("putting_start_round", { p_token_hash: tokenHash(token), p_client_hash: clientHash(request), p_version: COURSE_VERSION });
  fail(error);
  return { token, courseVersion: COURSE_VERSION, expiresAt: data as string };
}
export async function submitScore(request: Request, body: unknown): Promise<VerifiedScore> {
  if (!body || typeof body !== "object") throw new PuttingError("Invalid score submission.", 400);
  const input = body as Record<string, unknown>;
  if (typeof input.token !== "string" || !/^[a-f0-9]{64}$/.test(input.token)) throw new PuttingError("A valid round is needed to post your score.", 400);
  const initials = typeof input.initials === "string" ? input.initials.trim().toUpperCase() : "";
  if (!/^[A-Z0-9]{3}$/.test(initials) || ["ASS", "FUK", "FCK", "KKK", "SEX", "CUM", "FAG", "NIG"].includes(initials)) throw new PuttingError("Choose three letters or numbers suitable for a public leaderboard.", 400);
  const db = database();
  const { error: limitError } = await db.rpc("putting_check_limit", { p_key: `submit:${clientHash(request)}`, p_limit: 240 });
  fail(limitError);
  let result: ReturnType<typeof replayRound>;
  try { result = replayRound(input.shots as Shot[][]); }
  catch { throw new PuttingError("This score could not be verified. Please complete all five holes.", 400); }
  const { data, error } = await db.rpc("putting_submit_score", { p_token_hash: tokenHash(input.token), p_initials: initials, p_score: result.score, p_version: COURSE_VERSION });
  fail(error);
  return entry(data as Record<string, unknown>);
}
export type ScoreEdition = "current" | "original";
export async function listScores(period: "weekly" | "alltime", edition: ScoreEdition = "current") {
  // Read the original board in place; never relabel scores or change replay rules.
  const version = edition === "original" ? "five-hole-v1" : COURSE_VERSION;
  const { data, error } = await database().rpc("putting_leaderboard", { p_version: version, p_weekly: period === "weekly" });
  fail(error);
  return ((data ?? []) as Record<string, unknown>[]).map(entry);
}
export async function getVerifiedScore(id: string): Promise<VerifiedScore | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await database().from("putting_scores").select("id,initials,score,rank_at_submission,created_at,course_version").eq("id", id).eq("hidden", false).maybeSingle();
  fail(error);
  return data ? entry(data) : null;
}
