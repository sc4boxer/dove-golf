import type { Metadata } from "next";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";

export const metadata: Metadata = {
  title: "DoveGolf | Understand your ball flight and fit your gear",
  description:
    "Free, practical golf diagnosis and equipment-fit guidance for everyday golfers. Decode your ball flight and leave with one clear thing to test.",
  alternates: { canonical: "/" },
};

const symptoms = [
  {
    eyebrow: "BALL FLIGHT",
    title: "My ball curves",
    description: "Decode slices, hooks, pushes, pulls, and the patterns in between.",
    href: "/tools/ball-flight-decoder",
    action: "Read the flight",
  },
  {
    eyebrow: "CONTACT",
    title: "My strike feels inconsistent",
    description: "Use face contact and ball flight together to narrow the likely cause.",
    href: "/ball-flight-library",
    action: "Check the pattern",
  },
  {
    eyebrow: "EQUIPMENT",
    title: "My clubs may not fit",
    description: "Review shaft, launch, build, and setup clues without sales pressure.",
    href: "/diagnostic",
    action: "Check my equipment",
  },
];

const guides = [
  {
    title: "Start line vs. curve",
    description: "Learn what the face and path each contribute to the shot you see.",
    href: "/learn/start-line-vs-curve",
  },
  {
    title: "Shaft weight physics",
    description: "Understand why weight can matter as much as the flex printed on a shaft.",
    href: "/learn/shaft-weight-physics",
  },
  {
    title: "Tempo vs. flex",
    description: "See how speed and transition work together when choosing a starting point.",
    href: "/learn/tempo-vs-flex",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-[color:var(--paper)/0.92]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-3 rounded-md">
            <span
              aria-hidden
              className="grid size-10 place-items-center rounded-full bg-[var(--forest)] text-sm font-bold text-[var(--lime)]"
            >
              D
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-[-0.02em]">DoveGolf</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                Free golf guidance
              </span>
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            <Link className="text-sm font-medium hover:text-[var(--fairway)]" href="/tools/ball-flight-decoder">
              Ball Flight
            </Link>
            <Link className="text-sm font-medium hover:text-[var(--fairway)]" href="/diagnostic">
              Equipment Fit
            </Link>
            <Link className="text-sm font-medium hover:text-[var(--fairway)]" href="/learn">
              Learn
            </Link>
          </nav>

          <TrackLink
            href="/tools/ball-flight-decoder"
            eventParams={{ module: "ball_flight_decoder", placement: "home_header", version: "revival_v1" }}
            className="rounded-full bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--forest-deep)]"
          >
            Diagnose my shot
          </TrackLink>
        </div>
      </header>

      <section className="golf-grid border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-12 lg:py-28">
          <div>
            <p className="eyebrow">Practical golf guidance · Free to use</p>
            <h1 className="mt-6 max-w-5xl font-serif text-[clamp(3rem,7vw,6.6rem)] leading-[0.92] tracking-[-0.055em]">
              Understand your miss. Fit your gear. Play with less guesswork.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              DoveGolf turns your ball flight, strike pattern, and current setup into clear next steps—without
              sales pressure or confusing fitting jargon.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <TrackLink
                href="/tools/ball-flight-decoder"
                eventParams={{ module: "ball_flight_decoder", placement: "home_hero_primary", version: "revival_v1" }}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--forest)] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--forest-deep)]"
              >
                Decode my ball flight
              </TrackLink>
              <TrackLink
                href="/diagnostic"
                eventParams={{ module: "dovefit", placement: "home_hero_secondary", version: "revival_v1" }}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--ink)] px-6 py-3 font-semibold transition hover:bg-white/70"
              >
                Check my equipment fit
              </TrackLink>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--muted)]">No signup. Takes about 2 minutes.</p>
          </div>

          <aside
            aria-label="Example diagnosis result"
            className="relative rounded-[2rem] border border-white/10 bg-[var(--forest-deep)] p-6 text-white shadow-[0_32px_80px_rgba(11,41,34,0.18)] sm:p-8"
          >
            <div className="absolute right-6 top-6 size-3 rounded-full bg-[var(--lime)] shadow-[0_0_0_8px_rgba(216,240,107,0.12)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Example result</p>
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-white/50">What you entered</p>
              <p className="mt-2 font-medium">Starts right · Curves right · Heel strike</p>
            </div>
            <div className="my-6 h-px bg-white/10" />
            <p className="text-xs uppercase tracking-[0.13em] text-[var(--lime)]">Likely pattern</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">Open face with an out-to-in delivery</p>
            <p className="mt-4 leading-7 text-white/70">
              Contact can add curve, so test strike location before changing equipment.
            </p>
            <Link
              href="/tools/ball-flight-decoder"
              className="mt-7 inline-flex min-h-11 items-center font-semibold text-[var(--lime)]"
            >
              See what to test first <span aria-hidden className="ml-2">→</span>
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <p className="eyebrow">Start with what you see</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.045em]">
            What are you trying to solve?
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Choose the symptom that best matches your game. We’ll help you separate swing clues from equipment
            clues.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {symptoms.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex min-h-72 flex-col rounded-[1.6rem] border border-[var(--line)] bg-[var(--paper-strong)] p-6 transition hover:-translate-y-1 hover:border-[var(--fairway)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fairway)]">{item.eyebrow}</p>
                <span aria-hidden className="text-sm text-[var(--muted)]">0{index + 1}</span>
              </div>
              <h3 className="mt-10 text-2xl font-semibold tracking-[-0.025em]">{item.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{item.description}</p>
              <p className="mt-auto pt-8 font-semibold">
                {item.action} <span aria-hidden className="ml-1 transition group-hover:ml-2">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--forest)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <p className="eyebrow text-[var(--lime)]">Free tools</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] bg-[var(--paper-strong)] p-7 text-[var(--ink)] sm:p-10">
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--fairway)]">
                <span>2 min</span><span aria-hidden>·</span><span>No account</span><span aria-hidden>·</span><span>Plain-English result</span>
              </div>
              <h2 className="mt-8 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Ball Flight Decoder</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
                Tell us where the ball starts, how it curves, and where you strike the face. Get likely causes
                and one practical test for your next range session.
              </p>
              <TrackLink
                href="/tools/ball-flight-decoder"
                eventParams={{ module: "ball_flight_decoder", placement: "home_tool_card", version: "revival_v1" }}
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[var(--forest)] px-6 py-3 font-semibold text-white"
              >
                Start the decoder
              </TrackLink>
            </article>

            <article className="rounded-[2rem] border border-white/15 bg-white/5 p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--lime)]">Equipment engine</p>
              <h2 className="mt-8 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Equipment Fit Check</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                See whether your current setup may be helping, neutral, or working against your delivery.
              </p>
              <TrackLink
                href="/diagnostic"
                eventParams={{ module: "dovefit", placement: "home_tool_card", version: "revival_v1" }}
                className="mt-8 inline-flex min-h-12 items-center rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Review my setup
              </TrackLink>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <p className="eyebrow">How DoveGolf works</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]">
              Guidance you can inspect—not a mystery score.
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">
              DoveGolf provides educational starting points, not promises or a substitute for an in-person
              coach or qualified club fitter.
            </p>
          </div>
          <ol className="grid gap-3">
            {[
              ["Describe", "Share what the ball and strike are doing."],
              ["Understand", "See the relationships between face, path, contact, and equipment."],
              ["Test", "Leave with one focused experiment and know when professional help would add value."],
            ].map(([title, description], index) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 rounded-2xl border border-[var(--line)] bg-white/45 p-5">
                <span className="font-serif text-2xl text-[var(--fairway)]">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 leading-7 text-[var(--muted)]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--paper-strong)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <p className="eyebrow">Learn the why</p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.045em]">
                Clear answers for the questions golfers actually ask.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                Practical guides that connect ball flight, impact, and equipment—so you know what to change
                and what to leave alone.
              </p>
            </div>
            <Link href="/learn" className="font-semibold text-[var(--forest)]">
              Explore all golf guides <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group rounded-2xl border border-[var(--line)] p-6 transition hover:bg-[var(--paper)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fairway)]">Guide</p>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">{guide.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{guide.description}</p>
                <p className="mt-8 font-semibold">Read the guide <span aria-hidden>→</span></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="rounded-[2rem] bg-[var(--lime)] p-7 sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <h2 className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.05em]">
              Start with the shot you want to understand.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--forest-deep)]/75">
              A clearer diagnosis is a better first step than another random swing thought or equipment purchase.
            </p>
          </div>
          <TrackLink
            href="/tools/ball-flight-decoder"
            eventParams={{ module: "ball_flight_decoder", placement: "home_closing_cta", version: "revival_v1" }}
            className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[var(--forest-deep)] px-6 py-3 font-semibold text-white lg:mt-0"
          >
            Decode my ball flight
          </TrackLink>
        </div>
      </section>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <p className="font-semibold">DoveGolf</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Free, practical golf diagnosis and equipment-fit guidance for everyday golfers.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <Link href="/method">Method</Link>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
          <p className="text-xs leading-5 text-[var(--muted)] md:col-span-2">
            Educational guidance only. Results are starting points to test, not guarantees of performance.
          </p>
        </div>
      </footer>
    </main>
  );
}
