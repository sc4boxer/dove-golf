"use client";

import Link from "next/link";
import { useState } from "react";
import { DriverSliceMiniChart, PullHookMiniChart } from "@/components/clinic/ClinicHeroMiniCharts";

const heroTiles = [
  {
    key: "driver-slice",
    cta: "Start: Driver Slice",
    href: "/clinic/driver-slice",
    Visual: DriverSliceMiniChart,
  },
  {
    key: "pull-hook",
    cta: "Start: Pull Hook",
    href: "/clinic/pull-hook",
    Visual: PullHookMiniChart,
  },
] as const;

export function ClinicHero() {
  const [activeTile, setActiveTile] = useState(0);
  const tile = heroTiles[activeTile] ?? heroTiles[0];

  return (
    <section className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="absolute right-4 top-4 flex gap-1.5">
        {activeTile > 0 ? (
          <button
            type="button"
            aria-label="Show previous clinic module"
            onClick={() => setActiveTile((prev) => Math.max(prev - 1, 0))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            ←
          </button>
        ) : null}
        {activeTile < heroTiles.length - 1 ? (
          <button
            type="button"
            aria-label="Show next clinic module"
            onClick={() => setActiveTile((prev) => Math.min(prev + 1, heroTiles.length - 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            →
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr] md:items-center">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-500">Dove Golf Modules</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">DoveClinic™</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Debug your miss in minutes. Deterministic, physics-aware guidance.</p>
          <p className="mt-4 text-sm text-slate-500">Not a swing coach. A structured diagnostic you can test at the range.</p>
          <Link
            href={tile.href}
            className="mt-6 inline-flex rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {tile.cta}
          </Link>

          <div className="mt-4 flex gap-2">
            {heroTiles.map((entry, idx) => (
              <span
                key={entry.key}
                className={`h-1.5 w-6 rounded-full ${idx === activeTile ? "bg-slate-900" : "bg-slate-200"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[230px] rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <tile.Visual />
        </div>
      </div>
    </section>
  );
}
