import { RangeTest2ABVisual } from "@/components/clinic/RangeTest2ABVisual";
import { RangeTest3GateVisual } from "@/components/clinic/RangeTest3GateVisual";
import { ClinicRangeTest } from "@/lib/clinic/types";
import { Ball, FlightArc, Ground, RangeMapFrame, RANGE_MAP, TargetLine, TargetMarker } from "@/components/clinic/visuals/RangeMapPrimitives";

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
      <RangeMapFrame label="Thin irons low-point line drill">
        <Ground />
        <Ball x={144} />
        <TargetLine />
        <TargetMarker />
        <line x1="136" y1={RANGE_MAP.groundY} x2="136" y2="102" stroke="rgb(239 68 68)" strokeWidth="3" />
        <line x1="152" y1={RANGE_MAP.groundY} x2="152" y2="104" stroke="rgb(16 185 129)" strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  if (testId === "thin-posture-constraint") {
    return (
      <RangeMapFrame label="Thin irons posture constraint">
        <Ground />
        <Ball />
        <line x1="202" y1="50" x2="202" y2={RANGE_MAP.groundY} stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="190" y1="78" x2="178" y2="126" stroke="rgb(239 68 68)" strokeWidth="4" strokeLinecap="round" />
        <line x1="172" y1="76" x2="164" y2="126" stroke="rgb(16 185 129)" strokeWidth="4" strokeLinecap="round" />
      </RangeMapFrame>
    );
  }

  if (testId === "thin-ball-handle-ab") {
    return (
      <RangeMapFrame label="Thin irons ball position A/B">
        <Ground />
        <Ball x={144} />
        <Ball x={132} />
        <line x1="140" y1={RANGE_MAP.groundY} x2="140" y2="106" stroke="rgb(239 68 68)" strokeWidth="2.5" />
        <line x1="152" y1={RANGE_MAP.groundY} x2="152" y2="106" stroke="rgb(16 185 129)" strokeWidth="2.5" />
      </RangeMapFrame>
    );
  }

  if (testId === "fat-towel-behind") {
    return (
      <RangeMapFrame label="Fat irons towel drill">
        <Ground />
        <rect x="110" y="132" width="22" height="9" rx="2" fill="rgb(239 68 68 / 0.7)" />
        <Ball />
        <FlightArc d={`M 108 ${RANGE_MAP.ballY + 2} C 146 130, 186 102, 226 70`} tone="good" />
        <FlightArc d={`M 108 ${RANGE_MAP.ballY + 2} C 114 138, 124 136, 140 124`} tone="bad" dashed />
      </RangeMapFrame>
    );
  }

  if (testId === "fat-pressure-forward") {
    return (
      <RangeMapFrame label="Fat irons pressure-forward drill">
        <Ground />
        <Ball />
        <line x1="124" y1="86" x2="200" y2="86" stroke="rgb(226 232 240)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="190" cy="86" r="8" fill="rgb(15 23 42)" />
        <line x1="154" y1={RANGE_MAP.groundY} x2="154" y2="104" stroke="rgb(16 185 129)" strokeWidth="3" />
      </RangeMapFrame>
    );
  }

  if (testId === "fat-divot-start") {
    return (
      <RangeMapFrame label="Fat irons divot start checkpoint">
        <Ground />
        <Ball />
        <rect x="114" y="138" width="20" height="4" rx="2" fill="rgb(239 68 68 / 0.75)" />
        <rect x="148" y="138" width="24" height="4" rx="2" fill="rgb(16 185 129 / 0.75)" />
      </RangeMapFrame>
    );
  }

  if (testId === "balloon-flighted-punch") {
    return (
      <RangeMapFrame label="High spin balloon flighted punch">
        <Ground />
        <Ball />
        <TargetLine />
        <TargetMarker />
        <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 156 68, 198 30, 234 64`} tone="bad" />
        <FlightArc d={`M ${RANGE_MAP.ballX} ${RANGE_MAP.ballY} C 160 116, 194 88, 232 72`} dashed />
      </RangeMapFrame>
    );
  }

  if (testId === "balloon-contact-check") {
    return (
      <RangeMapFrame label="High spin balloon contact check">
        <rect x="102" y="50" width="110" height="88" rx="10" fill="white" stroke="rgb(148 163 184)" strokeWidth="2.5" />
        <line x1="157" y1="54" x2="157" y2="134" stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1="106" y1="94" x2="208" y2="94" stroke="rgb(226 232 240)" strokeWidth="2" />
        <circle cx="157" cy="112" r="6" fill="rgb(239 68 68 / 0.75)" />
        <circle cx="157" cy="94" r="5" fill="rgb(15 23 42 / 0.45)" />
      </RangeMapFrame>
    );
  }

  if (testId === "balloon-handle-forward-ab") {
    return (
      <RangeMapFrame label="High spin balloon handle-forward rehearsal">
        <Ground />
        <Ball />
        <line x1="120" y1="126" x2="170" y2="90" stroke="rgb(239 68 68 / 0.9)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="144" y1="126" x2="176" y2="94" stroke="rgb(16 185 129 / 0.9)" strokeWidth="3.5" strokeLinecap="round" />
      </RangeMapFrame>
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
