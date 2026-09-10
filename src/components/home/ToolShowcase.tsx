"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";
import { TrackLink } from "@/components/analytics/TrackLink";
import { ToolPreview } from "./ToolPreview";
import { nextToolIndex, swipeStep } from "./showcaseInteraction";
import styles from "./ToolShowcase.module.css";

const tools = [
  { id: "range", tab: "Range Rescue", title: "Build a better next shot.", label: "Struggling with contact?", description: "Build better contact, one small practice step at a time.", detail: "Irons or driver. Five shots. One change to test.", href: "/range-rescue", action: "Start practicing" },
  { id: "flight", tab: "Ball Flight", title: "Make sense of your ball flight.", label: "Confused by your curve?", description: "Understand what your ball’s start and curve may suggest.", detail: "Describe the flight. Get a clear explanation and one practical test.", href: "/tools/ball-flight-decoder", action: "Decode a shot" },
  { id: "equipment", tab: "Equipment Fit", title: "Know what’s worth testing.", label: "Considering a club change?", description: "Check whether a repeated pattern makes your club setup worth testing.", detail: "Explore your observations before deciding what to change.", href: "/diagnostic", action: "Check my setup" },
] as const;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageIsVisible = () => !document.hidden;
const serverReducedMotion = () => true;
const serverVisible = () => false;

export function ToolShowcase() {
  const [selected, setSelected] = useState(0);
  const [rotationOn, setRotationOn] = useState(true);
  const [motionPaused, setMotionPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const animationDone = useRef(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, serverReducedMotion);
  const pageVisible = useSyncExternalStore(subscribeVisibility, pageIsVisible, serverVisible);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const select = useCallback((index: number, focus = false, manual = true) => {
    const next = nextToolIndex(index, tools.length);
    if (manual) setRotationOn(false);
    if (next !== selected) animationDone.current = false;
    setSelected(next);
    if (focus) tabs.current[next]?.focus();
  }, [selected]);
  const previewComplete = useCallback(() => { animationDone.current = true; }, []);
  const previewStarted = useCallback(() => { animationDone.current = false; }, []);

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25), { threshold: 0.25 });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotationOn || hovered || !inView || !pageVisible || reducedMotion) return;
    // Each visible preview gets a full ten seconds, and may finish before advancing.
    let timer: ReturnType<typeof setTimeout>;
    const advanceWhenFinished = () => {
      if (animationDone.current) select(selected + 1, false, false);
      else timer = setTimeout(advanceWhenFinished, 100);
    };
    timer = setTimeout(advanceWhenFinished, 10_000);
    return () => clearTimeout(timer);
  }, [selected, rotationOn, hovered, inView, pageVisible, reducedMotion, select]);

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    swiped.current = false;
    const target = event.target as HTMLElement;
    if (!event.isPrimary || event.button !== 0 || target.closest("a,input") || target.closest("button:not([role=tab])")) return;
    setRotationOn(false);
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }
  function moveSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      event.currentTarget.setPointerCapture(event.pointerId);
      swiped.current = true;
    }
  }
  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    const direction = swipeStep(dx, dy);
    if (direction) {
      swiped.current = true;
      const tabFocused = tabs.current.some(tab => tab === document.activeElement);
      select(selected + direction, tabFocused);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const swipeHandlers = {
    onPointerDown: startSwipe,
    onPointerMove: moveSwipe,
    onPointerUp: endSwipe,
    onPointerCancel: () => { gesture.current = null; swiped.current = false; },
    onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => {
      // Touch implicitly captures a tab; transferring it to this wrapper must not cancel the swipe.
      if (event.target === event.currentTarget) gesture.current = null;
    },
  };
  const animate = inView && pageVisible && !reducedMotion && !motionPaused;
  return <section ref={section} className={styles.showcase} aria-label="Explore Dove Golf tools" onPointerDownCapture={() => { swiped.current = false; }} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={event => {
    if (!(event.target as HTMLElement).closest("[data-rotation-control]")) setRotationOn(false);
  }} onClickCapture={event => {
    if (swiped.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); swiped.current = false; }
  }}>
    <div className={styles.selectorLabel}><span>Explore the tools</span><span>Swipe or choose a tab</span></div>
    <div role="tablist" aria-label="Preview a tool" className={styles.tabs} style={{ "--selected-tab": selected } as CSSProperties} {...swipeHandlers}>
      <span className={styles.tabIndicator} aria-hidden="true" />
      {tools.map((tool, index) => <button key={tool.id} type="button" role="tab" id={`tool-tab-${tool.id}`} aria-controls={`tool-panel-${tool.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={(element) => { tabs.current[index] = element; }} onClick={() => select(index)} onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        select(event.key === "Home" ? 0 : event.key === "End" ? tools.length - 1 : selected + (event.key === "ArrowRight" ? 1 : -1), true);
      }}>{tool.tab}</button>)}
    </div>
    <div className={styles.panels} {...swipeHandlers}>
      {tools.map((tool, index) => <div key={tool.id} role="tabpanel" id={`tool-panel-${tool.id}`} aria-labelledby={`tool-tab-${tool.id}`} aria-hidden={selected !== index} inert={selected !== index} className={`${styles.panel} ${selected === index ? styles.active : ""}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{tool.label}</p>
          <h2>{tool.title}</h2>
          <p className={styles.description}>{tool.description}</p>
          <p className={styles.detail}>{tool.detail}</p>
          <TrackLink href={tool.href} className={styles.action} eventParams={tool.id === "range" ? { module: "range_rescue", placement: "home_hero_primary", version: "revival_v2" } : tool.id === "flight" ? { module: "ball_flight_decoder", placement: "home_hero_primary", version: "revival_v2" } : { module: "dovefit", placement: "home_hero_secondary", version: "revival_v2" }}>{tool.action}<span aria-hidden="true">→</span></TrackLink>
        </div>
        <div className={styles.visual}>
          <ToolPreview id={tool.id} animate={selected === index && animate} onStart={selected === index ? previewStarted : undefined} onComplete={selected === index ? previewComplete : undefined} />
        </div>
      </div>)}
    </div>
    <div className={styles.browse}>
      <button type="button" className={styles.rotation} data-rotation-control disabled={reducedMotion} onClick={() => { setRotationOn(!rotationOn); setMotionPaused(rotationOn); }} aria-label={reducedMotion ? "Automatic previews off: reduced motion" : rotationOn ? "Pause automatic previews" : "Resume automatic previews"}><span aria-hidden="true">{rotationOn && !reducedMotion ? "Ⅱ" : "▷"}</span>{reducedMotion ? "Auto-preview off" : rotationOn ? "Pause previews" : "Resume previews"}</button>
      <div><button type="button" aria-label="Previous tool" onClick={() => select(selected - 1)}><span aria-hidden="true">←</span></button><span role="status" aria-live={rotationOn ? "off" : "polite"}>{selected + 1} / 3</span><button type="button" aria-label="Next tool" onClick={() => select(selected + 1)}><span aria-hidden="true">→</span></button></div>
    </div>
  </section>;
}
