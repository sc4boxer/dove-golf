"use client";

import { useState } from "react";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import type { PatternSlug } from "@/lib/learn/ballFlightPatterns";
import type { BallFlightChartShape } from "@/lib/visual/ballFlightChartPaths";
import type { CurveInput, StartInput } from "./model.ts";

const SHAPE_BY_PATTERN: Record<PatternSlug, BallFlightChartShape> = {
  "pull-draw": "pull-draw",
  "pull-straight": "pull",
  "pull-fade": "pull-fade",
  "straight-draw": "draw",
  "straight-straight": "straight",
  "straight-fade": "fade",
  "push-draw": "push-draw",
  "push-straight": "push",
  "push-fade": "push-fade",
};

const START_COPY: Record<StartInput, string> = {
  left: "Starts left of target",
  straight: "Starts near the target line",
  right: "Starts right of target",
};

const CURVE_COPY: Record<CurveInput, string> = {
  left: "Curves left",
  straight: "Flies mostly straight",
  right: "Curves right",
};

export function BallFlightResultVisual({
  patternSlug,
  patternTitle,
  start,
  curve,
}: {
  patternSlug: PatternSlug;
  patternTitle: string;
  start: StartInput;
  curve: CurveInput;
}) {
  const [replay, setReplay] = useState(0);
  const shape = SHAPE_BY_PATTERN[patternSlug];

  return (
    <section
      aria-labelledby="ball-flight-visual-title"
      className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            What the ball did
          </p>
          <h3 id="ball-flight-visual-title" className="mt-3 text-2xl font-semibold tracking-tight">
            {patternTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {START_COPY[start]}, then {CURVE_COPY[curve].toLowerCase()}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReplay((value) => value + 1)}
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Replay flight
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <BallFlightChart
          key={patternSlug + "-" + replay}
          shape={shape}
          className="mx-auto max-w-2xl"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          {START_COPY[start]}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          {CURVE_COPY[curve]}
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        This is an educational flight-shape example. It shows direction and curve, not measured distance,
        height, wind effect, or curve severity.
      </p>
    </section>
  );
}
