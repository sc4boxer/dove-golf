"use client";

import Link from "next/link";
import { type FormEvent, type RefObject, useRef, useState } from "react";
import { BALL_FLIGHT_PATTERNS } from "@/lib/learn/ballFlightPatterns";
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
    <fieldset className="rounded-3xl border border-[var(--line)] bg-[var(--paper-strong)] p-5 sm:p-7">
      <legend className="px-1 text-xl font-semibold tracking-[-0.02em]">{legend}</legend>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{helper}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option, index) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={[
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 font-semibold transition",
                checked
                  ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                  : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--fairway)]",
              ].join(" ")}
            >
              <input
                ref={index === 0 ? firstInputRef : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="size-4 shrink-0 accent-[var(--lime)]"
              />
              <span>{option.label}</span>
              {checked ? <span className="ml-auto text-[var(--lime)]" aria-hidden>✓</span> : null}
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

  return (
    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
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
          className="min-h-14 rounded-full bg-[var(--forest)] px-6 py-3 font-semibold text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[var(--forest-deep)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Decode my shot
        </button>
      </form>

      <section
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        aria-labelledby="decoder-result-title"
        className="min-h-[28rem] rounded-[2rem] border border-[var(--line)] bg-[var(--paper-strong)] p-6 outline-none sm:p-9"
      >
        {!result || !pattern ? (
          <div className="flex min-h-[24rem] flex-col justify-between">
            <div>
              <p className="eyebrow">Your result will appear here</p>
              <h2 id="decoder-result-title" className="mt-5 max-w-xl font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
                Three observations. One transparent starting point.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
                We use start direction, curve, and strike together. No confidence theater, hidden score, or
                automatic equipment prescription.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3" aria-hidden>
              {["Start", "Curve", "Strike"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-dashed border-[var(--line)] p-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">0{index + 1}</span>
                  <p className="mt-4 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="eyebrow">Your pattern</p>
            <h2 id="decoder-result-title" className="mt-4 font-serif text-5xl tracking-[-0.045em] sm:text-6xl">
              {pattern.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{pattern.definition}</p>
            <p className="mt-3 rounded-xl bg-[var(--mist)]/55 p-4 text-sm leading-6 text-[var(--forest-deep)]">
              Because curve size is not collected, “draw/fade” is descriptive; a large curve may commonly be
              called a hook/slice.
            </p>

            <div className="mt-8 border-t border-[var(--line)] pt-8">
              <h3 className="text-xl font-semibold">What the flight tells us</h3>
              <p className="mt-4 leading-7 text-[var(--muted)]">{result.faceSummary}</p>
              <p className="mt-3 leading-7 text-[var(--muted)]">{result.pathSummary}</p>
              <ul className="mt-5 grid gap-2 text-sm text-[var(--forest-deep)]">
                {pattern.physicsConstraints.map((constraint) => (
                  <li key={constraint} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--fairway)]" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-8">
              <h3 className="text-xl font-semibold">How strike changes the read</h3>
              <p className="mt-4 leading-7 text-[var(--muted)]">{result.strikeSummary}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-[var(--forest-deep)] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--lime)]">Technique first</p>
                <p className="mt-4 leading-7 text-white/75">{result.techniqueGuidance}</p>
              </article>
              <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--fairway)]">Equipment check</p>
                <p className="mt-4 leading-7 text-[var(--muted)]">{result.equipmentGuidance}</p>
              </article>
            </div>

            <div className="mt-8 rounded-2xl bg-[var(--lime)] p-5 text-[var(--forest-deep)]">
              <p className="text-xs font-bold uppercase tracking-[0.12em]">Your next range test</p>
              <p className="mt-3 font-medium leading-7">{result.nextTest}</p>
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-8">
              <h3 className="text-lg font-semibold">Limits of this result</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{result.caveat}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="min-h-11 rounded-full border border-[var(--ink)] px-5 py-2.5 font-semibold"
              >
                Decode another shot
              </button>
              <div className="flex flex-wrap gap-5 text-sm font-semibold">
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
