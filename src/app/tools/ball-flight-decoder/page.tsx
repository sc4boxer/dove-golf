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
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
          >
            <span aria-hidden className="size-2 rounded-full bg-slate-900" />
            Dove Golf
          </Link>

          <nav aria-label="Tool navigation" className="flex items-center gap-5 text-sm text-slate-500">
            <Link className="hidden hover:text-slate-900 sm:inline" href="/learn/start-line-vs-curve">
              Face vs path
            </Link>
            <Link className="hover:text-slate-900" href="/diagnostic">
              Equipment fit
            </Link>
          </nav>
        </header>

        <section className="mt-16 max-w-3xl sm:mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Free tool · Right-handed model
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            Decode your ball flight.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
            Tell us where the ball started, how it curved, and where you struck the face. We will translate
            the pattern—not guess your swing.
          </p>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <span className="font-medium text-slate-900">Right-handed assumption. </span>
            Left-handed pattern names and curve relationships reverse.
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <BallFlightDecoder />
        </section>

        <footer className="mt-16 border-t border-slate-100 pt-8">
          <div className="grid gap-6 text-sm text-slate-500 md:grid-cols-2">
            <p>
              This tool is educational. Use a repeatable shot cluster and compare the result with an in-person
              coach or qualified fitter when the pattern persists.
            </p>
            <nav aria-label="Related resources" className="flex flex-wrap gap-5 md:justify-end">
              <Link className="hover:text-slate-900" href="/ball-flight-library">
                Ball flight library
              </Link>
              <Link className="hover:text-slate-900" href="/method">
                Method
              </Link>
              <Link className="hover:text-slate-900" href="/">
                Home
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
