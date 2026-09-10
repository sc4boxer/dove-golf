import { getSessionFeedback, type ShotOutcome } from "./beginner-session.ts";
import type { RangeRescueClub } from "./plans";

export const STORAGE_KEY = "dove-golf-practice-v1";
export const MAX_SESSIONS = 30;

export type PracticeSession = {
  id: string;
  completedAt: string;
  localDate: string;
  club: RangeRescueClub;
  before: ShotOutcome[];
  after: ShotOutcome[];
};

export type HistoryState = { version: 1; enabled: true; sessions: PracticeSession[] };

function localDate(date: Date): string {
  return `${date.getFullYear().toString().padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validShots(value: unknown): value is ShotOutcome[] {
  return Array.isArray(value) && value.length === 5 && value.every((shot) =>
    shot === "air" || shot === "contact" || shot === "miss" || shot === "unsure");
}

function validSession(value: unknown, now: Date): value is PracticeSession {
  if (!record(value) || typeof value.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id)) return false;
  if (value.club !== "iron" && value.club !== "driver") return false;
  if (!validShots(value.before) || !validShots(value.after) || !validDate(value.localDate)) return false;
  if (typeof value.completedAt !== "string") return false;
  const completed = new Date(value.completedAt);
  if (!Number.isFinite(completed.getTime()) || completed.toISOString() !== value.completedAt || completed > now) return false;
  // The completion date was recorded in the golfer's local timezone, which may
  // differ from this device's current timezone after travel or a timezone change.
  const utcDay = new Date(`${value.completedAt.slice(0, 10)}T12:00:00.000Z`).getTime();
  const storedDay = new Date(`${value.localDate}T12:00:00.000Z`).getTime();
  return Math.abs(storedDay - utcDay) <= 86_400_000;
}

function copySession(session: PracticeSession): PracticeSession {
  return {
    id: session.id, completedAt: session.completedAt, localDate: session.localDate,
    club: session.club, before: [...session.before], after: [...session.after],
  };
}

function newestFirst(a: PracticeSession, b: PracticeSession): number {
  return b.completedAt.localeCompare(a.completedAt) || a.id.localeCompare(b.id);
}

/** Reject a corrupt document as a whole so incomplete records never earn credit. */
export function parseHistory(raw: string | null, now = new Date()): HistoryState | null {
  if (raw === null || raw.length > 65_536 || !Number.isFinite(now.getTime())) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!record(value) || value.version !== 1 || value.enabled !== true || !Array.isArray(value.sessions) || value.sessions.length > MAX_SESSIONS) return null;
    const ids = new Set<string>();
    const sessions: PracticeSession[] = [];
    for (const session of value.sessions) {
      if (!validSession(session, now) || ids.has(session.id)) return null;
      ids.add(session.id);
      sessions.push(copySession(session));
    }
    return { version: 1, enabled: true, sessions: sessions.sort(newestFirst) };
  } catch {
    return null;
  }
}

export function appendSession(existing: readonly PracticeSession[], session: PracticeSession): PracticeSession[] {
  const now = new Date();
  if (!validSession(session, now) || existing.some((item) => !validSession(item, now))) throw new Error("Only complete, valid practice sessions can be saved.");
  const sessions = new Map<string, PracticeSession>();
  for (const item of [...existing].sort(newestFirst)) {
    if (!sessions.has(item.id)) sessions.set(item.id, copySession(item));
  }
  sessions.set(session.id, copySession(session));
  return [...sessions.values()].sort(newestFirst).slice(0, MAX_SESSIONS);
}

export function createSession(club: RangeRescueClub, before: readonly ShotOutcome[], after: readonly ShotOutcome[], now = new Date(), id: string = globalThis.crypto.randomUUID()): PracticeSession {
  if (!Number.isFinite(now.getTime())) throw new Error("A valid completion date is required.");
  const session = { id, club, before: [...before], after: [...after], completedAt: now.toISOString(), localDate: localDate(now) };
  if (!validSession(session, new Date())) throw new Error("Only complete, valid practice sessions can be saved.");
  return session;
}

export function getClubSessions(sessions: readonly PracticeSession[], club: RangeRescueClub): PracticeSession[] {
  return sessions.filter((session) => session.club === club).map(copySession).sort(newestFirst);
}

export function getPracticeSeries(sessions: readonly PracticeSession[], club: RangeRescueClub) {
  const now = new Date();
  const completed = Math.min(3, new Set(getClubSessions(sessions, club)
    .filter((session) => session.completedAt <= now.toISOString() && session.localDate <= localDate(now))
    .map((session) => session.localDate)).size);
  const steps = club === "driver" ? [
    { title: "Set up and observe", description: "Use the driver setup guide. Record what happens with five starting balls, then five after the guided practice." },
    { title: "Repeat an easy movement", description: "Return on another day. Keep the same driver, tee height, and ball position, and repeat the shorter, easy swing." },
    { title: "Review your contact", description: "On a third practice day, record another two sets. Review contact and height with the same setup before adding distance." },
  ] : [
    { title: "Set up and observe", description: "Use the iron setup guide. Record what happens with five starting balls, then five after the guided practice." },
    { title: "Repeat a small movement", description: "Return on another day. Keep the same iron and repeat the small swing from the practice guide." },
    { title: "Review your contact", description: "On a third practice day, record another two sets. Review contact and height with the same setup before adding distance." },
  ];
  return { completed, currentIndex: Math.min(completed, 2), steps, complete: completed === 3 };
}

export function getWeeklyChallenge(sessions: readonly PracticeSession[], now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const weekStart = localDate(start);
  const weekEnd = localDate(end);
  const today = localDate(now);
  const count = new Set(sessions.filter((session) =>
    session.localDate >= weekStart && session.localDate <= weekEnd && session.localDate <= today && session.completedAt <= now.toISOString())
    .map((session) => session.localDate)).size;
  return { count, target: 2 as const, complete: count >= 2, weekStart, weekEnd };
}

export function getNextPractice(sessions: readonly PracticeSession[], club: RangeRescueClub): { title: string; next: string } {
  const latest = getClubSessions(sessions, club)[0];
  if (latest) return getSessionFeedback(latest.before, latest.after, club);
  return {
    title: "Start with a short practice",
    next: club === "driver"
      ? "Follow the driver setup guide, record five starting balls, then try the shorter, easy swing and record five more. Notice contact and height before distance."
      : "Follow the iron setup guide, record five starting balls, then try the small swing and record five more. Notice contact and height before distance.",
  };
}
