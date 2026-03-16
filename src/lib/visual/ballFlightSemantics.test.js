import { getShotPathGeometry, SHOT_SHAPE_PATHS_NORMALIZED } from "./shotShapePaths.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const canonicalShapes = ["straight", "draw", "fade", "hook", "slice", "pull", "push"];
const starts = canonicalShapes.map((shape) => SHOT_SHAPE_PATHS_NORMALIZED[shape]);
const sharedStartX = starts[0].startX;
const sharedStartY = starts[0].startY;

assert(
  starts.every((shape) => shape.startX === sharedStartX && shape.startY === sharedStartY),
  "all core shot shapes must share one center-bottom origin",
);

const straight = SHOT_SHAPE_PATHS_NORMALIZED.straight;
const draw = SHOT_SHAPE_PATHS_NORMALIZED.draw;
const fade = SHOT_SHAPE_PATHS_NORMALIZED.fade;
const hook = SHOT_SHAPE_PATHS_NORMALIZED.hook;
const slice = SHOT_SHAPE_PATHS_NORMALIZED.slice;
const pull = SHOT_SHAPE_PATHS_NORMALIZED.pull;
const push = SHOT_SHAPE_PATHS_NORMALIZED.push;

assert(draw.endX < straight.endX, "draw must finish left of straight");
assert(fade.endX > straight.endX, "fade must finish right of straight");
assert(hook.endX < draw.endX, "hook must finish farther left than draw");
assert(slice.endX > fade.endX, "slice must finish farther right than fade");
assert(pull.endX < straight.endX, "pull must finish left of straight");
assert(push.endX > straight.endX, "push must finish right of straight");
assert(pull.endX < draw.endX, "pull should finish farther left than draw (start-line miss, low curve)");
assert(push.endX > fade.endX, "push should finish farther right than fade (start-line miss, low curve)");

const pullCurvature = Math.abs(pull.c2x - pull.endX);
const pushCurvature = Math.abs(push.c2x - push.endX);
assert(pullCurvature <= 0.031, "pull must have very low curvature");
assert(pushCurvature <= 0.031, "push must have very low curvature");

const drawCurvature = Math.abs(draw.c2x - draw.endX);
const fadeCurvature = Math.abs(fade.c2x - fade.endX);
assert(drawCurvature > pullCurvature, "draw curvature must be visibly stronger than pull");
assert(fadeCurvature > pushCurvature, "fade curvature must be visibly stronger than push");

function normalizeSnapshot(geometry) {
  return Object.fromEntries(Object.entries(geometry).map(([key, value]) => [key, Math.round(value * 10) / 10]));
}

const drawSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "draw" }));
const fadeSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "fade" }));
const hookSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "hook" }));
const sliceSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "slice" }));
const pullSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "pull" }));
const pushSnapshot = normalizeSnapshot(getShotPathGeometry({ width: 220, height: 140, shape: "push" }));

const snapshot = {
  draw: drawSnapshot,
  fade: fadeSnapshot,
  hook: hookSnapshot,
  slice: sliceSnapshot,
  pull: pullSnapshot,
  push: pushSnapshot,
};

const expectedSnapshot = {
  draw: { startX: 110, startY: 126, c1x: 107.8, c1y: 99.4, c2x: 74.8, c2y: 58.8, endX: 88, endY: 16.8 },
  fade: { startX: 110, startY: 126, c1x: 112.2, c1y: 99.4, c2x: 145.2, c2y: 58.8, endX: 132, endY: 16.8 },
  hook: { startX: 110, startY: 126, c1x: 105.6, c1y: 100.8, c2x: 57.2, c2y: 64.4, endX: 39.6, endY: 19.6 },
  slice: { startX: 110, startY: 126, c1x: 114.4, c1y: 100.8, c2x: 162.8, c2y: 64.4, endX: 180.4, endY: 19.6 },
  pull: { startX: 110, startY: 126, c1x: 101.2, c1y: 96.6, c2x: 85.8, c2y: 56, endX: 79.2, endY: 16.8 },
  push: { startX: 110, startY: 126, c1x: 118.8, c1y: 96.6, c2x: 134.2, c2y: 56, endX: 140.8, endY: 16.8 },
};

assert(JSON.stringify(snapshot) === JSON.stringify(expectedSnapshot), "shot shape geometry snapshots must remain stable");

console.log("ballFlightSemantics tests passed");
