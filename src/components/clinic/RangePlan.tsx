import { ClinicRangeTest } from "@/lib/clinic/types";

function TestVisualAid({ test }: { test: ClinicRangeTest }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500">Visual aid — {test.visualAid.title}</p>
      <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-slate-600">
        {test.visualAid.lanes.map((lane, idx) => (
          <div key={`${test.id}-row-${lane}`} className="contents">
            <p className="font-medium text-slate-700">{lane}</p>
            <pre className="font-mono text-[11px] text-slate-600">{test.visualAid.markers[idx]}</pre>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">{test.visualAid.hint}</p>
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
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium text-slate-900">What to do:</span> {test.whatToDo}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium text-slate-900">What you should see if this is the cause:</span>{" "}
              {test.expectedIfCause}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium text-slate-900">What it means if nothing changes:</span>{" "}
              {test.ifNoChange}
            </p>
            <TestVisualAid test={test} />
          </article>
        ))}
      </div>
    </section>
  );
}
