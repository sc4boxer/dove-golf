import { SHOT_SHAPE_SEMANTICS, getShotPathGeometry } from "./shotShapeSemantics.ts";
import { STRIKE_SEMANTICS } from "./strikeSemantics.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  SHOT_SHAPE_SEMANTICS.draw.startSide === "right" && SHOT_SHAPE_SEMANTICS.draw.curveDirection === "left",
  "Draw must start right and curve left for right-handed visuals",
);
assert(
  SHOT_SHAPE_SEMANTICS.fade.startSide === "left" && SHOT_SHAPE_SEMANTICS.fade.curveDirection === "right",
  "Fade must start left and curve right for right-handed visuals",
);
assert(
  SHOT_SHAPE_SEMANTICS.hook.startSide === "right" && SHOT_SHAPE_SEMANTICS.hook.curveDirection === "left",
  "Hook must start right and curve left for right-handed visuals",
);
assert(
  SHOT_SHAPE_SEMANTICS.slice.startSide === "left" && SHOT_SHAPE_SEMANTICS.slice.curveDirection === "right",
  "Slice must start left and curve right for right-handed visuals",
);
assert(
  STRIKE_SEMANTICS.toe.horizontalPositionOnFace > STRIKE_SEMANTICS.center.horizontalPositionOnFace
    && STRIKE_SEMANTICS.center.horizontalPositionOnFace > STRIKE_SEMANTICS.heel.horizontalPositionOnFace,
  "Strike semantics must satisfy toe > center > heel",
);

const drawGeometry = getShotPathGeometry({ width: 260, height: 120, shape: "draw" });
const fadeGeometry = getShotPathGeometry({ width: 260, height: 120, shape: "fade" });
assert(drawGeometry.startX > 130, "Draw geometry should start right of center");
assert(fadeGeometry.startX < 130, "Fade geometry should start left of center");
