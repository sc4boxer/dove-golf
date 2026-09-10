"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEY } from "@/lib/range-rescue/practice-history";
import { createPracticeStore } from "@/lib/range-rescue/practice-store";
import { usePracticeAccount } from "./PracticeAccountProvider";
import type { PracticeSession } from "@/lib/range-rescue/practice-history";

const store = createPracticeStore(() => window.localStorage);
function subscribe(listener: () => void) {
  const unsubscribe = store.subscribe(listener);
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) listener(); };
  window.addEventListener("storage", onStorage);
  return () => { unsubscribe(); window.removeEventListener("storage", onStorage); };
}

export function useDevicePracticeHistory() {
  return {
    ...useSyncExternalStore(subscribe, store.getSnapshot, store.getServerSnapshot),
    enable: store.enable, save: store.save, forget: store.forget,
  };
}

export function usePracticeHistory() {
  const local = useDevicePracticeHistory();
  const account = usePracticeAccount();
  if (account?.user) return {
    ready: account.ready, enabled: true, sessions: account.sessions,
    error: account.error, account: true, busy: account.busy, scope: account.user.id,
    enable: () => {}, save: (session: PracticeSession) => account.save([session]), forget: account.forget,
  };
  return { ...local, account: false, busy: false, scope: "browser" };
}
