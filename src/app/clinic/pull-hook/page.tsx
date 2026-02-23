"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { LikelihoodBars } from "@/components/clinic/LikelihoodBars";
import { PullHookWizard } from "@/components/clinic/PullHookWizard";
import { RangePlan } from "@/components/clinic/RangePlan";
import { track } from "@/lib/analytics/ga";
import { loadClinicSessions, saveClinicSession } from "@/lib/clinic/storage";
import { ClinicSession, PullHookInputs } from "@/lib/clinic/types";
import { evaluatePullHook, pullHookLeverLabel } from "@/lib/clinic/problems/pullHook";

/**
 * Pull Hook module mirrors Driver Slice architecture:
 * route page -> module wizard -> evaluate function -> likelihood split + range plan -> session storage/history.
 * It is linked from clinic landing through the same module grid card pattern.
 */
function defaultInputs(): Partial<PullHookInputs> {
  return {
    startLine: undefined,
    curveSeverity: undefined,
    strikeLocation: undefined,
    missPattern: undefined,
    tempoTransition: undefined,
    driverVsIrons: undefined,
    setupPattern: undefined,
  };
}

export default function PullHookPage() {
  const [inputs, setInputs] = useState<Partial<PullHookInputs>>(defaultInputs());
  const [result, setResult] = useState<ReturnType<typeof evaluatePullHook> | null>(null);
  const [sessions, setSessions] = useState<ClinicSession[]>(() => loadClinicSessions());
  const clinicCompletedTrackedRef = useRef(false);

  useEffect(() => {
    if (!result || clinicCompletedTrackedRef.current) return;

    clinicCompletedTrackedRef.current = true;
    track("dov_clinic_completed", {
      module: "doveclinic",
      placement: "pull_hook_results",
      step: "results",
      version: "v1",
    });
  }, [result]);

  const explanations = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.split)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => ({ key, text: result.bucketExplanations[key as keyof typeof result.bucketExplanations] }));
  }, [result]);

  const handleComplete = () => {
    const full = inputs as PullHookInputs;
    const evaluation = evaluatePullHook(full);
    setResult(evaluation);

    const session: ClinicSession = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      problemKey: "pullHook",
      inputs: full,
      result: evaluation,
    };

    setSessions(saveClinicSession(session));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-medium tracking-wide text-slate-500">DoveClinic™</p>
            <Link href="/clinic" className="text-sm font-medium text-slate-700 underline">
              Back to Clinic
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Pull Hook debugger</h1>
          <p className="text-sm text-slate-600">Fixes left-start shots that over-curve left by separating delivery, strike, setup, and equipment levers.</p>
        </div>

        {!result ? (
          <PullHookWizard value={inputs} onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))} onComplete={handleComplete} />
        ) : (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Likelihood split</h2>
              <p className="mt-2 text-sm text-slate-600">
                Primary lever: <span className="font-medium text-slate-900">{pullHookLeverLabel(result.primaryLever)}</span>
              </p>
              <div className="mt-4">
                <LikelihoodBars split={result.split} />
              </div>
              <div className="mt-5 space-y-3">
                {explanations.map((item) => (
                  <p key={item.key} className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">{item.key}:</span> {item.text}
                  </p>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Why this is likely</p>
                <p className="mt-1">{result.whyLikely}</p>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Diagnosis summary</h2>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Primary likely cause:</span> {result.primaryCause}
              </p>
              {result.secondaryCause ? (
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Secondary cause:</span> {result.secondaryCause}
                </p>
              ) : null}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">What to check next</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {result.checksNext.map((check) => (
                      <li key={check}>• {check}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">Equipment levers</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {result.equipmentLevers.map((lever) => (
                      <li key={lever}>• {lever}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Range test to validate</p>
                <p className="mt-1">{result.rangeValidationTest}</p>
              </div>
            </section>

            <RangePlan tests={result.rangePlan} />

            <button
              type="button"
              onClick={() => {
                clinicCompletedTrackedRef.current = false;
                setResult(null);
                setInputs(defaultInputs());
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white"
            >
              Start a new session
            </button>
          </section>
        )}

        <ClinicSessionHistory
          sessions={sessions.filter((session) => session.problemKey === "pullHook")}
          onOpen={(session) => {
            if (session.problemKey !== "pullHook") return;
            setResult(session.result as ReturnType<typeof evaluatePullHook>);
            setInputs(session.inputs as PullHookInputs);
          }}
        />
      </div>
    </main>
  );
}
