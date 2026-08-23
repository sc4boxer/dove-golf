import type { BallFlightChartShape } from "./ballFlightChartPaths.ts";

export type EquipmentStartLine = "left" | "center" | "right" | "unsure";
export type EquipmentCurve = "draw" | "straight" | "fade" | "unsure";

export const EQUIPMENT_BALL_FLIGHT_SHAPES: Record<
  Exclude<EquipmentStartLine, "unsure">,
  Record<Exclude<EquipmentCurve, "unsure">, BallFlightChartShape>
> = {
  left: {
    draw: "pull-draw",
    straight: "pull",
    fade: "pull-fade",
  },
  center: {
    draw: "draw",
    straight: "straight",
    fade: "fade",
  },
  right: {
    draw: "push-draw",
    straight: "push",
    fade: "push-fade",
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
  return EQUIPMENT_BALL_FLIGHT_SHAPES[start][curve];
}

export function getEquipmentBallFlightLabel(
  start: EquipmentStartLine,
  curve: EquipmentCurve,
): string | null {
  const shape = getEquipmentBallFlightShape(start, curve);
  return shape ? EQUIPMENT_BALL_FLIGHT_LABELS[shape] : null;
}
