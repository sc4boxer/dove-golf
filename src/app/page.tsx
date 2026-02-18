export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-sm font-medium text-slate-500">
          Golf Equipment Diagnostic
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight leading-tight">
          Stop guessing.
          <br />
          Fit your gear to your swing.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          A fast, unbiased diagnostic that recommends shaft and head traits
          based on how you actually swing — not influencer hype.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/diagnostic"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-white font-medium shadow-sm hover:bg-slate-800 transition"
          >
            Start Free Diagnostic
          </a>

          <a
            href="/method"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-8 py-4 font-medium text-slate-900 hover:bg-slate-50 transition"
          >
            How it works
          </a>
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          Built for 8–22 handicap golfers who are tired of “Best Driver 2026”
          lists and want clear, data-driven explanations behind equipment decisions.
        </div>
      </div>
    </main>
  );
}