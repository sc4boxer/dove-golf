export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Home
          </a>

          <a
            href="/about"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            About
          </a>
        </div>

        {/* Header */}
        <div className="mt-10 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight">
            About Dove Golf
          </h1>

          <p className="mt-6 text-lg text-slate-700 leading-relaxed">
            Dove Golf builds a brand-neutral, science-forward fitting engine for amateur golfers.
          </p>

          <p className="mt-4 text-lg text-slate-700 leading-relaxed">
            The goal is simple: reduce guesswork, explain the “why,” and give you a blueprint you can test.
          </p>

          {/* Pill Tags */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700">
              Brand-neutral
            </span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700">
              Deterministic outputs
            </span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700">
              Explainable logic
            </span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700">
              Built for amateurs
            </span>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">

          {/* LEFT CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-lg font-semibold">
              Want the technical details?
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              The Method page explains what we measure, how answers become signals,
              and how the scoring maps into a testable blueprint.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/method"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                View Method →
              </a>

              <a
                href="/diagnostic"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
              >
                Start Diagnostic →
              </a>
            </div>

            {/* Principle Box */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">
                Principle
              </div>
              <p className="mt-2 text-sm text-slate-600">
                If you can’t test a recommendation with real shots, it’s not useful.
              </p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-lg font-semibold">
              Feedback, improvements, or issues
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              If something feels off (or you have a feature request), email me.
              The fastest way to improve this tool is direct feedback from golfers.
            </p>

            {/* Matched Email Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:sc4boxer@gmail.com?subject=Dove%20Golf%20Feedback"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                Email Joshua →
              </a>

              <a
                href="mailto:sc4boxer@gmail.com"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
              >
                sc4boxer@gmail.com
              </a>
            </div>

            {/* Helpful Context */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">
                Helpful context
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Your handicap range</li>
                <li>Your typical miss (driver vs irons)</li>
                <li>What you’re currently playing (shaft weight/flex if known)</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-slate-100 pt-8 text-center">
          <p className="text-xs tracking-wide text-slate-400">
            © {new Date().getFullYear()} · Dove Golf
          </p>
        </div>

      </div>
    </main>
  );
}
