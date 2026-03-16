export type VisualHandedness = "right-handed";
export type ShotShapeName = "draw" | "fade" | "hook" | "slice" | "straight";
export type StartSide = "left" | "center" | "right";
export type CurveDirection = "left" | "none" | "right";

export type ShotShapeSemantics = {
  name: ShotShapeName;
  startSide: StartSide;
  curveDirection: CurveDirection;
  curvatureStrength: number;
  endSide: StartSide;
  handednessAssumption: VisualHandedness;
};

export const SHOT_SHAPE_SEMANTICS: Record<ShotShapeName, ShotShapeSemantics> = {
  draw: {
    name: "draw",
    startSide: "right",
    curveDirection: "left",
    curvatureStrength: 0.45,
    endSide: "center",
    handednessAssumption: "right-handed",
  },
  fade: {
    name: "fade",
    startSide: "left",
    curveDirection: "right",
    curvatureStrength: 0.45,
    endSide: "center",
    handednessAssumption: "right-handed",
  },
  hook: {
    name: "hook",
    startSide: "right",
    curveDirection: "left",
    curvatureStrength: 0.9,
    endSide: "left",
    handednessAssumption: "right-handed",
  },
  slice: {
    name: "slice",
    startSide: "left",
    curveDirection: "right",
    curvatureStrength: 0.9,
    endSide: "right",
    handednessAssumption: "right-handed",
  },
  straight: {
    name: "straight",
    startSide: "center",
    curveDirection: "none",
    curvatureStrength: 0,
    endSide: "center",
    handednessAssumption: "right-handed",
  },
};

export function curveDirectionSign(curveDirection: CurveDirection): -1 | 0 | 1 {
  if (curveDirection === "left") return -1;
  if (curveDirection === "right") return 1;
  return 0;
}

export function xFromSide(side: StartSide, centerX: number, laneOffset: number): number {
  if (side === "left") return centerX - laneOffset;
  if (side === "right") return centerX + laneOffset;
  return centerX;
}

export function getShotPathGeometry({
  width,
  height,
  shape,
  startSide,
}: {
  width: number;
  height: number;
  shape: ShotShapeName;
  startSide?: StartSide;
}) {
  const semantics = SHOT_SHAPE_SEMANTICS[shape];
  const centerX = width * 0.5;
  const laneOffset = width * 0.18;
  const resolvedStartSide = startSide ?? semantics.startSide;
  const startX = xFromSide(resolvedStartSide, centerX, laneOffset);
  const endX = xFromSide(semantics.endSide, centerX, laneOffset);
  const sign = curveDirectionSign(semantics.curveDirection);
  const bend = sign * width * 0.22 * semantics.curvatureStrength;

  return {
    startX,
    startY: height * 0.78,
    endX,
    endY: height * 0.2,
    c1x: startX + bend * 0.35,
    c1y: height * 0.62,
    c2x: (startX + endX) / 2 + bend,
    c2y: height * 0.28,
  };
}
