import { CurveDirection, CurveSeverity, StartDirection } from "@/lib/clinic/ballFlightPatterns";

type BallFlightVizProps = {
  startDirection: StartDirection;
  curveDirection: CurveDirection;
  curveSeverity: CurveSeverity;
  className?: string;
};

const START_X: Record<StartDirection, number> = {
  left: 38,
  center: 50,
  right: 62,
};

const CURVE_SHIFT: Record<CurveSeverity, number> = {
  small: 8,
  medium: 14,
  large: 20,
};

export function BallFlightViz({ startDirection, curveDirection, curveSeverity, className }: BallFlightVizProps) {
  const origin = { x: 50, y: 90 };
  const midY = 52;
  const startX = START_X[startDirection];
  const shift = curveDirection === "none" ? 0 : CURVE_SHIFT[curveSeverity] * (curveDirection === "right" ? 1 : -1);
  const endX = startX + shift;

  const d = `M ${origin.x} ${origin.y} Q ${startX} ${midY}, ${endX} 14`;

  return (
    <svg viewBox="0 0 100 100" className={className ?? "h-24 w-full"} aria-hidden>
      <line x1="50" y1="90" x2="50" y2="10" stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="3 3" />
      <circle cx="50" cy="90" r="2.6" fill="#0f172a" />
      <path d={d} fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={endX} cy={14} r="2.2" fill="#0f172a" />
    </svg>
  );
}
