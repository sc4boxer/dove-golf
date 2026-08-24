"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
  useId,
  useRef,
  useState,
} from "react";

export type DiagnosisStorySlide = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  content: ReactNode;
};

type DiagnosisStoryDeckProps = {
  title: string;
  slides: DiagnosisStorySlide[];
  className?: string;
  onStepChange?: (index: number, slide: DiagnosisStorySlide) => void;
};

const SWIPE_DISTANCE = 56;

export function DiagnosisStoryDeck({
  title,
  slides,
  className = "",
  onStepChange,
}: DiagnosisStoryDeckProps) {
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeSlide = slides[activeIndex];

  function showStep(nextIndex: number) {
    const bounded = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (bounded === activeIndex) return;
    setActiveIndex(bounded);
    onStepChange?.(bounded, slides[bounded]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showStep(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showStep(activeIndex + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      showStep(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      showStep(slides.length - 1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.changedTouches.length !== 1) return;

    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_DISTANCE || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return;
    showStep(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  if (!activeSlide) return null;

  return (
    <section
      aria-labelledby={titleId}
      className={["rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8", className].join(" ")}
    >
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Result story
          </p>
          <h2 id={titleId} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        <p className="text-sm font-medium text-slate-500">
          {activeIndex + 1} of {slides.length}
        </p>
      </div>

      <nav aria-label="Diagnosis result chapters" className="mt-5">
        <ol className="grid gap-2 sm:grid-cols-4">
          {slides.map((slide, index) => (
            <li key={slide.id}>
              <button
                type="button"
                onClick={() => showStep(index)}
                aria-current={index === activeIndex ? "step" : undefined}
                aria-label={`Show result ${index + 1} of ${slides.length}: ${slide.label}`}
                className={[
                  "min-h-12 w-full rounded-2xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-slate-600",
                  index === activeIndex
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className={index === activeIndex ? "text-slate-300" : "text-slate-400"}>
                  0{index + 1}
                </span>
                <span className="ml-2">{slide.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="mt-5 touch-pan-y rounded-3xl bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
        aria-label="Diagnosis result. Swipe horizontally or use the chapter buttons to change cards."
      >
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            hidden={index !== activeIndex}
            aria-labelledby={`${titleId}-${slide.id}`}
            className="min-h-[32rem] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:min-h-[34rem] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {slide.eyebrow}
            </p>
            <h3
              id={`${titleId}-${slide.id}`}
              className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl"
            >
              {slide.title}
            </h3>
            <div className="mt-6 min-w-0">{slide.content}</div>
          </article>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Result {activeIndex + 1} of {slides.length}: {activeSlide.label}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => showStep(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => showStep(activeIndex + 1)}
          disabled={activeIndex === slides.length - 1}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
