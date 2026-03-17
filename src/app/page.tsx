import type { Metadata } from "next";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";

export const metadata: Metadata = {
  title: "DoveGolf | Visual Golf Diagnosis with DoveClinic",
  description:
    "DoveClinic helps golfers diagnose visible ball-flight symptoms, test likely causes, and build straighter, more solid shots.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
          <p className="text-xs font-medium tracking-wide text-slate-500">DoveGolf platform</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Fix your miss with clarity.</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            DoveClinic helps you understand your ball flight, test likely causes, and work toward straighter,
            more solid shots.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackLink
              href="/clinic/ball-curves-right"
              eventParams={{ module: "doveclinic", placement: "home_hero_primary", version: "v3" }}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Start DoveClinic
            </TrackLink>
            <TrackLink
              href="/diagnostic"
              eventParams={{ module: "dovefit", placement: "home_hero_secondary", version: "v3" }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Explore DoveFit
            </TrackLink>
            <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              DoveLab coming soon
            </span>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <TrajectoryHeroViz />
          <p className="mt-4 text-sm text-slate-600">
            Different swings → different trajectories. Smart diagnosis helps you improve your default flight.
          </p>
        </section>


        <section className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <article className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white">
            <p className="text-sm font-medium tracking-wide text-slate-300">Primary product</p>
            <h2 className="mt-2 text-2xl font-semibold">DoveClinic</h2>
            <p className="mt-2 text-sm text-slate-200">
              Diagnose ball-flight and strike symptoms with visual cause-and-effect logic.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• Match the shot shape you actually see</li>
              <li>• Get ranked likely causes</li>
              <li>• Test one change at a time</li>
            </ul>
            <TrackLink
              href="/clinic"
              eventParams={{ module: "doveclinic", placement: "home_product_card", version: "v3" }}
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900"
            >
              Open DoveClinic
            </TrackLink>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium tracking-wide text-slate-500">Equipment engine</p>
            <h2 className="mt-2 text-2xl font-semibold">DoveFit</h2>
            <p className="mt-2 text-sm text-slate-600">
              Evaluate whether your equipment is helping or hurting your delivery.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Shaft weight and flex guidance</li>
              <li>• Launch and bias recommendation logic</li>
              <li>• Practical testing checklist</li>
            </ul>
            <TrackLink
              href="/diagnostic"
              eventParams={{ module: "dovefit", placement: "home_product_card", version: "v3" }}
              className="mt-5 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800"
            >
              Open DoveFit
            </TrackLink>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium tracking-wide text-slate-500">Advanced layer</p>
            <h2 className="mt-2 text-2xl font-semibold">DoveLab</h2>
            <p className="mt-2 text-sm text-slate-600">
              Future deeper analysis tools for testing, learning, and advanced diagnostics.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Variable interaction studies</li>
              <li>• Expanded visual analytics</li>
              <li>• Experimental modules</li>
            </ul>
            <div className="mt-5 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
              Coming soon
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-base text-slate-700">
          For golfers who care about cause and effect — and want clear, data-driven reasoning behind equipment
          decisions.
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <TrackLink
            href="/learn/ball-flight"
            eventParams={{ module: "learn", placement: "home_support_card", version: "v3" }}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-slate-300"
          >
            <p className="text-2xl font-semibold tracking-tight text-slate-900">Ball Flight Library</p>
            <p className="mt-2 text-lg text-slate-600">Curve → probable causes → what to test.</p>
          </TrackLink>

          <Link
            href="/method"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-slate-300"
          >
            <p className="text-2xl font-semibold tracking-tight text-slate-900">How it works</p>
            <p className="mt-2 text-lg text-slate-600">See the fitting logic before you run the workflow.</p>
          </Link>

          <Link
            href="/about"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-slate-300"
          >
            <p className="text-2xl font-semibold tracking-tight text-slate-900">About DoveGolf™</p>
            <p className="mt-2 text-lg text-slate-600">Engineered cause and effect.</p>
          </Link>
        </section>
      </div>
    </main>
  );
}

function TrajectoryHeroViz() {
  const baseAnim = "dash 1.4s ease forwards";

  return (
    <svg viewBox="0 0 760 240" className="w-full" aria-hidden>
      <line x1="52" y1="190" x2="708" y2="190" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="52" y1="24" x2="52" y2="190" stroke="#cbd5e1" strokeWidth="2" />

      {[128, 95, 62].map((y) => (
        <line key={y} x1="52" y1={y} x2="708" y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {[130, 210, 290, 370, 450, 530, 610].map((x) => (
        <line key={x} x1={x} y1="24" x2={x} y2="190" stroke="#e2e8f0" strokeWidth="1" />
      ))}

      <path
        d="M 52 190 C 170 36, 320 34, 455 190"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeDasharray="12 12"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDashoffset: 1, animation: `${baseAnim} 0.2s` }}
      />

      <path
        d="M 52 190 C 195 148, 435 110, 560 190"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeDasharray="12 12"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDashoffset: 1, animation: `${baseAnim} 0.7s` }}
      />

      <path
        d="M 52 190 C 220 88, 500 66, 655 190"
        fill="none"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDashoffset: 1, animation: `${baseAnim} 1.2s` }}
      />

      <text x="60" y="36" fill="#475569" fontSize="14">
        Height
      </text>
      <text x="642" y="216" fill="#475569" fontSize="14">
        Distance
      </text>
    </svg>
  );
}
