import { getShotPathGeometry, SHOT_SHAPE_PATHS_NORMALIZED } from "./shotShapePaths.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const centerLaunchShapes = ["straight", "draw", "fade", "hook", "slice"];
const starts = centerLaunchShapes.map((shape) => SHOT_SHAPE_PATHS_NORMALIZED[shape]);
assert(starts.every((shape) => shape.startX === 0), "center-launch shapes should share centered launch axis");

assert(SHOT_SHAPE_PATHS_NORMALIZED.draw.curve < 0, "draw must curve left");
assert(SHOT_SHAPE_PATHS_NORMALIZED.fade.curve > 0, "fade must curve right");
assert(SHOT_SHAPE_PATHS_NORMALIZED.hook.curve < SHOT_SHAPE_PATHS_NORMALIZED.draw.curve, "hook must curve left more than draw");
assert(SHOT_SHAPE_PATHS_NORMALIZED.slice.curve > SHOT_SHAPE_PATHS_NORMALIZED.fade.curve, "slice must curve right more than fade");

const drawSnapshot = getShotPathGeometry({ width: 220, height: 140, shape: "draw" });
const fadeSnapshot = getShotPathGeometry({ width: 220, height: 140, shape: "fade" });
assert(drawSnapshot.endX < 110, "draw geometry should finish left of center");
assert(fadeSnapshot.endX > 110, "fade geometry should finish right of center");

console.log("ballFlightSemantics tests passed");
