import { ClinicRangeTest } from "@/lib/clinic/types";

function TestVisualAid({ test }: { test: ClinicRangeTest }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500">Visual aid — {test.visualAid.title}</p>
      <div className="mt-3 space-y-2">
        {test.visualAid.lanes.map((lane, idx) => (
          <div key={`${test.id}-row-${lane}`} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{lane}</p>
            <p className="mt-1 font-mono text-xs text-slate-700">{test.visualAid.markers[idx]}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-600">{test.visualAid.hint}</p>
    </div>
  );
}

export function RangePlan({ tests }: { tests: ClinicRangeTest[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">Range plan (max 3 tests)</h3>
      <div className="mt-4 space-y-4">
        {tests.map((test, idx) => (
          <article key={test.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Test {idx + 1}: {test.title}
            </p>
            <ol className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <span className="font-medium text-slate-900">1) What to do:</span> {test.whatToDo}
              </li>
              <li>
                <span className="font-medium text-slate-900">2) If this is the cause:</span> {test.expectedIfCause}
              </li>
              <li>
                <span className="font-medium text-slate-900">3) If nothing changes:</span> {test.ifNoChange}
              </li>
            </ol>
            <TestVisualAid test={test} />
          </article>
        ))}
      </div>
    </section>
  );
}
