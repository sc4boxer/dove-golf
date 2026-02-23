"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics/ga";
import { PullHookInputs } from "@/lib/clinic/types";

type WizardProps = {
  value: Partial<PullHookInputs>;
  onChange: (patch: Partial<PullHookInputs>) => void;
  onComplete: () => void;
};

const steps = [
  { key: "startLine", label: "Where does the ball usually start?", options: ["left", "center", "right", "unsure"] },
  { key: "curveSeverity", label: "How hard does it curve left?", options: ["none", "slight", "moderate", "severe"] },
  { key: "strikeLocation", label: "Most common strike location?", options: ["heel", "center", "toe", "high", "low", "unsure"] },
  { key: "missPattern", label: "Typical miss pattern", options: ["oneWay", "twoWay", "unsure"] },
  { key: "tempoTransition", label: "Tempo / transition feel", options: ["smooth", "neutral", "quick", "unsure"] },
  {
    key: "driverVsIrons",
    label: "Where is the pull-hook more pronounced?",
    options: ["driverWorse", "ironsWorse", "sameBoth", "unsure"],
  },
  {
    key: "setupPattern",
    label: "Setup quick check",
    options: ["square", "aimLeft", "ballBack", "closedStance", "unsure"],
  },
] as const;

type Step = (typeof steps)[number];

type StepPreviewProps = {
  step: Step;
  selected?: string;
};

function optionLabel(step: Step, option: string) {
  if (step.key === "missPattern" && option === "oneWay") return "one-way left";
  if (step.key === "missPattern" && option === "twoWay") return "mixed left misses";
  return option.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function previewColor(active: boolean) {
  return active ? "rgb(15 23 42)" : "rgb(203 213 225)";
}

function StepPreview({ step, selected }: StepPreviewProps) {
  const current = selected ?? step.options[0];

  if (step.key === "startLine") {
    const startX = current === "left" ? 90 : current === "right" ? 230 : 160;
    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Start line preview">
        <line x1="160" y1="20" x2="160" y2="160" stroke="rgb(203 213 225)" strokeDasharray="5 5" strokeWidth="2" />
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <path
          d={`M 160 160 C ${155 + (startX - 160) * 0.4} 110, ${startX} 70, ${startX} 35`}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="5"
          strokeLinecap="round"
          className="[stroke-dasharray:320] [stroke-dashoffset:320] animate-[dash_0.7s_ease-out_forwards]"
        />
        <circle cx={startX} cy={35} r="6" fill="rgb(15 23 42)" />
      </svg>
    );
  }

  if (step.key === "curveSeverity") {
    const targetX = 248;
    const profiles = {
      none: { c1x: 242, c1y: 128, c2x: 242, c2y: 86, endX: 242, endY: 42 },
      slight: { c1x: 236, c1y: 130, c2x: 222, c2y: 92, endX: 212, endY: 46 },
      moderate: { c1x: 228, c1y: 132, c2x: 192, c2y: 98, endX: 170, endY: 56 },
      severe: { c1x: 220, c1y: 136, c2x: 168, c2y: 104, endX: 130, endY: 68 },
      unsure: { c1x: 236, c1y: 130, c2x: 222, c2y: 92, endX: 212, endY: 46 },
    } as const;
    const shape = profiles[current as keyof typeof profiles] ?? profiles.unsure;

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Curve severity preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1={targetX} y1="24" x2={targetX} y2="160" stroke="rgb(203 213 225)" strokeDasharray="5 5" strokeWidth="2" />
        <circle cx={targetX} cy="22" r="8" fill="rgb(234 179 8)" />
        <text x="194" y="26" className="fill-slate-500 text-[10px]">Target line</text>
        <path
          d={`M 248 155 C ${shape.c1x} ${shape.c1y}, ${shape.c2x} ${shape.c2y}, ${shape.endX} ${shape.endY}`}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="5"
          strokeLinecap="round"
          className="[stroke-dasharray:320] [stroke-dashoffset:320] animate-[dash_0.7s_ease-out_forwards]"
        />
        <circle cx={shape.endX} cy={shape.endY} r="6" fill="rgb(15 23 42)" />
      </svg>
    );
  }

  if (step.key === "strikeLocation") {
    const position = {
      heel: { x: 105, y: 90 },
      center: { x: 160, y: 90 },
      toe: { x: 215, y: 90 },
      high: { x: 160, y: 58 },
      low: { x: 160, y: 122 },
      unsure: { x: 160, y: 90 },
    }[current as PullHookInputs["strikeLocation"]];

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Strike location preview">
        <rect x="82" y="40" width="156" height="100" rx="18" fill="white" stroke="rgb(148 163 184)" strokeWidth="3" />
        <line x1="160" y1="45" x2="160" y2="135" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="87" y1="90" x2="233" y2="90" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="248" y1="24" x2="232" y2="54" stroke="rgb(71 85 105)" strokeWidth="5" strokeLinecap="round" />
        <text x="93" y="152" className="fill-slate-500 text-[11px]">Heel</text>
        <text x="211" y="152" className="fill-slate-500 text-[11px]">Toe</text>
        <circle cx={position.x} cy={position.y} r="13" fill="rgb(15 23 42 / 0.15)" />
        <circle cx={position.x} cy={position.y} r="7" fill="rgb(15 23 42)" />
      </svg>
    );
  }

  if (step.key === "missPattern") {
    const oneWay = current === "oneWay";
    const trajectories = oneWay
      ? [
          "M 250 152 C 236 126, 212 94, 178 44",
          "M 250 152 C 232 128, 206 96, 170 50",
          "M 250 152 C 228 132, 200 100, 162 58",
        ]
      : [
          "M 250 152 C 234 124, 214 90, 192 38",
          "M 250 152 C 230 138, 190 116, 144 100",
          "M 248 152 C 224 134, 242 86, 270 46",
        ];

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Miss pattern preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="248" y1="24" x2="248" y2="160" stroke="rgb(203 213 225)" strokeDasharray="5 4" strokeWidth="2" />
        <circle cx="248" cy="22" r="8" fill="rgb(234 179 8)" />
        {trajectories.map((shape, i) => (
          <path key={shape} d={shape} fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" opacity={current === "unsure" ? 0.45 : 0.95 - i * 0.15} />
        ))}
        <text x="122" y="24" className="fill-slate-500 text-[11px]">{oneWay ? "One-way left miss" : "Mixed miss window"}</text>
      </svg>
    );
  }

  if (step.key === "tempoTransition") {
    const accent = current === "smooth" ? "rgb(34 197 94)" : current === "quick" ? "rgb(239 68 68)" : "rgb(59 130 246)";
    const intensityByTempo = {
      smooth: [0.18, 0.24, 0.32, 0.46, 0.62, 0.82],
      neutral: [0.24, 0.38, 0.58, 0.58, 0.38, 0.24],
      quick: [0.82, 0.62, 0.46, 0.32, 0.24, 0.18],
      unsure: [0.28, 0.32, 0.36, 0.36, 0.32, 0.28],
    } as const;
    const intensities = intensityByTempo[current as keyof typeof intensityByTempo] ?? intensityByTempo.unsure;

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Tempo transition preview">
        <rect x="24" y="24" width="272" height="132" rx="14" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
        <line x1="44" y1="132" x2="276" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        {intensities.map((opacity, idx) => (
          <circle key={idx} cx={62 + idx * 38} cy={122} r={6} fill={accent} opacity={opacity} />
        ))}
        <text x="58" y="53" className="fill-slate-600 text-[11px] font-medium">Transition accent: {current}</text>
      </svg>
    );
  }

  if (step.key === "driverVsIrons") {
    const bars = {
      driverWorse: [84, 42],
      ironsWorse: [44, 86],
      sameBoth: [68, 68],
      unsure: [58, 58],
    } as const;
    const [driver, irons] = bars[current as keyof typeof bars] ?? bars.unsure;

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Driver versus irons preview">
        <rect x="30" y="24" width="260" height="132" rx="14" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
        <line x1="58" y1="132" x2="262" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <rect x="92" y={132 - driver} width="44" height={driver} rx="6" fill="rgb(15 23 42)" />
        <rect x="184" y={132 - irons} width="44" height={irons} rx="6" fill="rgb(71 85 105)" />
        <text x="94" y="148" className="fill-slate-600 text-[11px]">Driver</text>
        <text x="188" y="148" className="fill-slate-600 text-[11px]">Irons</text>
      </svg>
    );
  }

  const setup = {
    square: "Square lines",
    aimLeft: "Aim left",
    ballBack: "Ball back",
    closedStance: "Closed stance",
    unsure: "Neutral ref",
  } as const;

  const lineOffset = current === "aimLeft" ? -24 : current === "closedStance" ? -16 : 0;
  const ballX = current === "ballBack" ? 132 : 160;

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Setup pattern preview">
      <line x1="52" y1="140" x2="268" y2="140" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1="160" y1="28" x2="160" y2="140" stroke="rgb(203 213 225)" strokeDasharray="5 4" strokeWidth="2" />
      <line x1={102 + lineOffset} y1="110" x2={218 + lineOffset} y2="74" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <circle cx={ballX} cy="126" r="7" fill="rgb(15 23 42)" />
      <text x="96" y="160" className="fill-slate-600 text-[11px]">{setup[current as keyof typeof setup] ?? setup.unsure}</text>
    </svg>
  );
}

function StepGuidance({ step, selected }: StepPreviewProps) {
  if (step.key === "tempoTransition") {
    const notes = {
      smooth: "Smooth transitions usually reduce closure-rate spikes.",
      neutral: "Neutral pace gives the clearest read on true face/path.",
      quick: "Quick transition can over-close the face if timing is late-early.",
      unsure: "Unsure is fine when pace varies shot-to-shot.",
    } as const;
    return <p className="mt-3 text-xs text-slate-600">{notes[(selected ?? "neutral") as keyof typeof notes]}</p>;
  }

  if (step.key === "setupPattern") {
    return (
      <p className="mt-3 text-xs text-slate-600">
        Setup can pre-bias start line left before curvature happens. This step helps separate setup bias from true face/path closure.
      </p>
    );
  }

  return null;
}

export function PullHookWizard({ value, onChange, onComplete }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const clinicStartedTrackedRef = useRef(false);
  const viewedStepKeysRef = useRef<Set<string>>(new Set());

  const active = steps[currentStep] ?? null;

  useEffect(() => {
    if (!active || viewedStepKeysRef.current.has(active.key)) return;

    viewedStepKeysRef.current.add(active.key);
    track("dov_clinic_step_viewed", {
      module: "doveclinic",
      placement: "pull_hook_wizard",
      step: active.key,
      index: currentStep,
      version: "v1",
    });
  }, [active, currentStep]);

  const canComplete = steps.every((step) => value[step.key]);

  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-slate-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>
        {active ? (
          <div className="mt-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {active.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (!clinicStartedTrackedRef.current) {
                      clinicStartedTrackedRef.current = true;
                      track("dov_clinic_started", {
                        module: "doveclinic",
                        placement: "pull_hook_wizard",
                        step: active.key,
                        index: currentStep,
                        version: "v1",
                      });
                    }

                    onChange({ [active.key]: option } as Partial<PullHookInputs>);
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                    value[active.key] === option
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {optionLabel(active, option)}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
                disabled={!value[active.key]}
                className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {canComplete ? (
              <>
                <h2 className="text-xl font-semibold text-slate-900">All core inputs captured</h2>
                <p className="mt-2 text-sm text-slate-600">Generate your pull-hook diagnosis and the next range validation test.</p>
                <button
                  type="button"
                  onClick={onComplete}
                  className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  See results
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-900">A few answers are still missing</h2>
                <p className="mt-2 text-sm text-slate-600">Complete the key prompts so the diagnosis can separate face/path from strike and setup.</p>
                <button
                  type="button"
                  onClick={() => {
                    const firstMissing = steps.findIndex((step) => !value[step.key]);
                    setCurrentStep(firstMissing === -1 ? 0 : firstMissing);
                  }}
                  className="mt-4 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Go to first missing question
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Interactive step visual</h3>
        {active ? (
          <>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <StepPreview step={active} selected={value[active.key]} />
            </div>
            <StepGuidance step={active} selected={value[active.key]} />
            <div className="mt-4 flex flex-wrap gap-2">
              {active.options.map((option) => (
                <span key={option} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: previewColor(value[active.key] === option) }} />
                  {optionLabel(active, option)}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Once all answers are captured, generate your deterministic diagnosis.</p>
        )}
      </aside>
    </section>
  );
}
