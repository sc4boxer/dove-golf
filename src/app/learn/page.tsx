import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Technical golf fitting articles on ball flight, shaft dynamics, and repeatable launch conditions.",
  alternates: { canonical: "/learn" },
};

type ArticleCard = {
  title: string;
  href: string;
  summary: string;
};

const physicsFundamentals: ArticleCard[] = [
  {
    title: "Start Line vs Curve",
    href: "/learn/start-line-vs-curve",
    summary:
      "Separate face angle influence from face-to-path influence so directional misses can be diagnosed correctly.",
  },
  {
    title: "Tempo vs Flex",
    href: "/learn/tempo-vs-flex",
    summary:
      "Map transition tempo to bend profile timing rather than relying on non-standard flex labels.",
  },
  {
    title: "Shaft Weight",
    href: "/learn/shaft-weight-physics",
    summary:
      "Understand why total system mass often improves timing repeatability before stiffness changes do.",
  },
  {
    title: "Launch and Spin",
    href: "/learn/launch-spin-window",
    summary:
      "Build a playable launch-spin corridor based on strike and delivery variability instead of chasing single numbers.",
  },
];

const commonQuestions: ArticleCard[] = [
  {
    title: "Golf fitting FAQ",
    href: "/faq",
    summary:
      "Technical answers to high-intent fitting questions, with clear boundaries between mechanical and equipment effects.",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">Learn</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Technical fitting education</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Engineering-first articles on ball flight, shaft dynamics, and fitting decisions that can be validated on
            the range. The focus is cause and effect, not product hype.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Physics Fundamentals</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {physicsFundamentals.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
              >
                <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.summary}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Common Questions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {commonQuestions.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
              >
                <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.summary}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
