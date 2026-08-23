import test from "node:test";
import assert from "node:assert/strict";
import { deriveShotEvidence } from "./shotEvidence.ts";

const starts = ["left", "straight", "right"];
const curves = ["left", "straight", "right"];
const strikes = ["heel", "center", "toe", "unknown"];

test("returns bounded evidence geometry for every decoder combination", () => {
  for (const start of starts) {
    for (const curve of curves) {
      for (const strike of strikes) {
        const evidence = deriveShotEvidence({ start, curve, strike });
        assert.ok(Number.isFinite(evidence.faceAngle));
        assert.ok(Number.isFinite(evidence.pathAngle));
        assert.ok(Math.abs(evidence.faceAngle) <= 8);
        assert.ok(Math.abs(evidence.pathAngle) <= 20);
        assert.ok(evidence.faceToTarget);
        assert.ok(evidence.faceToPath);
        assert.ok(evidence.strikeNote);
      }
    }
  }
});

test("keeps face direction aligned with the selected start line", () => {
  assert.ok(deriveShotEvidence({ start: "left", curve: "straight", strike: "center" }).faceAngle < 0);
  assert.equal(deriveShotEvidence({ start: "straight", curve: "straight", strike: "center" }).faceAngle, 0);
  assert.ok(deriveShotEvidence({ start: "right", curve: "straight", strike: "center" }).faceAngle > 0);
});

test("illustrates only the face-to-path relationship supported by curve", () => {
  const leftCurve = deriveShotEvidence({ start: "straight", curve: "left", strike: "center" });
  assert.ok(leftCurve.pathAngle > leftCurve.faceAngle);
  assert.match(leftCurve.faceToPath, /closed relative to the path/);

  const straight = deriveShotEvidence({ start: "straight", curve: "straight", strike: "center" });
  assert.equal(straight.pathAngle, straight.faceAngle);
  assert.match(straight.faceToPath, /closely matched/);

  const rightCurve = deriveShotEvidence({ start: "straight", curve: "right", strike: "center" });
  assert.ok(rightCurve.pathAngle < rightCurve.faceAngle);
  assert.match(rightCurve.faceToPath, /open relative to the path/);
});

test("places strike markers in heel, center, and toe order", () => {
  const heel = deriveShotEvidence({ start: "straight", curve: "straight", strike: "heel" });
  const center = deriveShotEvidence({ start: "straight", curve: "straight", strike: "center" });
  const toe = deriveShotEvidence({ start: "straight", curve: "straight", strike: "toe" });

  assert.ok(heel.strikePosition < center.strikePosition);
  assert.ok(center.strikePosition < toe.strikePosition);
  assert.match(heel.strikeNote, /driver or fairway wood/);
  assert.match(toe.strikeNote, /driver or fairway wood/);
});
