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
import { BeginnerSession } from "@/components/range-rescue/BeginnerSession";
import { track } from "@/lib/analytics/ga";
import styles from "./range-rescue.module.css";

export default function RangeRescuePage() {
  const [selectedId, setSelectedId] = useState<RangeRescuePlanId | null>(null);
  const [beginnerSession, setBeginnerSession] = useState(false);
  const chooserHeading = useRef<HTMLHeadingElement>(null);
  const returnToChooser = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const fiveBallPlan = useRef<HTMLOListElement>(null);
  const selectedPlan = selectedId ? getRangeRescuePlan(selectedId) : undefined;

  useEffect(() => {
    if (selectedPlan) resultHeading.current?.focus();
    else if (!beginnerSession && returnToChooser.current) {
      chooserHeading.current?.focus();
      returnToChooser.current = false;
    }
  }, [selectedPlan, beginnerSession]);

  function showChooser() {
    returnToChooser.current = true;
    setSelectedId(null);
    setBeginnerSession(false);
  }

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

        {beginnerSession ? <BeginnerSession onExit={showChooser} /> : !selectedPlan ? (
          <section className={styles.chooser} aria-labelledby="rescue-heading">
            <div className={styles.intro}>
              <p className={styles.eyebrow}>A little help at the range</p>
              <h1 id="rescue-heading" ref={chooserHeading} tabIndex={-1}>Make your next practice simpler.</h1>
              <p>
                New to golf or having a difficult session? Start with one clear goal and one small thing to practice.
              </p>
            </div>

            <div className={styles.beginnerCard}>
              <p className={styles.eyebrow}>Start here · About 10–15 minutes</p>
              <h2>New to golf? Let’s make contact.</h2>
              <p>Get ready, record five starting shots, try a smaller swing, then see what changed. No golf vocabulary needed.</p>
              <button type="button" onClick={() => setBeginnerSession(true)}>Start guided beginner practice <span aria-hidden="true">→</span></button>
              <p className={styles.hint}>Not sure what’s going wrong? This is a good place to begin.</p>
            </div>

            <div className={styles.breath} aria-label="First, take one slow breath">
              <span className={styles.breathDot} aria-hidden="true" />
              <span><strong>First:</strong> inhale slowly, then let your shoulders drop.</span>
            </div>

            <fieldset className={styles.options}>
              <legend>Or choose what your ball is doing</legend>
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
            <button className={styles.back} type="button" onClick={showChooser}>
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

            <div className={styles.beginnerCard}>
              <h2>Before you try the change</h2>
              <p>Read the Reset step below and choose your club first. Take five comfortable shots as your starting point, or use your last five only if you used the same club and setup. If either changes, take a new starting set before trying the change.</p>
              <p>Count every attempt, including misses. Use the same club and setup for both sets. Stop if swinging hurts.</p>
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
                        <span className={styles.ballCount}>{index === 0 ? "Prep" : index === 1 ? "1–5" : "Notice"}</span>
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
              <button type="button" onClick={showChooser}>Start over</button>
            </div>
          </section>
        )}

        <footer className={styles.footer}>One small step. Something you can practice.</footer>
      </div>
    </main>
  );
}
