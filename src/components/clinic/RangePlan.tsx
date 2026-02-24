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


  if (testId === "thin-low-point-line") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Thin irons low-point line drill">
        <line x1="40" y1="132" x2="280" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="168" y1="132" x2="168" y2="40" stroke="rgb(148 163 184)" strokeDasharray="5 4" strokeWidth="2" />
        <line x1="152" y1="132" x2="152" y2="70" stroke="rgb(239 68 68)" strokeWidth="3" />
        <circle cx="168" cy="124" r="6" fill="rgb(15 23 42)" />
        <path d="M 120 130 C 144 116, 162 98, 186 66" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" />
        <text x="156" y="66" className="fill-rose-500 text-[10px]">low-point line</text>
      </svg>
    );
  }

  if (testId === "thin-posture-constraint") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Posture and hip-depth reference">
        <line x1="42" y1="132" x2="278" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <rect x="124" y="56" width="70" height="72" fill="rgb(241 245 249)" stroke="rgb(148 163 184)" />
        <circle cx="158" cy="72" r="11" fill="rgb(15 23 42)" />
        <line x1="202" y1="48" x2="202" y2="132" stroke="rgb(239 68 68)" strokeDasharray="4 3" strokeWidth="2" />
        <circle cx="166" cy="124" r="6" fill="rgb(15 23 42)" />
        <text x="208" y="46" className="fill-rose-500 text-[10px]">hip depth ref</text>
      </svg>
    );
  }

  if (testId === "thin-ball-handle-ab") {
    return <RangeTest2ABVisual />;
  }

  if (testId === "fat-towel-behind") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Towel behind ball drill">
        <line x1="40" y1="132" x2="280" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <rect x="132" y="120" width="24" height="8" rx="3" fill="rgb(239 68 68 / 0.65)" />
        <circle cx="170" cy="124" r="6" fill="rgb(15 23 42)" />
        <path d="M 120 128 C 142 110, 160 94, 188 62" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" />
        <text x="124" y="116" className="fill-rose-500 text-[10px]">towel</text>
      </svg>
    );
  }

  if (testId === "fat-pressure-forward") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Pressure forward checkpoint">
        <line x1="40" y1="132" x2="280" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <rect x="110" y="74" width="120" height="14" rx="7" fill="rgb(226 232 240)" />
        <circle cx="192" cy="81" r="10" fill="rgb(15 23 42)" />
        <circle cx="166" cy="124" r="6" fill="rgb(15 23 42)" />
        <text x="112" y="64" className="fill-slate-500 text-[10px]">trail</text><text x="214" y="64" className="fill-slate-500 text-[10px]">lead</text>
      </svg>
    );
  }

  if (testId === "fat-divot-start") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Divot-start checkpoint">
        <line x1="40" y1="132" x2="280" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="152" y1="132" x2="152" y2="74" stroke="rgb(148 163 184)" strokeDasharray="4 3" strokeWidth="2" />
        <circle cx="168" cy="124" r="6" fill="rgb(15 23 42)" />
        <rect x="178" y="126" width="28" height="5" fill="rgb(16 185 129 / 0.7)" />
        <text x="178" y="118" className="fill-emerald-600 text-[10px]">divot starts after ball</text>
      </svg>
    );
  }

  if (testId === "balloon-flighted-punch") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Balloon vs flighted arc">
        <line x1="38" y1="132" x2="282" y2="132" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="164" y1="26" x2="164" y2="132" stroke="rgb(148 163 184)" strokeDasharray="5 4" strokeWidth="2" />
        <circle cx="154" cy="124" r="6" fill="rgb(15 23 42)" />
        <path d="M 154 124 C 166 74, 196 44, 240 34" fill="none" stroke="rgb(239 68 68)" strokeWidth="4" />
        <path d="M 154 124 C 172 106, 198 88, 228 72" fill="none" stroke="rgb(15 23 42)" strokeWidth="3" strokeDasharray="4 3" />
      </svg>
    );
  }

  if (testId === "balloon-contact-check") {
    return (
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-label="Balloon contact check">
        <rect x="96" y="34" width="128" height="92" rx="16" fill="white" stroke="rgb(148 163 184)" strokeWidth="3" />
        <line x1="160" y1="38" x2="160" y2="122" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="100" y1="80" x2="220" y2="80" stroke="rgb(226 232 240)" strokeWidth="2" />
        <circle cx="160" cy="82" r="6" fill="rgb(15 23 42 / 0.55)" />
        <circle cx="160" cy="98" r="6" fill="rgb(239 68 68 / 0.6)" />
        <text x="108" y="142" className="fill-slate-500 text-[10px]">center-face cluster lowers spin volatility</text>
      </svg>
    );
  }

  if (testId === "balloon-handle-forward-ab") {
    return <RangeTest2ABVisual />;
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
