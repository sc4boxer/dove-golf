"use client";

import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";
import { type FormEvent, type RefObject, useRef, useState } from "react";
import { BALL_FLIGHT_PATTERNS } from "@/lib/learn/ballFlightPatterns";
import { buildEquipmentFitHref } from "@/lib/tools/ballFlightEquipmentBridge";
import { BallFlightResultVisual } from "./BallFlightResultVisual";
import { ShotEvidenceView } from "./ShotEvidenceView";
import {
  type CurveInput,
  type DecoderResult,
  type StartInput,
  type StrikeInput,
  decodeBallFlight,
} from "./model";

type Choice<T extends string> = { value: T; label: string };

const START_OPTIONS: Choice<StartInput>[] = [
  { value: "left", label: "Left" },
  { value: "straight", label: "On target" },
  { value: "right", label: "Right" },
];

const CURVE_OPTIONS: Choice<CurveInput>[] = [
  { value: "left", label: "Left" },
  { value: "straight", label: "Mostly straight" },
  { value: "right", label: "Right" },
];

const STRIKE_OPTIONS: Choice<StrikeInput>[] = [
  { value: "heel", label: "Heel" },
  { value: "center", label: "Center" },
  { value: "toe", label: "Toe" },
  { value: "unknown", label: "Not sure" },
];

function ChoiceGroup<T extends string>({
  legend,
  helper,
  name,
  options,
  value,
  onChange,
  firstInputRef,
}: {
  legend: string;
  helper: string;
  name: string;
  options: Choice<T>[];
  value: T | "";
  onChange: (value: T) => void;
  firstInputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <fieldset className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <legend className="px-1 text-lg font-semibold tracking-tight">{legend}</legend>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={[
                "flex min-h-14 min-w-0 cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium leading-5 transition",
                checked
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <input
                ref={index === 0 ? firstInputRef : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="size-4 shrink-0 accent-slate-900"
              />
              <span className="min-w-0 break-words">{option.label}</span>
              {checked ? <span className="ml-auto shrink-0 text-white" aria-hidden>✓</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function BallFlightDecoder() {
  const [start, setStart] = useState<StartInput | "">("");
  const [curve, setCurve] = useState<CurveInput | "">("");
  const [strike, setStrike] = useState<StrikeInput | "">("");
  const [result, setResult] = useState<DecoderResult | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const complete = Boolean(start && curve && strike);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!start || !curve || !strike) return;
    setResult(decodeBallFlight({ start, curve, strike }));
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }

  function handleReset() {
    setStart("");
    setCurve("");
    setStrike("");
    setResult(null);
    window.requestAnimationFrame(() => firstInputRef.current?.focus());
  }

  const pattern = result ? BALL_FLIGHT_PATTERNS[result.patternSlug] : null;
  const equipmentHref =
    result && start && curve && strike
      ? buildEquipmentFitHref({
          start,
          curve,
          strike,
        })
      : "/diagnostic";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <form onSubmit={handleSubmit} className="grid gap-5" aria-label="Ball flight inputs">
        <ChoiceGroup
          legend="1. Where did the ball start?"
          helper="Judge the first part of flight, not where it finished."
          name="start"
          options={START_OPTIONS}
          value={start}
          onChange={setStart}
          firstInputRef={firstInputRef}
        />
        <ChoiceGroup
          legend="2. Which way did it curve?"
          helper="Curve is the sideways bend after launch."
          name="curve"
          options={CURVE_OPTIONS}
          value={curve}
          onChange={setCurve}
        />
        <ChoiceGroup
          legend="3. Where did you strike the face?"
          helper="Heel is nearest the shaft; toe is farthest from it."
          name="strike"
          options={STRIKE_OPTIONS}
          value={strike}
          onChange={setStrike}
        />

        <button
          type="submit"
          disabled={!complete}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Decode my shot
        </button>
      </form>

      <section
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        aria-labelledby="decoder-result-title"
        className="min-h-[28rem] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-slate-600"
      >
        {!result || !pattern || !start || !curve || !strike ? (
          <div className="flex min-h-[24rem] flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Your result will appear here</p>
              <h2 id="decoder-result-title" className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                Three observations. One transparent starting point.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                We use start direction, curve, and strike together. No confidence theater, hidden score, or
                automatic equipment prescription.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3" aria-hidden>
              {["Start", "Curve", "Strike"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-dashed border-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">0{index + 1}</span>
                  <p className="mt-4 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Your pattern</p>
            <h2 id="decoder-result-title" className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {pattern.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{pattern.definition}</p>
            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              Because curve size is not collected, “draw/fade” is descriptive; a large curve may commonly be
              called a hook/slice.
            </p>

            <BallFlightResultVisual
              patternSlug={result.patternSlug}
              patternTitle={pattern.title}
              start={start}
              curve={curve}
            />

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold">What the flight tells us</h3>
              <p className="mt-4 leading-7 text-slate-600">{result.faceSummary}</p>
              <p className="mt-3 leading-7 text-slate-600">{result.pathSummary}</p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700">
                {pattern.physicsConstraints.map((constraint) => (
                  <li key={constraint} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>

              <details className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-900">
                  See the face, path, and strike relationship
                </summary>
                <ShotEvidenceView start={start} curve={curve} strike={strike} />
              </details>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-xl font-semibold">How strike changes the read</h3>
              <p className="mt-4 leading-7 text-slate-600">{result.strikeSummary}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Technique first</p>
                <p className="mt-4 leading-7 text-slate-200">{result.techniqueGuidance}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Equipment check</p>
                <p className="mt-4 leading-7 text-slate-600">{result.equipmentGuidance}</p>
              </article>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.12em]">Your next range test</p>
              <p className="mt-3 font-medium leading-7">{result.nextTest}</p>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold">Limits of this result</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{result.caveat}</p>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8 sm:flex sm:items-end sm:justify-between sm:gap-8">
              <div className="max-w-lg">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Continue with this result
                </p>
                <h3 className="mt-3 text-lg font-semibold">Could your equipment be contributing?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Carry this shot pattern into the Equipment Fit Check. We’ll use it as context—not proof that your
                  clubs caused the miss.
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your start, curve, and strike will come with you.
                </p>
              </div>
              <TrackLink
                href={equipmentHref}
                eventName="dov_decoder_fit_handoff_clicked"
                eventParams={{
                  module: "ball_flight_decoder",
                  placement: "decoder_result",
                  start,
                  curve,
                  strike,
                }}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:mt-0 sm:w-auto sm:shrink-0"
              >
                Check my equipment fit →
              </TrackLink>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Decode another shot
              </button>
              <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-700">
                <Link href="/learn/start-line-vs-curve">Learn face vs path</Link>
                <Link href="/method">Read our method</Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
