import test from "node:test";
import assert from "node:assert/strict";
import {
  EQUIPMENT_BALL_FLIGHT_LABELS,
  getEquipmentBallFlightLabel,
  getEquipmentBallFlightShape,
} from "./equipmentBallFlightShape.ts";
import { getBallFlightChartPathGeometry } from "./ballFlightChartPaths.ts";

const CASES = [
  ["left", "draw", "pull-draw", "Pull Draw"],
  ["left", "straight", "pull", "Pull Straight"],
  ["left", "fade", "pull-fade", "Pull Fade"],
  ["center", "draw", "draw", "Straight Draw"],
  ["center", "straight", "straight", "Straight"],
  ["center", "fade", "fade", "Straight Fade"],
  ["right", "draw", "push-draw", "Push Draw"],
  ["right", "straight", "push", "Push Straight"],
  ["right", "fade", "push-fade", "Push Fade"],
];

test("maps every equipment start and curve pair to the canonical nine-family chart", () => {
  for (const [start, curve, expectedShape, expectedLabel] of CASES) {
    assert.equal(getEquipmentBallFlightShape(start, curve), expectedShape);
    assert.equal(getEquipmentBallFlightLabel(start, curve), expectedLabel);
    assert.equal(EQUIPMENT_BALL_FLIGHT_LABELS[expectedShape], expectedLabel);
  }
});

test("does not turn missing observations into a confident straight flight", () => {
  for (const start of ["left", "center", "right", "unsure"]) {
    assert.equal(getEquipmentBallFlightShape(start, "unsure"), null);
  }
  for (const curve of ["draw", "straight", "fade", "unsure"]) {
    assert.equal(getEquipmentBallFlightShape("unsure", curve), null);
  }
});

test("all nine canonical paths share one physical origin", () => {
  const origins = CASES.map(([, , shape]) => {
    const path = getBallFlightChartPathGeometry({ shape, width: 520, height: 210 });
    return [path.startX, path.startY];
  });

  for (const origin of origins) assert.deepEqual(origin, origins[0]);
});

test("the initial tangent matches the selected start line", () => {
  for (const [start, , shape] of CASES) {
    const path = getBallFlightChartPathGeometry({ shape, width: 520, height: 210 });
    if (start === "left") assert.ok(path.cp1X < path.startX);
    if (start === "center") assert.equal(path.cp1X, path.startX);
    if (start === "right") assert.ok(path.cp1X > path.startX);
  }
});

test("within each start family, draw bends left and fade bends right of straight", () => {
  for (const start of ["left", "center", "right"]) {
    const drawShape = getEquipmentBallFlightShape(start, "draw");
    const straightShape = getEquipmentBallFlightShape(start, "straight");
    const fadeShape = getEquipmentBallFlightShape(start, "fade");
    assert.ok(drawShape && straightShape && fadeShape);

    const draw = getBallFlightChartPathGeometry({ shape: drawShape, width: 520, height: 210 });
    const straight = getBallFlightChartPathGeometry({ shape: straightShape, width: 520, height: 210 });
    const fade = getBallFlightChartPathGeometry({ shape: fadeShape, width: 520, height: 210 });

    assert.ok(draw.endX < straight.endX);
    assert.ok(fade.endX > straight.endX);
  }
});

test("no-curve pull, straight, and push paths stay on one launch ray", () => {
  for (const shape of ["pull", "straight", "push"]) {
    const path = getBallFlightChartPathGeometry({ shape, width: 520, height: 210 });
    const dx = path.endX - path.startX;
    const dy = path.endY - path.startY;
    const cross1 = (path.cp1X - path.startX) * dy - (path.cp1Y - path.startY) * dx;
    const cross2 = (path.cp2X - path.startX) * dy - (path.cp2Y - path.startY) * dx;
    assert.ok(Math.abs(cross1) < 0.1, `${shape} first control point must stay on its ray`);
    assert.ok(Math.abs(cross2) < 0.1, `${shape} second control point must stay on its ray`);
  }
});
