import {
  getShotShapeGeometry,
  SHOT_SHAPE_MAP,
  toSvgPath,
  type CanonicalShotShape,
  type FlightSide,
  type ShotPathGeometry,
} from "./shotShapeModel";

export type { FlightSide, ShotPathGeometry };

export type ShotShape = Extract<
  CanonicalShotShape,
  "straight" | "draw" | "fade" | "hook" | "slice" | "pull" | "push" | "duck_hook" | "shank"
>;

export const SHOT_SHAPE_PATHS_NORMALIZED = SHOT_SHAPE_MAP;

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
  return getShotShapeGeometry({ shape, width, height, startSide });
}

export { toSvgPath };
