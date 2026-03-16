export type FlightSide = "left" | "center" | "right";

export type CanonicalShotShape =
  | "straight"
  | "draw"
  | "fade"
  | "push"
  | "pull"
  | "push-draw"
  | "push-fade"
  | "pull-draw"
  | "pull-fade"
  | "hook"
  | "slice"
  | "duck_hook"
  | "shank";

export type ShotShapeDefinition = {
  startX: number;
  endX: number;
  curve: number;
  apexY?: number;
};

export const SHOT_SHAPE_MAP: Record<CanonicalShotShape, ShotShapeDefinition> = {
  straight: { startX: 0, endX: 0, curve: 0 },
  draw: { startX: 0, endX: -22, curve: -18 },
  fade: { startX: 0, endX: 22, curve: 18 },
  push: { startX: 18, endX: 18, curve: 0 },
  pull: { startX: -18, endX: -18, curve: 0 },
  "push-draw": { startX: 20, endX: -8, curve: -22 },
  "push-fade": { startX: 20, endX: 34, curve: 16 },
  "pull-draw": { startX: -20, endX: -34, curve: -16 },
  "pull-fade": { startX: -20, endX: 8, curve: 22 },
  hook: { startX: 0, endX: -36, curve: -30, apexY: 0.14 },
  slice: { startX: 0, endX: 36, curve: 30, apexY: 0.14 },
  duck_hook: { startX: 0, endX: -46, curve: -38, apexY: 0.2 },
  shank: { startX: 0, endX: 46, curve: 38, apexY: 0.2 },
};

export type ShotPathGeometry = {
  startX: number;
  startY: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  endX: number;
  endY: number;
};

const START_Y_RATIO = 0.9;
const DEFAULT_APEX_Y_RATIO = 0.12;
const SIDE_SHIFT: Record<FlightSide, number> = {
  left: -18,
  center: 0,
  right: 18,
};

function axisToX(axis: number, width: number): number {
  const center = width * 0.5;
  const axisScale = width * 0.0075;
  return center + axis * axisScale;
}

export function getShotShapeGeometry({
  shape,
  width,
  height,
  startSide,
}: {
  shape: CanonicalShotShape;
  width: number;
  height: number;
  startSide?: FlightSide;
}): ShotPathGeometry {
  const def = SHOT_SHAPE_MAP[shape];
  const sideShift = startSide ? SIDE_SHIFT[startSide] : 0;

  const startAxis = def.startX + sideShift;
  const endAxis = def.endX + sideShift;
  const curveAxis = def.curve;

  const startY = height * START_Y_RATIO;
  const endY = height * (def.apexY ?? DEFAULT_APEX_Y_RATIO);
  const travelY = startY - endY;

  const cp1Axis = startAxis + curveAxis * 0.35;
  const cp2Axis = endAxis + curveAxis * 0.65;

  return {
    startX: axisToX(startAxis, width),
    startY,
    c1x: axisToX(cp1Axis, width),
    c1y: startY - travelY * 0.3,
    c2x: axisToX(cp2Axis, width),
    c2y: startY - travelY * 0.72,
    endX: axisToX(endAxis, width),
    endY,
  };
}

export function toSvgPath(geometry: ShotPathGeometry): string {
  return `M ${geometry.startX} ${geometry.startY} C ${geometry.c1x} ${geometry.c1y}, ${geometry.c2x} ${geometry.c2y}, ${geometry.endX} ${geometry.endY}`;
}
