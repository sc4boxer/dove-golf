import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Line vs Curve in Golf Ball Flight",
  description:
    "A technical explanation of face angle, path, and curvature, including what equipment can realistically influence.",
  alternates: { canonical: "/learn/start-line-vs-curve" },
};

export default function StartLineVsCurvePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <a href="/learn" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Learn
        </a>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Start Line vs Curve: What Actually Controls Ball Flight?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Start direction is primarily a face variable. Curvature emerges from the delta between face and path.
            These are separate inputs and should be diagnosed separately before changing equipment.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Impact geometry diagram</h2>
          <p className="mt-2 text-sm text-slate-600">Face controls start. Path influences curve.</p>
          <svg viewBox="0 0 640 260" className="mt-4 w-full h-auto" role="img" aria-label="Start line and curve">
            <line x1="80" y1="210" x2="560" y2="210" stroke="#94a3b8" strokeWidth="2" />
            <line x1="80" y1="210" x2="80" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <text x="510" y="238" fill="#64748b" fontSize="13">
              Start direction
            </text>
            <path d="M 90 205 Q 300 120 540 205" fill="none" stroke="#0f172a" strokeWidth="3" />
            <path d="M 90 205 Q 300 245 540 205" fill="none" stroke="#475569" strokeWidth="3" />
            <text x="285" y="110" fill="#0f172a" fontSize="13">
              Draw tendency
            </text>
            <text x="285" y="252" fill="#475569" fontSize="13">
              Fade tendency
            </text>
          </svg>
        </section>

        <section className="mt-8 space-y-6 max-w-3xl">
          <ArticleSection
            title="Face angle dominance at impact"
            body="Across typical driver speeds, initial start direction is driven mostly by delivered face angle relative to target. Path still matters, but the face contributes the larger share of directional launch. If the ball starts right repeatedly, the first hypothesis is usually an open face, not a path-only issue."
          />
          <ArticleSection
            title="Face-to-path relationship"
            body="Curvature is better modeled as a differential term. When the face is right of path, the spin axis tilts one way; when face is left of path, it tilts the other. That is why two swings can share similar start lines but bend differently downrange."
          />
          <ArticleSection
            title="Why amateurs misdiagnose curvature"
            body="Many players watch the final curve and infer a single swing flaw. The better approach is a two-step read: where it started, then how it bent. Without separating those two observations, equipment changes can solve the wrong variable and increase uncertainty."
          />
          <ArticleSection
            title="What equipment can and cannot fix"
            body="Equipment can influence closure timing, strike stability, and how often face delivery repeats under load. It cannot reliably override a large path error created by mechanics. Use fit to narrow dispersion around your current pattern, then improve motion if directional bias is still excessive."
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
