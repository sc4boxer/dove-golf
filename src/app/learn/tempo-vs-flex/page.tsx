import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tempo vs Flex in Golf Shaft Fitting",
  description:
    "Learn how transition tempo interacts with bend profile timing, and why flex labels alone are an incomplete fit signal.",
  alternates: { canonical: "/learn/tempo-vs-flex" },
};

export default function TempoVsFlexPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <a href="/learn" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Learn
        </a>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Tempo vs Flex: Matching Bend Profile to Transition
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Flex labels hide major differences in stiffness distribution and recovery timing. Tempo is not just speed,
            it is loading rate through transition. Matching profile to that rate usually outperforms label-driven
            fitting.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Load and recovery chart</h2>
          <svg viewBox="0 0 640 280" className="mt-4 w-full h-auto" role="img" aria-label="Tempo load curves">
            <line x1="80" y1="230" x2="560" y2="230" stroke="#94a3b8" strokeWidth="2" />
            <line x1="80" y1="230" x2="80" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <text x="530" y="255" fill="#64748b" fontSize="13">
              Time
            </text>
            <text x="20" y="32" fill="#64748b" fontSize="13">
              Shaft deflection
            </text>
            <path d="M 90 220 C 170 160, 300 150, 540 210" fill="none" stroke="#0f172a" strokeWidth="3" />
            <path d="M 90 220 C 140 90, 240 80, 540 215" fill="none" stroke="#475569" strokeWidth="3" />
            <text x="360" y="136" fill="#0f172a" fontSize="13">
              Smooth tempo
            </text>
            <text x="255" y="76" fill="#475569" fontSize="13">
              Aggressive tempo
            </text>
          </svg>
        </section>

        <section className="mt-8 space-y-6 max-w-3xl">
          <ArticleSection
            title="Why flex labels are not standardized"
            body="One brand’s stiff can frequency-match another brand’s firm, and neither label reveals where along the shaft stiffness is concentrated. Butt, mid, and tip behavior can vary meaningfully inside the same letter code. Flex labels are useful shorthand, but not precise engineering descriptors."
          />
          <ArticleSection
            title="Loading rate vs shaft recovery timing"
            body="Transition speed changes how quickly the shaft is loaded and when it recovers relative to impact. A profile that recovers too late can present unstable face delivery, while a profile that recovers too early can feel disconnected and difficult to time. The goal is not maximal stiffness, but synchronized recovery."
          />
          <ArticleSection
            title="Smooth vs abrupt transitions"
            body="Smoother transitions generally tolerate a wider profile range because load is applied progressively. Abrupt transitions narrow that range because dynamic deflection spikes faster. This is why two players at similar club speed can fit very different shafts."
          />
          <ArticleSection
            title="When mechanics matter more than flex"
            body="If sequencing breaks down before impact, changing flex may move symptoms without fixing the source. Equipment can improve consistency around your current motion, but large transition inefficiencies are mechanical constraints. Fit and technique should be solved in parallel, not treated as substitutes."
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
