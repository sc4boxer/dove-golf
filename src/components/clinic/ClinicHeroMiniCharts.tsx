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
