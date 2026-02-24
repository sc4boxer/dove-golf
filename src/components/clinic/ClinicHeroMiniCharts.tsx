export function DriverSliceMiniChart() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Driver slice ball flight mini chart">
      <line x1="28" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1="112" y1="24" x2="112" y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x="122" y="24" className="fill-slate-500 text-[8px]">target line</text>
      <circle cx="122" cy="108" r="5" fill="rgb(15 23 42)" />
      <text x="130" y="111" className="fill-slate-500 text-[9px]">start</text>
      <path d="M 122 108 C 130 84, 144 62, 168 38" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <text x="172" y="36" className="fill-slate-600 text-[8px]">slice</text>
    </svg>
  );
}

export function PullHookMiniChart() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Pull hook ball flight mini chart">
      <line x1="28" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1="112" y1="24" x2="112" y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x="122" y="24" className="fill-slate-500 text-[8px]">target line</text>
      <circle cx="96" cy="108" r="5" fill="rgb(15 23 42)" />
      <text x="48" y="110" className="fill-slate-500 text-[8px]">left start</text>
      <path d="M 96 108 C 88 88, 78 64, 56 38" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <text x="28" y="36" className="fill-slate-600 text-[8px]">hook</text>
    </svg>
  );
}

export function ThinIronsMiniChart() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Thin irons mini chart">
      <line x1="24" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1="104" y1="30" x2="104" y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="106" cy="111" r="5" fill="rgb(15 23 42)" />
      <path d="M 106 111 C 118 98, 132 88, 150 78" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="116" x2="160" y2="116" stroke="rgb(239 68 68)" strokeWidth="2" strokeDasharray="4 3" />
      <text x="121" y="25" className="fill-slate-500 text-[8px]">target</text>
      <text x="152" y="77" className="fill-slate-600 text-[8px]">thin</text>
      <text x="82" y="126" className="fill-rose-500 text-[8px]">low point</text>
    </svg>
  );
}

export function FatIronsMiniChart() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Fat irons mini chart">
      <line x1="24" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <circle cx="120" cy="110" r="5" fill="rgb(15 23 42)" />
      <path d="M 74 116 C 88 110, 104 106, 120 110" fill="none" stroke="rgb(239 68 68)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 120 110 C 136 96, 152 76, 166 52" fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <line x1="112" y1="28" x2="112" y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x="24" y="113" className="fill-rose-500 text-[8px]">ground first</text>
      <text x="170" y="49" className="fill-slate-600 text-[8px]">heavy</text>
    </svg>
  );
}

export function HighSpinBalloonMiniChart() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="High spin balloon mini chart">
      <line x1="24" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1="112" y1="24" x2="112" y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="108" cy="110" r="5" fill="rgb(15 23 42)" />
      <path d="M 108 110 C 114 74, 126 44, 156 34" fill="none" stroke="rgb(239 68 68)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 108 110 C 118 94, 132 80, 146 68" fill="none" stroke="rgb(15 23 42)" strokeWidth="3" strokeDasharray="4 3" />
      <text x="160" y="33" className="fill-rose-500 text-[8px]">balloon</text>
      <text x="148" y="67" className="fill-slate-600 text-[8px]">flighted</text>
    </svg>
  );
}
