import type { Metadata } from "next";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";
import { MissVisual } from "@/components/range-rescue/MissVisual";

export const metadata: Metadata = {
  title: "Online Golf Club Fitting & Equipment Diagnostic",
  description:
    "Make clearer golf decisions with independent equipment fitting, miss debugging, ball-flight education, and Range Rescue.",
  alternates: { canonical: "/" },
};

const tracked = (module: string, placement: string) => ({ module, placement, version: "v2" });

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dove Golf",
    url: "https://dovegolf.fit",
    description:
      "Independent golf fitting, miss debugging, ball-flight education, and simple in-session range guidance.",
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#1d1d1f]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-5 border-b border-black/8 px-5 sm:px-8">
        <Link href="/" className="inline-flex min-h-12 items-center gap-2.5 rounded-xl font-semibold tracking-[-0.02em] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-slate-500">
          <span className="grid size-8 place-items-center rounded-full bg-[#1d1d1f] text-xs font-bold text-white">D</span>
          <span>Dove Golf</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          <TrackLink href="/diagnostic" eventParams={tracked("dovefit", "home_header")} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-black/65 transition hover:bg-white hover:text-black">Fit</TrackLink>
          <TrackLink href="/clinic" eventParams={tracked("doveclinic", "home_header")} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-black/65 transition hover:bg-white hover:text-black">Clinic</TrackLink>
          <TrackLink href="/learn" eventParams={tracked("learn", "home_header")} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-black/65 transition hover:bg-white hover:text-black">Learn</TrackLink>
          <Link href="/range-rescue" className="ml-2 inline-flex min-h-11 items-center rounded-full bg-[#245f4d] px-5 text-sm font-semibold text-white transition hover:bg-[#194b3c] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#8aa840]">Range Rescue</Link>
        </nav>

        <Link href="/range-rescue" className="inline-flex min-h-11 items-center rounded-full bg-[#245f4d] px-4 text-sm font-semibold text-white sm:hidden">Rescue</Link>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <section className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/45">Independent golf guidance</p>
          <h1 className="mt-5 text-[clamp(3rem,9vw,7.2rem)] font-semibold leading-[0.91] tracking-[-0.072em]">Better decisions.<br />Less guesswork.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/58 sm:text-xl">
            Fit your equipment, understand your ball flight, or steady a bad range session—without hype, brand bias, or swing-theory overload.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <TrackLink href="/diagnostic" eventParams={tracked("dovefit", "home_hero")} className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#1d1d1f] px-7 text-sm font-semibold text-white transition hover:bg-black">Start a fitting</TrackLink>
            <Link href="/range-rescue" className="inline-flex min-h-13 items-center justify-center rounded-full border border-black/12 bg-white px-7 text-sm font-semibold transition hover:border-black/25">Rescue this range session</Link>
          </div>
        </section>

        <section id="products" aria-labelledby="products-heading" className="mt-24 sm:mt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/42">Choose what you need</p>
          <h2 id="products-heading" className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Start with today’s problem.</h2>

          <article className="mt-8 overflow-hidden rounded-[2rem] bg-[#17362d] text-white">
            <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ddec8e]">At the range right now</p>
                <h3 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Calm your next five balls.</h3>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
                  Pick the picture that looks most like your miss. Get one simple reset and a five-ball plan—no account and nothing saved.
                </p>
                <Link href="/range-rescue" className="mt-8 inline-flex min-h-13 items-center rounded-full bg-[#ddec8e] px-7 text-sm font-semibold text-[#17362d] transition hover:bg-[#e8f3aa] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Open Range Rescue <span className="ml-2" aria-hidden="true">→</span></Link>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-[1.6rem] bg-white/7 p-3 sm:gap-4 sm:p-5" aria-hidden="true">
                <div className="rotate-[-3deg]"><MissVisual id="ground-first" /></div>
                <div className="translate-y-5"><MissVisual id="curves-right" /></div>
                <div className="rotate-[3deg]"><MissVisual id="no-pattern" /></div>
              </div>
            </div>
          </article>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="flex min-h-80 flex-col rounded-[2rem] border border-black/8 bg-white p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-black/42">DoveFit</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">Fit the gear to your swing.</h3>
              <p className="mt-4 max-w-md leading-7 text-black/55">A focused equipment diagnostic that turns your tendencies into clear, testable fitting decisions.</p>
              <TrackLink href="/diagnostic" eventParams={tracked("dovefit", "home_product")} className="mt-auto inline-flex min-h-12 items-center self-start rounded-full bg-[#1d1d1f] px-6 text-sm font-semibold text-white">Start DoveFit <span className="ml-2" aria-hidden="true">→</span></TrackLink>
            </article>

            <article className="flex min-h-80 flex-col rounded-[2rem] border border-black/8 bg-white p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-black/42">DoveClinic</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">Debug a repeatable miss.</h3>
              <p className="mt-4 max-w-md leading-7 text-black/55">Work through a recurring ball-flight problem with clear tests and simple if/then outcomes.</p>
              <TrackLink href="/clinic" eventParams={tracked("doveclinic", "home_product")} className="mt-auto inline-flex min-h-12 items-center self-start rounded-full border border-black/12 px-6 text-sm font-semibold">Open DoveClinic <span className="ml-2" aria-hidden="true">→</span></TrackLink>
            </article>
          </div>

          <article className="mt-5 grid gap-6 rounded-[2rem] border border-black/8 bg-[#eceef0] p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-black/42">Learn</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">See what the ball is telling you.</h3>
              <p className="mt-3 max-w-2xl leading-7 text-black/55">Plain-language visual guides to start direction, curve, contact, launch, and equipment variables.</p>
            </div>
            <TrackLink href="/learn" eventParams={tracked("learn", "home_product")} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold shadow-sm">Explore the library</TrackLink>
          </article>
        </section>

        <section className="mt-20 grid gap-6 border-t border-black/8 pt-10 sm:mt-28 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold">The method is simple.</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">Observe what happened. Change one useful variable. Test again. Keep what improves the result.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <Link href="/method" className="min-h-11 content-center text-black/62 hover:text-black">How it works</Link>
            <Link href="/about" className="min-h-11 content-center text-black/62 hover:text-black">About</Link>
            <Link href="/faq" className="min-h-11 content-center text-black/62 hover:text-black">FAQ</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
