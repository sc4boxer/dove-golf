"use client";

import { useState } from "react";
import { DriverSliceInputs } from "@/lib/clinic/types";

type WizardProps = {
  value: Partial<DriverSliceInputs>;
  onChange: (patch: Partial<DriverSliceInputs>) => void;
  onComplete: () => void;
};

const steps = [
  {
    key: "startLine",
    label: "Where does the ball typically start?",
    options: ["left", "center", "right", "unsure"],
  },
  {
    key: "curveSeverity",
    label: "How much does it curve right?",
    options: ["none", "slight", "moderate", "severe"],
  },
  {
    key: "strikeLocation",
    label: "Where is contact most often on the driver face?",
    options: ["heel", "center", "toe", "high", "low", "unsure"],
  },
  {
    key: "missPattern",
    label: "Typical pattern",
    options: ["oneWay", "twoWay", "unsure"],
  },
  {
    key: "gripStrength",
    label: "Grip strength quick check",
    options: ["weak", "neutral", "strong", "unsure"],
  },
  {
    key: "tempoRelease",
    label: "Tempo / release proxy",
    options: ["smooth", "neutral", "quick", "unsure"],
  },
] as const;

type Step = (typeof steps)[number];

type StepPreviewProps = {
  step: Step;
  selected?: string;
};

function previewColor(active: boolean) {
  return active ? "rgb(15 23 42)" : "rgb(203 213 225)";
}

function optionLabel(step: Step, option: string) {
  if (step.key === "missPattern" && option === "twoWay") {
    return "multi-way";
  }

  return option.replace(/([a-z])([A-Z])/g, "$1 $2");
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
          d={`M 160 160 C ${155 + (startX - 160) * 0.35} 110, ${startX} 70, ${startX} 35`}
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
    const targetX = 72;
    const profiles = {
      none: { c1x: 80, c1y: 126, c2x: 78, c2y: 84, endX: 76, endY: 40 },
      slight: { c1x: 88, c1y: 128, c2x: 102, c2y: 86, endX: 114, endY: 44 },
      moderate: { c1x: 92, c1y: 132, c2x: 124, c2y: 92, endX: 142, endY: 52 },
      severe: { c1x: 96, c1y: 136, c2x: 144, c2y: 96, endX: 176, endY: 62 },
      unsure: { c1x: 88, c1y: 128, c2x: 102, c2y: 86, endX: 114, endY: 44 },
    } as const;
    const shape = profiles[current as keyof typeof profiles] ?? profiles.unsure;

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Curve severity preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1={targetX} y1="24" x2={targetX} y2="160" stroke="rgb(203 213 225)" strokeDasharray="5 5" strokeWidth="2" />
        <circle cx={targetX} cy="22" r="8" fill="rgb(234 179 8)" />
        <text x="84" y="26" className="fill-slate-500 text-[10px]">Target line</text>
        <path
          d={`M 72 155 C ${shape.c1x} ${shape.c1y}, ${shape.c2x} ${shape.c2y}, ${shape.endX} ${shape.endY}`}
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
    }[current as DriverSliceInputs["strikeLocation"]];

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Strike location preview">
        <rect x="82" y="40" width="156" height="100" rx="18" fill="white" stroke="rgb(148 163 184)" strokeWidth="3" />
        <line x1="160" y1="45" x2="160" y2="135" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="87" y1="90" x2="233" y2="90" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="248" y1="24" x2="232" y2="54" stroke="rgb(71 85 105)" strokeWidth="5" strokeLinecap="round" />
        <text x="244" y="20" className="fill-slate-600 text-[10px] font-semibold">Shaft</text>
        <text x="93" y="152" className="fill-slate-500 text-[11px]">Heel</text>
        <text x="211" y="152" className="fill-slate-500 text-[11px]">Toe (shaft side)</text>
        <circle cx={position.x} cy={position.y} r="13" fill="rgb(15 23 42 / 0.15)" />
        <circle cx={position.x} cy={position.y} r="7" fill="rgb(15 23 42)" />
      </svg>
    );
  }

  if (step.key === "missPattern") {
    const oneWay = current === "oneWay";
    const trajectories = oneWay
      ? [
          "M 86 152 C 98 128, 112 96, 124 44",
          "M 86 152 C 100 130, 114 98, 128 48",
          "M 86 152 C 102 132, 116 100, 132 52",
        ]
      : [
          "M 86 152 C 104 126, 118 88, 120 36",
          "M 86 152 C 126 132, 172 106, 222 94",
          "M 84 152 C 136 138, 184 66, 152 30",
        ];

    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Miss pattern preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="86" y1="24" x2="86" y2="160" stroke="rgb(203 213 225)" strokeDasharray="5 4" strokeWidth="2" />
        <circle cx="86" cy="22" r="8" fill="rgb(234 179 8)" />
        {trajectories.map((shape, i) => {
          const opacity = current === "unsure" ? 0.45 : 0.95 - i * 0.15;
          return (
            <path
              key={shape}
              d={shape}
              fill="none"
              stroke="rgb(15 23 42)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
        <text x="100" y="24" className="fill-slate-500 text-[11px]">{oneWay ? "One-way miss shape" : "Multi-way miss shape"}</text>
      </svg>
    );
  }

  if (step.key === "gripStrength") {
    const angle = current === "weak" ? -28 : current === "strong" ? 26 : 0;
    const gripLabel =
      current === "weak"
        ? "Weak: V points more toward lead shoulder"
        : current === "strong"
          ? "Strong: V points more toward trail shoulder"
          : current === "neutral"
            ? "Neutral: V points around trail ear/chin"
            : "Unsure: neutral reference shown";
    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Grip strength preview">
        <rect x="84" y="70" width="154" height="26" rx="13" fill="rgb(241 245 249)" stroke="rgb(148 163 184)" />
        <line x1="160" y1="20" x2="160" y2="150" stroke="rgb(226 232 240)" strokeDasharray="5 4" strokeWidth="2" />
        <line x1="160" y1="83" x2={160 + angle} y2="45" stroke="rgb(15 23 42)" strokeWidth="5" strokeLinecap="round" />
        <circle cx={160 + angle} cy="45" r="7" fill="rgb(15 23 42)" />
        <text x="70" y="150" className="fill-slate-500 text-[11px]">{gripLabel}</text>
      </svg>
    );
  }

  const accent = current === "smooth" ? "rgb(34 197 94)" : current === "quick" ? "rgb(239 68 68)" : "rgb(59 130 246)";
  const intensityByTempo = {
    smooth: [0.18, 0.24, 0.32, 0.46, 0.62, 0.82],
    neutral: [0.24, 0.38, 0.58, 0.58, 0.38, 0.24],
    quick: [0.82, 0.62, 0.46, 0.32, 0.24, 0.18],
    unsure: [0.28, 0.32, 0.36, 0.36, 0.32, 0.28],
  } as const;
  const intensities = intensityByTempo[current as keyof typeof intensityByTempo] ?? intensityByTempo.unsure;

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Tempo release preview">
      <rect x="24" y="24" width="272" height="132" rx="14" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
      <line x1="44" y1="132" x2="276" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
      {intensities.map((opacity, idx) => (
        <circle key={idx} cx={62 + idx * 38} cy={122} r={6} fill={accent} opacity={opacity} />
      ))}
      <rect x="48" y="38" width="224" height="34" rx="8" fill="rgb(255 255 255)" stroke="rgb(226 232 240)" />
      <text x="58" y="53" className="fill-slate-600 text-[11px] font-medium">Transition accent: {current}</text>
      <text x="58" y="67" className="fill-slate-500 text-[10px]">Keep sequencing repeatable; speed is secondary.</text>
    </svg>
  );
}

function StepGuidance({ step, selected }: StepPreviewProps) {
  if (step.key === "tempoRelease") {
    const notes = {
      smooth: "Smooth: transition feels gradual; release timing tends to be easier to repeat.",
      neutral: "Neutral: balanced pace from top to impact with no obvious rush.",
      quick: "Quick: transition feels abrupt; face/strike timing can become less stable.",
      unsure: "Unsure: pick this when tempo changes shot-to-shot or you cannot tell.",
    } as const;

    return (
      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Tempo / release guide</p>
        <ul className="mt-2 space-y-1.5">
          {step.options.map((option) => (
            <li key={option} className={selected === option ? "font-medium text-slate-900" : ""}>
              • {notes[option as keyof typeof notes]}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (step.key === "gripStrength") {
    const notes = {
      weak: "Weak grip often leaves the face open longer; common with right starts for right-handed players.",
      neutral: "Neutral grip is usually easiest to pair with centered starts and predictable curve.",
      strong: "Strong grip can help closure rate, but too strong may over-close and miss left.",
      unsure: "Unsure is valid if glove wear and hand placement change during the session.",
    } as const;
    return <p className="mt-3 text-xs text-slate-600">{notes[(selected ?? "neutral") as keyof typeof notes]}</p>;
  }

  return null;
}

export function ClinicWizard({ value, onChange, onComplete }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const active = steps[currentStep] ?? null;

  const progressStep = active ? currentStep + 1 : steps.length;

  const canComplete = steps.every((step) => value[step.key]);

  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-slate-500">Step {progressStep} of {steps.length}</p>
        {active ? (
          <div className="mt-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {active.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange({ [active.key]: option } as Partial<DriverSliceInputs>);
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
                <p className="mt-2 text-sm text-slate-600">Review your likelihood split and generate your range plan.</p>
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
                <p className="mt-2 text-sm text-slate-600">Fill in remaining prompts so we can build an accurate split.</p>
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
