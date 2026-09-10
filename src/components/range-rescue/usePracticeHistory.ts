"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEY } from "@/lib/range-rescue/practice-history";
import { createPracticeStore } from "@/lib/range-rescue/practice-store";

const store = createPracticeStore(() => window.localStorage);
function subscribe(listener: () => void) {
  const unsubscribe = store.subscribe(listener);
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) listener(); };
  window.addEventListener("storage", onStorage);
  return () => { unsubscribe(); window.removeEventListener("storage", onStorage); };
}

export function usePracticeHistory() {
  return {
    ...useSyncExternalStore(subscribe, store.getSnapshot, store.getServerSnapshot),
    enable: store.enable, save: store.save, forget: store.forget,
  };
}
