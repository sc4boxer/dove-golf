"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { DiagnosisSharePanel } from "@/components/diagnosis/DiagnosisSharePanel";
import { DiagnosisStoryDeck } from "@/components/diagnosis/DiagnosisStoryDeck";
import { LikelihoodBars } from "@/components/clinic/LikelihoodBars";
import { PullHookWizard } from "@/components/clinic/PullHookWizard";
import { RangePlan } from "@/components/clinic/RangePlan";
import { track } from "@/lib/analytics/ga";
import { getBallFlightShapeFromObservation } from "@/lib/visual/ballFlightObservationShape";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
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

  const flightShape =
    inputs.startLine && inputs.startLine !== "unsure"
      ? getBallFlightShapeFromObservation(
          inputs.startLine,
          inputs.curveSeverity === "none" ? "straight" : "left",
        )
      : null;

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
          <DiagnosisStoryDeck
            title="Your Pull Hook result"
            slides={[
              {
                id: "pattern",
                label: "Your pattern",
                eyebrow: "Observed shot",
                title: `${inputs.startLine ?? "Unknown"} start · ${inputs.curveSeverity ?? "Unknown"} left curve`,
                content: (
                  <div>
                    <dl className="grid gap-3 sm:grid-cols-3">
                      {[
                        ["Start", inputs.startLine ?? "Not measured"],
                        ["Curve", inputs.curveSeverity === "none" ? "No meaningful left curve" : `${inputs.curveSeverity ?? "Unknown"} left`],
                        ["Strike", inputs.strikeLocation ?? "Not measured"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
                          <dd className="mt-2 font-semibold capitalize text-slate-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {flightShape ? (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                        <BallFlightChart shape={flightShape} className="mx-auto max-w-2xl" />
                      </div>
                    ) : null}
                  </div>
                ),
              },
              {
                id: "why",
                label: "What it suggests",
                eyebrow: "Leading hypothesis",
                title: pullHookLeverLabel(result.primaryLever),
                content: (
                  <div>
                    <p className="max-w-2xl text-lg leading-8 text-slate-700">{result.whyLikely}</p>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                      <LikelihoodBars split={result.split} />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {explanations.map((item) => (
                        <p key={item.key} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                          <span className="font-medium text-slate-900">{item.key}:</span> {item.text}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">What to check next</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {result.checksNext.map((check) => <li key={check}>• {check}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">Equipment levers</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {result.equipmentLevers.map((lever) => <li key={lever}>• {lever}</li>)}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-slate-600">
                      This ranking is a hypothesis to test, not proof of a swing cause.
                    </p>
                  </div>
                ),
              },
              {
                id: "test",
                label: "Range test",
                eyebrow: "One variable at a time",
                title: "Test the leading idea",
                content: (
                  <div>
                    <RangePlan tests={result.rangePlan} />
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-sm font-semibold text-slate-900">Range test to validate</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{result.rangeValidationTest}</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "share",
                label: "Save & share",
                eyebrow: "Your portable result",
                title: "Share your shot profile",
                content: (
                  <div>
                    <DiagnosisSharePanel
                      miss={`Observed shot: ${inputs.startLine ?? "unknown"} start, ${inputs.curveSeverity === "none" ? "no meaningful left curve" : `${inputs.curveSeverity ?? "unknown"} left curve`}, ${inputs.strikeLocation ?? "unknown"} strike.`}
                      likelyCause={`${pullHookLeverLabel(result.primaryLever)} is the leading hypothesis. Test it against the range plan before treating it as the cause.`}
                      rangePlan={result.rangePlan[0]?.whatToDo || "Hit two five-ball sets at 80% speed. Change one variable and compare start line, curve, and strike."}
                      shareUrl="https://dovegolf.fit/clinic/pull-hook"
                      source="pull_hook"
                      insightLabel="Leading hypothesis"
                      emailDiagnosis={{
                        kind: "pull_hook",
                        startLine: inputs.startLine ?? "unsure",
                        curveSeverity: inputs.curveSeverity ?? "none",
                        strikeLocation: inputs.strikeLocation ?? "unsure",
                        primaryLever: result.primaryLever,
                      }}
                      details={[
                        { label: "Start", value: inputs.startLine ?? "Not measured" },
                        { label: "Curve", value: inputs.curveSeverity === "none" ? "No meaningful left curve" : `${inputs.curveSeverity ?? "Unknown"} left` },
                        { label: "Strike", value: inputs.strikeLocation ?? "Not measured" },
                      ]}
                      flightShape={flightShape}
                      analyticsContext={{
                        pattern: `${inputs.startLine ?? "unknown"}-${inputs.curveSeverity ?? "unknown"}-left`,
                        strike: inputs.strikeLocation ?? "unknown",
                        category: "pull_hook",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        clinicCompletedTrackedRef.current = false;
                        setResult(null);
                        setInputs(defaultInputs());
                      }}
                      className="mt-5 min-h-12 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Start a new session
                    </button>
                  </div>
                ),
              },
            ]}
          />
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
