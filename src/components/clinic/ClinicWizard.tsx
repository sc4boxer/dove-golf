"use client";

import { LikelihoodBars } from "@/components/clinic/LikelihoodBars";
import { evaluateDriverSlice } from "@/lib/clinic/problems/driverSlice";
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

const strikeMap = [
  ["high", "", ""],
  ["heel", "center", "toe"],
  ["", "low", ""],
];

export function ClinicWizard({ value, onChange, onComplete }: WizardProps) {
  const answered = steps.filter((step) => value[step.key]).length;
  const active = steps[answered] ?? null;

  const canComplete = steps.every((step) => value[step.key]);
  const snapshot = canComplete ? evaluateDriverSlice(value as DriverSliceInputs).split : null;

  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-slate-500">
          Step {Math.min(answered + 1, steps.length)} of {steps.length}
        </p>
        {active ? (
          <div className="mt-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{active.label}</h2>

            {active.key === "strikeLocation" ? (
              <div className="mt-4 rounded-xl border border-slate-200 p-3 text-xs text-slate-500">
                {strikeMap.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 text-center">
                    {row.map((cell) => (
                      <span key={cell || `${i}-blank`} className="rounded bg-slate-50 py-1">
                        {cell || "·"}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}

            {active.key === "gripStrength" ? (
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
                {`Lead-hand V reference
Weak:  points toward chin
Neutral: points to trail shoulder
Strong: points outside trail shoulder`}
              </pre>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {active.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange({ [active.key]: option } as Partial<DriverSliceInputs>)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-slate-900">All core inputs captured</h2>
            <p className="mt-2 text-sm text-slate-600">Review your likelihood split and generate your range plan.</p>
            <button
              type="button"
              onClick={onComplete}
              className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              See results
            </button>
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Likelihood snapshot</h3>
        {snapshot ? (
          <div className="mt-3">
            <LikelihoodBars split={snapshot} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Answer all prompts to unlock a deterministic split.</p>
        )}
      </aside>
    </section>
  );
}
