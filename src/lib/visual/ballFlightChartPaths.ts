export const CANONICAL_BALL_FLIGHT_SHAPES = [
  "pull-draw",
  "pull",
  "pull-fade",
  "draw",
  "straight",
  "fade",
  "push-draw",
  "push",
  "push-fade",
] as const;

export type BallFlightChartShape = (typeof CANONICAL_BALL_FLIGHT_SHAPES)[number];

type NormalizedPoint = {
  x: number;
  /** y increases upward from the shared origin. */
  y: number;
};

type FlightPreset = {
  shape: BallFlightChartShape;
  start: NormalizedPoint;
  c1: NormalizedPoint;
  c2: NormalizedPoint;
  end: NormalizedPoint;
};

export type BallFlightChartPathNormalized = {
  startX: number;
  startY: number;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
  endX: number;
  endY: number;
};

export type BallFlightChartPathGeometry = BallFlightChartPathNormalized;

/**
 * Canonical educational presets (not simulated physics).
 * All nine patterns share the exact same origin.
 */
const FLIGHT_PRESETS: Record<BallFlightChartShape, FlightPreset> = {
  "pull-draw": {
    shape: "pull-draw",
    start: { x: 0, y: 0 },
    c1: { x: -0.16, y: 0.22 },
    c2: { x: -0.27, y: 0.62 },
    end: { x: -0.34, y: 0.92 },
  },
  pull: {
    shape: "pull",
    start: { x: 0, y: 0 },
    c1: { x: -0.14, y: 0.24 },
    c2: { x: -0.17, y: 0.62 },
    end: { x: -0.2, y: 0.92 },
  },
  "pull-fade": {
    shape: "pull-fade",
    start: { x: 0, y: 0 },
    c1: { x: -0.17, y: 0.22 },
    c2: { x: -0.08, y: 0.62 },
    end: { x: -0.02, y: 0.92 },
  },
  draw: {
    shape: "draw",
    start: { x: 0, y: 0 },
    c1: { x: -0.06, y: 0.22 },
    c2: { x: -0.16, y: 0.62 },
    end: { x: -0.24, y: 0.92 },
  },
  straight: {
    shape: "straight",
    start: { x: 0, y: 0 },
    c1: { x: 0, y: 0.25 },
    c2: { x: 0, y: 0.62 },
    end: { x: 0, y: 0.92 },
  },
  fade: {
    shape: "fade",
    start: { x: 0, y: 0 },
    c1: { x: 0.06, y: 0.22 },
    c2: { x: 0.16, y: 0.62 },
    end: { x: 0.24, y: 0.92 },
  },
  "push-draw": {
    shape: "push-draw",
    start: { x: 0, y: 0 },
    c1: { x: 0.17, y: 0.22 },
    c2: { x: 0.1, y: 0.62 },
    end: { x: 0.03, y: 0.92 },
  },
  push: {
    shape: "push",
    start: { x: 0, y: 0 },
    c1: { x: 0.14, y: 0.24 },
    c2: { x: 0.17, y: 0.62 },
    end: { x: 0.2, y: 0.92 },
  },
  "push-fade": {
    shape: "push-fade",
    start: { x: 0, y: 0 },
    c1: { x: 0.17, y: 0.22 },
    c2: { x: 0.28, y: 0.62 },
    end: { x: 0.34, y: 0.92 },
  },
};

const ORIGIN_Y = 0.9;
const FLIGHT_HEIGHT = 0.78;
const X_SPAN = 0.32;

function toChartSpace(point: NormalizedPoint): { x: number; y: number } {
  return {
    x: 0.5 + point.x * X_SPAN,
    y: ORIGIN_Y - point.y * FLIGHT_HEIGHT,
  };
}

function presetToPathNormalized(preset: FlightPreset): BallFlightChartPathNormalized {
  const start = toChartSpace(preset.start);
  const c1 = toChartSpace(preset.c1);
  const c2 = toChartSpace(preset.c2);
  const end = toChartSpace(preset.end);

  return {
    startX: start.x,
    startY: start.y,
    cp1X: c1.x,
    cp1Y: c1.y,
    cp2X: c2.x,
    cp2Y: c2.y,
    endX: end.x,
    endY: end.y,
  };
}

export const BALL_FLIGHT_CHART_PATHS_NORMALIZED: Record<BallFlightChartShape, BallFlightChartPathNormalized> =
  CANONICAL_BALL_FLIGHT_SHAPES.reduce((acc, shape) => {
    acc[shape] = presetToPathNormalized(FLIGHT_PRESETS[shape]);
    return acc;
  }, {} as Record<BallFlightChartShape, BallFlightChartPathNormalized>);

export function getBallFlightChartPathGeometry({
  shape,
  width,
  height,
}: {
  shape: BallFlightChartShape;
  width: number;
  height: number;
}): BallFlightChartPathGeometry {
  const preset = BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape];

  return {
    startX: preset.startX * width,
    startY: preset.startY * height,
    cp1X: preset.cp1X * width,
    cp1Y: preset.cp1Y * height,
    cp2X: preset.cp2X * width,
    cp2Y: preset.cp2Y * height,
    endX: preset.endX * width,
    endY: preset.endY * height,
  };
}

export function toBallFlightChartSvgPath(path: BallFlightChartPathGeometry): string {
  return `M ${path.startX} ${path.startY} C ${path.cp1X} ${path.cp1Y}, ${path.cp2X} ${path.cp2Y}, ${path.endX} ${path.endY}`;
}

export const BALL_FLIGHT_CHART_SHAPE_MAP = FLIGHT_PRESETS;
