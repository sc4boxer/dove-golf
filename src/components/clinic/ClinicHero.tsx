import Link from "next/link";

export function ClinicHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <p className="text-xs font-medium tracking-wide text-slate-500">Dove Golf Modules</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">DoveClinic™</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Debug your miss in minutes. Deterministic, physics-aware guidance.
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Not a swing coach. A structured diagnostic you can test at the range.
      </p>
      <Link
        href="/clinic/driver-slice"
        className="mt-6 inline-flex rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Start: Driver Slice
      </Link>
    </section>
  );
}
