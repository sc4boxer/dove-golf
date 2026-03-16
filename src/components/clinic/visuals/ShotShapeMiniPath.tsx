type ShotShapeMiniPathProps = {
  targetX?: number;
  startX: number;
  endX: number;
  label: string;
  startLabel: string;
};

export function ShotShapeMiniPath({ targetX = 112, startX, endX, label, startLabel }: ShotShapeMiniPathProps) {
  const c1x = startX + (endX - startX) * 0.28;
  const c2x = startX + (endX - startX) * 0.72;

  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label={`${label} ball flight mini chart`}>
      <line x1="28" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1={targetX} y1="24" x2={targetX} y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x={targetX + 10} y="24" className="fill-slate-500 text-[8px]">target line</text>

      <circle cx={startX} cy="108" r="5" fill="rgb(15 23 42)" />
      <text x={startX < targetX ? startX - 44 : startX + 6} y="111" className="fill-slate-500 text-[9px]">{startLabel}</text>

      <path
        d={`M ${startX} 108 C ${c1x} 86, ${c2x} 62, ${endX} 38`}
        fill="none"
        stroke="rgb(15 23 42)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x={endX < targetX ? endX - 30 : endX + 6} y="36" className="fill-slate-600 text-[8px]">{label}</text>
    </svg>
  );
}
