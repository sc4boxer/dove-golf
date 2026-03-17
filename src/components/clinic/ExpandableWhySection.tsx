"use client";

import { useState } from "react";

type ExpandableWhySectionProps = {
  points: string[];
};

export function ExpandableWhySection({ points }: ExpandableWhySectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold tracking-tight">Why this happens</h3>
        <span className="text-sm text-slate-500">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {points.map((point) => (
            <li key={point}>• {point}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
