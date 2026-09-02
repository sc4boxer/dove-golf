"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  RANGE_RESCUE_PLANS,
  getRangeRescuePlan,
  type RangeRescuePlanId,
} from "@/lib/range-rescue/plans";
import { MissVisual } from "@/components/range-rescue/MissVisual";
import { RescueVisualGuide } from "@/components/range-rescue/RescueVisualGuide";
import { ProductFeedback } from "@/components/feedback/ProductFeedback";
import { track } from "@/lib/analytics/ga";
import styles from "./range-rescue.module.css";

export default function RangeRescuePage() {
  const [selectedId, setSelectedId] = useState<RangeRescuePlanId | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const fiveBallPlan = useRef<HTMLOListElement>(null);
  const selectedPlan = selectedId ? getRangeRescuePlan(selectedId) : undefined;

  useEffect(() => {
    if (selectedPlan) resultHeading.current?.focus();
  }, [selectedPlan]);

  function startFiveBallRescue() {
    if (selectedPlan) {
      track("dov_range_rescue_five_ball_started", { plan_id: selectedPlan.id });
    }
    fiveBallPlan.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    window.requestAnimationFrame(() => fiveBallPlan.current?.focus());
  }

  return (
    <main className={styles.shell}>
      <div className={styles.haze} aria-hidden="true" />
      <div className={styles.app}>
        <header className={styles.header}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Back to Dove Golf home"
          >
            <span className={styles.brandMark} aria-hidden="true">R</span>
            <span className={styles.brandCopy}>
              <span>Range Rescue</span>
              <span className={styles.homeCue}><span aria-hidden="true">←</span> Dove Golf home</span>
            </span>
          </Link>
          <span className={styles.privateNote}>No account needed</span>
        </header>

        {!selectedPlan ? (
          <section className={styles.chooser} aria-labelledby="rescue-heading">
            <div className={styles.intro}>
              <p className={styles.eyebrow}>Bad range session?</p>
              <h1 id="rescue-heading">Let’s calm the next five balls.</h1>
              <p>
                Take one breath. Pick the closest match. You’ll get one small thing to try—not a swing lesson.
              </p>
            </div>

            <div className={styles.breath} aria-label="First, take one slow breath">
              <span className={styles.breathDot} aria-hidden="true" />
              <span><strong>First:</strong> inhale slowly, then let your shoulders drop.</span>
            </div>

            <fieldset className={styles.options}>
              <legend>What’s going wrong right now?</legend>
              <p className={styles.hint}>Choose the closest match. It does not have to be perfect.</p>
              <div className={styles.optionGrid}>
                {RANGE_RESCUE_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    className={styles.option}
                    type="button"
                    onClick={() => {
                      track("dov_range_rescue_plan_selected", { plan_id: plan.id });
                      setSelectedId(plan.id);
                    }}
                  >
                    <MissVisual id={plan.id} />
                    <span className={styles.optionCopy}>
                      <strong>{plan.optionLabel}</strong>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        ) : (
          <section className={styles.result} aria-labelledby="plan-heading">
            <button className={styles.back} type="button" onClick={() => setSelectedId(null)}>
              <span aria-hidden="true">←</span> Pick a different miss
            </button>

            <div className={styles.planIntro}>
              <p className={styles.eyebrow}>Your five-ball rescue</p>
              <div className={styles.planHeadingRow}>
                <div>
                  <h1 id="plan-heading" ref={resultHeading} tabIndex={-1}>{selectedPlan.title}</h1>
                  <p>{selectedPlan.summary}</p>
                </div>
                <MissVisual id={selectedPlan.id} large />
              </div>
            </div>

            <RescueVisualGuide id={selectedPlan.id} onStart={startFiveBallRescue} />

            <ol className={styles.steps} ref={fiveBallPlan} tabIndex={-1} aria-label="Your five-ball rescue plan">
              <li>
                <span className={styles.stepNumber}>1</span>
                <div><h2>Reset</h2><p>{selectedPlan.reset}</p></div>
              </li>
              <li>
                <span className={styles.stepNumber}>2</span>
                <div><h2>Try this</h2><p>{selectedPlan.change}</p></div>
              </li>
              <li>
                <span className={styles.stepNumber}>3</span>
                <div>
                  <h2>Hit five balls</h2>
                  <div className={styles.ballRow} aria-label="Five-ball test">
                    {selectedPlan.test.map((instruction, index) => (
                      <div className={styles.testGroup} key={instruction}>
                        <span className={styles.ballCount}>{index === 0 ? "1–2" : index === 1 ? "3–5" : "Cue"}</span>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ol>

            <div className={styles.decision}>
              <div>
                <span className={styles.decisionLabel}>Better looks like</span>
                <p>{selectedPlan.better}</p>
              </div>
              <div>
                <span className={styles.decisionLabel}>If not</span>
                <p>{selectedPlan.fallback}</p>
              </div>
            </div>

            <ProductFeedback planId={selectedPlan.id} />

            <div className={styles.finish}>
              <p>You’re not fixing your swing today. You’re finding one playable shot.</p>
              <button type="button" onClick={() => setSelectedId(null)}>Start over</button>
            </div>
          </section>
        )}

        <footer className={styles.footer}>One choice. One change. Five balls.</footer>
      </div>
    </main>
  );
}
