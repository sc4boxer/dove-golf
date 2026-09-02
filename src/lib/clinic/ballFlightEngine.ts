import {
  BallFlightPattern,
  CurveDirection,
  CurveSeverity,
  NINE_BALL_FLIGHT_PATTERNS,
  StartDirection,
} from "@/lib/clinic/ballFlightPatterns";

export type BallFlightSelection = {
  startDirection: StartDirection;
  curveDirection: CurveDirection;
  curveSeverity: CurveSeverity;
};

const severityWeight: Record<CurveSeverity, number> = {
  small: 1,
  medium: 2,
  large: 3,
};

export function resolvePattern(selection: BallFlightSelection): BallFlightPattern | null {
  const exact = NINE_BALL_FLIGHT_PATTERNS.find(
    (pattern) =>
      pattern.startDirection === selection.startDirection &&
      pattern.curveDirection === selection.curveDirection &&
      pattern.curveSeverity === selection.curveSeverity
  );

  if (exact) return exact;

  const sameStartAndCurve = NINE_BALL_FLIGHT_PATTERNS.filter(
    (pattern) =>
      pattern.startDirection === selection.startDirection &&
      pattern.curveDirection === selection.curveDirection
  );

  if (!sameStartAndCurve.length) return null;

  return sameStartAndCurve.sort(
    (a, b) =>
      Math.abs(severityWeight[a.curveSeverity] - severityWeight[selection.curveSeverity]) -
      Math.abs(severityWeight[b.curveSeverity] - severityWeight[selection.curveSeverity])
  )[0];
}

export function getPatternsBySymptom(curveDirection: CurveDirection): BallFlightPattern[] {
  return NINE_BALL_FLIGHT_PATTERNS.filter((pattern) => pattern.curveDirection === curveDirection);
}
