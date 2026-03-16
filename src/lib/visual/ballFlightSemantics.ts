export type Handedness = "right-handed";
export type ShotShape = "straight" | "draw" | "fade" | "hook" | "slice";
export type FlightSide = "left" | "center" | "right";
export type CurveDirection = "left" | "none" | "right";

export type BallFlightSemantic = {
  shape: ShotShape;
  label: string;
  handedness: Handedness;
  startSide: FlightSide;
  launchStartX: number;
  curveDirection: CurveDirection;
  curveAmount: number;
  endBias: FlightSide;
};

export const BALL_FLIGHT_SEMANTICS: Record<ShotShape, BallFlightSemantic> = {
  straight: {
    shape: "straight",
    label: "Straight",
    handedness: "right-handed",
    startSide: "center",
    launchStartX: 0,
    curveDirection: "none",
    curveAmount: 0,
    endBias: "center",
  },
  draw: {
    shape: "draw",
    label: "Draw",
    handedness: "right-handed",
    startSide: "right",
    launchStartX: 0.17,
    curveDirection: "left",
    curveAmount: 0.34,
    endBias: "center",
  },
  fade: {
    shape: "fade",
    label: "Fade",
    handedness: "right-handed",
    startSide: "left",
    launchStartX: -0.17,
    curveDirection: "right",
    curveAmount: 0.34,
    endBias: "center",
  },
  hook: {
    shape: "hook",
    label: "Hook",
    handedness: "right-handed",
    startSide: "right",
    launchStartX: 0.2,
    curveDirection: "left",
    curveAmount: 0.65,
    endBias: "left",
  },
  slice: {
    shape: "slice",
    label: "Slice",
    handedness: "right-handed",
    startSide: "left",
    launchStartX: -0.2,
    curveDirection: "right",
    curveAmount: 0.65,
    endBias: "right",
  },
};

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

export function resolveStartX(shape: ShotShape, override?: FlightSide): number {
  if (!override) return BALL_FLIGHT_SEMANTICS[shape].launchStartX;
  return sideToNormalizedX(override) * 0.18;
}

export function getBallFlightPathGeometry({
  width,
  height,
  shape,
  startSide,
}: {
  width: number;
  height: number;
  shape: ShotShape;
  startSide?: FlightSide;
}) {
  const semantics = BALL_FLIGHT_SEMANTICS[shape];
  const centerX = width * 0.5;
  const startX = centerX + resolveStartX(shape, startSide) * width;
  const endX = centerX + sideToNormalizedX(semantics.endBias) * width * 0.16;
  const sign = curveDirectionSign(semantics.curveDirection);
  const bend = sign * width * semantics.curveAmount * 0.35;

  return {
    startX,
    startY: height * 0.84,
    endX,
    endY: height * 0.14,
    c1x: startX + bend * 0.3,
    c1y: height * 0.6,
    c2x: (startX + endX) * 0.5 + bend,
    c2y: height * 0.28,
  };
}
