import { BALL_FLIGHT_SEMANTICS } from "./ballFlightSemantics.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  BALL_FLIGHT_SEMANTICS.draw.startSide === "right" && BALL_FLIGHT_SEMANTICS.draw.curveDirection === "left",
  "draw must start right and curve left",
);

assert(
  BALL_FLIGHT_SEMANTICS.fade.startSide === "left" && BALL_FLIGHT_SEMANTICS.fade.curveDirection === "right",
  "fade must start left and curve right",
);

assert(
  BALL_FLIGHT_SEMANTICS.hook.startSide === "right" && BALL_FLIGHT_SEMANTICS.hook.curveDirection === "left",
  "hook must start right and curve left",
);

assert(
  BALL_FLIGHT_SEMANTICS.hook.curveAmount > BALL_FLIGHT_SEMANTICS.draw.curveAmount,
  "hook curve must be greater than draw curve",
);

assert(
  BALL_FLIGHT_SEMANTICS.slice.startSide === "left" && BALL_FLIGHT_SEMANTICS.slice.curveDirection === "right",
  "slice must start left and curve right",
);

assert(
  BALL_FLIGHT_SEMANTICS.slice.curveAmount > BALL_FLIGHT_SEMANTICS.fade.curveAmount,
  "slice curve must be greater than fade curve",
);

assert(
  BALL_FLIGHT_SEMANTICS.straight.curveDirection === "none" && BALL_FLIGHT_SEMANTICS.straight.curveAmount === 0,
  "straight must have neutral curvature",
);

console.log("ballFlightSemantics tests passed");
