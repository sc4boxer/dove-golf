import {
  BALL_FLIGHT_CHART_PATHS_NORMALIZED,
  CANONICAL_BALL_FLIGHT_SHAPES,
  getBallFlightChartPathGeometry,
} from "./ballFlightChartPaths.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.draw.startX === BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startX, "draw should launch from center start");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.fade.startX === BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startX, "fade should launch from center start");

assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED["pull-draw"].endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX, "pull draw should finish left of pull");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED["pull-fade"].endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX, "pull fade should finish right of pull");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.draw.endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "draw must finish left of straight");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.fade.endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "fade must finish right of straight");

const snapshot = Object.fromEntries(
  CANONICAL_BALL_FLIGHT_SHAPES.map((shape) => {
    const g = getBallFlightChartPathGeometry({ shape, width: 220, height: 140 });
    return [shape, Object.fromEntries(Object.entries(g).map(([k, v]) => [k, Math.round(v * 10) / 10]))];
  }),
);

assert(snapshot["pull-draw"].endX < snapshot.pull.endX, "pull draw must finish left of pull");
assert(snapshot["push-fade"].endX > snapshot.push.endX, "push fade must finish right of push");

console.log("ballFlightChartPaths tests passed");
