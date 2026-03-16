import {
  BALL_FLIGHT_CHART_PATHS_NORMALIZED,
  CANONICAL_BALL_FLIGHT_SHAPES,
  getBallFlightChartPathGeometry,
} from "./ballFlightChartPaths.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sharedStartX = BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startX;
const sharedStartY = BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startY;

for (const shape of CANONICAL_BALL_FLIGHT_SHAPES) {
  assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape].startX === sharedStartX, `${shape} must share the same origin x`);
  assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape].startY === sharedStartY, `${shape} must share the same origin y`);
}

assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.draw.endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "draw must finish left of straight");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.fade.endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "fade must finish right of straight");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.push.endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "push straight must finish right of target");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX, "pull straight must finish left of target");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED["push-draw"].endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.push.endX, "push draw should curve back left from push straight");
assert(BALL_FLIGHT_CHART_PATHS_NORMALIZED["pull-fade"].endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX, "pull fade should curve back right from pull straight");

const snapshot = Object.fromEntries(
  CANONICAL_BALL_FLIGHT_SHAPES.map((shape) => {
    const g = getBallFlightChartPathGeometry({ shape, width: 220, height: 140 });
    return [shape, Object.fromEntries(Object.entries(g).map(([k, v]) => [k, Math.round(v * 10) / 10]))];
  }),
);

assert(snapshot["push-fade"].endX > snapshot.push.endX, "push fade must finish right of push straight");
assert(snapshot["pull-draw"].endX < snapshot.pull.endX, "pull draw must finish left of pull straight");

console.log("ballFlightChartPaths tests passed");
