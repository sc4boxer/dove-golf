export function RangeTest3GateVisual() {
  return (
    <svg viewBox="0 0 360 190" className="h-auto w-full" role="img" aria-label="Start-line gate visual with good and miss-left examples">
      <defs>
        <marker id="gate-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="rgb(15 23 42)" />
        </marker>
      </defs>
      <line x1="38" y1="154" x2="322" y2="154" stroke="rgb(203 213 225)" strokeWidth="2" />

      <circle cx="180" cy="146" r="6" fill="white" stroke="rgb(15 23 42)" strokeWidth="2" />
      <circle cx="154" cy="164" r="8" fill="rgb(15 23 42 / 0.9)" />
      <line x1="154" y1="156" x2="154" y2="138" stroke="rgb(15 23 42 / 0.9)" strokeWidth="3" strokeLinecap="round" />
      <text x="166" y="170" className="fill-slate-500 text-[10px]">golfer</text>

      <line x1="180" y1="26" x2="180" y2="152" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 4" />
      <text x="186" y="28" className="fill-slate-500 text-[10px]">target line</text>

      <rect x="166" y="88" width="7" height="24" rx="3" fill="rgb(71 85 105 / 0.8)" />
      <rect x="187" y="88" width="7" height="24" rx="3" fill="rgb(71 85 105 / 0.8)" />
      <text x="202" y="102" className="fill-slate-600 text-[10px]">Gate at ~8 ft</text>

      <path d="M 180 146 C 180 122, 180 98, 180 58" fill="none" stroke="rgb(15 23 42)" strokeWidth="3.5" markerEnd="url(#gate-arrow)" />
      <path d="M 180 146 C 170 124, 154 102, 132 72" fill="none" stroke="rgb(239 68 68 / 0.45)" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#gate-arrow)" />

      <text x="186" y="62" className="fill-slate-700 text-[10px]">Start line (through gate)</text>
      <text x="76" y="74" className="fill-rose-600 text-[10px]">miss-left reference</text>
    </svg>
  );
}
