"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./PracticeAccount.module.css";

type Props = {
  configured: boolean;
  ready: boolean;
  email: string | null;
  busy: boolean;
  error: string | null;
  status: string | null;
  localSessionCount: number;
  onSendCode: (email: string) => Promise<void>;
  onVerifyCode: (email: string, code: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onImport: () => Promise<void>;
};

export function PracticeAccount({ configured, ready, email, busy, error, status, localSessionCount, onSendCode, onVerifyCode, onSignOut, onImport }: Props) {
  const id = useId();
  const emailInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousEmail = useRef(email);
  const [draftEmail, setDraftEmail] = useState("");
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const pending = busy || working;
  const displayedError = error || actionError;

  useEffect(() => { if (sentEmail) codeInput.current?.focus(); }, [sentEmail]);
  useEffect(() => {
    if (email !== previousEmail.current) heading.current?.focus();
    previousEmail.current = email;
  }, [email]);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const address = draftEmail.trim();
    setWorking(true);
    setActionError(null);
    try {
      await onSendCode(address);
      setSentEmail(address);
      setCode("");
    } catch {
      setActionError("We couldn’t send a sign-in code. Please try again.");
    } finally { setWorking(false); }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !sentEmail) return;
    setWorking(true);
    setActionError(null);
    try { await onVerifyCode(sentEmail, code.trim()); }
    catch { setActionError("We couldn’t verify that code. Check the email and try again."); }
    finally { setWorking(false); }
  }

  async function accountAction(action: "import" | "signOut") {
    if (pending) return;
    setWorking(true);
    setActionError(null);
    try {
      if (action === "import") await onImport();
      else {
        await onSignOut();
        setSentEmail(null);
        setCode("");
      }
    } catch {
      setActionError(action === "import" ? "We couldn’t import your device history. Please try again." : "We couldn’t sign you out. Please try again.");
    } finally { setWorking(false); }
  }

  if (!configured) return null;

  return <section className={styles.panel} aria-labelledby={`${id}-heading`}>
    <p className={styles.kicker}>Optional practice account</p>
    <h2 ref={heading} tabIndex={-1} id={`${id}-heading`}>{email ? "Your practice, across devices" : "Keep your practice with you"}</h2>
    {!ready ? <p className={styles.muted} role="status">Checking your practice account…</p> : <>
      {displayedError && <p className={styles.error} role="alert">{displayedError}</p>}
      {status && <p className={styles.status} role="status">{status}</p>}
      {email ? <>
        <p className={styles.email}>Signed in as <strong>{email}</strong></p>
        <p className={styles.muted}>Completed practice sessions save to your account so you can pick up on another device. Sign in with the same email to see them.</p>
        {localSessionCount > 0 && <div className={styles.import}>
          <h3>Bring your browser history with you</h3>
          <p className={styles.muted}>{localSessionCount} completed {localSessionCount === 1 ? "session is" : "sessions are"} saved in this browser. Import them only if they belong to you. Signing in does not import them automatically.</p>
          <button className={styles.secondary} disabled={pending} onClick={() => void accountAction("import")}>Import {localSessionCount} device {localSessionCount === 1 ? "session" : "sessions"}</button>
        </div>}
        <button className={styles.textButton} disabled={pending} onClick={() => void accountAction("signOut")}>{pending ? "Please wait…" : "Sign out"}</button>
        <p className={styles.fine}>Signing out keeps your account history. Browser-only history stays on this device until you delete it.</p>
      </> : <>
        <p className={styles.muted}>Create or sign in to a practice account with an email code. Completed sessions will save to your account across devices. You can also keep practicing without an account.</p>
        <p className={styles.fine}>History already in this browser is imported only when you choose to import it after signing in.</p>
        {sentEmail ? <form className={styles.form} onSubmit={verifyCode} aria-busy={pending}>
          <p className={styles.email}>Enter the code sent to <strong>{sentEmail}</strong>. Check your spam folder if it hasn’t arrived.</p>
          <label htmlFor={`${id}-code`}>Email sign-in code</label>
          <input ref={codeInput} id={`${id}-code`} name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" minLength={6} maxLength={8} required value={code} onChange={(event) => setCode(event.target.value)} disabled={pending} aria-describedby={`${id}-code-help`} />
          <p id={`${id}-code-help`} className={styles.fine}>Use the 6–8 digit code from the email.</p>
          <button className={styles.primary} type="submit" disabled={pending}>{pending ? "Checking…" : "Verify and sign in"}</button>
          <button className={styles.textButton} type="button" disabled={pending} onClick={() => { setSentEmail(null); setCode(""); setActionError(null); requestAnimationFrame(() => emailInput.current?.focus()); }}>Change email or request a new code</button>
        </form> : <form className={styles.form} onSubmit={sendCode} aria-busy={pending}>
          <label htmlFor={`${id}-email`}>Email address</label>
          <input ref={emailInput} id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} disabled={pending} />
          <button className={styles.primary} type="submit" disabled={pending}>{pending ? "Sending…" : "Email me a sign-in code"}</button>
        </form>}
      </>}
    </>}
  </section>;
}
