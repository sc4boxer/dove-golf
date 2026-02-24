"use client";

import { useState } from "react";
import { HighSpinBalloonInputs } from "@/lib/clinic/types";

type Props = { value: Partial<HighSpinBalloonInputs>; onChange: (patch: Partial<HighSpinBalloonInputs>) => void; onComplete: () => void };

const steps = [
  { key: "flightPattern", label: "Flight pattern", options: ["highShort", "windBalloon", "both", "unsure"] },
  { key: "divotClue", label: "Divot / steepness clue", options: ["shallow", "steep", "mixed", "unsure"] },
  { key: "dynamicLoft", label: "Hand position at impact", options: ["handsAhead", "neutral", "handsBehind", "unsure"] },
  { key: "contactPattern", label: "Contact pattern", options: ["center", "lowFace", "mixed", "unsure"] },
  { key: "setupWindow", label: "Ball + handle setup", options: ["neutral", "ballForward", "handleBack", "both", "unsure"] },
  { key: "tempoTransition", label: "Tempo / transition", options: ["smooth", "neutral", "quick", "unsure"] },
] as const;

type Step = (typeof steps)[number];
const label = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2");

function StepPreview({ step, selected }: { step: Step; selected?: string }) {
  const current = selected ?? step.options[0];
  if (step.key === "flightPattern") {
    return <svg viewBox="0 0 320 180" className="w-full"><line x1="40" y1="150" x2="280" y2="150" stroke="rgb(203 213 225)"/><line x1="160" y1="24" x2="160" y2="150" stroke="rgb(148 163 184)" strokeDasharray="4 4"/><circle cx="140" cy="142" r="6" fill="rgb(15 23 42)"/><path d="M 140 142 C 156 86, 184 46, 230 34" fill="none" stroke="rgb(239 68 68)" strokeWidth="4"/><path d="M 140 142 C 158 120, 184 94, 214 78" fill="none" stroke="rgb(15 23 42)" strokeWidth="3" strokeDasharray="4 3"/><text x="236" y="34" className="fill-rose-500 text-[10px]">balloon</text><text x="216" y="77" className="fill-slate-500 text-[10px]">flighted</text></svg>;
  }
  if (step.key === "dynamicLoft") {
    const handX = current === "handsAhead" ? 186 : current === "handsBehind" ? 136 : 162;
    return <svg viewBox="0 0 320 180" className="w-full"><line x1="50" y1="150" x2="270" y2="150" stroke="rgb(203 213 225)"/><circle cx="160" cy="142" r="6" fill="rgb(15 23 42)"/><line x1={handX} y1="120" x2="198" y2="92" stroke="rgb(15 23 42)" strokeWidth="5"/><circle cx={handX} cy="120" r="7" fill="rgb(239 68 68 / .7)"/><text x="108" y="54" className="fill-slate-500 text-[11px]">{label(current)}</text></svg>;
  }
  return <svg viewBox="0 0 320 180" className="w-full"><line x1="42" y1="150" x2="278" y2="150" stroke="rgb(203 213 225)"/><circle cx="160" cy="142" r="6" fill="rgb(15 23 42)"/><path d="M 160 142 C 172 120, 190 96, 208 64" fill="none" stroke="rgb(15 23 42)" strokeWidth="4"/><text x="42" y="28" className="fill-slate-500 text-[11px]">{label(current)}</text></svg>;
}

export function HighSpinBalloonWizard({ value, onChange, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const active = steps[currentStep] ?? null;
  const canComplete = steps.every((step) => value[step.key]);
  return <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>{active ? <div className="mt-3"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{active.options.map((option) => <button key={option} onClick={() => onChange({ [active.key]: option } as Partial<HighSpinBalloonInputs>)} className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${value[active.key] === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{label(option)}</button>)}</div><div className="mt-4 flex gap-2"><button onClick={() => setCurrentStep((p) => Math.max(p - 1, 0))} disabled={currentStep === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go back</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Skip for now</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} disabled={!value[active.key]} className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button></div></div> : canComplete ? <button onClick={onComplete} className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">See results</button> : null}</div><aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>{active ? <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><StepPreview step={active} selected={value[active.key]} /></div> : <p className="mt-3 text-sm text-slate-600">Generate diagnosis after completing inputs.</p>}</aside></section>;
}
