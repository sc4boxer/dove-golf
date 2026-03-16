import { ShotShapeName, getShotPathGeometry } from "@/lib/visual/shotShapeSemantics";

type ShotShapeMiniPathProps = {
  targetX?: number;
  shape: ShotShapeName;
};

export function ShotShapeMiniPath({ targetX = 112, shape }: ShotShapeMiniPathProps) {
  const geometry = getShotPathGeometry({ width: 220, height: 140, shape });

  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label={`${shape} ball flight mini chart`}>
      <line x1="28" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1={targetX} y1="24" x2={targetX} y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x={targetX + 10} y="24" className="fill-slate-500 text-[8px]">target line</text>

      <circle cx={geometry.startX} cy={108} r="5" fill="rgb(15 23 42)" />
      <text x={geometry.startX < targetX ? geometry.startX - 44 : geometry.startX + 6} y="111" className="fill-slate-500 text-[9px]">start {shape === "slice" || shape === "fade" ? "left" : shape === "hook" || shape === "draw" ? "right" : "center"}</text>

      <path
        d={`M ${geometry.startX} 108 C ${geometry.c1x} 86, ${geometry.c2x} 62, ${geometry.endX} 38`}
        fill="none"
        stroke="rgb(15 23 42)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x={geometry.endX < targetX ? geometry.endX - 30 : geometry.endX + 6} y="36" className="fill-slate-600 text-[8px]">{shape}</text>
    </svg>
  );
}
