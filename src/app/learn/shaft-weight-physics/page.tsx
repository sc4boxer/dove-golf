import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shaft Weight Physics for Better Dispersion",
  description:
    "A practical physics guide to shaft weight, timing repeatability, fatigue effects, and why mass often beats flex adjustments.",
  alternates: { canonical: "/learn/shaft-weight-physics" },
};

export default function ShaftWeightPhysicsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <a href="/learn" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Learn
        </a>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Shaft Weight: The First Lever to Get Right</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Mass changes system behavior before label changes do. Appropriate weight can stabilize transition timing,
            improve strike repeatability, and reduce late-round dispersion drift. Flex still matters, but often second.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Dispersion comparison</h2>
          <svg viewBox="0 0 640 280" className="mt-4 w-full h-auto" role="img" aria-label="Dispersion clusters by shaft weight">
            <line x1="60" y1="240" x2="580" y2="240" stroke="#94a3b8" strokeWidth="2" />
            <line x1="60" y1="240" x2="60" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <text x="510" y="265" fill="#64748b" fontSize="13">
              Horizontal dispersion
            </text>
            <text x="18" y="34" fill="#64748b" fontSize="13">
              Vertical dispersion
            </text>
            <circle cx="190" cy="145" r="70" fill="none" stroke="#475569" strokeWidth="2" />
            <circle cx="450" cy="150" r="38" fill="none" stroke="#0f172a" strokeWidth="2" />
            <text x="126" y="67" fill="#475569" fontSize="13">
              Light shaft cluster
            </text>
            <text x="395" y="92" fill="#0f172a" fontSize="13">
              Appropriate weight cluster
            </text>
          </svg>
        </section>

        <section className="mt-8 space-y-6 max-w-3xl">
          <ArticleSection
            title="Total system mass vs static weight"
            body="Static shaft grams are only one part of the load your body manages. Head mass, playing length, and balance distribution all change effective effort and sequencing. Practical fitting treats weight as a system variable, not an isolated catalog number."
          />
          <ArticleSection
            title="Impact on timing repeatability"
            body="A shaft that is too light for your tempo can increase hand-speed variability and closure timing noise. Appropriate mass tends to damp timing spikes, making strike and face delivery more repeatable. That repeatability is usually visible in tighter start-line variance."
          />
          <ArticleSection
            title="Fatigue and dispersion"
            body="Too much weight can increase late-session fatigue and reduce delivery quality. Too little weight can force over-acceleration and widen two-way misses. The useful target is sustainable mass that preserves rhythm across a full range session or round."
          />
          <ArticleSection
            title="Why weight often matters more than flex"
            body="Mass shapes motion at a foundational level, while flex mostly fine-tunes how that motion is expressed through impact timing. If weight is mismatched, flex adjustments often act like patchwork. Solve mass first, then refine profile and flex within that stable window."
          />
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/method" className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Read the method
          </a>
          <a href="/diagnostic" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
            Start diagnostic
          </a>
        </div>
      </div>
    </main>
  );
}

function ArticleSection({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{body}</p>
    </article>
  );
}
