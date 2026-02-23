import { ClinicRangeTest } from "@/lib/clinic/types";

function markerPosition(marker: string) {
  const normalized = marker.toLowerCase();
  if (normalized.includes("left") || normalized.includes("heel")) return "18%";
  if (normalized.includes("right") || normalized.includes("toe")) return "82%";
  return "50%";
}

function TestVisualAid({ test }: { test: ClinicRangeTest }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500">Visual aid — {test.visualAid.title}</p>
      <div className="mt-3 space-y-2">
        {test.visualAid.lanes.map((lane, idx) => (
          <div key={`${test.id}-row-${lane}`} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{lane}</p>
            <div className="mt-1 relative h-6 rounded-full border border-slate-200 bg-white">
              <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l border-dashed border-slate-200" />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-slate-800"
                style={{ left: markerPosition(test.visualAid.markers[idx]) }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-700">{test.visualAid.markers[idx]}</p>
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
