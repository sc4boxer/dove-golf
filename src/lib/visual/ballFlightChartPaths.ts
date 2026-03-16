import { getShotShapeGeometry, SHOT_SHAPE_MAP, type CanonicalShotShape } from "./shotShapeModel";

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

const CHART_NORMALIZED_WIDTH = 100;
const CHART_NORMALIZED_HEIGHT = 100;

function toNormalized(geometry: ReturnType<typeof getShotShapeGeometry>): BallFlightChartPathNormalized {
  return {
    startX: geometry.startX / CHART_NORMALIZED_WIDTH,
    startY: geometry.startY / CHART_NORMALIZED_HEIGHT,
    cp1X: geometry.c1x / CHART_NORMALIZED_WIDTH,
    cp1Y: geometry.c1y / CHART_NORMALIZED_HEIGHT,
    cp2X: geometry.c2x / CHART_NORMALIZED_WIDTH,
    cp2Y: geometry.c2y / CHART_NORMALIZED_HEIGHT,
    endX: geometry.endX / CHART_NORMALIZED_WIDTH,
    endY: geometry.endY / CHART_NORMALIZED_HEIGHT,
  };
}

export const BALL_FLIGHT_CHART_PATHS_NORMALIZED: Record<BallFlightChartShape, BallFlightChartPathNormalized> =
  CANONICAL_BALL_FLIGHT_SHAPES.reduce((acc, shape) => {
    acc[shape] = toNormalized(getShotShapeGeometry({
      shape: shape as CanonicalShotShape,
      width: CHART_NORMALIZED_WIDTH,
      height: CHART_NORMALIZED_HEIGHT,
    }));
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
  const geometry = getShotShapeGeometry({ shape, width, height });

  return {
    startX: geometry.startX,
    startY: geometry.startY,
    cp1X: geometry.c1x,
    cp1Y: geometry.c1y,
    cp2X: geometry.c2x,
    cp2Y: geometry.c2y,
    endX: geometry.endX,
    endY: geometry.endY,
  };
}

export function toBallFlightChartSvgPath(path: BallFlightChartPathGeometry): string {
  return `M ${path.startX} ${path.startY} C ${path.cp1X} ${path.cp1Y}, ${path.cp2X} ${path.cp2Y}, ${path.endX} ${path.endY}`;
}

export const BALL_FLIGHT_CHART_SHAPE_MAP = SHOT_SHAPE_MAP;
