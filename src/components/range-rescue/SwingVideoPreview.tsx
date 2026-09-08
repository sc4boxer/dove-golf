"use client";

import { useEffect, useRef, useState } from "react";
import ShotReplay from "./ShotReplay";
import { summarizeShots, type ShotOutcome } from "@/lib/range-rescue/beginner-session";
import { getShotPractice, getShotPracticeFeedback, SAMPLE_START, SAMPLE_AFTER } from "@/lib/range-rescue/shot-practice";
import type { RangeRescueClub } from "@/lib/range-rescue/plans";
import styles from "./SwingVideoPreview.module.css";

type Stage = "setup" | "start" | "practice" | "after" | "results";
type Mode = "sample" | "own";
const outcomeOptions: { id: ShotOutcome; label: string; detail: string }[] = [
  { id: "air", label: "Airborne", detail: "Lifted off the ground, even briefly" },
  { id: "contact", label: "Rolled", detail: "Made contact, stayed on the ground" },
  { id: "miss", label: "Missed", detail: "Did not touch the ball" },
  { id: "unsure", label: "Unclear", detail: "I couldn't confidently tell" },
];
const titles: Record<Stage, string> = { setup: "Film a shot. Find your next step.", start: "First, see what happens.", practice: "One thing to practice.", after: "Try five more balls.", results: "See what changed." };

function CameraGuide({ left, club }: { left: boolean; club: RangeRescueClub }) {
  return <svg className={styles.camera} viewBox="0 0 560 320" role="img" aria-label={`Top-down guide for a ${left ? "left" : "right"}-handed golfer: phone behind the ball at the back of the bay, looking straight down the range. The friend stands well behind the swing area. Same camera direction for irons and driver.`}>
    <rect width="560" height="320" rx="18" fill="#edf2ef" />
    <path d="M280 249V30m-8 10 8-10 8 10" stroke="#52766b" strokeWidth="2" strokeDasharray="5 5" fill="none" />
    <text x="303" y="39" fill="#36594c" fontSize="14">Down the range</text>
    <g transform={left ? "translate(560 0) scale(-1 1)" : undefined}>
      <ellipse cx="245" cy="137" rx="79" ry="59" fill="none" stroke="#94a3b8" strokeDasharray="4 5" />
      <circle cx="220" cy="137" r="16" fill="#0f172a" />
      <path d="M234 140l39-3" stroke="#0f172a" strokeWidth="4" />
    </g>
    <circle cx="280" cy="137" r="6" fill="white" stroke="#52766b" strokeWidth="2" />
    <text x={left ? 70 : 370} y="143" fill="#475569" fontSize="13">{club === "driver" ? "Ball on tee" : "Ball"}</text>
    <text x={left ? 407 : 55} y="96" fill="#475569" fontSize="13">Swing area</text>
    <path d={left ? "M392 100h10" : "M135 100h24"} stroke="#94a3b8" />
    <path d="M32 225H528" stroke="#c6d6cc" />
    <rect x="270" y="252" width="20" height="32" rx="4" fill="#0f172a" /><circle cx="280" cy="260" r="2" fill="white" />
    <text x="308" y="264" fill="#36594c" fontSize="14">Phone + friend</text>
    <text x="308" y="283" fill="#475569" fontSize="12">At the back of your bay</text>
    <text x="20" y="305" fill="#64748b" fontSize="11">Position guide · not to scale</text>
  </svg>;
}

export function SwingVideoPreview({ onExit, club = "iron" }: { onExit: () => void; club?: RangeRescueClub }) {
  const [stage, setStage] = useState<Stage>("setup");
  const [mode, setMode] = useState<Mode>("sample");
  const [left, setLeft] = useState(false);
  const [before, setBefore] = useState<ShotOutcome[]>([]);
  const [after, setAfter] = useState<ShotOutcome[]>([]);
  const [selected, setSelected] = useState<ShotOutcome | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [help, setHelp] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const confirm = useRef<HTMLButtonElement>(null);
  const recording = stage === "start" || stage === "after";
  const shots = stage === "after" ? after : before;
  const shotIndex = editing ?? shots.length;
  const complete = shots.length === 5 && editing === null;
  const sample = (stage === "after" ? SAMPLE_AFTER : SAMPLE_START)[Math.min(shotIndex, 4)];
  const plan = before.length === 5 ? getShotPractice(before, club) : null;
  const initial = summarizeShots(before);
  const final = summarizeShots(after);
  const feedback = stage === "results" ? getShotPracticeFeedback(before, after, club) : null;
  useEffect(() => { heading.current?.focus(); }, [stage]);
  useEffect(() => { if (recording) heading.current?.focus(); }, [recording, shotIndex, editing]);
  function begin(nextMode: Mode) { setMode(nextMode); setStage("start"); }
  function record() {
    if (!selected || complete) return;
    const next = editing === null ? [...shots, selected] : shots.map((shot, index) => index === editing ? selected : shot);
    if (stage === "after") setAfter(next); else setBefore(next);
    setSelected(null); setEditing(null);
  }
  function undo() {
    if (stage === "after") setAfter(shots.slice(0, -1)); else setBefore(shots.slice(0, -1));
    setSelected(null); setEditing(null);
  }
  const activeStep = stage === "setup" ? 0 : stage === "start" ? 1 : stage === "practice" ? 2 : stage === "after" ? 3 : 4;

  return <section className={styles.preview} aria-labelledby="shot-practice-title">
    <div className={styles.topline}><button className={styles.back} onClick={onExit}>← Range Rescue</button><span className={styles.badge}>Experimental · {club === "driver" ? "Driver" : "Irons"}</span></div>
    <p className={styles.eyebrow}>{stage === "setup" ? "A little help, one shot at a time" : mode === "sample" ? "Sample session · these are example results" : "Your practice · outcomes confirmed by you"}</p>
    <h1 id="shot-practice-title" ref={heading} tabIndex={-1}>{titles[stage]}</h1>
    <p className={styles.intro}>{stage === "setup" ? "Replay the shot, notice contact and height, then choose one simple thing to try. Distance can wait." : "Five starting attempts. One practice task. Five more attempts."}</p>
    <ol className={styles.progress} aria-label="Practice progress">{["Prepare", "First five", "Practice", "Next five", "Compare"].map((label, i) => <li key={label} aria-current={i === activeStep ? "step" : undefined}><span>{i + 1}</span>{label}</li>)}</ol>

    {stage === "setup" && <>
      <div className={styles.card}>
        <div className={styles.cardHeading}><span className={styles.eyebrow}>A range-friendly camera angle</span><span className={styles.tag}>Down the range</span></div>
        <h2>From behind, looking down the range.</h2>
        <p>Ask your friend to film from the back of your bay, well behind the swing area. Point the phone straight down the range along the ball’s intended path. Keep the ball and the ground ahead visible, with space above for its flight.</p>
        <fieldset className={styles.handedness}><legend>Which way do you play?</legend><label><input type="radio" name="shot-handedness" checked={!left} onChange={() => setLeft(false)} /> Right-handed</label><label><input type="radio" name="shot-handedness" checked={left} onChange={() => setLeft(true)} /> Left-handed</label></fieldset>
        <CameraGuide left={left} club={club} />
        <ul className={styles.tips}><li>Keep the phone steady and everyone outside the swing area and ball’s path. Stay within your bay; skip filming if there is no safe space.</li><li>Include the ball before the swing and a few seconds afterward. Rolling shots matter too.</li><li>{club === "driver" ? "Use your driver with a suitable tee. Keep the same driver, tee height, and ball position for both sets." : "Use the same iron, ball position, and grass, mat, or tee setup for both sets."} Stop if swinging hurts.</li></ul>
      </div>
      <div className={`${styles.card} ${styles.startCard}`}>
        <span className={styles.eyebrow}>At the range</span><h2>Film your shot.</h2><p>Record or choose a short clip. We’ll look for the shot moment on your device. Replay it, then confirm whether the ball got airborne, rolled, or stayed in place.</p>
        <div className={styles.startActions}><button className={styles.primary} onClick={() => begin("own")}>Start my practice →</button><button className={styles.demoLink} onClick={() => begin("sample")}>See a demo with sample shots</button></div>
      </div>
      <p className={styles.note}>Video stays on your device and clears when you confirm or leave a shot. The experimental check helps find the shot moment; you confirm the outcome. Demo shots are illustrations. Leaving or refreshing clears your results.</p>
    </>}

    {recording && <>
      <div className={styles.setHeading}><h2>{complete ? "All five attempts recorded." : `Ball ${shotIndex + 1} of 5`}</h2><span className={styles.tag}>{stage === "start" ? "Starting set" : "After practice"}</span></div>
      {stage === "after" && plan && <p className={styles.note}>Practice focus: {plan.title}. Keep your club and setup the same.</p>}
      {!complete && <>
        <ShotReplay key={`${club}-${stage}-${shotIndex}-${editing === null ? "new" : "edit"}`} sample={sample} allowSamples={mode === "sample"} club={club} />
        <div className={styles.card}>
          <h2>{mode === "sample" ? "Confirm the example outcome" : "What happened to this ball?"}</h2>
          <p className={styles.note}>{mode === "sample" ? `Example outcome: ${outcomeOptions.find(option => option.id === sample)?.label}. You can change it to explore a different result.` : "Confirm what you see in the replay. The video check finds movement; it does not classify the result."}</p>
          <div className={styles.outcomes} role="group" aria-label="Shot outcome">{outcomeOptions.map(option => <button key={option.id} aria-pressed={selected === option.id} onClick={() => setSelected(option.id)}><strong>{option.label}</strong><span>{club === "driver" && option.id === "air" ? "Flew beyond the tee, even briefly" : option.detail}</span></button>)}</div>
          <button className={styles.primary} ref={confirm} disabled={selected === null} onClick={record}>{editing === null ? "Confirm this shot" : "Save correction"}</button>
          {editing !== null && <button className={styles.back} onClick={() => { setEditing(null); setSelected(null); }}>Cancel correction</button>}
          <button className={styles.back} aria-expanded={help} onClick={() => setHelp(!help)}>Can’t see the ball?</button>
          {help && <div className={styles.help}><p>Keep the camera still and include more ground around the ball next time. If the ball disappears, do not guess the rest of its flight.</p><p>Choose Unclear for this attempt and count it. You can film the next shot from a safer, clearer position.</p></div>}
        </div>
      </>}
      {shots.length > 0 && <div className={styles.card}><h2>Your {mode === "sample" ? "example " : ""}shot record</h2><ol className={styles.shotList}>{shots.map((outcome, i) => <li key={i}><span>Ball {i + 1}</span><strong>{outcomeOptions.find(option => option.id === outcome)?.label}</strong><button aria-label={`Edit ball ${i + 1}`} onClick={() => { setEditing(i); setSelected(outcome); }}>Edit</button></li>)}</ol><button className={styles.back} onClick={undo}>Undo last shot</button></div>}
      {complete && <><p className={styles.note}>Airborne shots also count as contact. Unclear attempts stay in the set and are not counted as confirmed contact.</p><button className={styles.primary} onClick={() => { setSelected(null); setStage(stage === "start" ? "practice" : "results"); }}>{stage === "start" ? "Find my one practice task" : "Compare my two sets"}</button></>}
    </>}

    {stage === "practice" && plan && <>
      <div className={styles.stats}><div><strong>{initial.contact}<small>/5</small></strong><span>Confirmed contact</span></div><div><strong>{initial.airborne}<small>/5</small></strong><span>Airborne</span></div></div>
      <div className={styles.practice}><span className={styles.eyebrow}>{mode === "sample" ? "Based on your example selections" : "Based on the outcomes you confirmed"}</span><h2>{plan.title}</h2><p>{plan.observation}</p><div className={styles.rule} /><h3>Your next task</h3><p>{plan.instruction}</p><h3>What to notice</h3><p>{plan.measure}</p></div>
      <p className={styles.note}>This is a practice experiment, not a diagnosis of your swing. Keep the club and setup the same. If either changes, start a new session.</p>
      <button className={styles.primary} onClick={() => {
        if (plan.id === "clarify") { setBefore([]); setAfter([]); setSelected(null); setEditing(null); setStage("start"); }
        else setStage("after");
      }}>{plan.id === "clarify" ? "Record a fresh starting set" : mode === "sample" ? "Explore the next five example shots" : "I'm ready for five more balls"}</button>
      <button className={styles.back} onClick={() => setStage("start")}>Review starting outcomes</button>
    </>}

    {stage === "results" && feedback && <>
      <div className={styles.practice}><span className={styles.eyebrow}>{mode === "sample" ? "Example comparison" : "Your comparison"}</span><h2>{feedback.title}</h2><table className={styles.table}><caption>Two sets of five attempts</caption><thead><tr><th scope="col">What you saw</th><th scope="col">Start</th><th scope="col">After</th></tr></thead><tbody><tr><th scope="row">Contact</th><td>{initial.contact}/5</td><td>{final.contact}/5</td></tr><tr><th scope="row">Airborne</th><td>{initial.airborne}/5</td><td>{final.airborne}/5</td></tr></tbody></table><p>{feedback.next}</p></div>
      <p className={styles.note}>{mode === "sample" ? "These are sample results, not evidence that your swing improved. " : "One small set does not prove lasting improvement. "}Airborne counts as contact. Unclear results prevent a fair improvement claim.</p>
      <button className={styles.primary} onClick={onExit}>Finish practice</button>
      <button className={styles.secondary} onClick={() => { setBefore([]); setAfter([]); setSelected(null); setEditing(null); setStage("setup"); }}>Start a fresh session</button>
      <button className={styles.back} onClick={() => setStage("after")}>Review comparison outcomes</button>
    </>}
    {stage !== "setup" && <p className={styles.sessionNote}>{mode === "sample" ? "Illustrated sample session" : "Local session · no uploads"} · Results clear when you leave or refresh.</p>}
  </section>;
}
