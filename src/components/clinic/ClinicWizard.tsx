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
    const bend =
      current === "none" ? 0 : current === "slight" ? -24 : current === "moderate" ? -46 : current === "severe" ? -78 : -10;
    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Curve severity preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="240" y1="25" x2="240" y2="160" stroke="rgb(226 232 240)" strokeDasharray="5 5" strokeWidth="2" />
        <path
          d={`M 70 155 C 130 115, ${185 + bend} 70, ${240 + bend} 30`}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="5"
          strokeLinecap="round"
          className="[stroke-dasharray:320] [stroke-dashoffset:320] animate-[dash_0.7s_ease-out_forwards]"
        />
        <circle cx={240 + bend} cy={30} r="6" fill="rgb(15 23 42)" />
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
    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Miss pattern preview">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => {
          const x = 60 + i * 58;
          const swing = oneWay ? -20 : i % 2 === 0 ? -20 : 20;
          return <path key={x} d={`M ${x} 150 C ${x + 20} 95, ${x + 40 + swing} 70, ${x + 50 + swing} 28`} fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" opacity={current === "unsure" ? 0.45 : 1} />;
        })}
      </svg>
    );
  }

  if (step.key === "gripStrength") {
    const angle = current === "weak" ? -28 : current === "strong" ? 26 : 0;
    return (
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Grip strength preview">
        <rect x="84" y="70" width="154" height="26" rx="13" fill="rgb(241 245 249)" stroke="rgb(148 163 184)" />
        <line x1="160" y1="83" x2={160 + angle} y2="45" stroke="rgb(15 23 42)" strokeWidth="5" strokeLinecap="round" />
        <circle cx={160 + angle} cy="45" r="7" fill="rgb(15 23 42)" />
        <text x="70" y="150" className="fill-slate-500 text-[12px]">Lead-hand V direction</text>
      </svg>
    );
  }

  const pace = current === "smooth" ? 0.5 : current === "quick" ? 1.35 : 0.9;
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Tempo release preview">
      <line x1="40" y1="160" x2="280" y2="160" stroke="rgb(203 213 225)" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((idx) => (
        <circle key={idx} cx={70 + idx * 48} cy={130 - idx * 20} r={7} fill="rgb(15 23 42)" opacity={Math.min(1, 0.25 + idx * 0.15 * pace)} />
      ))}
      <path d="M 68 134 C 140 88, 188 60, 260 48" fill="none" stroke="rgb(15 23 42 / 0.35)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ClinicWizard({ value, onChange, onComplete }: WizardProps) {
  const answered = steps.filter((step) => value[step.key]).length;
  const [currentStep, setCurrentStep] = useState(0);

  const active = steps[currentStep] ?? null;

  const progressStep = currentStep >= steps.length ? steps.length : Math.max(answered + 1, currentStep + 1);

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
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                    value[active.key] === option
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option}
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
            <div className="mt-4 flex flex-wrap gap-2">
              {active.options.map((option) => (
                <span key={option} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: previewColor(value[active.key] === option) }} />
                  {option}
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
