"use client";

import { useMemo, useState } from "react";
import { BallFlightOptionCard } from "@/components/clinic/BallFlightOptionCard";
import { CauseTestCard } from "@/components/clinic/CauseTestCard";
import { ClinicModuleShell } from "@/components/clinic/ClinicModuleShell";
import { ClinicSymptomHero } from "@/components/clinic/ClinicSymptomHero";
import { ExpandableWhySection } from "@/components/clinic/ExpandableWhySection";
import { LikelyCauseCard } from "@/components/clinic/LikelyCauseCard";
import { RangePlanCard } from "@/components/clinic/RangePlanCard";
import { ResultInterpretationCard } from "@/components/clinic/ResultInterpretationCard";
import { CAUSE_LIBRARY } from "@/lib/clinic/causeLibrary";
import { rankBallCurvesRightCauses } from "@/lib/clinic/confidenceScoring";
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold tracking-tight">2. Likely causes</h3>
        <p className="mt-2 text-sm text-slate-600">Most likely first. Confidence updates as you test changes.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold tracking-tight">3. Try one change at a time</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tests.map((test) => (
            <CauseTestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold tracking-tight">4. What your result probably means</h3>
        <div className="mt-4 grid gap-3">
          {BALL_CURVES_RIGHT_MODULE.interpretationRules.map((rule) => (
            <ResultInterpretationCard key={rule.cue} cue={rule.cue} meaning={rule.meaning} />
          ))}
        </div>
      </section>

      <RangePlanCard steps={BALL_CURVES_RIGHT_MODULE.rangePlan} />

      <ExpandableWhySection
        points={[
          "Face direction strongly influences where the ball starts.",
          "The face-to-path relationship influences how much the ball curves.",
          "A right curve is often a mix of face, path, and strike quality rather than one single issue.",
        ]}
      />
    </ClinicModuleShell>
  );
}
