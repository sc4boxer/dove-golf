import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MAX_SESSIONS, parseHistory, type PracticeSession } from "./practice-history.ts";

/** Account responses are small JSON payloads; include their body in the deadline. */
export function createAccountFetch(nativeFetch: typeof fetch = (input, init) => globalThis.fetch(input, init), timeoutMs = 15_000): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const incoming = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    let rejectCancellation: (reason: Error) => void = () => {};
    const cancellation = new Promise<never>((_, reject) => { rejectCancellation = reject; });
    const cancel = (message: string) => {
      const error = new Error(message);
      rejectCancellation(error);
      controller.abort(error);
    };
    const onAbort = () => cancel("Account request cancelled. Please try again.");
    const timer = setTimeout(() => cancel("Account request timed out. Please try again."), timeoutMs);
    incoming?.addEventListener("abort", onAbort, { once: true });
    try {
      if (incoming?.aborted) {
        onAbort();
        return await cancellation;
      }
      const request = (async () => {
        const response = await nativeFetch(input, { ...init, signal: controller.signal });
        const body = response.body === null ? null : await response.arrayBuffer();
        return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
      })();
      return await Promise.race([request, cancellation]);
    } finally {
      clearTimeout(timer);
      incoming?.removeEventListener("abort", onAbort);
    }
  };
}

/** Public project credentials only; the server's service-role key is never used. */
export function createPracticeAccountClient(): SupabaseClient | null {
  if (process.env.NEXT_PUBLIC_PRACTICE_ACCOUNTS !== "true") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key || !key.startsWith("sb_publishable_")) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
    return createClient(url, key, { global: { fetch: createAccountFetch() }, auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "dove-golf-practice-auth-v1" } });
  } catch { return null; }
}

/** Database timestamps may use +00:00 rather than JS's canonical .000Z form. */
export function parseAccountSessions(rows: unknown): PracticeSession[] {
  if (!Array.isArray(rows) || rows.length > MAX_SESSIONS) throw new Error("Saved account practice could not be read.");
  const sessions = rows.map((row: unknown) => {
    if (typeof row !== "object" || row === null || Array.isArray(row)) throw new Error("Saved account practice could not be read.");
    const value = row as Record<string, unknown>;
    const date = typeof value.completed_at === "string" ? new Date(value.completed_at) : new Date(NaN);
    if (!Number.isFinite(date.getTime())) throw new Error("Saved account practice could not be read.");
    return { id: value.id, completedAt: date.toISOString(), localDate: value.local_date, club: value.club, before: value.before_shots, after: value.after_shots };
  });
  const parsed = parseHistory(JSON.stringify({ version: 1, enabled: true, sessions }));
  if (!parsed) throw new Error("Saved account practice could not be read. Check your device’s date and try again.");
  return parsed.sessions;
}

async function accountId(client: SupabaseClient, expectedUserId: string): Promise<string> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user || data.user.id !== expectedUserId) throw new Error("Your account changed. Please sign in again before accessing account practice.");
  return data.user.id;
}

export async function fetchAccountSessions(client: SupabaseClient, expectedUserId: string): Promise<PracticeSession[]> {
  const userId = await accountId(client, expectedUserId);
  const { data, error } = await client.from("practice_sessions")
    .select("id,completed_at,local_date,club,before_shots,after_shots")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false }).order("id", { ascending: true }).limit(MAX_SESSIONS);
  if (error) throw new Error("Account practice is unavailable. Your browser history has not changed.");
  return parseAccountSessions(data);
}

export async function saveAccountSessions(client: SupabaseClient, sessions: readonly PracticeSession[], expectedUserId: string): Promise<PracticeSession[]> {
  const parsed = parseHistory(JSON.stringify({ version: 1, enabled: true, sessions }));
  if (!parsed) throw new Error("Only complete practice sessions with valid dates can be synced.");
  const userId = await accountId(client, expectedUserId);
  const { data, error } = await client.rpc("save_practice_sessions", { p_sessions: parsed.sessions, p_expected_user_id: userId });
  if (error) throw new Error("Practice could not sync. Your browser history has not changed; please try again.");
  return parseAccountSessions(data);
}

export async function clearAccountSessions(client: SupabaseClient, expectedUserId: string): Promise<void> {
  const userId = await accountId(client, expectedUserId);
  const { error } = await client.rpc("clear_practice_sessions", { p_expected_user_id: userId });
  if (error) throw new Error("Account practice could not be deleted. Please try again.");
}
