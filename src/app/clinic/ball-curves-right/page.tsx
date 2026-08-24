"use client";

import { useMemo, useState } from "react";
import { BallFlightOptionCard } from "@/components/clinic/BallFlightOptionCard";
import { DiagnosisSharePanel } from "@/components/diagnosis/DiagnosisSharePanel";
import { DiagnosisStoryDeck } from "@/components/diagnosis/DiagnosisStoryDeck";
import { CauseTestCard } from "@/components/clinic/CauseTestCard";
import { ClinicModuleShell } from "@/components/clinic/ClinicModuleShell";
import { ClinicSymptomHero } from "@/components/clinic/ClinicSymptomHero";
import { ExpandableWhySection } from "@/components/clinic/ExpandableWhySection";
import { LikelyCauseCard } from "@/components/clinic/LikelyCauseCard";
import { RangePlanCard } from "@/components/clinic/RangePlanCard";
import { ResultInterpretationCard } from "@/components/clinic/ResultInterpretationCard";
import { CAUSE_LIBRARY } from "@/lib/clinic/causeLibrary";
import { rankBallCurvesRightCauses } from "@/lib/clinic/confidenceScoring";
import { getBallFlightShapeFromObservation } from "@/lib/visual/ballFlightObservationShape";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import { BALL_CURVES_RIGHT_MODULE } from "@/lib/clinic/moduleConfigs/ballCurvesRight";

export default function BallCurvesRightPage() {
  const [selectedVariant, setSelectedVariant] = useState(BALL_CURVES_RIGHT_MODULE.variants[0]);

  const rankedCauses = useMemo(
    () =>
      rankBallCurvesRightCauses({
        variantId: selectedVariant.id,
        startDirection: selectedVariant.startDirection,
        curveSeverity: selectedVariant.curveSeverity,
      }).slice(0, 4),
    [selectedVariant]
  );

  const tests = rankedCauses
    .map((entry) => CAUSE_LIBRARY[entry.causeId]?.testSuggestions[0])
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const shareInsight =
    selectedVariant.id === "curves-right-center"
      ? "The face was likely open relative to a path left of the face. Exact path direction relative to the target is unmeasured."
      : selectedVariant.id === "curves-right-from-left"
        ? "The face was left of the target but open relative to an even farther-left path. This describes impact geometry, not a body-motion fault."
        : "The face was right of the target and open relative to the path. Strike and equipment contributions remain unmeasured.";

  return (
    <ClinicModuleShell
      eyebrow="DoveClinic™ pilot module"
      title={BALL_CURVES_RIGHT_MODULE.symptomTitle}
      intro={BALL_CURVES_RIGHT_MODULE.intro}
    >
      <ClinicSymptomHero
        title="Ball Curves Right"
        description="Several things can cause a right curve. Let’s narrow down the most likely ones, then test one change at a time."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold tracking-tight">1. Identify your version</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {BALL_CURVES_RIGHT_MODULE.variants.map((variant) => (
            <BallFlightOptionCard
              key={variant.id}
              title={variant.title}
              startDirection={variant.startDirection}
              curveSeverity={variant.curveSeverity}
              selected={selectedVariant.id === variant.id}
              onSelect={() => setSelectedVariant(variant)}
            />
          ))}
        </div>
      </section>

      <DiagnosisStoryDeck
        title={`Your ${selectedVariant.title} result`}
        slides={[
          {
            id: "pattern",
            label: "Your pattern",
            eyebrow: "Observed shot",
            title: selectedVariant.title,
            content: (
              <div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Start</dt>
                    <dd className="mt-2 font-semibold capitalize text-slate-900">{selectedVariant.startDirection}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Curve</dt>
                    <dd className="mt-2 font-semibold capitalize text-slate-900">{selectedVariant.curveSeverity} right</dd>
                  </div>
                </dl>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                  <BallFlightChart
                    shape={getBallFlightShapeFromObservation(selectedVariant.startDirection, "right")}
                    className="mx-auto max-w-2xl"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "why",
            label: "What it suggests",
            eyebrow: "Ranked hypotheses",
            title: "What this pattern may suggest",
            content: (
              <div>
                <p className="max-w-2xl text-lg leading-8 text-slate-700">{shareInsight}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {rankedCauses.map((entry) => {
                    const cause = CAUSE_LIBRARY[entry.causeId];
                    return (
                      <LikelyCauseCard
                        key={entry.causeId}
                        title={cause.title}
                        summary={cause.summary}
                        explanation={cause.explanation}
                        confidence={entry.label}
                        visualType={cause.visualType}
                      />
                    );
                  })}
                </div>
                <ExpandableWhySection
                  points={[
                    "Face direction strongly influences where the ball starts.",
                    "The face-to-path relationship influences how much the ball curves.",
                    "A right curve is often a mix of face, path, and strike quality rather than one single issue.",
                  ]}
                />
              </div>
            ),
          },
          {
            id: "test",
            label: "Range test",
            eyebrow: "One variable at a time",
            title: "Test the leading idea",
            content: (
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tests.map((test) => <CauseTestCard key={test.id} test={test} />)}
                </div>
                <div className="mt-5 grid gap-3">
                  {BALL_CURVES_RIGHT_MODULE.interpretationRules.map((rule) => (
                    <ResultInterpretationCard key={rule.cue} cue={rule.cue} meaning={rule.meaning} />
                  ))}
                </div>
                <div className="mt-5"><RangePlanCard steps={BALL_CURVES_RIGHT_MODULE.rangePlan} /></div>
              </div>
            ),
          },
          {
            id: "share",
            label: "Save & share",
            eyebrow: "Your portable result",
            title: "Share your shot profile",
            content: (
              <DiagnosisSharePanel
                embedded
                miss={selectedVariant.title}
                likelyCause={shareInsight}
                rangePlan={BALL_CURVES_RIGHT_MODULE.rangePlan.join(" · ")}
                shareUrl="https://dovegolf.fit/clinic/ball-curves-right"
                source="ball_curves_right"
                insightLabel="Leading hypothesis"
                emailDiagnosis={{
                  kind: "ball_curves_right",
                  variantId:
                    selectedVariant.id === "curves-right-center" ||
                    selectedVariant.id === "curves-right-from-left"
                      ? selectedVariant.id
                      : "curves-right-from-right",
                }}
                details={[
                  { label: "Start", value: selectedVariant.startDirection },
                  { label: "Curve", value: `${selectedVariant.curveSeverity} right` },
                  { label: "Pattern", value: selectedVariant.title },
                ]}
                flightShape={getBallFlightShapeFromObservation(selectedVariant.startDirection, "right")}
                analyticsContext={{
                  pattern: selectedVariant.id,
                  category: "ball_curves_right",
                }}
              />
            ),
          },
        ]}
      />
    </ClinicModuleShell>
  );
}
