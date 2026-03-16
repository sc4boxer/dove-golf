import type { Curve, StartLine } from "@/lib/learn/ballFlightPatterns";
import { getShotPathGeometry } from "@/lib/visual/shotShapeSemantics";

export function BallFlightLibraryViz({ startLine, curve }: { startLine: StartLine; curve: Curve }) {
  const width = 700;
  const height = 340;
  const targetX = width * 0.5;
  const targetMarkerY = 30;
  const geometry = getShotPathGeometry({ width, height, shape: curve, startSide: startLine });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Ball flight visualization">
        <line x1="40" y1={height * 0.78} x2="660" y2={height * 0.78} stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1={targetX} y1="40" x2={targetX} y2={height * 0.78} stroke="rgb(226 232 240)" strokeDasharray="6 6" strokeWidth="2" />
        <text x="329" y="16" className="fill-slate-500 text-[12px]">Target</text>
        <text x="328" y="323" className="fill-slate-500 text-[12px]">Player strike</text>

        <path
          key={`${startLine}-${curve}`}
          d={`M ${geometry.startX} ${geometry.startY} C ${geometry.c1x} ${geometry.c1y}, ${geometry.c2x} ${geometry.c2y}, ${geometry.endX} ${geometry.endY}`}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="5"
          strokeLinecap="round"
          className="[stroke-dasharray:1000] [stroke-dashoffset:1000] animate-[dash_1.1s_ease-out_forwards]"
        />

        <circle cx={geometry.endX} cy={geometry.endY} r="7" fill="rgb(15 23 42)" />
        <circle cx={targetX} cy={targetMarkerY} r="4" fill="rgb(148 163 184)" />
        <circle cx={geometry.startX} cy={geometry.startY} r="5" fill="rgb(100 116 139)" />
      </svg>
    </div>
  );
}
