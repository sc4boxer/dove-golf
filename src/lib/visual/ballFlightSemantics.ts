import {
  getShotPathGeometry,
  SHOT_SHAPE_PATHS_NORMALIZED,
  type FlightSide,
  type ShotShape,
} from "./shotShapePaths";

export type Handedness = "right-handed";
export type CurveDirection = "left" | "none" | "right";

export type BallFlightSemantic = {
  shape: ShotShape;
  label: string;
  handedness: Handedness;
  startSide: FlightSide;
  curveDirection: CurveDirection;
  curveAmount: number;
  endBias: FlightSide;
};

function sideFromX(x: number): FlightSide {
  if (x < 0.47) return "left";
  if (x > 0.53) return "right";
  return "center";
}

function curveDirectionFromControlPoints(shape: ShotShape): CurveDirection {
  if (shape === "straight" || shape === "pull" || shape === "push") return "none";
  return SHOT_SHAPE_PATHS_NORMALIZED[shape].c2x < 0.5 ? "left" : "right";
}

function curveAmount(shape: ShotShape): number {
  const normalized = SHOT_SHAPE_PATHS_NORMALIZED[shape];
  return Math.abs(normalized.c2x - 0.5);
}

function labelForShape(shape: ShotShape): string {
  if (shape === "duck_hook") return "Duck Hook";
  if (shape === "shank") return "Shank";
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

export const BALL_FLIGHT_SEMANTICS: Record<ShotShape, BallFlightSemantic> = (Object.keys(
  SHOT_SHAPE_PATHS_NORMALIZED,
) as ShotShape[]).reduce((acc, shape) => {
  const normalized = SHOT_SHAPE_PATHS_NORMALIZED[shape];
  acc[shape] = {
    shape,
    label: labelForShape(shape),
    handedness: "right-handed",
    startSide: "center",
    curveDirection: curveDirectionFromControlPoints(shape),
    curveAmount: curveAmount(shape),
    endBias: sideFromX(normalized.endX),
  };
  return acc;
}, {} as Record<ShotShape, BallFlightSemantic>);

export function sideToNormalizedX(side: FlightSide): number {
  if (side === "left") return -1;
  if (side === "right") return 1;
  return 0;
}

export function curveDirectionSign(direction: CurveDirection): -1 | 0 | 1 {
  if (direction === "left") return -1;
  if (direction === "right") return 1;
  return 0;
}

export const getBallFlightPathGeometry = getShotPathGeometry;

export type { FlightSide, ShotShape };
