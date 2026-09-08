import type { RangeRescuePlan } from "@/lib/range-rescue/plans";
import styles from "./DriverPracticeGuide.module.css";

export function DriverPracticeGuide({
  onStart,
  practiceOnly = false,
  plan,
}: {
  onStart: () => void;
  practiceOnly?: boolean;
  plan?: RangeRescuePlan;
}) {
  return (
    <section className={styles.guide} aria-label="Driver practice guide">
      <figure className={styles.figure}>
        <svg className={styles.diagram} viewBox="0 0 560 220" role="img" aria-label="Side view of a driver beside a ball on a tee, with the clubhead above the mat. Setup reference only.">
          <path className={styles.ground} d="M52 177 H508" />
          <path className={styles.tee} d="M333 177 V144 M324 143 Q333 149 342 143" />
          <circle className={styles.ball} cx="333" cy="129" r="15" />
          <path className={styles.shaft} d="M217 37 L287 131" />
          <path className={styles.head} d="M279 128 Q268 130 267 142 Q270 157 293 158 L312 155 L312 131 Q294 124 279 128 Z" />
          <path className={styles.labelLine} d="M350 125 H405" />
          <text className={styles.label} x="413" y="129">on a tee</text>
          <text className={styles.label} x="58" y="201">grass or mat</text>
        </svg>
        <figcaption>Driver setup reference · Tee height varies with your club and range tee.</figcaption>
      </figure>
      <div className={styles.copy}>
        <p className={styles.kicker}>{practiceOnly ? "An easy driver rehearsal" : "Your driver practice"}</p>
        <h2>{practiceOnly ? "Keep it easy. Finish in balance." : "One cue. Five teed balls."}</h2>
        <p>{practiceOnly
          ? "Keep the tee height and ball position you used for your starting shots."
          : "Use a tee, with the ball forward in your stance near your lead heel—the heel closer to the target. Ask range staff for help choosing a suitable tee if needed."}</p>
        <p className={styles.cue}>
          {practiceOnly
            ? "Try three easy, shorter rehearsals without a ball, keeping the clubhead above the grass or mat. Finish comfortably in balance. Then use the same tee height and ball position for your next five shots."
            : plan?.change ?? "Use an easy, shorter swing and finish comfortably in balance. Keep the same tee height and ball position for all five shots."}
        </p>
        <button className={styles.primary} type="button" onClick={onStart}>
          {practiceOnly ? "Record my next five balls" : "Start the five-ball rescue"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
