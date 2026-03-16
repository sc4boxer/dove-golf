import {
  BALL_FLIGHT_CHART_PATHS_NORMALIZED,
  CANONICAL_BALL_FLIGHT_SHAPES,
  getBallFlightChartPathGeometry,
} from "./ballFlightChartPaths.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const starts = CANONICAL_BALL_FLIGHT_SHAPES.map((shape) => BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape]);
const sharedStartX = starts[0].startX;
const sharedStartY = starts[0].startY;

assert(starts.every((path) => path.startX === sharedStartX && path.startY === sharedStartY), "all nine paths must share one origin");

const orderedEndX = CANONICAL_BALL_FLIGHT_SHAPES.map((shape) => BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape].endX);
for (let i = 1; i < orderedEndX.length; i += 1) {
  assert(orderedEndX[i - 1] < orderedEndX[i], "endX ordering must remain canonical left-to-right");
}

assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["pull-draw"].endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX,
  "pull-draw must finish left of pull",
);
assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["straight-draw"].endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX,
  "straight-draw must finish left of straight",
);
assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["push-draw"].endX < BALL_FLIGHT_CHART_PATHS_NORMALIZED.push.endX,
  "push-draw must finish left of push",
);

assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["pull-fade"].endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.pull.endX,
  "pull-fade must finish right of pull",
);
assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["straight-fade"].endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.endX,
  "straight-fade must finish right of straight",
);
assert(
  BALL_FLIGHT_CHART_PATHS_NORMALIZED["push-fade"].endX > BALL_FLIGHT_CHART_PATHS_NORMALIZED.push.endX,
  "push-fade must finish right of push",
);

function curveDelta(shape) {
  const path = BALL_FLIGHT_CHART_PATHS_NORMALIZED[shape];
  return path.cp2X - path.endX;
}

assert(curveDelta("pull-draw") < curveDelta("pull"), "pull-draw should bend left relative to pull");
assert(curveDelta("straight-draw") < curveDelta("straight"), "straight-draw should bend left relative to straight");
assert(curveDelta("push-draw") < curveDelta("push"), "push-draw should bend left relative to push");

assert(curveDelta("pull-fade") > curveDelta("pull"), "pull-fade should bend right relative to pull");
assert(curveDelta("straight-fade") > curveDelta("straight"), "straight-fade should bend right relative to straight");
assert(curveDelta("push-fade") > curveDelta("push"), "push-fade should bend right relative to push");

function normalizeSnapshot(geometry) {
  return Object.fromEntries(Object.entries(geometry).map(([key, value]) => [key, Math.round(value * 10) / 10]));
}

const snapshot = Object.fromEntries(
  CANONICAL_BALL_FLIGHT_SHAPES.map((shape) => [shape, normalizeSnapshot(getBallFlightChartPathGeometry({ shape, width: 220, height: 140 }))]),
);

const expectedSnapshot = {
  "pull-draw": { startX: 110, startY: 126, cp1X: 96.8, cp1Y: 98, cp2X: 35.2, cp2Y: 58.8, endX: 44, endY: 16.8 },
  pull: { startX: 110, startY: 126, cp1X: 94.6, cp1Y: 96.6, cp2X: 72.6, cp2Y: 57.4, endX: 61.6, endY: 16.8 },
  "pull-fade": { startX: 110, startY: 126, cp1X: 92.4, cp1Y: 98, cp2X: 96.8, cp2Y: 58.8, endX: 79.2, endY: 16.8 },
  "straight-draw": { startX: 110, startY: 126, cp1X: 110, cp1Y: 98, cp2X: 83.6, cp2Y: 58.8, endX: 96.8, endY: 16.8 },
  straight: { startX: 110, startY: 126, cp1X: 110, cp1Y: 96.6, cp2X: 110, cp2Y: 56, endX: 110, endY: 16.8 },
  "straight-fade": { startX: 110, startY: 126, cp1X: 110, cp1Y: 98, cp2X: 136.4, cp2Y: 58.8, endX: 123.2, endY: 16.8 },
  "push-draw": { startX: 110, startY: 126, cp1X: 132, cp1Y: 98, cp2X: 123.2, cp2Y: 58.8, endX: 140.8, endY: 16.8 },
  push: { startX: 110, startY: 126, cp1X: 125.4, cp1Y: 96.6, cp2X: 147.4, cp2Y: 57.4, endX: 158.4, endY: 16.8 },
  "push-fade": { startX: 110, startY: 126, cp1X: 127.6, cp1Y: 98, cp2X: 184.8, cp2Y: 58.8, endX: 176, endY: 16.8 },
};

assert(JSON.stringify(snapshot) === JSON.stringify(expectedSnapshot), "ball flight chart geometry snapshots must remain stable");

console.log("ballFlightChartPaths tests passed");
