import type { Metadata } from "next";
import { SITE_SLOGAN, SITE_DESCRIPTION } from "@/lib/siteCopy";
import Link from "next/link";
import { ToolShowcase } from "@/components/home/ToolShowcase";


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
        <aside className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6" aria-labelledby="putting-break-heading">
          <div><h2 id="putting-break-heading" className="text-base font-semibold tracking-tight">A little break between shots.</h2><p className="mt-1 text-sm leading-6 text-slate-600">Putting Break · Five holes. Bank shots. High scores.</p></div>
          <Link href="/play/putting" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100">Play a quick hole <span aria-hidden>→</span></Link>
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
