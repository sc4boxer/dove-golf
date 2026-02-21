"use client";

import React, { useMemo, useState } from "react";

type Props = {
  payload: any; // diagnostic answers object (driver/irons/full bag)
};

export default function EmailCaptureCard({ payload }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = useMemo(() => {
    const v = email.trim();
    // simple, practical email validation for v1
    return v.length >= 5 && v.includes("@") && v.includes(".");
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

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

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
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
          <label className="block text-sm font-medium text-slate-700">Email</label>
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
            disabled={!isValidEmail || status === "sending"}
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
