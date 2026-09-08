"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DriverSwingAnimation.module.css";

export function DriverSwingAnimation() {
  const figure = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
    }, { threshold: [0, 0.3] });
    if (figure.current) observer.observe(figure.current);
    return () => observer.disconnect();
  }, []);

  return <figure ref={figure} className={styles.figure}>
    <div key={replay} className={visible ? styles.playing : undefined}>
      <svg className={styles.diagram} viewBox="0 0 560 250" role="img" aria-label="Illustrated driver tee shot: a shorter backswing, the club sweeping above the ground through the teed ball, then a controlled finish. The example ball flight is not a predicted result.">
        <path className={styles.ground} d="M45 211 H515" />
        <path className={styles.tee} d="M326 211 V159 M317 156 Q326 163 335 156" />
        <path className={styles.swingArc} d="M173 148 A120 120 0 0 0 359 57" />
        <path className={styles.flight} d="M326 145 L484 50" />
        <g className={styles.club}>
          <path className={styles.shaft} d="M240 45 L294 136" />
          <path className={styles.head} d="M288 130 Q272 132 277 146 Q282 158 302 158 L315 155 L315 133 Q301 127 288 130 Z" />
        </g>
        <circle className={styles.ball} cx="326" cy="145" r="11" />
        <text className={styles.label} x="48" y="234">Grass or mat</text>
        <text className={styles.label} x="352" y="193">Ball on a tee</text>
      </svg>
      <ol className={styles.steps} aria-label="Driver swing sequence">
        <li><span>1</span>Shorter backswing</li>
        <li><span>2</span>Sweep through</li>
        <li><span>3</span>Balanced finish</li>
      </ol>
    </div>
    <figcaption>Example tee shot, shown from the side. Rehearse without a ball first. Keep your starting tee height and ball position.</figcaption>
    <button type="button" className={styles.replay} onClick={() => {
      setReplay(value => value + 1);
      figure.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }}>Replay picture <span aria-hidden="true">↻</span></button>
  </figure>;
}
