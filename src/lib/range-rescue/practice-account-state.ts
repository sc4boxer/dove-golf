import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { PracticeSession } from "./practice-history.ts";

type Dependencies = {
  client: SupabaseClient | null;
  fetchAccountSessions: (client: SupabaseClient, owner: string) => Promise<PracticeSession[]>;
  saveAccountSessions: (client: SupabaseClient, sessions: PracticeSession[], owner: string) => Promise<PracticeSession[]>;
  clearAccountSessions: (client: SupabaseClient, owner: string) => Promise<void>;
};
type Snapshot = { configured: boolean; ready: boolean; user: User | null; sessions: PracticeSession[]; busy: boolean; error: string | null; status: string | null };

/** Async results belong to one mounted lifecycle and account epoch. */
export function createPracticeAccountStore(deps: Dependencies) {
  const { client } = deps;
  const initial: Snapshot = { configured: !!client, ready: !client, user: null, sessions: [], busy: false, error: null, status: null };
  let state = initial;
  let active = false;
  let epoch = 0;
  let revision = 0;
  let operation: object | null = null;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const listeners = new Set<() => void>();
  function update(patch: Partial<Snapshot>) {
    if (!active) return;
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }
  function valid(generation: number) { return active && epoch === generation; }
  async function refresh() {
    if (!active || !client || !state.user || operation) return;
    const owner = state.user.id;
    const generation = epoch;
    const ticket = ++revision;
    const timeout = setTimeout(() => {
      timers.delete(timeout);
      if (valid(generation) && revision === ticket) update({ ready: true, error: "Account practice is taking longer than expected. Check your connection or continue with browser-only practice." });
    }, 15000);
    timers.add(timeout);
    try {
      const sessions = await deps.fetchAccountSessions(client, owner);
      if (valid(generation) && revision === ticket) update({ sessions, ready: true, error: null });
    } catch {
      if (valid(generation) && revision === ticket) update({ ready: true, error: "We couldn’t load your account practice. Check your connection and return to this page to retry." });
    } finally { clearTimeout(timeout); timers.delete(timeout); }
  }
  function receive(next: User | null) {
    if (!active) return;
    if ((state.user?.id ?? null) === (next?.id ?? null)) {
      // Token refreshes deliver new User objects without changing account ownership.
      update({ user: next, ...(!next ? { ready: true } : {}) });
      return;
    }
    epoch++; revision++; operation = null;
    update({ user: next, sessions: [], ready: !next, busy: false, error: null, status: null });
    const generation = epoch;
    // Avoid awaiting Supabase calls inside its auth callback.
    void Promise.resolve().then(() => { if (valid(generation)) return refresh(); });
  }
  async function run(action: () => Promise<void>, failure: string) {
    if (!active || !client || operation) throw new Error("Please wait and try again.");
    const token = {};
    const generation = epoch;
    operation = token;
    update({ busy: true, error: null, status: null });
    try { await action(); return valid(generation); }
    catch {
      if (valid(generation)) { update({ error: failure }); throw new Error(failure); }
      return false;
    } finally {
      if (valid(generation) && operation === token) { operation = null; update({ busy: false }); }
    }
  }
  const actions = {
    async sendCode(email: string) {
      const generation = epoch;
      const completed = await run(async () => {
        const { error } = await client!.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
        if (error) throw error;
      }, "We couldn’t send a code. Check your email address, wait a minute, and try again.");
      if (completed && valid(generation)) update({ status: "Check your email for a sign-in code. It may take a moment to arrive." });
    },
    async verifyCode(email: string, token: string) {
      await run(async () => {
        const { error } = await client!.auth.verifyOtp({ email, token, type: "email" });
        if (error) throw error;
      }, "That code couldn’t be verified. Check it or request a new code.");
    },
    async signOut() {
      const generation = epoch;
      const completed = await run(async () => {
        const { error } = await client!.auth.signOut({ scope: "local" });
        if (error) throw error;
      }, "We couldn’t sign out. Check your connection and try again.");
      if (completed && valid(generation)) receive(null);
    },
    async save(batch: PracticeSession[]): Promise<boolean> {
      if (!active || !client || !state.user || operation) return false;
      const owner = state.user.id;
      const generation = epoch;
      const ticket = ++revision;
      try {
        const completed = await run(async () => {
          const sessions = await deps.saveAccountSessions(client, batch, owner);
          if (valid(generation) && revision === ticket) update({ sessions, ready: true, status: "Practice saved to your account." });
        }, "This practice wasn’t saved to your account. Check your connection and try saving again before leaving.");
        if (valid(generation)) update({ ready: true });
        return completed && revision === ticket;
      } catch { if (valid(generation)) update({ ready: true }); return false; }
    },
    async forget(): Promise<void> {
      if (!active || !client || !state.user || operation) return;
      const owner = state.user.id;
      const generation = epoch;
      const ticket = ++revision;
      try {
        await run(async () => {
          await deps.clearAccountSessions(client, owner);
          if (valid(generation) && revision === ticket) update({ sessions: [], ready: true, status: "Account practice history deleted. Future completed sessions will still save while signed in." });
        }, "We couldn’t delete your account history. Check your connection and try again.");
      } catch { /* Keep the visible error reviewable. */ }
      if (valid(generation)) update({ ready: true });
    },
  };
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    actions,
    refresh,
    start() {
      active = true; epoch++; revision++; operation = null;
      update(initial);
      let subscribed = true;
      const timeout = setTimeout(() => {
        if (subscribed && active && !state.ready && !state.user) update({ ready: true, error: "Account sign-in is taking longer than expected. Check your connection or continue with browser-only practice." });
      }, 15000);
      const subscription = client?.auth.onAuthStateChange((_event, session) => {
        if (subscribed) { clearTimeout(timeout); receive(session?.user ?? null); }
      }).data.subscription;
      return () => {
        subscribed = false; active = false; epoch++; revision++; operation = null;
        timers.forEach(clearTimeout); timers.clear();
        clearTimeout(timeout); subscription?.unsubscribe();
      };
    },
  };
}
