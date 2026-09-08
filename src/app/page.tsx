import type { Metadata } from "next";
import { SITE_SLOGAN, SITE_DESCRIPTION } from "@/lib/siteCopy";
import Link from "next/link";
import { ToolShowcase } from "@/components/home/ToolShowcase";
import { ScoreChallenge } from "@/components/home/ScoreChallenge";
import { TrackLink } from "@/components/analytics/TrackLink";


export const metadata: Metadata = {
  title: "Dove Golf | Free Golf Tools for Better Range Sessions",
  description: SITE_DESCRIPTION,
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Link href="/" className="inline-flex min-h-11 items-center text-lg font-semibold tracking-tight">Dove Golf<span aria-hidden className="ml-1 text-slate-400">.</span></Link>
          <nav aria-label="Primary navigation" className="flex gap-5 text-sm text-slate-500">
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/learn">Learn</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/method">Method</Link>
            <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/about">About</Link>
          </nav>
        </header>
        <section className="mb-8 mt-10 max-w-2xl sm:mb-10 sm:mt-14" aria-labelledby="home-heading">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Free tools. Clear next steps.</p>
          <h1 id="home-heading" className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl">{SITE_SLOGAN}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{SITE_DESCRIPTION}</p>
        </section>
        <ToolShowcase />
        <section className="mt-8 mb-8" aria-labelledby="choose-tool-heading">
          <h2 id="choose-tool-heading" className="text-base font-semibold tracking-tight">What are you working on?</h2>
          <p className="mt-1 text-sm text-slate-600">Choose a starting point for your next session.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { question: "Struggling with contact?", name: "Range Rescue", href: "/range-rescue", module: "range_rescue" },
              { question: "Confused by your curve?", name: "Ball Flight Decoder", href: "/tools/ball-flight-decoder", module: "ball_flight_decoder" },
              { question: "Considering a club change?", name: "Equipment Fit", href: "/diagnostic", module: "dovefit" },
            ].map(tool => <TrackLink key={tool.module} href={tool.href} eventParams={{ module: tool.module, placement: "home_tool_guide", version: "revival_v2" }} className="group rounded-2xl border border-slate-200 p-4 hover:border-sky-200 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">
              <span className="block text-sm font-medium text-slate-800">{tool.question}</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-600">Open {tool.name}<span aria-hidden="true" className="text-sky-700">→</span></span>
            </TrackLink>)}
          </div>
        </section>
        <aside className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6" aria-labelledby="putting-break-heading">
          <div><h2 id="putting-break-heading" className="text-base font-semibold tracking-tight">A little break between shots.</h2><p className="mt-1 text-sm leading-6 text-slate-600">Putting Break · Five holes. Bank shots. High scores.</p><ScoreChallenge /></div>
          <Link href="/play/putting" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Play a quick hole <span aria-hidden>→</span></Link>
        </aside>
        <footer className="mt-9 border-t border-slate-200 pt-6">
          <p className="text-sm font-medium text-slate-700">Free · No account · Brand-neutral</p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">Educational guidance with clear limits and practical next steps. Results are starting points to test, not guaranteed diagnoses. Range partners do not influence results.</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} · Dove Golf</p>
            <div className="flex gap-5">
              <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/faq">FAQ</Link>
              <Link className="inline-flex min-h-11 items-center hover:text-slate-900" href="/learn/ball-flight">Ball flight library</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
