"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./SwingVideoPreview.module.css";

type Sample = "review" | "retake" | "unclear";
const examples: { id: Sample; title: string; description: string }[] = [
  { id: "review", title: "Example review", description: "A visible movement and one practice idea." },
  { id: "retake", title: "Needs a retake", description: "The golfer’s hands leave the picture." },
  { id: "unclear", title: "No clear finding", description: "There isn’t enough evidence for a suggestion." },
];

function FramingDiagram({ observation = false }: { observation?: boolean }) {
  return <svg className={styles.diagram} viewBox="0 0 420 290" role="img" aria-label={observation ? "Illustrative golfer with hands above a dashed waist-height line. This is a drawing, not analyzed footage." : "Face-on framing example: the golfer’s whole body and club fit inside the picture, with space around them."}>
    <rect x="18" y="16" width="384" height="258" rx="18" fill="#eaf1ee" />
    <path d="M40 66V38h30 M350 38h30v28 M40 222v28h30 M350 250h30v-28" fill="none" stroke="#52766b" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 237h310" stroke="#a4b8af" strokeWidth="2" />
    <circle cx="207" cy="78" r="18" fill="#0f172a" />
    <path d="M207 105v69 M207 174l-25 60 M207 174l26 60" fill="none" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    {observation ? <>
      <path d="M207 115l42 17 18-47 M207 116l32-2 28-29" fill="none" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M267 85L155 46l-15 8" fill="none" stroke="#52766b" strokeWidth="5" strokeLinecap="round" />
      <path d="M75 174h265" stroke="#52766b" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="267" cy="85" r="15" fill="none" stroke="#916214" strokeWidth="3" />
      <text x="79" y="164" fill="#36594c" fontSize="13" fontFamily="sans-serif">Waist height</text>
    </> : <>
      <path d="M207 114l-17 42 30 12 M207 114l20 40-7 14" fill="none" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M220 168l37 66h15" fill="none" stroke="#52766b" strokeWidth="5" strokeLinecap="round" />
      <circle cx="278" cy="232" r="5" fill="#fff" stroke="#52766b" strokeWidth="1.5" />
    </>}
  </svg>;
}

export function SwingVideoPreview({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [sample, setSample] = useState<Sample>("review");
  const heading = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  useEffect(() => { heading.current?.focus(); }, [step]);
  const title = step === 0 ? "Film your swing. Get one thing to work on." : step === 1 ? "Explore an example" : sample === "retake" ? "A clearer view would help" : sample === "unclear" ? "No clear finding is a valid result" : "One observation. One practice idea.";

  return <section className={styles.preview} aria-labelledby={headingId}>
    <div className={styles.topline}><span className={styles.badge}>Interactive preview</span><span className={styles.counter}>Preview step {step + 1} of 3</span></div>
    <h1 id={headingId} ref={heading} tabIndex={-1} className={styles.heading}>{title}</h1>
    <p className={styles.notice}>Example only. This preview does not record, upload, or analyze your swing.</p>
    <ol className={styles.progress} aria-label="Preview steps">
      {["Frame", "Explore", "Practice"].map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}
    </ol>

    {step === 0 && <>
      <div className={styles.card}>
        <FramingDiagram />
        <h2>Start with a face-on view</h2>
        <p>The camera faces your chest, so your whole body and club can be seen.</p>
        <ul className={styles.tips}>
          <li>Keep the phone steady, with room around the full swing.</li>
          <li>Keep the phone and any helper outside the reach of your club and away from the ball’s path.</li>
          <li>Include the setup, swing, and finish in one short clip.</li>
        </ul>
        <p className={styles.small}>No filming needed today. Explore the sample below.</p>
      </div>
      <button type="button" className={styles.primary} onClick={() => setStep(1)}>Explore the sample reviews</button>
    </>}

    {step === 1 && <>
      <p>A useful review needs a clear view. See how the experience could respond in three situations.</p>
      <div className={styles.examples}>
        {examples.map((example) => <button type="button" className={styles.example} key={example.id} onClick={() => { setSample(example.id); setStep(2); }}>
          <span className={styles.exampleTitle}>{example.title}<span aria-hidden="true">→</span></span>
          <span className={styles.small}>{example.description}</span>
        </button>)}
      </div>
      <button type="button" className={styles.secondary} onClick={() => setStep(0)}>Back to framing guide</button>
    </>}

    {step === 2 && <>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Sample response · Not your swing</span>
        {sample === "review" ? <>
          <figure className={styles.figure}>
            <FramingDiagram observation />
            <figcaption>Illustrative frame · 00:02 is an example timestamp, not actual footage.</figcaption>
          </figure>
          <h2>What is visible in this example</h2>
          <p>The hands travel above waist height on the backswing.</p>
          <p className={styles.small}>A longer swing isn’t automatically a fault. This observation does not explain why a ball was missed.</p>
          <div className={styles.practice}>
            <span className={styles.eyebrow}>One thing to try</span>
            <h2>Make the swing smaller</h2>
            <p>Without a ball, rehearse three gentle swings with your hands traveling only to about waist height on each side.</p>
          </div>
          <p className={styles.small}>Then try five balls with the same club and setup. Record contact and height to see what happens.</p>
        </> : sample === "retake" ? <>
          <h2>The hands leave the picture</h2>
          <p>In this example, part of the swing is out of view. A review would need another clip with more space around the golfer.</p>
          <p className={styles.small}>Move the camera farther away while keeping it in a safe position. Check that the full swing fits before recording.</p>
        </> : <>
          <h2>There isn’t enough evidence to choose a change</h2>
          <p>A review should say when it cannot make a useful observation. It doesn’t mean your swing is right or wrong.</p>
          <p className={styles.small}>You can still try the usual small-swing practice and compare your next five balls.</p>
        </>}
      </div>
      {sample === "retake" ? <>
        <button type="button" className={styles.primary} onClick={() => setStep(0)}>Revisit the framing guide</button>
        <button type="button" className={styles.secondary} onClick={onComplete}>Continue with usual practice</button>
      </> : <button type="button" className={styles.primary} onClick={onComplete}>{sample === "review" ? "Try the small-swing practice" : "Continue with usual practice"}</button>}
      <button type="button" className={styles.secondary} onClick={() => setStep(1)}>Explore another example</button>
    </>}
    <div className={styles.footer}>
      <button type="button" className={styles.textButton} onClick={onBack}>← Back to starting shots</button>
      {step !== 2 && <button type="button" className={styles.textButton} onClick={onComplete}>Skip preview and practice</button>}
    </div>
  </section>;
}
