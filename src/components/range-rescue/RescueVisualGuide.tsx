"use client";

import { useId, useRef, useState } from "react";
import type { RangeRescuePlanId } from "@/lib/range-rescue/plans";
import { getRangeRescueVisualGuidance } from "@/lib/range-rescue/visual-guidance";
import { track } from "@/lib/analytics/ga";
import styles from "./RescueVisualGuide.module.css";

type Stage = "understand" | "copy";

function FlightDiagram({ id, stage }: { id: RangeRescuePlanId; stage: Stage }) {
  const isCopy = stage === "copy";
  const isGround = id === "ground-first";
  const isThin = id === "thin-or-top";
  const isStart = id === "starts-left" || id === "starts-right";
  const isCurve = id === "curves-left" || id === "curves-right";
  const isLeft = id === "starts-left" || id === "curves-left";

  if (isGround || isThin) {
    return (
      <svg className={styles.diagram} viewBox="0 0 560 250" role="img" aria-label={isCopy ? "Side view: club meets the ball before brushing the ground toward the target" : isGround ? "Side view: club hits the ground before reaching the ball" : "Side view: club passes too high and catches the upper part of the ball"}>
        <path className={styles.ground} d="M42 190 H518" />
        <circle className={styles.ball} cx="330" cy="174" r="16" />
        <path className={styles.clubTrail} d={isCopy ? "M95 75 Q222 82 330 168 Q407 215 490 186" : isGround ? "M95 75 Q205 92 265 178 Q299 216 365 188" : "M90 168 Q220 138 324 153 Q410 166 492 180"} />
        <circle className={styles.movingHead} r="12">
          <animateMotion dur="2.4s" repeatCount="1" fill="freeze" path={isCopy ? "M95 75 Q222 82 330 168 Q407 215 490 186" : isGround ? "M95 75 Q205 92 265 178 Q299 216 365 188" : "M90 168 Q220 138 324 153 Q410 166 492 180"} />
        </circle>
        <circle className={styles.staticHead} cx={isCopy ? 490 : isGround ? 365 : 492} cy={isCopy ? 186 : isGround ? 188 : 180} r="12" />
        <g className={styles.contactMark} transform={`translate(${isCopy ? 375 : isGround ? 265 : 330} ${!isCopy && isThin ? 153 : 190})`}>
          <circle r="19" />
          <path d="M-8 0H8M0-8V8" />
        </g>
        <text className={styles.svgLabel} x={isCopy ? 375 : isGround ? 178 : 354} y="226">{isCopy ? "brush after ball" : isGround ? "ground first" : "club too high"}</text>
        <text className={styles.svgLabel} x="380" y="112">toward target →</text>
        {isCopy && <path className={styles.forwardArrow} d="M355 132 H455 M441 119 L455 132 L441 145" />}
      </svg>
    );
  }

  if (id === "no-pattern") {
    return (
      <svg className={styles.diagram} viewBox="0 0 560 250" role="img" aria-label={isCopy ? "Wide target window and smaller swing" : "Several different ball flights"}>
        <path className={styles.targetLine} d="M280 216 V35" />
        {isCopy ? (
          <>
            <path className={styles.targetWindow} d="M155 54 Q280 9 405 54 L373 103 Q280 73 187 103 Z" />
            <path className={styles.goodFlight} d="M280 216 Q278 139 280 76" />
            <circle className={styles.flightBall} r="9"><animateMotion dur="2.2s" repeatCount="1" fill="freeze" path="M280 216 Q278 139 280 76" /></circle>
            <circle className={styles.staticHead} cx="280" cy="76" r="9" />
            <path className={styles.smallArc} d="M229 211 Q280 172 331 211" />
            <text className={styles.svgLabel} x="346" y="202">small swing</text>
          </>
        ) : (
          <>
            <path className={styles.badFlight} d="M280 216 Q164 149 118 64" />
            <path className={styles.badFlight} d="M280 216 Q404 160 444 72" />
            <path className={styles.badFlight} d="M280 216 Q245 151 205 99" />
            <path className={styles.badFlight} d="M280 216 Q337 132 354 48" />
            <circle className={styles.origin} cx="280" cy="216" r="9" />
          </>
        )}
      </svg>
    );
  }

  const startX = isLeft ? 170 : 390;
  const curveEndX = isLeft ? 155 : 405;
  const curveControlX = isLeft ? 390 : 170;
  const observedPath = isCurve
    ? `M280 216 Q${curveControlX} 128 ${curveEndX} 45`
    : `M280 216 L${startX} 43`;
  const copyPath = isCurve
    ? `M280 216 Q${isLeft ? 330 : 230} 132 ${isLeft ? 246 : 314} 46`
    : "M280 216 Q280 128 280 42";

  return (
    <svg className={styles.diagram} viewBox="0 0 560 250" role="img" aria-label={isCopy ? isCurve ? `Practice goal: a smaller ${isLeft ? "left" : "right"} curve, viewed down the range` : "Practice goal: ball starts toward the target, with a nearby aiming mark and a parallel line for your feet" : `Looking down the range: ball ${isCurve ? "bends" : "starts and travels"} ${isLeft ? "left" : "right"} of the dashed target line`}>
      <path className={styles.targetLine} d="M280 218 V30" />
      <path className={styles.targetCap} d="M252 33 H308" />
      <text className={styles.svgLabel} x="316" y="37">target</text>
      {isCopy && isStart && (
        <>
          <path className={styles.feetLine} d="M205 215 V74" />
          <circle className={styles.nearMark} cx="280" cy="150" r="7" />
          <text className={styles.svgLabel} x="292" y="155">nearby mark</text>
          <text className={styles.svgLabel} x="65" y="100">feet alongside</text>
        </>
      )}
      {isCopy && isCurve && (
        <>
          <path className={styles.smallArc} d="M219 216 Q280 163 341 216" />
          <text className={styles.svgLabel} x="352" y="211">easy pace</text>
        </>
      )}
      <path className={isCopy ? styles.goodFlight : styles.badFlight} d={isCopy ? copyPath : observedPath} />
      <circle className={isCopy ? styles.flightBall : styles.issueBall} r="9">
        <animateMotion dur="2.25s" repeatCount="1" fill="freeze" path={isCopy ? copyPath : observedPath} />
      </circle>
      <circle className={styles.staticHead} cx={isCopy ? isCurve ? isLeft ? 246 : 314 : 280 : isCurve ? curveEndX : startX} cy={isCopy ? isCurve ? 46 : 42 : isCurve ? 45 : 43} r="9" />
      <circle className={styles.origin} cx="280" cy="216" r="9" />
    </svg>
  );
}

type GuideProps = { id: RangeRescuePlanId; onStart: () => void; practiceOnly?: boolean };

export function RescueVisualGuide({ id, onStart, practiceOnly = false }: GuideProps) {
  return <RescueVisualGuideContent key={`${id}-${practiceOnly}`} id={id} onStart={onStart} practiceOnly={practiceOnly} />;
}

function RescueVisualGuideContent({ id, onStart, practiceOnly }: GuideProps) {
  const headingId = useId();
  const [stage, setStage] = useState<Stage>(practiceOnly ? "copy" : "understand");
  const [replay, setReplay] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const guidance = getRangeRescueVisualGuidance(id);
  const isCopy = stage === "copy";

  function showCopy() {
    track("dov_range_rescue_visual_completed", { plan_id: id });
    setStage("copy");
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  return (
    <section className={styles.guide} aria-labelledby={headingId}>
      <div className={styles.progress} aria-label={practiceOnly ? "Your practice picture" : `Visual guide, step ${isCopy ? 2 : 1} of 2`}>
        <span className={styles.progressLabel}>{practiceOnly ? "Your practice picture" : isCopy ? "2 · Try this" : "1 · What happened"}</span>
        <span className={styles.progressTrack} aria-hidden="true"><span className={isCopy ? styles.progressComplete : styles.progressHalf} /></span>
      </div>

      <div className={styles.visualFrame} key={`${stage}-${replay}`}>
        <FlightDiagram id={id} stage={stage} />
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>{isCopy ? "Your practice goal" : "What you noticed"}</p>
        <h2 id={headingId} ref={headingRef} tabIndex={-1}>{isCopy ? guidance.copyTitle : guidance.observedTitle}</h2>
        <p>{isCopy ? guidance.copyBody : guidance.observedBody}</p>
        {isCopy && <p className={styles.cue}><span aria-hidden="true">✓</span>{guidance.copyCue}</p>}
      </div>

      <div className={styles.actions}>
        <button className={styles.replay} type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay picture
        </button>
        {!isCopy ? (
          <button className={styles.primary} type="button" onClick={showCopy}>Show me how <span aria-hidden="true">→</span></button>
        ) : (
          <button className={styles.primary} type="button" onClick={onStart}>{practiceOnly ? "Record my next five balls" : "Start the five-ball rescue"} <span aria-hidden="true">↓</span></button>
        )}
      </div>
      <p className={styles.note}>The drawing illustrates a practice goal. Your next shots help you check whether it works for you.</p>
    </section>
  );
}
