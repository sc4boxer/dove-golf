"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { HighSpinBalloonWizard } from "@/components/clinic/HighSpinBalloonWizard";
import { LikelihoodBars } from "@/components/clinic/LikelihoodBars";
import { RangePlan } from "@/components/clinic/RangePlan";
import { evaluateHighSpinBalloon, highSpinBalloonLeverLabel } from "@/lib/clinic/problems/highSpinBalloon";
import { loadClinicSessions, saveClinicSession } from "@/lib/clinic/storage";
import { ClinicSession, HighSpinBalloonInputs } from "@/lib/clinic/types";

function defaults(): Partial<HighSpinBalloonInputs> {
  return { flightPattern: undefined, divotClue: undefined, dynamicLoft: undefined, contactPattern: undefined, setupWindow: undefined, tempoTransition: undefined };
}

export default function HighSpinBalloonPage() {
  const [inputs, setInputs] = useState<Partial<HighSpinBalloonInputs>>(defaults());
  const [result, setResult] = useState<ReturnType<typeof evaluateHighSpinBalloon> | null>(null);
  const [sessions, setSessions] = useState<ClinicSession[]>(() => loadClinicSessions());
  const explanations = useMemo(() => !result ? [] : Object.entries(result.split).sort(([, a], [, b]) => b - a).map(([key]) => ({ key, text: result.bucketExplanations[key as keyof typeof result.bucketExplanations] })), [result]);

  return <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900"><div className="mx-auto max-w-5xl space-y-6"><div className="space-y-1"><div className="flex items-start justify-between gap-4"><p className="text-xs font-medium tracking-wide text-slate-500">DoveClinic™</p><Link href="/clinic" className="text-sm font-medium text-slate-700 underline">Back to Clinic</Link></div><h1 className="text-3xl font-semibold tracking-tight">High Spin Balloon debugger</h1></div>{!result ? <HighSpinBalloonWizard value={inputs} onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))} onComplete={() => {
    const full = inputs as HighSpinBalloonInputs;
    const evaluation = evaluateHighSpinBalloon(full);
    setResult(evaluation);
    setSessions(saveClinicSession({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), problemKey: "highSpinBalloon", inputs: full, result: evaluation }));
  }} /> : <section className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-xl font-semibold">Likelihood split</h2><p className="mt-2 text-sm text-slate-600">Primary lever: <span className="font-medium text-slate-900">{highSpinBalloonLeverLabel(result.primaryLever)}</span></p><div className="mt-4"><LikelihoodBars split={result.split} /></div><div className="mt-5 space-y-3">{explanations.map((item) => <p key={item.key} className="text-sm text-slate-700"><span className="font-medium text-slate-900">{item.key}:</span> {item.text}</p>)}</div><div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><p className="font-medium text-slate-900">Why this is likely</p><p className="mt-1">{result.whyLikely}</p></div></div><section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold text-slate-900">Diagnosis summary</h2><p className="mt-2 text-sm text-slate-700"><span className="font-medium text-slate-900">Primary likely cause:</span> {result.primaryCause}</p>{result.secondaryCause ? <p className="mt-1 text-sm text-slate-700"><span className="font-medium text-slate-900">Secondary cause:</span> {result.secondaryCause}</p> : null}<div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-medium text-slate-900">What to check next</p><ul className="mt-2 space-y-1 text-sm text-slate-700">{result.checksNext.map((check) => <li key={check}>• {check}</li>)}</ul></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-medium text-slate-900">Equipment levers</p><ul className="mt-2 space-y-1 text-sm text-slate-700">{result.equipmentLevers.map((lever) => <li key={lever}>• {lever}</li>)}</ul></div></div></section><RangePlan tests={result.rangePlan} /><button onClick={() => { setResult(null); setInputs(defaults()); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white">Start a new session</button></section>}<ClinicSessionHistory sessions={sessions.filter((session) => session.problemKey === "highSpinBalloon")} onOpen={(session) => { if (session.problemKey !== "highSpinBalloon") return; setResult(session.result as ReturnType<typeof evaluateHighSpinBalloon>); setInputs(session.inputs as HighSpinBalloonInputs); }} /></div></main>;
}
