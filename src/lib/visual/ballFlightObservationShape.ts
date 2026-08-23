import type { BallFlightChartShape } from "./ballFlightChartPaths.ts";

export type ObservedStartLine = "left" | "center" | "right";
export type ObservedCurveDirection = "left" | "straight" | "right";

export const BALL_FLIGHT_SHAPE_BY_OBSERVATION: Record<
  ObservedStartLine,
  Record<ObservedCurveDirection, BallFlightChartShape>
> = {
  left: {
    left: "pull-draw",
    straight: "pull",
    right: "pull-fade",
  },
  center: {
    left: "draw",
    straight: "straight",
    right: "fade",
  },
  right: {
    left: "push-draw",
    straight: "push",
    right: "push-fade",
  },
};

export function getBallFlightShapeFromObservation(
  start: ObservedStartLine,
  curve: ObservedCurveDirection,
): BallFlightChartShape {
  return BALL_FLIGHT_SHAPE_BY_OBSERVATION[start][curve];
}
