import test from "node:test";
import assert from "node:assert/strict";
import { decodeBallFlight } from "./model.ts";

const mappings = [
  ["left", "left", "pull-draw"],
  ["left", "straight", "pull-straight"],
  ["left", "right", "pull-fade"],
  ["straight", "left", "straight-draw"],
  ["straight", "straight", "straight-straight"],
  ["straight", "right", "straight-fade"],
  ["right", "left", "push-draw"],
  ["right", "straight", "push-straight"],
  ["right", "right", "push-fade"],
];

const strikes = ["heel", "center", "toe", "unknown"];

test("maps all nine start and curve combinations", () => {
  for (const [start, curve, expected] of mappings) {
    assert.equal(decodeBallFlight({ start, curve, strike: "center" }).patternSlug, expected);
  }
});

test("returns complete guidance for all 36 valid input combinations", () => {
  for (const [start, curve] of mappings) {
    for (const strike of strikes) {
      const result = decodeBallFlight({ start, curve, strike });
      assert.ok(result.faceSummary);
      assert.ok(result.pathSummary);
      assert.ok(result.strikeSummary);
      assert.ok(result.techniqueGuidance);
      assert.ok(result.equipmentGuidance);
      assert.ok(result.nextTest);
      assert.ok(result.caveat);
    }
  }
});

test("qualifies face and path interpretations", () => {
  assert.match(decodeBallFlight({ start: "left", curve: "straight", strike: "center" }).faceSummary, /face was left/);
  assert.match(decodeBallFlight({ start: "right", curve: "straight", strike: "center" }).faceSummary, /face was right/);
  assert.match(decodeBallFlight({ start: "straight", curve: "straight", strike: "center" }).faceSummary, /face was near/);

  const left = decodeBallFlight({ start: "straight", curve: "left", strike: "center" }).pathSummary;
  assert.match(left, /closed to the club path/);
  assert.match(left, /does not prove the path was right of the target/);

  const right = decodeBallFlight({ start: "straight", curve: "right", strike: "center" }).pathSummary;
  assert.match(right, /open to the club path/);
  assert.match(right, /does not prove the path was left of the target/);

  const straight = decodeBallFlight({ start: "straight", curve: "straight", strike: "center" }).pathSummary;
  assert.match(straight, /closely matched/);
  assert.match(straight, /does not prove either was square/);
});

test("uses strike as a modifier instead of a diagnosis", () => {
  assert.equal(decodeBallFlight({ start: "right", curve: "right", strike: "heel" }).strikeRole, "supports");
  assert.equal(decodeBallFlight({ start: "left", curve: "left", strike: "toe" }).strikeRole, "supports");
  assert.equal(decodeBallFlight({ start: "left", curve: "left", strike: "heel" }).strikeRole, "opposes");
  assert.equal(decodeBallFlight({ start: "right", curve: "right", strike: "toe" }).strikeRole, "opposes");
  assert.equal(decodeBallFlight({ start: "left", curve: "straight", strike: "heel" }).strikeRole, "ambiguous");
  assert.equal(decodeBallFlight({ start: "left", curve: "right", strike: "center" }).strikeRole, "neutral");
  assert.equal(decodeBallFlight({ start: "left", curve: "right", strike: "unknown" }).strikeRole, "unknown");
});

test("limits gear effect and equipment claims", () => {
  for (const strike of ["heel", "toe"]) {
    for (const curve of ["left", "straight", "right"]) {
      const result = decodeBallFlight({ start: "straight", curve, strike });
      assert.match(result.strikeSummary, /driver or fairway wood/);
      assert.match(result.caveat, /most relevant to drivers and fairway woods/);
    }
  }

  for (const strike of strikes) {
    const guidance = decodeBallFlight({ start: "right", curve: "right", strike }).equipmentGuidance.toLowerCase();
    for (const unsupported of ["will fix", "caused by", "need a stiff", "set your loft"]) {
      assert.equal(guidance.includes(unsupported), false);
    }
  }
});

test("keeps a neutral centered pattern instead of inventing a fault", () => {
  const result = decodeBallFlight({ start: "straight", curve: "straight", strike: "center" });
  assert.match(result.techniqueGuidance, /do not show an obvious directional fault/);
  assert.match(result.nextTest, /ten shots/);
  assert.match(result.nextTest, /keep the pattern/);
});
