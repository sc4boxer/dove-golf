"use client";

import { useState } from "react";
import { ThinIronsInputs } from "@/lib/clinic/types";

type Props = { value: Partial<ThinIronsInputs>; onChange: (patch: Partial<ThinIronsInputs>) => void; onComplete: () => void };

const steps = [
  { key: "lowPointControl", label: "Low-point / divot pattern", options: ["clean", "mixed", "noDivot", "unsure"] },
  { key: "earlyExtension", label: "Do you stand up through impact?", options: ["rare", "sometimes", "often", "unsure"] },
  { key: "liftIntent", label: "Trying to lift the ball?", options: ["never", "sometimes", "often", "unsure"] },
  { key: "setupWindow", label: "Setup check (ball + handle)", options: ["neutral", "ballForward", "handleHigh", "both", "unsure"] },
  { key: "strikeClue", label: "Most common strike clue", options: ["lowFace", "toe", "heel", "mixed", "unsure"] },
  { key: "missPattern", label: "Pattern stability", options: ["oneWay", "twoWay", "unsure"] },
] as const;

type Step = (typeof steps)[number];

function optionLabel(option: string) {
  return option.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function StepPreview({ step, selected }: { step: Step; selected?: string }) {
  const current = selected ?? step.options[0];
  if (step.key === "lowPointControl") {
    const lowPointX = current === "clean" ? 176 : current === "mixed" ? 162 : 148;
    return <svg viewBox="0 0 320 180" className="w-full"><line x1="40" y1="150" x2="280" y2="150" stroke="rgb(203 213 225)" strokeWidth="2" /><circle cx="160" cy="142" r="6" fill="rgb(15 23 42)" /><line x1="152" y1="150" x2="152" y2="64" stroke="rgb(148 163 184)" strokeDasharray="4 4" /><line x1={lowPointX} y1="150" x2={lowPointX} y2="96" stroke="rgb(239 68 68)" strokeWidth="3" /><text x="156" y="60" className="fill-slate-500 text-[10px]">ball</text><text x={lowPointX + 4} y="92" className="fill-rose-500 text-[10px]">low point</text></svg>;
  }
  if (step.key === "earlyExtension") {
    const chestY = current === "often" ? 90 : 70;
    return <svg viewBox="0 0 320 180" className="w-full"><line x1="72" y1="150" x2="260" y2="150" stroke="rgb(203 213 225)"/><rect x="110" y="58" width="70" height="84" fill="rgb(241 245 249)" stroke="rgb(148 163 184)"/><circle cx="145" cy={chestY} r="14" fill="rgb(15 23 42)"/><line x1="182" y1="58" x2="182" y2="142" stroke="rgb(239 68 68)" strokeDasharray="4 3"/><text x="188" y="56" className="fill-rose-500 text-[10px]">hip depth ref</text></svg>;
  }
  return <svg viewBox="0 0 320 180" className="w-full"><line x1="42" y1="150" x2="278" y2="150" stroke="rgb(203 213 225)"/><line x1="160" y1="20" x2="160" y2="150" stroke="rgb(148 163 184)" strokeDasharray="5 4"/><circle cx="160" cy="142" r="6" fill="rgb(15 23 42)"/><path d="M 160 142 C 168 122, 186 94, 200 66" fill="none" stroke="rgb(15 23 42)" strokeWidth="4"/><text x="46" y="26" className="fill-slate-500 text-[11px]">{optionLabel(current)}</text></svg>;
}

export function ThinIronsWizard({ value, onChange, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const active = steps[currentStep] ?? null;
  const canComplete = steps.every((step) => value[step.key]);

  return <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>{active ? <div className="mt-3"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{active.options.map((option) => <button key={option} type="button" onClick={() => onChange({ [active.key]: option } as Partial<ThinIronsInputs>)} className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${value[active.key] === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{optionLabel(option)}</button>)}</div><div className="mt-4 flex gap-2"><button type="button" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} disabled={currentStep === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go back</button><button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Skip for now</button><button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))} disabled={!value[active.key]} className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button></div></div> : <div className="mt-4">{canComplete ? <><h2 className="text-xl font-semibold text-slate-900">All core inputs captured</h2><button type="button" onClick={onComplete} className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">See results</button></> : <button type="button" onClick={() => setCurrentStep(0)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go to first missing question</button>}</div>}</div><aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>{active ? <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><StepPreview step={active} selected={value[active.key]} /></div> : <p className="mt-3 text-sm text-slate-600">Generate diagnosis after completing inputs.</p>}</aside></section>;
}
