"use client";

import { useEffect, useRef, useState } from "react";
import { RescueVisualGuide } from "./RescueVisualGuide";
import { getSessionFeedback, summarizeShots, type ShotOutcome } from "@/lib/range-rescue/beginner-session";
import styles from "./BeginnerSession.module.css";

const stages = ["Get ready", "Starting shots", "Small-swing practice", "Try again", "Your next step"];
const outcomes: { value: ShotOutcome; label: string }[] = [
  { value: "air", label: "The ball went into the air" },
  { value: "contact", label: "I hit it, but it stayed on the ground" },
  { value: "miss", label: "I missed the ball" },
  { value: "unsure", label: "I couldn’t tell what happened" },
];

export function BeginnerSession({ onExit }: { onExit: () => void }) {
  const [stage, setStage] = useState(0);
  const [before, setBefore] = useState<ShotOutcome[]>([]);
  const [after, setAfter] = useState<ShotOutcome[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { heading.current?.focus(); }, [stage]);
  const shots = stage === 1 ? before : after;
  const setShots = stage === 1 ? setBefore : setAfter;
  useEffect(() => {
    if ((stage === 1 || stage === 3) && shots.length === 5) continueButton.current?.focus();
  }, [stage, shots.length]);
  const initial = summarizeShots(before);
  const final = summarizeShots(after);
  const feedback = stage === 4 ? getSessionFeedback(before, after) : null;

  return <section className={styles.session} aria-labelledby="session-heading">
    <button className={styles.back} onClick={onExit}>← Leave session</button>
    <p className={styles.kicker}>Beginner practice · Step {stage + 1} of 5</p>
    <h1 ref={heading} tabIndex={-1} id="session-heading">{stages[stage]}</h1>
    <p className={styles.note}>About 10–15 minutes. Go at your own pace. Your results stay on this page and clear when you leave or refresh.</p>
    {stage === 0 && <>
      <h2>Today’s goal: touch the ball, then find a little height</h2>
      <p>Distance and direction can wait. We’ll compare five starting shots with five shots after one simple exercise.</p>
      <ol className={styles.instructions}>
        <li>Choose a club marked 9, PW, or SW if you have one. Otherwise use an iron you feel comfortable holding, or ask range staff to help choose one.</li>
        <li>Stay inside your hitting area, face the range, and check that nobody is within reach of your club. Stop if a swing hurts.</li>
        <li>Place one ball on the mat or grass. Stand with feet about shoulder-width apart, bend forward comfortably from your hips, and let the club rest behind the ball with both hands on the handle.</li>
        <li>Use the same club and ball position for both sets. If you need a low tee to begin, use it for both sets.</li>
      </ol>
      <button className={styles.primary} onClick={() => setStage(1)}>I’m ready for five starting shots</button>
    </>}
    {(stage === 1 || stage === 3) && <>
      <h2>{stage === 1 ? "Take five comfortable shots" : "Take five shots with the small swing"}</h2>
      <p>{stage === 1 ? "Use your current comfortable swing. After each attempt, record what happened—even a miss counts." : "Let your hands travel only to about waist height going back and forward. After each attempt, record what happened."}</p>
      <p id="shot-help">“Into the air” means you saw the ball lift off the ground, even briefly. A rolling ball still counts as contact. If you couldn’t tell, choose that option without guessing. Stay inside your hitting area.</p>
      <div className={styles.recorder}>
        <p role="status">{shots.length < 5 ? `Ball ${shots.length + 1} of 5: what happened?` : "All five attempts recorded."}</p>
        {shots.length < 5 && <div className={styles.choices} aria-describedby="shot-help">
          {outcomes.map(({ value, label }) => <button key={value} onClick={() => setShots((previous) => previous.length < 5 ? [...previous, value] : previous)}>{label}</button>)}
        </div>}
        {shots.length > 0 && <>
          <ol className={styles.records}>{shots.map((shot, index) => <li key={index}>Ball {index + 1}: {outcomes.find((item) => item.value === shot)?.label}</li>)}</ol>
          <button className={styles.back} onClick={() => setShots((previous) => previous.slice(0, -1))}>Undo last ball</button>
        </>}
      </div>
      <button ref={continueButton} className={styles.primary} disabled={shots.length !== 5} onClick={() => setStage(stage + 1)}>{stage === 1 ? "Show me the practice exercise" : "Compare my results"}</button>
    </>}
    {stage === 2 && <>
      <h2>One change: make the swing smaller</h2>
      <p>Without a ball, make three gentle swings. Let your hands travel only to about waist height on each side. Feel the club lightly brush the grass or mat, and finish standing comfortably.</p>
      <p>A smaller movement gives you a simpler task to repeat. It may help contact; it does not guarantee the ball will lift. You do not need to scoop the ball upward.</p>
      <RescueVisualGuide id="thin-or-top" practiceOnly onStart={() => setStage(3)} />
    </>}
    {feedback && <>
      <h2>{feedback.title}</h2>
      <table className={styles.results}><caption>Your two sets of five attempts</caption><thead><tr><th scope="col">What you observed</th><th scope="col">Start</th><th scope="col">After practice</th></tr></thead><tbody>
        <tr><th scope="row">Touched the ball</th><td>{initial.contact}/5</td><td>{final.contact}/5</td></tr>
        <tr><th scope="row">Got it into the air</th><td>{initial.airborne}/5</td><td>{final.airborne}/5</td></tr>
      </tbody></table>
      <p>Shots that went into the air count in both rows. Unclear results are not counted as contact or height; the table only shows what you observed. These are observations from a small sample, not a swing diagnosis.</p>
      <div className={styles.next}><h2>Next practice</h2><p>{feedback.next}</p></div>
      <p>You can finish here. There’s no need to keep hitting until you get a perfect shot.</p>
      <button className={styles.primary} onClick={onExit}>Finish session</button>
    </>}
  </section>;
}
