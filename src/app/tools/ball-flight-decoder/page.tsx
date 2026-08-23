import type { Metadata } from "next";
import Link from "next/link";
import { BallFlightDecoder } from "@/components/tools/ball-flight-decoder/BallFlightDecoder";

export const metadata: Metadata = {
  title: "Free Golf Ball Flight Decoder",
  description:
    "Identify a right-handed golf shot from its start direction, curve, and strike location—then see a transparent face/path interpretation and one practical test.",
  alternates: { canonical: "/tools/ball-flight-decoder" },
};

export default function BallFlightDecoderPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 rounded-md font-semibold">
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-full bg-[var(--forest)] text-sm font-bold text-[var(--lime)]"
            >
              D
            </span>
            DoveGolf
          </Link>
          <nav aria-label="Tool navigation" className="flex items-center gap-5 text-sm font-semibold">
            <Link className="hidden sm:inline" href="/learn/start-line-vs-curve">Face vs path</Link>
            <Link href="/diagnostic">Equipment fit</Link>
          </nav>
        </div>
      </header>

      <section className="golf-grid border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <p className="eyebrow">Free tool · Right-handed model</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <h1 className="font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.055em]">
                Decode your ball flight.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                Tell us where the ball started, how it curved, and where you struck the face. We’ll translate
                the pattern—not guess your swing.
              </p>
            </div>
            <aside className="rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-5 text-sm leading-6 text-[var(--muted)]">
              <strong className="block text-[var(--ink)]">Handedness assumption</strong>
              <span className="mt-2 block">
                This version describes a right-handed golfer. Left-handed pattern names and curve relationships
                reverse.
              </span>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <BallFlightDecoder />
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-[var(--muted)] sm:px-8 md:grid-cols-2 lg:px-12">
          <p>
            This tool is educational. Use a repeatable shot cluster and compare the result with an in-person
            coach or qualified fitter when the pattern persists.
          </p>
          <nav aria-label="Related resources" className="flex flex-wrap gap-5 font-semibold text-[var(--ink)] md:justify-end">
            <Link href="/ball-flight-library">Ball flight library</Link>
            <Link href="/method">Method</Link>
            <Link href="/">Home</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
