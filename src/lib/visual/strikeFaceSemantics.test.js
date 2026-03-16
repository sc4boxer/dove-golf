import { STRIKE_FACE_SEMANTICS } from "./strikeFaceSemantics.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  STRIKE_FACE_SEMANTICS.heel.normalizedX < STRIKE_FACE_SEMANTICS.center.normalizedX
    && STRIKE_FACE_SEMANTICS.center.normalizedX < STRIKE_FACE_SEMANTICS.toe.normalizedX,
  "heel x < center x < toe x",
);

assert(STRIKE_FACE_SEMANTICS.heel.relationToHosel === "nearest", "heel must be nearest hosel/shaft side");
assert(STRIKE_FACE_SEMANTICS.center.relationToHosel === "middle", "center must be middle of face");
assert(STRIKE_FACE_SEMANTICS.toe.relationToHosel === "farthest", "toe must be farthest from hosel/shaft side");

console.log("strikeFaceSemantics tests passed");
