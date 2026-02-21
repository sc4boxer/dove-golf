import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BallFlightLibraryViz } from "@/components/learn/BallFlightLibraryViz";
import { scoreConfidence } from "@/lib/learn/ballFlightConfidence";
import { BALL_FLIGHT_PATTERNS, PATTERN_ORDER, type PatternSlug } from "@/lib/learn/ballFlightPatterns";

type PatternPageProps = { params: Promise<{ pattern: string }> };

function isPatternSlug(value: string): value is PatternSlug {
  return PATTERN_ORDER.includes(value as PatternSlug);
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { pattern } = await params;
  if (!isPatternSlug(pattern)) {
    return {};
  }

  return {
    title: `${BALL_FLIGHT_PATTERNS[pattern].title} Ball Flight`,
    description: BALL_FLIGHT_PATTERNS[pattern].definition,
    alternates: { canonical: `/learn/ball-flight/${pattern}` },
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { pattern } = await params;
  if (!isPatternSlug(pattern)) notFound();

  const entry = BALL_FLIGHT_PATTERNS[pattern];
  const confidence = scoreConfidence({ pattern });
  const idx = PATTERN_ORDER.indexOf(pattern);
  const prev = PATTERN_ORDER[(idx + PATTERN_ORDER.length - 1) % PATTERN_ORDER.length];
  const next = PATTERN_ORDER[(idx + 1) % PATTERN_ORDER.length];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <HomeLinkPill />

        <p className="mt-5 text-sm font-medium text-slate-500">Ball Flight Library</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{entry.title}</h1>
        <p className="mt-4 text-sm text-slate-600">{entry.definition}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <BallFlightLibraryViz startLine={entry.startLine} curve={entry.curve} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-900">
              Confidence: {confidence.label} ({confidence.score}/100)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {confidence.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-slate-900">Physics constraints</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {entry.physicsConstraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/learn/ball-flight" className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
            Back to Explorer
          </Link>
          <Link href={`/learn/ball-flight/${prev}`} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
            Previous pattern
          </Link>
          <Link href={`/learn/ball-flight/${next}`} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
            Next pattern
          </Link>
        </div>
      </div>
    </main>
  );
}
