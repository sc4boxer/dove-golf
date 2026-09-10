"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPracticeAccountClient, fetchAccountSessions, saveAccountSessions, clearAccountSessions } from "@/lib/range-rescue/practice-account";
import { createPracticeAccountStore } from "@/lib/range-rescue/practice-account-state";

function useAccount() {
  const [store] = useState(() => createPracticeAccountStore({ client: createPracticeAccountClient(), fetchAccountSessions, saveAccountSessions, clearAccountSessions }));
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  useEffect(() => {
    const stop = store.start();
    const refresh = () => { if (document.visibilityState === "visible") void store.refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { stop(); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [store]);
  return { ...state, ...store.actions };
}

const AccountContext = createContext<ReturnType<typeof useAccount> | null>(null);
export function PracticeAccountProvider({ children }: { children: ReactNode }) {
  return <AccountContext.Provider value={useAccount()}>{children}</AccountContext.Provider>;
}
export function usePracticeAccount() { return useContext(AccountContext); }
