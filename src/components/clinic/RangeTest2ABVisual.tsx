export function RangeTest2ABVisual() {
  return (
    <svg viewBox="0 0 360 190" className="h-auto w-full" role="img" aria-label="A/B delivery and equipment lever comparison">
      <defs>
        <marker id="ab-arrow" markerWidth="4" markerHeight="4" refX="3.4" refY="2" orient="auto">
          <path d="M 0 0 L 4 2 L 0 4 z" fill="rgb(15 23 42)" />
        </marker>
      </defs>

      <rect x="16" y="22" width="154" height="146" rx="12" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
      <rect x="190" y="22" width="154" height="146" rx="12" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />

      <text x="24" y="38" className="fill-slate-700 text-[10px] font-semibold">A: current delivery</text>
      <text x="198" y="38" className="fill-slate-700 text-[10px] font-semibold">B: neutralized delivery</text>

      <line x1="96" y1="44" x2="96" y2="136" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 4" />
      <line x1="270" y1="44" x2="270" y2="136" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 4" />
      <text x="100" y="46" className="fill-slate-500 text-[9px]">target line</text>
      <text x="274" y="46" className="fill-slate-500 text-[9px]">target line</text>

      <circle cx="86" cy="132" r="5" fill="white" stroke="rgb(15 23 42)" strokeWidth="2" />
      <circle cx="260" cy="132" r="5" fill="white" stroke="rgb(15 23 42)" strokeWidth="2" />

      <path d="M 86 132 C 100 116, 108 92, 90 70" fill="none" stroke="rgb(15 23 42)" strokeWidth="2.5" markerEnd="url(#ab-arrow)" />
      <path d="M 260 132 C 270 114, 274 92, 270 70" fill="none" stroke="rgb(15 23 42)" strokeWidth="2.5" markerEnd="url(#ab-arrow)" />
      <text x="26" y="96" className="fill-slate-500 text-[9px]">club path</text>
      <text x="200" y="96" className="fill-slate-500 text-[9px]">club path</text>

      <line x1="103" y1="72" x2="118" y2="66" stroke="rgb(71 85 105 / 0.9)" strokeWidth="3" strokeLinecap="round" />
      <line x1="278" y1="72" x2="290" y2="72" stroke="rgb(34 197 94)" strokeWidth="3" strokeLinecap="round" />
      <text x="120" y="67" className="fill-slate-600 text-[9px]">face closed</text>
      <text x="292" y="74" className="fill-emerald-600 text-[9px]">face neutral</text>

      <line x1="126" y1="128" x2="138" y2="112" stroke="rgb(71 85 105 / 0.75)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="300" y1="128" x2="312" y2="120" stroke="rgb(34 197 94 / 0.85)" strokeWidth="2.5" strokeLinecap="round" />
      <text x="132" y="132" className="fill-slate-600 text-[9px]">toe-up lie</text>
      <text x="304" y="132" className="fill-emerald-600 text-[9px]">flatter lie</text>
    </svg>
  );
}
