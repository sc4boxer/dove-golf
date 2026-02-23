"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { ClinicWizard } from "@/components/clinic/ClinicWizard";
import { LikelihoodBars } from "@/components/clinic/LikelihoodBars";
import { RangePlan } from "@/components/clinic/RangePlan";
import { evaluateDriverSlice, primaryLeverLabel } from "@/lib/clinic/problems/driverSlice";
import { loadClinicSessions, saveClinicSession, updateClinicSession } from "@/lib/clinic/storage";
import { ClinicFeedbackOutcome, ClinicResult, ClinicSession, DriverSliceInputs } from "@/lib/clinic/types";
import { track } from "@/lib/analytics/ga";

const DISCRIMINATOR_OPTIONS = ["heel", "toe", "center"] as const;

function defaultInputs(): Partial<DriverSliceInputs> {
  return {
    startLine: undefined,
    curveSeverity: undefined,
    strikeLocation: undefined,
    missPattern: undefined,
    gripStrength: undefined,
    tempoRelease: undefined,
  };
}

export default function DriverSlicePage() {
  const [inputs, setInputs] = useState<Partial<DriverSliceInputs>>(defaultInputs());
  const [result, setResult] = useState<ClinicResult | null>(null);
  const [sessions, setSessions] = useState<ClinicSession[]>(() => loadClinicSessions());
  const [activeSession, setActiveSession] = useState<ClinicSession | null>(null);
  const [needsDiscriminator, setNeedsDiscriminator] = useState(false);
  const clinicCompletedTrackedRef = useRef(false);
  const recommendationViewedTrackedRef = useRef(false);

  useEffect(() => {
    if (!result || clinicCompletedTrackedRef.current) return;

    clinicCompletedTrackedRef.current = true;
    track("dov_clinic_completed", {
      module: "doveclinic",
      placement: "driver_slice_results",
      step: "results",
      version: "v1",
    });
  }, [result]);

  useEffect(() => {
    if (!result || recommendationViewedTrackedRef.current) return;

    recommendationViewedTrackedRef.current = true;
    track("dov_clinic_recommendation_viewed", {
      module: "doveclinic",
      placement: "driver_slice_range_plan",
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
    const full = inputs as DriverSliceInputs;
    const evaluation = evaluateDriverSlice(full);
    setResult(evaluation);

    const session: ClinicSession = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      problemKey: "driverSlice",
      inputs: full,
      result: evaluation,
    };
    setActiveSession(session);
    setSessions(saveClinicSession(session));
  };

  const applyFeedback = (outcome: ClinicFeedbackOutcome) => {
    if (!activeSession) return;

    const updated = updateClinicSession(activeSession.id, (existing) => ({ ...existing, feedbackOutcome: outcome }));
    setSessions(updated);
    setActiveSession((prev) => (prev ? { ...prev, feedbackOutcome: outcome } : prev));
    setNeedsDiscriminator(outcome === "no-change" || outcome === "worse");
  };

  const applyDiscriminator = (strike: (typeof DISCRIMINATOR_OPTIONS)[number]) => {
    if (!activeSession) return;
    const recalculated = evaluateDriverSlice({ ...activeSession.inputs, strikeLocation: strike, persistentRightStart: "yes" });
    const updated = updateClinicSession(activeSession.id, (existing) => ({
      ...existing,
      inputs: { ...existing.inputs, strikeLocation: strike, persistentRightStart: "yes" },
      result: recalculated,
    }));
    setSessions(updated);
    setResult(recalculated);
    setNeedsDiscriminator(false);
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
          <h1 className="text-3xl font-semibold tracking-tight">Driver Slice debugger</h1>
        </div>

        {!result ? (
          <ClinicWizard value={inputs} onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))} onComplete={handleComplete} />
        ) : (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Likelihood split</h2>
              <p className="mt-2 text-sm text-slate-600">
                Primary lever: <span className="font-medium text-slate-900">{primaryLeverLabel(result.primaryLever)}</span>
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

            <RangePlan tests={result.rangePlan} />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-900">Did this help reduce your slice today?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["fixed", "improved", "no-change", "worse"] as const).map((outcome) => (
                  <button
                    key={outcome}
                    type="button"
                    onClick={() => applyFeedback(outcome)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {outcome}
                  </button>
                ))}
              </div>

              {needsDiscriminator ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">One follow-up: where does contact feel most often?</p>
                  <div className="mt-3 flex gap-2">
                    {DISCRIMINATOR_OPTIONS.map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => applyDiscriminator(choice)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <button
              type="button"
              onClick={() => {
                clinicCompletedTrackedRef.current = false;
                recommendationViewedTrackedRef.current = false;
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
          sessions={sessions}
          onOpen={(session) => {
            setActiveSession(session);
            setResult(session.result);
            setInputs(session.inputs);
          }}
        />
      </div>
    </main>
  );
}
