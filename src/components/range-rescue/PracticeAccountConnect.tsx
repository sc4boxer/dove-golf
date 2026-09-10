"use client";
import { PracticeAccount } from "./PracticeAccount";
import { usePracticeAccount } from "./PracticeAccountProvider";
import { useDevicePracticeHistory } from "./usePracticeHistory";

export function PracticeAccountConnect() {
  const account = usePracticeAccount();
  const local = useDevicePracticeHistory();
  if (!account) return null;
  return <PracticeAccount configured={account.configured} ready={account.ready} email={account.user?.email ?? null} busy={account.busy} error={account.error} status={account.status} localSessionCount={local.sessions.length} onSendCode={account.sendCode} onVerifyCode={account.verifyCode} onSignOut={account.signOut} onImport={async () => {
    if (!await account.save(local.sessions)) throw new Error("Import failed");
  }} />;
}
