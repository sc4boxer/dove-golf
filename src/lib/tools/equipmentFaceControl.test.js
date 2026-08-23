import test from "node:test";
import assert from "node:assert/strict";
import { classifyEquipmentFaceControl } from "./equipmentFaceControl.ts";

const CASES = [
  ["left", "draw", "reduceLeft"],
  ["left", "straight", "reduceLeft"],
  ["left", "fade", "neutral"],
  ["center", "draw", "stability"],
  ["center", "straight", "neutral"],
  ["center", "fade", "stability"],
  ["right", "draw", "neutral"],
  ["right", "straight", "reduceRight"],
  ["right", "fade", "reduceRight"],
];

test("keeps the established recommendation bias for all nine flight families", () => {
  for (const [start, curve, expectedBias] of CASES) {
    const result = classifyEquipmentFaceControl(start, curve);
    assert.equal(result.bias, expectedBias, `${start} + ${curve}`);
    assert.match(result.label, /starts/);
  }
});

test("does not misclassify cross-direction families as hook or slice treatment", () => {
  assert.deepEqual(classifyEquipmentFaceControl("right", "draw"), {
    label: "starts right and curves left",
    bias: "neutral",
  });
  assert.deepEqual(classifyEquipmentFaceControl("left", "fade"), {
    label: "starts left and curves right",
    bias: "neutral",
  });
});

test("keeps unknown observations neutral without inventing a pattern", () => {
  assert.deepEqual(classifyEquipmentFaceControl("unsure", "draw"), {
    label: "unknown",
    bias: "neutral",
  });
  assert.deepEqual(classifyEquipmentFaceControl("left", "unsure"), {
    label: "unknown",
    bias: "neutral",
  });
});
