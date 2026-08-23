import type { Metadata } from "next";
import Link from "next/link";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import type { BallFlightChartShape } from "@/lib/visual/ballFlightChartPaths";

export const metadata: Metadata = {
  title: "Start Line vs Curve in Golf Ball Flight",
  description:
    "Learn the two observations behind a golf ball flight: where it starts and which way it curves. See clear right-handed examples before reading face and path.",
  alternates: { canonical: "/learn/start-line-vs-curve" },
};

const SAME_START_EXAMPLES: Array<{
  shape: BallFlightChartShape;
  title: string;
  observation: string;
  relationship: string;
}> = [
  {
    shape: "draw",
    title: "Curves left",
    observation: "Starts near the target, then bends left.",
    relationship: "Likely: the face pointed left of the path at impact.",
  },
  {
    shape: "straight",
    title: "Stays straight",
    observation: "Starts near the target with little sideways bend.",
    relationship: "Likely: the face and path pointed in nearly the same direction.",
  },
  {
    shape: "fade",
    title: "Curves right",
    observation: "Starts near the target, then bends right.",
    relationship: "Likely: the face pointed right of the path at impact.",
  },
];

export default function StartLineVsCurvePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4">
          <HomeLinkPill />
          <Link href="/learn" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Learn library
          </Link>
        </div>

        <header className="mt-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Beginner guide · Right-handed model
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Read the shot before you explain it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Ball flight becomes easier when you separate two observations: where the ball started, then which way
            it curved. Those observations support a face-and-path relationship—not a verdict about your swing.
          </p>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-2" aria-label="The two-step read">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">1 · Start line</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Which way did it launch?</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Watch the first few yards of flight: left of the target line, on it, or right of it. Ignore where the
              shot eventually finished.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">2 · Curve</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Which way did it bend after launch?</h2>
            <p className="mt-3 leading-7 text-slate-600">
              After that first direction, did it bend left, stay mostly straight, or bend right? Centered contact
              makes this clue easier to trust.
            </p>
          </article>
        </section>

        <section className="mt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">One start, three outcomes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Start on target. Then watch the curve.</h2>
            <p className="mt-3 leading-7 text-slate-600">
              These examples share approximately the same start line. The curve changes because the face-to-path
              relationship changes.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {SAME_START_EXAMPLES.map((example) => (
              <article key={example.shape} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <BallFlightChart shape={example.shape} className="mx-auto max-w-sm" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{example.title}</h3>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  What you see
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{example.observation}</p>
                <p className="mt-4 border-t border-slate-200 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  What it suggests
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{example.relationship}</p>
              </article>
            ))}
          </div>

          <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            These charts show direction, not severity. Because curve size is not measured here, “curves left” and
            “curves right” are the safest labels. Golfers often call a smaller curve a draw or fade and a larger
            curve a hook or slice.
          </p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What this relationship supports</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">A useful starting hypothesis.</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
              <li>Start line gives a practical clue about delivered face direction.</li>
              <li>Curve gives a practical clue about face relative to path.</li>
              <li>Centered contact makes that relationship easier to interpret.</li>
              <li>A repeated shot cluster is more useful than one swing.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What it cannot prove</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Not a body-motion diagnosis.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This relationship cannot identify an exact path angle, a specific body movement, or an equipment
              change. Strike location, club type, wind, lie, alignment, and timing still matter.
            </p>
          </article>
        </section>

        <section className="mt-14 rounded-3xl bg-slate-900 p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Try it with your shot</p>
            <h2 className="mt-3 text-2xl font-semibold">Use the Ball Flight Decoder.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Choose the observed start, curve, and strike. The result will show the flight first, then the
              qualified relationship and one range test.
            </p>
          </div>
          <Link
            href="/tools/ball-flight-decoder"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 sm:mt-0 sm:w-auto sm:shrink-0"
          >
            Decode a ball flight →
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-100 pt-7 text-sm text-slate-500">
          <p>
            Evidence basis:{" "}
            <a className="underline underline-offset-4 hover:text-slate-900" href="https://www.trackman.com/blog/what-is-launch-direction">
              TrackMan on launch direction
            </a>
            {" "}and{" "}
            <a className="underline underline-offset-4 hover:text-slate-900" href="https://www.trackman.com/blog/face-to-path">
              face-to-path
            </a>
            . This guide is educational and assumes a right-handed golfer.
          </p>
        </footer>
      </div>
    </main>
  );
}
