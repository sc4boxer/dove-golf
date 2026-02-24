"use client";

import { useState } from "react";
import { FatIronsInputs } from "@/lib/clinic/types";
import { Ball, FlightArc, Ground, RangeMapFrame, RANGE_MAP, TargetLine, TargetMarker } from "@/components/clinic/visuals/RangeMapPrimitives";

type Props = { value: Partial<FatIronsInputs>; onChange: (patch: Partial<FatIronsInputs>) => void; onComplete: () => void };

const steps = [
  { key: "fatSeverity", label: "How fat are the misses?", options: ["slight", "chunk", "mixed", "unsure"] },
  { key: "turfCondition", label: "Lie/turf condition", options: ["normal", "soft", "mixed", "unsure"] },
  { key: "ballPosition", label: "Ball position check", options: ["neutral", "forward", "veryForward", "unsure"] },
  { key: "pressurePattern", label: "Pressure through impact", options: ["forward", "staysBack", "mixed", "unsure"] },
  { key: "loftPattern", label: "Compression feel", options: ["compress", "flip", "mixed", "unsure"] },
  { key: "tempoTransition", label: "Tempo / transition", options: ["smooth", "neutral", "quick", "unsure"] },
] as const;

type Step = (typeof steps)[number];
const label = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2");

function StepPreview({ step, selected }: { step: Step; selected?: string }) {
  // Audit summary: visuals were mostly generic and did not clearly show ground-before-ball contact, low-point behind/ahead, or pressure shift state.
  // Rebuilt step-by-step geometry so each option change immediately moves core markers.
  const current = selected ?? step.options[0];

  if (step.key === "pressurePattern") {
    const comX = current === "forward" ? 190 : current === "mixed" ? 168 : 142;
    return (
      <RangeMapFrame label="Fat irons pressure shift">
        <Ground />
        <Ball />
        <line x1="124" y1="86" x2="198" y2="86" stroke="rgb(226 232 240)" strokeWidth="10" strokeLinecap="round" />
        <circle cx={comX} cy="86" r="8" fill="rgb(15 23 42)" />
        <line x1="154" y1={RANGE_MAP.groundY} x2="154" y2="104" stroke={current === "forward" ? "rgb(16 185 129)" : "rgb(239 68 68)"} strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  if (step.key === "fatSeverity") {
    const chunk = current === "chunk" || current === "mixed";
    return (
      <RangeMapFrame label="Fat irons chunk pattern">
        <Ground />
        <Ball />
        <TargetLine />
        <TargetMarker />
        {chunk ? <line x1="118" y1={RANGE_MAP.groundY - 2} x2="132" y2={RANGE_MAP.groundY - 8} stroke="rgb(239 68 68)" strokeWidth="5" strokeLinecap="round" /> : null}
        <line x1={chunk ? 122 : 154} y1={RANGE_MAP.groundY} x2={chunk ? 122 : 154} y2="106" stroke={chunk ? "rgb(239 68 68)" : "rgb(16 185 129)"} strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  return (
    <RangeMapFrame label="Fat irons low-point map">
      <Ground />
      <Ball x={current === "veryForward" ? 146 : current === "forward" ? 140 : RANGE_MAP.ballX} />
      <FlightArc d={`M ${RANGE_MAP.ballX - 8} ${RANGE_MAP.ballY} C 150 126, 188 96, ${RANGE_MAP.targetX - 8} ${RANGE_MAP.targetY + 10}`} />
    </RangeMapFrame>
  );
}

export function FatIronsWizard({ value, onChange, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const active = steps[currentStep] ?? null;
  const canComplete = steps.every((step) => value[step.key]);
  return <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>{active ? <div className="mt-3"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{active.options.map((option) => <button key={option} onClick={() => onChange({ [active.key]: option } as Partial<FatIronsInputs>)} className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${value[active.key] === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{label(option)}</button>)}</div><div className="mt-4 flex gap-2"><button onClick={() => setCurrentStep((p) => Math.max(p - 1, 0))} disabled={currentStep === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go back</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Skip for now</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} disabled={!value[active.key]} className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button></div></div> : canComplete ? <button onClick={onComplete} className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">See results</button> : null}</div><aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>{active ? <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><StepPreview step={active} selected={value[active.key]} /></div> : <p className="mt-3 text-sm text-slate-600">Generate diagnosis after completing inputs.</p>}</aside></section>;
}
