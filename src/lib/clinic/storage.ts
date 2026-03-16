import { ClinicSession } from "@/lib/clinic/types";

const STORAGE_KEY = "dove_clinic_sessions_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadClinicSessions(): ClinicSession[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClinicSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClinicSession(session: ClinicSession): ClinicSession[] {
  const current = loadClinicSessions();
  const next = [session, ...current].slice(0, 50);
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function updateClinicSession(
  id: string,
  updater: (existing: ClinicSession) => ClinicSession
): ClinicSession[] {
  const current = loadClinicSessions();
  const next = current.map((session) => (session.id === id ? updater(session) : session));
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
