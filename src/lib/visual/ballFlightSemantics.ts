import { getShotPathGeometry, SHOT_SHAPE_PATHS_NORMALIZED, type FlightSide, type ShotShape } from "./shotShapePaths";

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

function sideFromAxis(axis: number): FlightSide {
  if (axis < -8) return "left";
  if (axis > 8) return "right";
  return "center";
}

function curveDirectionFromDef(shape: ShotShape): CurveDirection {
  const curve = SHOT_SHAPE_PATHS_NORMALIZED[shape].curve;
  if (curve < 0) return "left";
  if (curve > 0) return "right";
  return "none";
}

function labelForShape(shape: ShotShape): string {
  if (shape === "duck_hook") return "Duck Hook";
  if (shape === "shank") return "Shank";
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

export const BALL_FLIGHT_SEMANTICS: Record<ShotShape, BallFlightSemantic> = (Object.keys(
  SHOT_SHAPE_PATHS_NORMALIZED,
) as ShotShape[]).reduce((acc, shape) => {
  const def = SHOT_SHAPE_PATHS_NORMALIZED[shape];
  acc[shape] = {
    shape,
    label: labelForShape(shape),
    handedness: "right-handed",
    startSide: sideFromAxis(def.startX),
    curveDirection: curveDirectionFromDef(shape),
    curveAmount: Math.abs(def.curve),
    endBias: sideFromAxis(def.endX),
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
