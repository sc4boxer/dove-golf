import type { Metadata } from "next";
import Link from "next/link";
import { PuttingGame } from "@/components/play/PuttingGame";

export const metadata: Metadata = {
  title: "Putting Break — Free Mini Golf Game",
  description: "Five holes, clever obstacles and an arcade leaderboard. Play a free mini golf challenge, bank your putts and share your score.",
  alternates: { canonical: "/play/putting" },
};

export default function PuttingPage() {
  return <main className="min-h-screen bg-white text-slate-900">
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium shadow-sm"><span aria-hidden="true">←</span> Dove Golf</Link>
      <header className="mb-6 mt-6 max-w-xl sm:mb-8 sm:mt-10">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">A little game between turns</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:mt-4 sm:text-5xl">Putting break.</h1>
        <p className="mt-3 text-base leading-7 text-slate-600 sm:mt-4">Five holes. Five putts each. Find your angles, bank off the walls, and put your initials on the board.</p>
      </header>
      <PuttingGame />
      <footer className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">Just for fun. Ready for your turn? You can leave any time. <Link href="/range-rescue" className="font-medium text-slate-900 underline underline-offset-4">Back to practice</Link></footer>
    </div>
  </main>;
}
