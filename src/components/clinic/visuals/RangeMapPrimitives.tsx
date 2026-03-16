import { ReactNode } from "react";

export const RANGE_MAP = {
  width: 320,
  height: 180,
  groundY: 146,
  ballX: 132,
  ballY: 138,
  targetX: 236,
  targetY: 34,
};

export function RangeMapFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${RANGE_MAP.width} ${RANGE_MAP.height}`} className="h-auto w-full" role="img" aria-label={label}>
      <defs>
        <marker id="range-arrow" markerWidth="8" markerHeight="8" refX="6.4" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="rgb(15 23 42)" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function Ground() {
  return <line x1="36" y1={RANGE_MAP.groundY} x2="284" y2={RANGE_MAP.groundY} stroke="rgb(203 213 225)" strokeWidth="2.5" />;
}

export function Ball({ x = RANGE_MAP.ballX }: { x?: number }) {
  return <circle cx={x} cy={RANGE_MAP.ballY} r="6" fill="rgb(15 23 42)" />;
}

export function TargetLine() {
  return (
    <line
      x1={RANGE_MAP.targetX}
      y1={RANGE_MAP.groundY}
      x2={RANGE_MAP.targetX}
      y2={RANGE_MAP.targetY}
      stroke="rgb(148 163 184)"
      strokeWidth="2"
      strokeDasharray="5 5"
    />
  );
}

export function TargetMarker() {
  return <circle cx={RANGE_MAP.targetX} cy={RANGE_MAP.targetY} r="4.5" fill="rgb(15 23 42 / 0.5)" />;
}

export function FlightArc({ d, tone = "dark", dashed = false }: { d: string; tone?: "dark" | "bad" | "good"; dashed?: boolean }) {
  const stroke = tone === "bad" ? "rgb(239 68 68)" : tone === "good" ? "rgb(16 185 129)" : "rgb(15 23 42)";
  return <path d={d} fill="none" stroke={stroke} strokeWidth="3.5" strokeDasharray={dashed ? "5 4" : undefined} strokeLinecap="round" />;
}
