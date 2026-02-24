"use client";

import { useState } from "react";
import { HighSpinBalloonInputs } from "@/lib/clinic/types";
import { Ball, FlightArc, Ground, RangeMapFrame, RANGE_MAP, TargetLine, TargetMarker } from "@/components/clinic/visuals/RangeMapPrimitives";

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

function StepPreview({ step, selected }: { step: Step; selected?: string }) {
  // Audit summary: flight and dynamic-loft visuals existed but were inconsistent with other modules and not fully state-mapped.
  // Rebuilt all steps using the shared range-map geometry to keep arc direction, loft cues, and contact cues consistent.
  const current = selected ?? step.options[0];

  if (step.key === "flightPattern") {
    const highArc = current === "highShort" || current === "both" || current === "windBalloon";
    return (
      <RangeMapFrame label="High spin balloon trajectory map">
        <Ground />
        <Ball />
        <TargetLine />
        <TargetMarker />
        {highArc ? <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 152 68, 196 30, 230 66`} tone="bad" /> : null}
        <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 160 118, 194 88, 232 72`} dashed={highArc} />
      </RangeMapFrame>
    );
  }

  if (step.key === "dynamicLoft") {
    const shaftX = current === "handsBehind" ? 120 : current === "handsAhead" ? 145 : 132;
    return (
      <RangeMapFrame label="High spin balloon dynamic loft">
        <Ground />
        <Ball />
        <line x1={shaftX} y1="126" x2="172" y2="92" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
        <line x1="132" y1={RANGE_MAP.groundY} x2="132" y2="102" stroke={current === "handsBehind" ? "rgb(239 68 68)" : "rgb(16 185 129)"} strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  if (step.key === "contactPattern") {
    const strikeY = current === "lowFace" ? 116 : 98;
    return (
      <RangeMapFrame label="High spin balloon contact height">
        <rect x="102" y="50" width="110" height="88" rx="10" fill="white" stroke="rgb(148 163 184)" strokeWidth="2.5" />
        <line x1="157" y1="54" x2="157" y2="134" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="106" y1="94" x2="208" y2="94" stroke="rgb(226 232 240)" strokeWidth="2" />
        <circle cx="157" cy="94" r="5" fill="rgb(15 23 42 / 0.35)" />
        <circle cx="157" cy={strikeY} r="6" fill={current === "lowFace" ? "rgb(239 68 68 / 0.75)" : "rgb(15 23 42 / 0.75)"} />
      </RangeMapFrame>
    );
  }

  return (
    <RangeMapFrame label="High spin balloon setup and flight">
      <Ground />
      <Ball x={current === "ballForward" || current === "both" ? 144 : RANGE_MAP.ballX} />
      <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 162 122, 192 96, 226 70`} />
    </RangeMapFrame>
  );
}

const label = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2");

export function HighSpinBalloonWizard({ value, onChange, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const active = steps[currentStep] ?? null;
  const canComplete = steps.every((step) => value[step.key]);
  return <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>{active ? <div className="mt-3"><h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{active.options.map((option) => <button key={option} onClick={() => onChange({ [active.key]: option } as Partial<HighSpinBalloonInputs>)} className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${value[active.key] === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{label(option)}</button>)}</div><div className="mt-4 flex gap-2"><button onClick={() => setCurrentStep((p) => Math.max(p - 1, 0))} disabled={currentStep === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Go back</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Skip for now</button><button onClick={() => setCurrentStep((p) => Math.min(p + 1, steps.length))} disabled={!value[active.key]} className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button></div></div> : canComplete ? <button onClick={onComplete} className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">See results</button> : null}</div><aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>{active ? <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2"><StepPreview step={active} selected={value[active.key]} /></div> : <p className="mt-3 text-sm text-slate-600">Generate diagnosis after completing inputs.</p>}</aside></section>;
}
