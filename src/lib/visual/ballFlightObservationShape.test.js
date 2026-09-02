import assert from "node:assert/strict";
import test from "node:test";
import { getEquipmentBallFlightShape } from "./equipmentBallFlightShape.ts";
import { getBallFlightShapeFromObservation } from "./ballFlightObservationShape.ts";

const CASES = [
  ["left", "left", "draw"],
  ["left", "straight", "straight"],
  ["left", "right", "fade"],
  ["center", "left", "draw"],
  ["center", "straight", "straight"],
  ["center", "right", "fade"],
  ["right", "left", "draw"],
  ["right", "straight", "straight"],
  ["right", "right", "fade"],
];

test("decoder and equipment fit render the same shape for all nine observations", () => {
  for (const [start, decoderCurve, equipmentCurve] of CASES) {
    const decoderShape = getBallFlightShapeFromObservation(start, decoderCurve);
    const equipmentShape = getEquipmentBallFlightShape(start, equipmentCurve);
    assert.equal(
      equipmentShape,
      decoderShape,
      `${start} start + ${decoderCurve} curve must share one canonical visual`,
    );
  }
});

test("left and right curve observations bend to the expected side", () => {
  for (const start of ["left", "center", "right"]) {
    assert.match(getBallFlightShapeFromObservation(start, "left"), /draw$/);
    assert.match(getBallFlightShapeFromObservation(start, "right"), /fade$/);
  }
});
