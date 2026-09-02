import type { BallFlightChartShape } from "./ballFlightChartPaths.ts";
import {
  getBallFlightShapeFromObservation,
  type ObservedCurveDirection,
} from "./ballFlightObservationShape.ts";

export type EquipmentStartLine = "left" | "center" | "right" | "unsure";
export type EquipmentCurve = "draw" | "straight" | "fade" | "unsure";

const EQUIPMENT_CURVE_TO_OBSERVED: Record<
  Exclude<EquipmentCurve, "unsure">,
  ObservedCurveDirection
> = {
  draw: "left",
  straight: "straight",
  fade: "right",
};

export const EQUIPMENT_BALL_FLIGHT_SHAPES: Record<
  Exclude<EquipmentStartLine, "unsure">,
  Record<Exclude<EquipmentCurve, "unsure">, BallFlightChartShape>
> = {
  left: {
    draw: getBallFlightShapeFromObservation("left", "left"),
    straight: getBallFlightShapeFromObservation("left", "straight"),
    fade: getBallFlightShapeFromObservation("left", "right"),
  },
  center: {
    draw: getBallFlightShapeFromObservation("center", "left"),
    straight: getBallFlightShapeFromObservation("center", "straight"),
    fade: getBallFlightShapeFromObservation("center", "right"),
  },
  right: {
    draw: getBallFlightShapeFromObservation("right", "left"),
    straight: getBallFlightShapeFromObservation("right", "straight"),
    fade: getBallFlightShapeFromObservation("right", "right"),
  },
};

export const EQUIPMENT_BALL_FLIGHT_LABELS: Record<BallFlightChartShape, string> = {
  "pull-draw": "Pull Draw",
  pull: "Pull Straight",
  "pull-fade": "Pull Fade",
  draw: "Straight Draw",
  straight: "Straight",
  fade: "Straight Fade",
  "push-draw": "Push Draw",
  push: "Push Straight",
  "push-fade": "Push Fade",
};

export function getEquipmentBallFlightShape(
  start: EquipmentStartLine,
  curve: EquipmentCurve,
): BallFlightChartShape | null {
  if (start === "unsure" || curve === "unsure") return null;
  return getBallFlightShapeFromObservation(start, EQUIPMENT_CURVE_TO_OBSERVED[curve]);
}

export function getEquipmentBallFlightLabel(
  start: EquipmentStartLine,
  curve: EquipmentCurve,
): string | null {
  const shape = getEquipmentBallFlightShape(start, curve);
  return shape ? EQUIPMENT_BALL_FLIGHT_LABELS[shape] : null;
}
