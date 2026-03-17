export type StartDirection = "left" | "center" | "right";
export type CurveDirection = "left" | "none" | "right";
export type CurveSeverity = "small" | "medium" | "large";

export type BallFlightPattern = {
  id: string;
  internalLabel: string;
  displayLabel: string;
  startDirection: StartDirection;
  curveDirection: CurveDirection;
  curveSeverity: CurveSeverity;
  notes?: string;
};

export const NINE_BALL_FLIGHT_PATTERNS: BallFlightPattern[] = [
  {
    id: "straight",
    internalLabel: "straight",
    displayLabel: "Straight",
    startDirection: "center",
    curveDirection: "none",
    curveSeverity: "small",
  },
  {
    id: "pull",
    internalLabel: "pull",
    displayLabel: "Starts left and stays left",
    startDirection: "left",
    curveDirection: "none",
    curveSeverity: "small",
  },
  {
    id: "push",
    internalLabel: "push",
    displayLabel: "Starts right and stays right",
    startDirection: "right",
    curveDirection: "none",
    curveSeverity: "small",
  },
  {
    id: "fade",
    internalLabel: "fade",
    displayLabel: "Gentle curve right",
    startDirection: "center",
    curveDirection: "right",
    curveSeverity: "small",
  },
  {
    id: "draw",
    internalLabel: "draw",
    displayLabel: "Gentle curve left",
    startDirection: "center",
    curveDirection: "left",
    curveSeverity: "small",
  },
  {
    id: "slice",
    internalLabel: "slice",
    displayLabel: "Big curve right",
    startDirection: "center",
    curveDirection: "right",
    curveSeverity: "large",
  },
  {
    id: "hook",
    internalLabel: "hook",
    displayLabel: "Big curve left",
    startDirection: "center",
    curveDirection: "left",
    curveSeverity: "large",
  },
  {
    id: "pull-fade",
    internalLabel: "pull-fade/pull-slice",
    displayLabel: "Starts left, curves right",
    startDirection: "left",
    curveDirection: "right",
    curveSeverity: "medium",
    notes: "Path and face mismatch often present.",
  },
  {
    id: "push-draw",
    internalLabel: "push-draw/push-hook",
    displayLabel: "Starts right, curves left",
    startDirection: "right",
    curveDirection: "left",
    curveSeverity: "medium",
  },
];
