"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { TrackLink } from "@/components/analytics/TrackLink";
import { MissVisual } from "@/components/range-rescue/MissVisual";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import styles from "./ToolShowcase.module.css";

const tools = [
  { id: "range", tab: "Range Rescue", title: "Build a better next shot.", label: "A guided start", description: "Build better contact, one small practice step at a time.", detail: "Start with five shots. Try one exercise. See what changed.", href: "/range-rescue", action: "Start practicing" },
  { id: "flight", tab: "Ball Flight", title: "Make sense of your ball flight.", label: "Ball Flight Decoder", description: "Understand what your ball’s start and curve may suggest.", detail: "Describe the flight. Get a clear explanation and one practical test.", href: "/tools/ball-flight-decoder", action: "Decode a shot" },
  { id: "equipment", tab: "Equipment Fit", title: "Know what’s worth testing.", label: "Before buying gear", description: "Check whether a repeated pattern makes your club setup worth testing.", detail: "Explore your observations before deciding what to change.", href: "/diagnostic", action: "Check my setup" },
] as const;

export function ToolShowcase() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  function select(index: number, focus = false) {
    const next = (index + tools.length) % tools.length;
    setSelected(next);
    if (focus) tabs.current[next]?.focus();
  }
  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    swiped.current = false;
    if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest("a,button,input")) return;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  return <section className={styles.showcase} aria-label="Explore Dove Golf tools">
    <div role="tablist" aria-label="Choose a tool" className={styles.tabs}>
      {tools.map((tool, index) => <button key={tool.id} type="button" role="tab" id={`tool-tab-${tool.id}`} aria-controls={`tool-panel-${tool.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={(element) => { tabs.current[index] = element; }} onClick={() => select(index)} onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        select(event.key === "Home" ? 0 : event.key === "End" ? tools.length - 1 : selected + (event.key === "ArrowRight" ? 1 : -1), true);
      }}>{tool.tab}</button>)}
    </div>
    <div className={styles.panels} onPointerDown={startSwipe} onPointerCancel={() => { gesture.current = null; }} onLostPointerCapture={() => { gesture.current = null; }} onPointerUp={(event) => {
      const start = gesture.current; gesture.current = null;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped.current = true; select(selected + (dx < 0 ? 1 : -1)); }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }} onClickCapture={(event) => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}>
      {tools.map((tool, index) => <div key={tool.id} role="tabpanel" id={`tool-panel-${tool.id}`} aria-labelledby={`tool-tab-${tool.id}`} aria-hidden={selected !== index} inert={selected !== index} className={`${styles.panel} ${selected === index ? styles.active : ""}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{tool.label}</p>
          <h2>{tool.title}</h2>
          <p className={styles.description}>{tool.description}</p>
          <p className={styles.detail}>{tool.detail}</p>
          {tool.id === "range" ? <Link href={tool.href} className={styles.action}>{tool.action}<span aria-hidden="true">→</span></Link> : <TrackLink href={tool.href} className={styles.action} eventParams={tool.id === "flight" ? { module: "ball_flight_decoder", placement: "home_hero_primary", version: "revival_v2" } : { module: "dovefit", placement: "home_hero_secondary", version: "revival_v2" }}>{tool.action}<span aria-hidden="true">→</span></TrackLink>}
        </div>
        <div className={styles.visual}>
          {tool.id === "range" ? <div className={styles.practicePreview}>
            <div className={styles.previewTop}><span>Your next five balls</span><span aria-hidden="true">01—05</span></div>
            <div className={styles.contact}><MissVisual id="thin-or-top" large /><span>Spot the miss.<br />Try one change.</span></div>
            <div className={styles.fiveBalls} aria-label="Five attempts, one step at a time">{[1, 2, 3, 4, 5].map((ball) => <span key={ball}>{ball}</span>)}</div>
            <p>One clear thing to practice.</p>
          </div> : tool.id === "flight" ? <div className={styles.flightPreview}>
            <p className={styles.previewTop}>Start direction + curve</p>
            <BallFlightChart shape="fade" compact staticRender className={styles.flightChart} />
            <p>An example flight, viewed from above.</p>
          </div> : <div className={styles.equipmentPreview}>
            <p className={styles.previewTop}>A clearer equipment check</p>
            {["Your current club", "The pattern you see", "One change to test"].map((label, i) => <div className={styles.checkRow} key={label}><span aria-hidden="true">0{i + 1}</span><strong>{label}</strong></div>)}
            <p>Observe first. Test before buying.</p>
          </div>}
        </div>
      </div>)}
    </div>
    <div className={styles.browse}>
      <span>Choose a tab or swipe to explore</span>
      <div><button type="button" aria-label="Previous tool" onClick={() => select(selected - 1)}><span aria-hidden="true">←</span></button><span role="status" aria-live="polite">{selected + 1} / 3</span><button type="button" aria-label="Next tool" onClick={() => select(selected + 1)}><span aria-hidden="true">→</span></button></div>
    </div>
  </section>;
}

