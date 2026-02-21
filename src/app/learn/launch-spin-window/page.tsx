import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";

export const metadata: Metadata = {
  title: "Launch and Spin Window for Repeatable Flight",
  description:
    "Build a repeatable launch-spin corridor by understanding strike location, dynamic loft, and why peak numbers can mislead.",
  alternates: { canonical: "/learn/launch-spin-window" },
};

export default function LaunchSpinWindowPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <HomeLinkPill />

        <a href="/learn" className="mt-4 inline-block text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Learn
        </a>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Launch and Spin: Build a Window You Can Repeat
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            One perfect launch monitor shot does not define a fit. Better fitting builds a repeatable launch-spin window
            that absorbs strike and tempo variability. The target is playable consistency, not isolated peak values.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Launch-spin window chart</h2>
          <svg viewBox="0 0 640 300" className="mt-4 w-full h-auto" role="img" aria-label="Launch spin corridor with sample shots">
            <line x1="70" y1="250" x2="580" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="70" y1="250" x2="70" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <text x="520" y="278" fill="#64748b" fontSize="13">
              Launch angle
            </text>
            <text x="16" y="34" fill="#64748b" fontSize="13">
              Spin rate
            </text>
            <rect x="220" y="110" width="200" height="95" fill="#e2e8f0" opacity="0.65" />
            <text x="250" y="100" fill="#334155" fontSize="13">
              Repeatable corridor
            </text>
            <circle cx="250" cy="150" r="6" fill="#0f172a" />
            <circle cx="285" cy="140" r="6" fill="#0f172a" />
            <circle cx="350" cy="180" r="6" fill="#0f172a" />
            <circle cx="390" cy="135" r="6" fill="#0f172a" />
            <circle cx="420" cy="200" r="6" fill="#475569" />
            <circle cx="470" cy="95" r="6" fill="#475569" />
          </svg>
        </section>

        <section className="mt-8 space-y-6 max-w-3xl">
          <ArticleSection
            title="Peak number vs repeatable window"
            body="A single optimized shot can be useful for capability, but on-course scoring depends on distribution. Fit decisions should center on the range where most impacts land, not the best outlier. That distribution mindset prevents chasing fragile settings."
          />
          <ArticleSection
            title="Low strike vs high strike spin effects"
            body="Strike location changes effective loft and gear-effect behavior, which shifts spin significantly. Low-face strikes generally raise spin while high-face strikes often reduce it in driver contexts. Without strike context, spin readings are easy to misinterpret."
          />
          <ArticleSection
            title="Dynamic loft interaction"
            body="Dynamic loft is the delivered loft at impact after shaft lean, release timing, and handle position are combined. Spin emerges from spin loft, the gap between dynamic loft and angle of attack. That means launch and spin must be interpreted together, not as isolated metrics."
          />
          <ArticleSection
            title="Why chasing spin numbers alone fails"
            body="Trying to force a target spin number can push players into unstable launch conditions or inconsistent strike patterns. Better outcomes come from balancing launch, spin, and dispersion in one repeatable corridor. If your window is stable, distance and control usually improve together."
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
