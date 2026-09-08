"use client";

import { useEffect, useRef, useState } from "react";
import { MissVisual } from "@/components/range-rescue/MissVisual";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import styles from "./ToolPreview.module.css";

export const TOOL_PREVIEW_DURATION_MS = { range: 6300, flight: 4000, equipment: 5600 } as const;

type ToolPreviewProps = {
  id: keyof typeof TOOL_PREVIEW_DURATION_MS;
  animate: boolean;
  onStart?: () => void;
  onComplete?: () => void;
};

export function ToolPreview({ id, animate, onStart, onComplete }: ToolPreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const callbacks = useRef({ onStart, onComplete });
  const playing = animate && visible;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2);
    }, { threshold: [0, 0.2] });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { callbacks.current = { onStart, onComplete }; }, [onStart, onComplete]);
  useEffect(() => {
    if (!playing) return;
    callbacks.current.onStart?.();
    const timer = window.setTimeout(() => callbacks.current.onComplete?.(), TOOL_PREVIEW_DURATION_MS[id]);
    return () => window.clearTimeout(timer);
  }, [id, playing]);

  const animationClass = playing ? styles.animated : "";

  if (id === "range") return <div ref={root} className={`${styles.practicePreview} ${animationClass}`}>
    <div className={styles.previewTop}><span>Your next five balls</span><span aria-hidden="true">01—05</span></div>
    <div className={styles.contact}><MissVisual id="thin-or-top" large /><span>Spot the miss.<br />Try one change.</span></div>
    <div className={styles.fiveBalls} aria-label="Five attempts, one step at a time">{[1, 2, 3, 4, 5].map((ball) => <span key={ball} style={{ animationDelay: `${0.3 + (ball - 1) * 0.9}s` }}>{ball}</span>)}</div>
    <div className={styles.takeaway}>
      <p className={styles.takeawayLabel}>Example iron practice</p>
      <p>Try five waist-high swings. Count how many balls get airborne.</p>
    </div>
  </div>;

  if (id === "flight") return <div ref={root} className={`${styles.flightPreview} ${animationClass}`}>
    <p className={styles.previewTop}>Start direction + curve</p>
    <BallFlightChart key={String(playing)} shape="fade" compact staticRender={!playing} className={styles.flightChart} />
    <div className={styles.takeaway}>
      <p className={styles.takeawayLabel}>Example reading · right-handed</p>
      <p>Starts on line, then curves right: a fade.</p>
    </div>
  </div>;

  return <div ref={root} className={`${styles.equipmentPreview} ${animationClass}`}>
    <p className={`${styles.previewTop} ${styles.equipmentHeading}`}>A clearer equipment check</p>
    {["Your current club", "The pattern you see", "One change to test"].map((label, i) => <div className={styles.checkRow} key={label} style={{ animationDelay: `${0.3 + i * 0.9}s` }}><span aria-hidden="true">0{i + 1}</span><strong>{label}</strong></div>)}
    <div className={styles.takeaway}>
      <p className={styles.takeawayLabel}>Example equipment check</p>
      <p>Test one club change. Compare the strike pattern before buying.</p>
    </div>
  </div>;
}
