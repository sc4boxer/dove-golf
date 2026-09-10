import { appendSession, parseHistory, STORAGE_KEY, type PracticeSession } from "./practice-history.ts";
export function createPracticeStore(storage: () => Pick<Storage, "getItem" | "setItem" | "removeItem">) {
  type Snapshot = { ready: boolean; enabled: boolean; sessions: PracticeSession[]; error: string | null };
  const serverSnapshot: Snapshot = { ready: false, enabled: false, sessions: [], error: null };
  let snapshot = serverSnapshot;
  let previousRaw: string | null | undefined;
  const listeners = new Set<() => void>();

  function emit() { listeners.forEach(listener => listener()); }
  function getSnapshot(): Snapshot {
    try {
      const raw = storage().getItem(STORAGE_KEY);
      if (snapshot.ready && raw === previousRaw) return snapshot;
      previousRaw = raw;
      const saved = parseHistory(raw);
      snapshot = {
        ready: true,
        enabled: saved?.enabled ?? false,
        sessions: saved?.sessions ?? [],
        error: raw !== null && !saved ? "We couldn’t read your saved practice. Clear the saved history below to start again, or practice without saving." : null,
      };
    } catch {
      previousRaw = undefined;
      if (!snapshot.ready || !snapshot.error) snapshot = { ...serverSnapshot, ready: true, error: "Saving is unavailable in this browser. You can still complete a practice session." };
    }
    return snapshot;
  }

  function write(sessions: PracticeSession[]) {
    try {
      const raw = JSON.stringify({ version: 1, enabled: true, sessions });
      storage().setItem(STORAGE_KEY, raw);
      previousRaw = raw;
      snapshot = { ready: true, enabled: true, sessions, error: null };
      emit();
      return true;
    } catch {
      snapshot = { ...getSnapshot(), error: "This session wasn’t saved. Browser storage may be full or blocked. You can keep practicing and try saving again." };
      emit();
      return false;
    }
  }

  function enable() {
    const current = getSnapshot();
    if (previousRaw === undefined || (previousRaw !== null && !current.enabled)) return false;
    return write(current.sessions);
  }

  function save(session: PracticeSession, optIn = false) {
    const current = getSnapshot();
    if (previousRaw === undefined || (previousRaw !== null && !current.enabled)) return false;
    if (!current.enabled && !optIn) return false;
    try {
      return write(appendSession(current.sessions, session));
    } catch {
      snapshot = { ...current, error: "This session couldn’t be saved. Please check your device’s date and complete both sets before trying again." };
      emit();
      return false;
    }
  }

  function forget() {
    try {
      storage().removeItem(STORAGE_KEY);
      previousRaw = null;
      snapshot = { ready: true, enabled: false, sessions: [], error: null };
      emit();
      return true;
    } catch {
      snapshot = { ...getSnapshot(), error: "We couldn’t clear browser storage. Try your browser’s site-data controls to remove saved practice." };
      emit();
      return false;
    }
  }

  return { getSnapshot, getServerSnapshot: () => serverSnapshot, enable, save, forget, subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; } };
}
