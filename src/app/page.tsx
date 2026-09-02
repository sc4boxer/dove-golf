import type { Metadata } from "next";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";
import { TrajectoryComparison } from "@/components/home/TrajectoryComparison";

export const metadata: Metadata = {
  title: "DoveGolf | Read the shot. Test the cause.",
  description:
    "Free, data-guided golf tools that turn observable ball flight, strike, and equipment clues into one practical next test.",
  alternates: { canonical: "/" },
};

const tools = [
  {
    label: "BALL FLIGHT",
    title: "Ball Flight Decoder",
    description:
      "Tell us where the ball started, how it curved, and where it met the face. We will show what that evidence suggests, what it cannot prove, and one variable to test next.",
    href: "/tools/ball-flight-decoder",
    action: "Decode my ball flight",
    meta: "About 2 minutes",
  },
  {
    label: "EQUIPMENT",
    title: "Equipment Fit Check",
    description:
      "Compare your tempo, speed, launch tendencies, and current setup before deciding whether a club or shaft change deserves attention.",
    href: "/diagnostic",
    action: "Check my equipment fit",
    meta: "Brand-neutral",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex items-center justify-between gap-3 sm:gap-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm sm:px-4"
          >
            <span aria-hidden className="size-2 rounded-full bg-slate-900" />
            Dove Golf
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-3 text-xs text-slate-500 sm:gap-5 sm:text-sm">
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/learn">Learn</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/method">Method</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/about">About</Link>
          </nav>
        </header>

        <section className="mt-20 max-w-3xl sm:mt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Data-guided golf tools</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
            Read the shot.
            <span className="block text-slate-500">Test the cause.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700">
            Ball flight is evidence. Dove Golf uses the shot, strike, and equipment clues you can observe to
            give you a clearer starting point—not another swing opinion.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackLink
              href="/tools/ball-flight-decoder"
              eventParams={{ module: "ball_flight_decoder", placement: "home_hero_primary", version: "revival_v2" }}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Decode my ball flight →
            </TrackLink>
            <TrackLink
              href="/diagnostic"
              eventParams={{ module: "dovefit", placement: "home_hero_secondary", version: "revival_v2" }}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Check my equipment fit →
            </TrackLink>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {["Free to use", "No account", "Brand-neutral", "Explainable logic"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600">{item}</span>
            ))}
          </div>
        </section>

        <TrajectoryComparison />

        <section className="mt-16" aria-labelledby="start-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Start here</p>
          <h2 id="start-heading" className="mt-3 text-2xl font-semibold tracking-tight">Choose the evidence you already have.</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex min-h-72 flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">{tool.label}</p>
                  <span className="text-xs text-slate-400">{tool.meta}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">{tool.title}</h3>
                <p className="mt-4 leading-relaxed text-slate-600">{tool.description}</p>
                <p className="mt-auto pt-8 text-sm font-medium text-slate-900">
                  {tool.action} <span aria-hidden className="transition group-hover:ml-1">→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8" aria-labelledby="range-rescue-heading">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#245f4d]">AT THE RANGE RIGHT NOW?</p>
            <h2 id="range-rescue-heading" className="mt-3 text-2xl font-semibold tracking-tight">Calm your next five balls.</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
              Pick the miss that looks closest and get one simple reset and a five-ball plan.
            </p>
          </div>
          <Link
            href="/range-rescue"
            className="mt-6 inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-2xl bg-[#245f4d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b4d3e] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b] sm:mt-0 sm:w-auto"
          >
            Open Range Rescue →
          </Link>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
          <p className="text-sm font-semibold">What every Dove Golf result should tell you</p>
          <div className="mt-5 grid gap-5 text-sm leading-6 text-slate-600 sm:grid-cols-3">
            <p><span className="block font-medium text-slate-900">What the evidence supports</span>The relationship we can reasonably read from your inputs.</p>
            <p><span className="block font-medium text-slate-900">What remains uncertain</span>The limits of the data, stated without false confidence.</p>
            <p><span className="block font-medium text-slate-900">What to test next</span>One practical change you can compare with real shots.</p>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-100 pt-8">
          <div className="flex flex-col justify-between gap-5 text-sm text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} · Dove Golf</p>
            <div className="flex gap-5">
              <Link className="hover:text-slate-900" href="/faq">FAQ</Link>
              <Link className="hover:text-slate-900" href="/learn/ball-flight">Ball flight library</Link>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-400">
            Educational guidance only. Results are starting points to test, not guaranteed diagnoses or performance outcomes.
          </p>
        </footer>
      </div>
    </main>
  );
}
