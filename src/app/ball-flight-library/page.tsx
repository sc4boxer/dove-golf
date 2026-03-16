"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type StartLine = "left" | "center" | "right";
type Curve = "draw" | "straight" | "fade";
type ShotId =
  | "pull_draw"
  | "pull"
  | "pull_fade"
  | "straight_draw"
  | "straight"
  | "straight_fade"
  | "push_draw"
  | "push"
  | "push_fade";

type ShotPattern = {
  id: ShotId;
  title: string;
  start: StartLine;
  curve: Curve;
  blurb: string;
  caption: string;
  constraints: string[];
};

const SHOT_PATTERNS: ShotPattern[] = [
  {
    id: "pull_draw",
    title: "Pull Draw",
    start: "left",
    curve: "draw",
    blurb: "Starts left of target and curves farther left.",
    caption: "left start · draw curve",
    constraints: [
      "Face is left of target at impact.",
      "Swing path is right of face angle.",
      "Face-to-path is closed, producing left curvature.",
    ],
  },
  {
    id: "pull",
    title: "Pull",
    start: "left",
    curve: "straight",
    blurb: "Starts left of target and stays mostly straight.",
    caption: "left start · straight flight",
    constraints: [
      "Face is left of target at impact.",
      "Face and path are closely matched.",
      "Minimal face-to-path gap keeps curvature small.",
    ],
  },
  {
    id: "pull_fade",
    title: "Pull Fade",
    start: "left",
    curve: "fade",
    blurb: "Starts left of target and curves back right.",
    caption: "left start · fade curve",
    constraints: [
      "Face is left of target at impact.",
      "Swing path is left of face angle.",
      "Face-to-path is open, producing right curvature.",
    ],
  },
  {
    id: "straight_draw",
    title: "Straight Draw",
    start: "center",
    curve: "draw",
    blurb: "Starts on the target line and curves left.",
    caption: "center start · draw curve",
    constraints: [
      "Face is near target at impact.",
      "Swing path is right of face angle.",
      "Slightly closed face-to-path creates a gentle draw.",
    ],
  },
  {
    id: "straight",
    title: "Straight",
    start: "center",
    curve: "straight",
    blurb: "Starts on the target line and stays mostly straight.",
    caption: "center start · straight flight",
    constraints: [
      "Face is near target at impact.",
      "Swing path is close to face angle.",
      "Little face-to-path difference means little curvature.",
    ],
  },
  {
    id: "straight_fade",
    title: "Straight Fade",
    start: "center",
    curve: "fade",
    blurb: "Starts on the target line and curves right.",
    caption: "center start · fade curve",
    constraints: [
      "Face is near target at impact.",
      "Swing path is left of face angle.",
      "Slightly open face-to-path creates a gentle fade.",
    ],
  },
  {
    id: "push_draw",
    title: "Push Draw",
    start: "right",
    curve: "draw",
    blurb: "Starts right of target and curves back left.",
    caption: "right start · draw curve",
    constraints: [
      "Face is right of target at impact.",
      "Swing path is farther right than face angle.",
      "Closed face-to-path produces left curvature back toward center.",
    ],
  },
  {
    id: "push",
    title: "Push",
    start: "right",
    curve: "straight",
    blurb: "Starts right of target and stays mostly straight.",
    caption: "right start · straight flight",
    constraints: [
      "Face is right of target at impact.",
      "Face and path are closely matched.",
      "Minimal face-to-path gap keeps the shot straight.",
    ],
  },
  {
    id: "push_fade",
    title: "Push Fade",
    start: "right",
    curve: "fade",
    blurb: "Starts right of target and curves farther right.",
    caption: "right start · fade curve",
    constraints: [
      "Face is right of target at impact.",
      "Swing path is left of face angle.",
      "Open face-to-path produces right curvature.",
    ],
  },
];

export default function BallFlightLibraryPage() {
  const [selectedId, setSelectedId] = useState<ShotId>("push_draw");
  const selected = useMemo(
    () => SHOT_PATTERNS.find((pattern) => pattern.id === selectedId) ?? SHOT_PATTERNS[0],
    [selectedId]
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ball Flight Library</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              Right-handed shot shapes with a common origin, target-line reference, and restrained curvature.
            </p>
          </div>
          <Link
            href="/diagnostic"
            className="inline-flex h-fit items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Diagnostic
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShotShapeViz start={selected.start} curve={selected.curve} />
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight">{selected.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{selected.blurb}</p>
            <div className="mt-3 text-sm font-medium text-slate-500">{selected.caption}</div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="text-sm font-semibold text-slate-900">Physics constraints</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {selected.constraints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Pattern Explorer</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SHOT_PATTERNS.map((pattern) => {
              const active = pattern.id === selected.id;
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedId(pattern.id)}
                  className={[
                    "rounded-3xl border p-5 text-left transition",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{pattern.title}</div>
                  <div className={["mt-2 text-sm", active ? "text-slate-300" : "text-slate-500"].join(" ")}>
                    {pattern.caption}
                  </div>
                  <div className={["mt-4", active ? "opacity-95" : "opacity-90"].join(" ")}>
                    <MiniShotShapeViz start={pattern.start} curve={pattern.curve} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function ShotShapeViz({ start, curve }: { start: StartLine; curve: Curve }) {
  const w = 660;
  const h = 420;
  const groundY = h * 0.84;
  const targetX = w * 0.5;
  const originX = targetX;
  const originY = groundY;
  const apexY = h * 0.14;

  const startOffset = start === "left" ? -w * 0.08 : start === "right" ? w * 0.08 : 0;
  const curveOffset = curve === "draw" ? -w * 0.05 : curve === "fade" ? w * 0.05 : 0;
  const endX = targetX + startOffset + curveOffset;

  const c1x = targetX + startOffset * 0.75;
  const c1y = h * 0.58;
  const c2x = targetX + startOffset + curveOffset * 1.25;
  const c2y = h * 0.28;
  const path = `M ${originX} ${originY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${apexY}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      <line
        x1={w * 0.11}
        y1={groundY}
        x2={w * 0.89}
        y2={groundY}
        stroke="rgb(226 232 240)"
        strokeWidth="2"
      />
      <line
        x1={targetX}
        y1={groundY}
        x2={targetX}
        y2={h * 0.1}
        stroke="rgb(203 213 225)"
        strokeWidth="2.5"
        strokeDasharray="6 8"
      />
      <path d={path} fill="none" stroke="rgb(15 23 42)" strokeWidth="5" strokeLinecap="round" />
      <circle cx={originX} cy={originY} r="4" fill="rgb(15 23 42)" />

      <text x={originX - 22} y={h * 0.93} fontSize="14" fill="rgb(100 116 139)">
        Origin
      </text>
      <text x={targetX + 12} y={h * 0.11} fontSize="14" fill="rgb(100 116 139)">
        Target line
      </text>
    </svg>
  );
}

function MiniShotShapeViz({ start, curve }: { start: StartLine; curve: Curve }) {
  const w = 180;
  const h = 92;
  const groundY = h * 0.82;
  const targetX = w * 0.5;
  const startOffset = start === "left" ? -w * 0.08 : start === "right" ? w * 0.08 : 0;
  const curveOffset = curve === "draw" ? -w * 0.05 : curve === "fade" ? w * 0.05 : 0;

  const path = `M ${targetX} ${groundY} C ${targetX + startOffset * 0.75} ${h * 0.58}, ${
    targetX + startOffset + curveOffset * 1.25
  } ${h * 0.3}, ${targetX + startOffset + curveOffset} ${h * 0.12}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      <line
        x1={w * 0.12}
        y1={groundY}
        x2={w * 0.88}
        y2={groundY}
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />
      <line
        x1={targetX}
        y1={groundY}
        x2={targetX}
        y2={h * 0.1}
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <circle cx={targetX} cy={groundY} r="2.75" fill="currentColor" />
    </svg>
  );
}
