import type { Curve, StartLine } from "@/lib/learn/ballFlightPatterns";

function getEndX(startLine: StartLine) {
  if (startLine === "left") return 520;
  if (startLine === "right") return 180;
  return 350;
}

function getControlShift(curve: Curve) {
  if (curve === "draw") return 80;
  if (curve === "fade") return -80;
  return 0;
}

export function BallFlightLibraryViz({ startLine, curve }: { startLine: StartLine; curve: Curve }) {
  const startX = 350;
  const startY = 300;
  const endX = getEndX(startLine);
  const endY = 50;
  const controlY = 130;
  const shift = getControlShift(curve);
  const c1x = startX + (endX - startX) * 0.35 + shift;
  const c2x = startX + (endX - startX) * 0.75 + shift;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <svg viewBox="0 0 700 340" className="h-auto w-full" role="img" aria-label="Ball flight visualization">
        <line x1="40" y1="300" x2="660" y2="300" stroke="rgb(203 213 225)" strokeWidth="2" />
        <line x1="350" y1="40" x2="350" y2="300" stroke="rgb(226 232 240)" strokeDasharray="6 6" strokeWidth="2" />
        <text x="344" y="323" className="fill-slate-500 text-[12px]">Target</text>

        <path
          key={`${startLine}-${curve}`}
          d={`M ${startX} ${startY} C ${c1x} ${controlY}, ${c2x} ${controlY - 20}, ${endX} ${endY}`}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="5"
          strokeLinecap="round"
          className="[stroke-dasharray:1000] [stroke-dashoffset:1000] animate-[dash_1.1s_ease-out_forwards]"
        />

        <circle cx={endX} cy={endY} r="7" fill="rgb(15 23 42)" />
        <circle cx={startX} cy={startY} r="5" fill="rgb(100 116 139)" />
      </svg>
    </div>
  );
}
