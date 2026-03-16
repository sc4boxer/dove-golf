export type FlightSide = "left" | "center" | "right";

export type ShotShape =
  | "straight"
  | "draw"
  | "fade"
  | "hook"
  | "slice"
  | "pull"
  | "push"
  | "duck_hook"
  | "shank";

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

type NormalizedGeometry = ShotPathGeometry;

// DoveGolf convention: draw=left curve, fade=right curve, all paths share center origin.
const SHARED_START: Pick<NormalizedGeometry, "startX" | "startY"> = {
  startX: 0.5,
  startY: 0.9,
};

export const SHOT_SHAPE_PATHS_NORMALIZED: Record<ShotShape, NormalizedGeometry> = {
  straight: {
    ...SHARED_START,
    c1x: 0.5,
    c1y: 0.68,
    c2x: 0.5,
    c2y: 0.38,
    endX: 0.5,
    endY: 0.12,
  },
  draw: {
    ...SHARED_START,
    c1x: 0.49,
    c1y: 0.71,
    c2x: 0.34,
    c2y: 0.42,
    endX: 0.4,
    endY: 0.12,
  },
  fade: {
    ...SHARED_START,
    c1x: 0.51,
    c1y: 0.71,
    c2x: 0.66,
    c2y: 0.42,
    endX: 0.6,
    endY: 0.12,
  },
  hook: {
    ...SHARED_START,
    c1x: 0.48,
    c1y: 0.72,
    c2x: 0.26,
    c2y: 0.46,
    endX: 0.18,
    endY: 0.14,
  },
  slice: {
    ...SHARED_START,
    c1x: 0.52,
    c1y: 0.72,
    c2x: 0.74,
    c2y: 0.46,
    endX: 0.82,
    endY: 0.14,
  },
  pull: {
    ...SHARED_START,
    c1x: 0.46,
    c1y: 0.69,
    c2x: 0.39,
    c2y: 0.4,
    endX: 0.36,
    endY: 0.12,
  },
  push: {
    ...SHARED_START,
    c1x: 0.54,
    c1y: 0.69,
    c2x: 0.61,
    c2y: 0.4,
    endX: 0.64,
    endY: 0.12,
  },
  duck_hook: {
    ...SHARED_START,
    c1x: 0.45,
    c1y: 0.73,
    c2x: 0.14,
    c2y: 0.5,
    endX: 0.04,
    endY: 0.2,
  },
  shank: {
    ...SHARED_START,
    c1x: 0.56,
    c1y: 0.72,
    c2x: 0.88,
    c2y: 0.5,
    endX: 0.96,
    endY: 0.2,
  },
};

const SIDE_BIAS: Record<FlightSide, number> = {
  left: -0.055,
  center: 0,
  right: 0.055,
};

function toAbsolute(value: number, size: number): number {
  return value * size;
}

export function getShotPathGeometry({
  width,
  height,
  shape,
  startSide,
}: {
  width: number;
  height: number;
  shape: ShotShape;
  startSide?: FlightSide;
}): ShotPathGeometry {
  const normalized = SHOT_SHAPE_PATHS_NORMALIZED[shape];
  const startBias = startSide ? SIDE_BIAS[startSide] : 0;

  const withBias = {
    ...normalized,
    c1x: normalized.c1x + startBias * 0.5,
    c2x: normalized.c2x + startBias,
    endX: normalized.endX + startBias,
  };

  return {
    startX: toAbsolute(withBias.startX, width),
    startY: toAbsolute(withBias.startY, height),
    c1x: toAbsolute(withBias.c1x, width),
    c1y: toAbsolute(withBias.c1y, height),
    c2x: toAbsolute(withBias.c2x, width),
    c2y: toAbsolute(withBias.c2y, height),
    endX: toAbsolute(withBias.endX, width),
    endY: toAbsolute(withBias.endY, height),
  };
}

export function toSvgPath(geometry: ShotPathGeometry): string {
  return `M ${geometry.startX} ${geometry.startY} C ${geometry.c1x} ${geometry.c1y}, ${geometry.c2x} ${geometry.c2y}, ${geometry.endX} ${geometry.endY}`;
}
