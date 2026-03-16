export const CANONICAL_BALL_FLIGHT_SHAPES = [
  "pull-draw",
  "pull",
  "pull-fade",
  "straight-draw",
  "straight",
  "straight-fade",
  "push-draw",
  "push",
  "push-fade",
] as const;

export type BallFlightChartShape = (typeof CANONICAL_BALL_FLIGHT_SHAPES)[number];

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

const SHARED_START = {
  startX: 0.5,
  startY: 0.9,
} as const;

export const BALL_FLIGHT_CHART_PATHS_NORMALIZED: Record<BallFlightChartShape, BallFlightChartPathNormalized> = {
  "pull-draw": {
    ...SHARED_START,
    cp1X: 0.44,
    cp1Y: 0.7,
    cp2X: 0.16,
    cp2Y: 0.42,
    endX: 0.2,
    endY: 0.12,
  },
  pull: {
    ...SHARED_START,
    cp1X: 0.43,
    cp1Y: 0.69,
    cp2X: 0.33,
    cp2Y: 0.41,
    endX: 0.28,
    endY: 0.12,
  },
  "pull-fade": {
    ...SHARED_START,
    cp1X: 0.42,
    cp1Y: 0.7,
    cp2X: 0.44,
    cp2Y: 0.42,
    endX: 0.36,
    endY: 0.12,
  },
  "straight-draw": {
    ...SHARED_START,
    cp1X: 0.5,
    cp1Y: 0.7,
    cp2X: 0.38,
    cp2Y: 0.42,
    endX: 0.44,
    endY: 0.12,
  },
  straight: {
    ...SHARED_START,
    cp1X: 0.5,
    cp1Y: 0.69,
    cp2X: 0.5,
    cp2Y: 0.4,
    endX: 0.5,
    endY: 0.12,
  },
  "straight-fade": {
    ...SHARED_START,
    cp1X: 0.5,
    cp1Y: 0.7,
    cp2X: 0.62,
    cp2Y: 0.42,
    endX: 0.56,
    endY: 0.12,
  },
  "push-draw": {
    ...SHARED_START,
    cp1X: 0.6,
    cp1Y: 0.7,
    cp2X: 0.56,
    cp2Y: 0.42,
    endX: 0.64,
    endY: 0.12,
  },
  push: {
    ...SHARED_START,
    cp1X: 0.57,
    cp1Y: 0.69,
    cp2X: 0.67,
    cp2Y: 0.41,
    endX: 0.72,
    endY: 0.12,
  },
  "push-fade": {
    ...SHARED_START,
    cp1X: 0.58,
    cp1Y: 0.7,
    cp2X: 0.84,
    cp2Y: 0.42,
    endX: 0.8,
    endY: 0.12,
  },
};

export function getBallFlightChartPathGeometry({
  shape,
  width,
  height,
}: {
  shape: BallFlightChartShape;
  width: number;
  height: number;
}): BallFlightChartPathGeometry {
  const normalized = BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape];

  return {
    startX: normalized.startX * width,
    startY: normalized.startY * height,
    cp1X: normalized.cp1X * width,
    cp1Y: normalized.cp1Y * height,
    cp2X: normalized.cp2X * width,
    cp2Y: normalized.cp2Y * height,
    endX: normalized.endX * width,
    endY: normalized.endY * height,
  };
}

export function toBallFlightChartSvgPath(path: BallFlightChartPathGeometry): string {
  return `M ${path.startX} ${path.startY} C ${path.cp1X} ${path.cp1Y}, ${path.cp2X} ${path.cp2Y}, ${path.endX} ${path.endY}`;
}
