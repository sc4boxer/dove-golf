"use client";

import Link from "next/link";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import { useMemo, useState } from "react";
import { BallFlightLibraryViz } from "@/components/learn/BallFlightLibraryViz";
import {
  BALL_FLIGHT_PATTERNS,
  PATTERN_ORDER,
  type PatternSlug,
  type Strike,
  type Tempo,
  type TypicalMiss,
} from "@/lib/learn/ballFlightPatterns";
import { scoreConfidence } from "@/lib/learn/ballFlightConfidence";

const tempoOptions: { value: Tempo; label: string }[] = [
  { value: "smooth", label: "Smooth" },
  { value: "neutral", label: "Neutral" },
  { value: "quick", label: "Quick" },
  { value: "unsure", label: "Unsure" },
];

const strikeOptions: { value: Strike; label: string }[] = [
  { value: "heel", label: "Heel" },
  { value: "center", label: "Center" },
  { value: "toe", label: "Toe" },
  { value: "unsure", label: "Unsure" },
];

const missOptions: { value: TypicalMiss; label: string }[] = [
  { value: "high_right", label: "High-right" },
  { value: "right", label: "Right" },
  { value: "low_right", label: "Low-right" },
  { value: "both_sides", label: "Both sides" },
  { value: "high_left", label: "High-left" },
  { value: "left", label: "Left" },
  { value: "low_left", label: "Low-left" },
  { value: "unsure", label: "Unsure" },
];

export function BallFlightLibraryExplorer() {
  const [pattern, setPattern] = useState<PatternSlug>("straight-straight");
  const [tempo, setTempo] = useState<Tempo>("unsure");
  const [strike, setStrike] = useState<Strike>("unsure");
  const [miss, setMiss] = useState<TypicalMiss>("unsure");

  const selected = BALL_FLIGHT_PATTERNS[pattern];
  const confidence = useMemo(() => scoreConfidence({ pattern, tempo, strike, miss }), [pattern, tempo, strike, miss]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-center justify-between">
          <HomeLinkPill />
          <span className="text-sm font-medium text-slate-500">Learn</span>
        </div>

        <header className="mt-5 max-w-3xl">
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Ball Flight Library</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">Ball flight is geometry: face, path, strike.</p>
          <p className="mt-2 text-sm text-slate-500">
            Pattern-based physics reference. Confidence increases with tempo + strike + miss.
          </p>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <BallFlightLibraryViz startLine={selected.startLine} curve={selected.curve} />

            <section className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Pattern Explorer</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PATTERN_ORDER.map((slug) => {
                  const tile = BALL_FLIGHT_PATTERNS[slug];
                  const active = slug === pattern;

                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setPattern(slug)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-semibold">{tile.title}</p>
                      <p className={`mt-1 text-xs ${active ? "text-slate-200" : "text-slate-600"}`}>
                        {tile.startLine} start · {tile.curve} curve
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">{selected.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.definition}</p>

            <p className="mt-4 text-sm font-medium text-slate-900">
              Confidence: {confidence.label} ({confidence.score}/100)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {confidence.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            {confidence.gaps.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-500">
                {confidence.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            )}

            <div className="mt-5 grid gap-3">
              <label className="text-sm font-medium text-slate-700">
                Tempo
                <select
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value as Tempo)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {tempoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Strike
                <select
                  value={strike}
                  onChange={(e) => setStrike(e.target.value as Strike)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {strikeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Typical miss
                <select
                  value={miss}
                  onChange={(e) => setMiss(e.target.value as TypicalMiss)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {missOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
              <p className="font-medium text-slate-900">Physics constraints</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {selected.physicsConstraints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 font-medium text-slate-900">Mechanisms</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Mechanics</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                {selected.mechanisms.mechanics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Equipment</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                {selected.mechanisms.equipment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Strike</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                {selected.mechanisms.strike.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 font-medium text-slate-900">What to test first</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {selected.whatToTestFirst.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-sm text-slate-600">{selected.confidenceNote}</p>
              <Link
                href={selected.runDoveFitHref}
                className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Run DoveFit™
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
