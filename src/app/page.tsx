import type { Metadata } from "next";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";
import { TrajectoryComparison } from "@/components/home/TrajectoryComparison";

export const metadata: Metadata = {
  title: "Dove Golf | Free Golf Tools for Better Range Sessions",
  description:
    "Dove Golf offers free, data-guided tools that turn ball flight, strike, and equipment clues into one practical next test.",
  alternates: { canonical: "/" },
};

const siteUrl = "https://dovegolf.fit/";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: "Dove Golf",
      alternateName: ["DoveGolf", "dovegolf.fit"],
      url: siteUrl,
      description:
        "Free, data-guided golf tools for better range sessions, clearer ball flight, and smarter equipment choices.",
      publisher: { "@id": `${siteUrl}#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "Dove Golf",
      legalName: "Dove Golf, Inc.",
      url: siteUrl,
      description:
        "A brand-neutral golf education company that turns observable ball flight, strike, and equipment clues into practical tests.",
    },
  ],
};

const beginnerSteps = [
  { title: "Pick the miss", detail: "Choose the picture that looks closest." },
  { title: "Try one change", detail: "Keep one simple thought for five balls." },
  { title: "Compare five balls", detail: "Notice better, worse, or just different." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <header>
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm sm:px-4"
            >
              <span aria-hidden className="size-2 rounded-full bg-[#245f4d]" />
              Dove Golf
            </Link>
            <p className="max-w-36 text-right text-xs leading-5 text-slate-500 sm:max-w-none">
              Available free at your range
            </p>
          </div>

          <nav
            aria-label="Primary navigation"
            className="mt-4 flex items-center gap-5 text-sm text-slate-500 sm:justify-end"
          >
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/learn">Learn</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/method">Method</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/about">About</Link>
          </nav>
        </header>

        <section className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-[1.15fr_0.85fr] md:gap-16" aria-labelledby="home-heading">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#245f4d]">Dove Golf · New to the range?</p>
            <h1 id="home-heading" className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
              Dove Golf helps your first bucket feel like{" "}
              <span className="block text-[#55716a]">progress.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700">
              You do not need to understand your swing yet. Tell Dove Golf what the last ball did, and get
              one simple thing to try for the next five.
            </p>

            <Link
              href="/range-rescue"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#245f4d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b4d3e] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b] sm:w-auto"
            >
              Get my five-ball plan →
            </Link>
            <p className="mt-4 text-sm text-slate-500">Free · No account · Brand-neutral</p>
          </div>

          <div className="rounded-3xl bg-[#edf4ef] p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#55716a]">A calmer way to start</p>
            <ol className="mt-7 space-y-0">
              {beginnerSteps.map((step, index) => (
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < beginnerSteps.length - 1 ? (
                    <span aria-hidden className="absolute left-5 top-10 h-full w-px bg-[#bfd0c7]" />
                  ) : null}
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-white text-sm font-medium text-[#245f4d] shadow-sm">
                    {index + 1}
                  </span>
                  <span className="pt-1">
                    <span className="block font-medium text-slate-900">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-16 border-y border-slate-200" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="sr-only">Choose a Dove Golf tool</h2>
          <div className="grid md:grid-cols-3">
            <article className="border-b border-slate-200 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#55716a]">AT THE RANGE</p>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">Range Rescue</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                When the session is going sideways, get one reset for your next five balls.
              </p>
              <Link
                href="/range-rescue"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#245f4d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1b4d3e] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b]"
              >
                Help my next five →
              </Link>
            </article>

            <article className="border-b border-slate-200 py-8 md:border-b-0 md:border-r md:px-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#55716a]">AFTER YOUR BUCKET</p>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">Ball Flight Decoder</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                Understand where the ball started, how it curved, and what that pattern may suggest.
              </p>
              <TrackLink
                href="/tools/ball-flight-decoder"
                eventParams={{ module: "ball_flight_decoder", placement: "home_hero_primary", version: "revival_v2" }}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#245f4d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1b4d3e] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b]"
              >
                Understand the pattern →
              </TrackLink>
            </article>

            <article className="py-8 md:px-6 md:last:pr-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#55716a]">BEFORE BUYING GEAR</p>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">Equipment Fit</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                Check whether a repeated pattern makes your current club setup worth testing.
              </p>
              <TrackLink
                href="/diagnostic"
                eventParams={{ module: "dovefit", placement: "home_hero_secondary", version: "revival_v2" }}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#245f4d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1b4d3e] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7d9b3b]"
              >
                Check the setup →
              </TrackLink>
            </article>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="trajectory-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What the ball can tell you</p>
          <h2 id="trajectory-heading" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Different shots leave different clues.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            You do not need the perfect golf term. Start with the shape you saw—we can work from there.
          </p>
          <div className="mt-7">
            <TrajectoryComparison />
          </div>
        </section>

        <section className="mt-16 border-t border-slate-200 pt-10" aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-xl font-semibold tracking-tight">A useful answer should stay honest.</h2>
          <div className="mt-7 grid gap-7 text-sm leading-6 text-slate-600 sm:grid-cols-3">
            <p><span className="block font-medium text-slate-900">What the evidence supports</span>The relationship we can reasonably read from your inputs.</p>
            <p><span className="block font-medium text-slate-900">What remains uncertain</span>The limits of the data, stated without false confidence.</p>
            <p><span className="block font-medium text-slate-900">What to try next</span>One practical change you can compare with real shots.</p>
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
          <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-500">
            Dove Golf guidance is brand-neutral. Range partners can help make it available, but they do not influence results.
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
            Educational guidance only. Results are starting points to test, not guaranteed diagnoses or performance outcomes.
          </p>
        </footer>
      </div>
    </main>
  );
}
