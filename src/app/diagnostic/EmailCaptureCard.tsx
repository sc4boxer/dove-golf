"use client";

import React, { useMemo, useState } from "react";

type Props = {
  payload: any; // diagnostic answers object (driver/irons/full bag)
  onProfileSaved?: (profile: { firstName: string; lastName: string; email: string }) => void;
};

export default function EmailCaptureCard({ payload, onProfileSaved }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = useMemo(() => {
    const v = email.trim();
    // simple, practical email validation for v1
    return v.length >= 5 && v.includes("@") && v.includes(".");
  }, [email]);

  const hasValidName = useMemo(() => firstName.trim().length > 0 && lastName.trim().length > 0, [firstName, lastName]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!hasValidName) {
      setStatus("error");
      setErrorMsg("Please enter your first and last name.");
      return;
    }

    if (!isValidEmail) {
      setStatus("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }

    setStatus("sending");

    try {
      // ✅ CRITICAL FIX:
      // Persist the exact run payload so the verify redirect restores the correct summary.
      window.localStorage.setItem("diagnostic_last_payload", JSON.stringify(payload));

      const profile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
      };

      window.localStorage.setItem("lead_contact_profile", JSON.stringify(profile));

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          payload,
        }),
      });

      const result = await res
        .json()
        .catch(() => ({ ok: false, error: "Invalid response from server." }));

      if (!(res.ok && result?.ok === true)) {
        throw new Error(result?.error || "Failed to send verification email.");
      }

      setStatus("sent");
      onProfileSaved?.(profile);
    } catch (err: any) {
      console.error("Email verification submit failed", err);
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm font-semibold text-slate-900">Unlock premium insights</div>

      <p className="mt-2 text-sm text-slate-600">
        Verify your email to unlock specific shaft shortlists + settings guidance.
      </p>

      {status === "sent" ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">✅ Email sent</div>
          <div className="mt-1 text-sm text-emerald-800">
            Check your inbox and click the verification link to unlock premium results.
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4">
          <label className="block text-sm font-medium text-slate-700">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />

          <label className="mt-3 block text-sm font-medium text-slate-700">Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />

          <label className="mt-3 block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            inputMode="email"
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />

          {status === "error" && errorMsg && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={!isValidEmail || !hasValidName || status === "sending"}
            className="mt-4 w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send verification email"}
          </button>

          <p className="mt-3 text-xs text-slate-500">
            We only use your email to unlock premium insights for this diagnostic.
          </p>
        </form>
      )}
    </div>
  );
}
