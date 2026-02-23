import { RangeTest2ABVisual } from "@/components/clinic/RangeTest2ABVisual";
import { RangeTest3GateVisual } from "@/components/clinic/RangeTest3GateVisual";
import { ClinicRangeTest } from "@/lib/clinic/types";

function VisualByTest({ testId }: { testId: string }) {
  if (testId === "face-gate") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Face gate setup preview">
        <line x1="48" y1="132" x2="272" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="160" y1="132" x2="160" y2="36" stroke="rgb(148 163 184)" strokeDasharray="5 5" strokeWidth="2" />
        <rect x="136" y="88" width="8" height="28" rx="3" fill="rgb(15 23 42 / 0.6)" />
        <rect x="176" y="88" width="8" height="28" rx="3" fill="rgb(15 23 42 / 0.6)" />
        <circle cx="160" cy="124" r="6" fill="rgb(15 23 42)" />
        <path d="M 160 124 C 160 96, 160 64, 160 42" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
        <text x="126" y="84" className="fill-slate-600 text-[10px]">tee gate</text>
      </svg>
    );
  }

  if (testId === "path-stick") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Path stick setup preview">
        <defs>
          <marker id="swing-path-arrow" markerWidth="4" markerHeight="4" refX="3.2" refY="2" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 4 2 L 0 4 z" fill="rgb(15 23 42)" />
          </marker>
        </defs>
        <line x1="44" y1="132" x2="276" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="198" y1="34" x2="198" y2="132" stroke="rgb(148 163 184)" strokeDasharray="5 4" strokeWidth="2" />
        <line x1="196" y1="128" x2="236" y2="44" stroke="rgb(15 23 42 / 0.7)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="86" cy="124" r="6" fill="rgb(15 23 42)" />
        <path
          d="M 86 124 C 116 112, 152 96, 190 48"
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#swing-path-arrow)"
        />
        <circle cx="198" cy="36" r="7" fill="rgb(234 179 8)" />
        <text x="212" y="36" className="fill-slate-600 text-[10px]">alignment stick</text>
        <text x="184" y="24" className="fill-slate-500 text-[10px]">target</text>
        <text x="92" y="148" className="fill-slate-500 text-[10px]">swing inside the stick</text>
      </svg>
    );
  }



  if (testId === "start-line-gate") {
    return <RangeTest3GateVisual />;
  }

  if (testId === "strike-map") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Strike map preview">
        <rect x="96" y="34" width="128" height="92" rx="16" fill="white" stroke="rgb(148 163 184)" strokeWidth="3" />
        <line x1="160" y1="38" x2="160" y2="122" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="100" y1="80" x2="220" y2="80" stroke="rgb(226 232 240)" strokeWidth="2" />
        <circle cx="198" cy="82" r="6" fill="rgb(239 68 68 / 0.65)" />
        <circle cx="206" cy="72" r="6" fill="rgb(239 68 68 / 0.6)" />
        <circle cx="194" cy="92" r="6" fill="rgb(239 68 68 / 0.5)" />
        <circle cx="160" cy="82" r="6" fill="rgb(15 23 42 / 0.35)" />
        <text x="110" y="142" className="fill-slate-500 text-[10px]">toe cluster often = more hook gear effect</text>
      </svg>
    );
  }

  if (testId === "delivery-gear-check") {
    return <RangeTest2ABVisual />;
  }

  return (
    <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Impact spray pattern preview">
      <rect x="96" y="34" width="128" height="92" rx="16" fill="white" stroke="rgb(148 163 184)" strokeWidth="3" />
      <line x1="160" y1="38" x2="160" y2="122" stroke="rgb(226 232 240)" strokeWidth="2" />
      <line x1="100" y1="80" x2="220" y2="80" stroke="rgb(226 232 240)" strokeWidth="2" />
      <circle cx="124" cy="80" r="5" fill="rgb(15 23 42 / 0.5)" />
      <circle cx="132" cy="72" r="5" fill="rgb(15 23 42 / 0.6)" />
      <circle cx="142" cy="90" r="5" fill="rgb(15 23 42 / 0.45)" />
      <circle cx="154" cy="84" r="5" fill="rgb(15 23 42 / 0.35)" />
      <text x="103" y="142" className="fill-slate-500 text-[10px]">Heel cluster shifting toward center</text>
    </svg>
  );
}

function TestVisualAid({ test }: { test: ClinicRangeTest }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500">Visual aid — {test.visualAid.title}</p>
      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-2">
        <VisualByTest testId={test.id} />
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-700">
        {test.visualAid.lanes.map((lane, idx) => (
          <li key={`${test.id}-${lane}`}>
            <span className="font-semibold text-slate-900">{lane}:</span> {test.visualAid.markers[idx]}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-medium text-slate-700">Execution cue: {test.visualAid.hint}</p>
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
