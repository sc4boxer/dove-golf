"use client";

import { useState } from "react";
import { ThinIronsInputs } from "@/lib/clinic/types";
import { Ball, FlightArc, Ground, RangeMapFrame, RANGE_MAP, TargetLine, TargetMarker } from "@/components/clinic/visuals/RangeMapPrimitives";

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
  // Audit summary: all six step visuals existed but several were generic/non-teaching; low-point and posture geometry were ambiguous;
  // some steps were not meaningfully state-driven. Rebuilt each step with one shared coordinate system and direct geometry tied to selection.
  const current = selected ?? step.options[0];

  if (step.key === "lowPointControl") {
    const lowPointX = current === "clean" ? 152 : current === "mixed" ? 140 : 122;
    const badThin = current === "mixed" || current === "noDivot";
    return (
      <RangeMapFrame label="Thin irons low-point map">
        <Ground />
        <Ball />
        <TargetLine />
        <TargetMarker />
        <line x1={lowPointX} y1={RANGE_MAP.groundY} x2={lowPointX} y2="98" stroke={badThin ? "rgb(239 68 68)" : "rgb(16 185 129)"} strokeWidth="3" />
        {badThin ? <line x1="124" y1="130" x2="140" y2="126" stroke="rgb(239 68 68)" strokeWidth="3" strokeLinecap="round" /> : null}
      </RangeMapFrame>
    );
  }

  if (step.key === "earlyExtension") {
    const torsoX = current === "often" ? 186 : current === "sometimes" ? 176 : 166;
    return (
      <RangeMapFrame label="Thin irons posture reference">
        <Ground />
        <Ball />
        <line x1="202" y1="52" x2="202" y2={RANGE_MAP.groundY} stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1={torsoX} y1="78" x2={torsoX - 8} y2="126" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      </RangeMapFrame>
    );
  }

  if (step.key === "setupWindow") {
    const ballX = current === "ballForward" || current === "both" ? 144 : RANGE_MAP.ballX;
    const lowPointX = current === "ballForward" || current === "both" ? 140 : 152;
    return (
      <RangeMapFrame label="Thin irons ball position setup">
        <Ground />
        <Ball x={ballX} />
        <TargetLine />
        <line x1={lowPointX} y1={RANGE_MAP.groundY} x2={lowPointX} y2="102" stroke="rgb(239 68 68 / 0.85)" strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  return (
    <RangeMapFrame label="Thin irons compression map">
      <Ground />
      <Ball />
      <TargetLine />
      <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 160 128, 196 96, ${RANGE_MAP.targetX} ${RANGE_MAP.targetY + 6}`} tone="dark" />
    </RangeMapFrame>
  );
}

export function ThinIronsWizard({ value, onChange, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const active = steps[currentStep] ?? null;
  const canComplete = steps.every((step) => value[step.key]);

  return <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>{active ? <div className="mt-3"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{active.options.map((option) => <button key={option} type="button" onClick={() => onChange({ [active.key]: option } as Partial<ThinIronsInputs>)} className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${value[active.key] === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{optionLabel(option)}</button>)}</div><div className="mt-4 flex gap-2"><button type="button" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} disabled={currentStep === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go back</button><button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Skip for now</button><button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))} disabled={!value[active.key]} className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button></div></div> : <div className="mt-4">{canComplete ? <><h2 className="text-xl font-semibold text-slate-900">All core inputs captured</h2><button type="button" onClick={onComplete} className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">See results</button></> : <button type="button" onClick={() => setCurrentStep(0)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go to first missing question</button>}</div>}</div><aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>{active ? <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><StepPreview step={active} selected={value[active.key]} /></div> : <p className="mt-3 text-sm text-slate-600">Generate diagnosis after completing inputs.</p>}</aside></section>;
}
