import { BALL_FLIGHT_SEMANTICS, getBallFlightPathGeometry, type ShotShape } from "@/lib/visual/ballFlightSemantics";
import { toSvgPath } from "@/lib/visual/shotShapePaths";

type ShotShapeMiniPathProps = {
  targetX?: number;
  shape: ShotShape;
};

export function ShotShapeMiniPath({ targetX = 112, shape }: ShotShapeMiniPathProps) {
  const geometry = getBallFlightPathGeometry({ width: 220, height: 140, shape });
  const semantics = BALL_FLIGHT_SEMANTICS[shape];

  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label={`${shape} ball flight mini chart`}>
      <line x1="28" y1="118" x2="196" y2="118" stroke="rgb(203 213 225)" strokeWidth="2" />
      <line x1={targetX} y1="24" x2={targetX} y2="118" stroke="rgb(148 163 184)" strokeWidth="2" strokeDasharray="5 5" />
      <text x={targetX + 10} y="24" className="fill-slate-500 text-[8px]">target line</text>

      <circle cx={geometry.startX} cy={geometry.startY} r="2.5" fill="rgb(30 41 59)" />

      <path
        d={toSvgPath(geometry)}
        fill="none"
        stroke="rgb(15 23 42)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x={geometry.endX < targetX ? geometry.endX - 30 : geometry.endX + 6} y="28" className="fill-slate-600 text-[8px]">{semantics.label}</text>
    </svg>
  );
}
