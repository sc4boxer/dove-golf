"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function TrajectoryComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timersRef = useRef<number[]>([]);
  const [forceMotion, setForceMotion] = useState(false);
  const [runId, setRunId] = useState(0);
  const w = 760;
  const h = 240;
  const padL = 56;
  const padR = 34;
  const padT = 26;
  const padB = 44;
  const originX = padL;
  const originY = h - padB;
  const xMax = w - padR;
  const yMax = padT;

  function curvePath(endX: number, endY: number, peakY: number) {
    const c1x = originX + (endX - originX) * 0.28;
    const c2x = originX + (endX - originX) * 0.72;
    return `M ${originX} ${originY} C ${c1x} ${peakY}, ${c2x} ${peakY}, ${endX} ${endY}`;
  }

  const highShortEndX = originX + (xMax - originX) * 0.52;
  const highShortPeakY = yMax + (originY - yMax) * 0.1;
  const highShortEndY = originY - 2;
  const lowMidEndX = originX + (xMax - originX) * 0.76;
  const lowMidPeakY = yMax + (originY - yMax) * 0.58;
  const lowMidEndY = originY - 2;
  const optimalEndX = originX + (xMax - originX) * 0.92;
  const optimalPeakY = yMax + (originY - yMax) * 0.36;
  const optimalEndY = originY - 2;

  const pathHigh = curvePath(highShortEndX, highShortEndY, highShortPeakY);
  const pathLow = curvePath(lowMidEndX, lowMidEndY, lowMidPeakY);
  const pathOptimal = curvePath(optimalEndX, optimalEndY, optimalPeakY);
  const tAxes = 0.9;
  const tHighStart = 1.1;
  const tHighDur = 3;
  const tLowStart = tHighStart + tHighDur + 0.35;
  const tLowDur = 3;
  const tOptStart = tLowStart + tLowDur + 0.35;
  const tOptDur = 2.2;
  const dashLen = 1200;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const startAnimation = useCallback(() => {
    clearTimers();

    const animations = svgRef.current?.querySelectorAll<SVGAnimationElement>("animate[data-delay]");
    animations?.forEach((animation) => {
      const delay = Number(animation.dataset.delay ?? 0) * 1000;
      const timer = window.setTimeout(() => animation.beginElement(), delay);
      timersRef.current.push(timer);
    });
  }, [clearTimers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startAnimation();
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startAnimation]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (runId === 0) return;
    const frame = window.requestAnimationFrame(startAnimation);
    return () => window.cancelAnimationFrame(frame);
  }, [runId, startAnimation]);

  function replayAnimation() {
    setForceMotion(true);
    setRunId((current) => current + 1);
  }

  return (
    <div
      ref={containerRef}
      className={`trajectory-shell rounded-3xl border border-slate-200 bg-white p-6 shadow-sm${forceMotion ? " trajectory-force-motion" : ""}`}
    >
      <svg
        key={runId}
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        className="trajectory-comparison w-full"
        role="img"
        aria-label="Three golf ball trajectories show that different shot shapes leave different clues"
      >
        <g opacity="0" data-trajectory-static="visible">
          <animate data-delay="0" begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur={`${tAxes}s`} fill="freeze" />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = originX + ((xMax - originX) * (i + 1)) / 7;
            return <line key={`gx-${i}`} x1={x} y1={yMax} x2={x} y2={originY} stroke="rgb(241 245 249)" strokeWidth="2" />;
          })}
          {Array.from({ length: 3 }).map((_, i) => {
            const y = yMax + ((originY - yMax) * (i + 1)) / 4;
            return <line key={`gy-${i}`} x1={originX} y1={y} x2={xMax} y2={y} stroke="rgb(241 245 249)" strokeWidth="2" />;
          })}
        </g>

        <g>
          <line data-trajectory-static="drawn" x1={originX} y1={originY} x2={originX} y2={yMax} stroke="rgb(203 213 225)" strokeWidth="3" strokeLinecap="round" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
            <animate data-delay="0" begin="indefinite" restart="always" attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tAxes}s`} fill="freeze" />
          </line>
          <line data-trajectory-static="drawn" x1={originX} y1={originY} x2={xMax} y2={originY} stroke="rgb(203 213 225)" strokeWidth="3" strokeLinecap="round" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
            <animate data-delay="0" begin="indefinite" restart="always" attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tAxes}s`} fill="freeze" />
          </line>
          <text data-trajectory-static="visible" x={originX + 6} y={yMax + 14} fontSize="12" fill="rgb(100 116 139)" opacity="0">
            Height
            <animate data-delay={tAxes} begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur="0.35s" fill="freeze" />
          </text>
          <text data-trajectory-static="visible" x={xMax - 62} y={originY + 26} fontSize="12" fill="rgb(100 116 139)" opacity="0">
            Distance
            <animate data-delay={tAxes} begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur="0.35s" fill="freeze" />
          </text>
        </g>

        <path data-trajectory-static="drawn" d={pathHigh} fill="none" stroke="rgb(148 163 184)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 26" opacity="0" strokeDashoffset={dashLen}>
          <animate data-delay={tHighStart} begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur="0.01s" fill="freeze" />
          <animate data-delay={tHighStart} begin="indefinite" restart="always" attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tHighDur}s`} fill="freeze" />
        </path>

        <path data-trajectory-static="drawn" d={pathLow} fill="none" stroke="rgb(148 163 184)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 26" opacity="0" strokeDashoffset={dashLen}>
          <animate data-delay={tLowStart} begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur="0.01s" fill="freeze" />
          <animate data-delay={tLowStart} begin="indefinite" restart="always" attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tLowDur}s`} fill="freeze" />
        </path>

        <path data-trajectory-static="drawn" d={pathOptimal} fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" opacity="0" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
          <animate data-delay={tOptStart} begin="indefinite" restart="always" attributeName="opacity" from="0" to="1" dur="0.01s" fill="freeze" />
          <animate data-delay={tOptStart} begin="indefinite" restart="always" attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tOptDur}s`} fill="freeze" />
        </path>
      </svg>

      <div className="mt-3 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Different swings → different trajectories. Fit optimizes your “default.”</p>
        <button
          type="button"
          onClick={replayAnimation}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b]"
        >
          Replay animation
        </button>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .trajectory-shell:not(.trajectory-force-motion) .trajectory-comparison animate {
            display: none;
          }

          .trajectory-shell:not(.trajectory-force-motion) .trajectory-comparison [data-trajectory-static="visible"] {
            opacity: 1;
          }

          .trajectory-shell:not(.trajectory-force-motion) .trajectory-comparison [data-trajectory-static="drawn"] {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
