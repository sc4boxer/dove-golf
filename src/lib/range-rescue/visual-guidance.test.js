import assert from "node:assert/strict";
import test from "node:test";
import { RANGE_RESCUE_PLAN_IDS } from "./plans.ts";
import { RANGE_RESCUE_VISUAL_GUIDANCE } from "./visual-guidance.ts";

test("every Range Rescue plan has complete visual guidance", () => {
  assert.deepEqual(Object.keys(RANGE_RESCUE_VISUAL_GUIDANCE).sort(), [...RANGE_RESCUE_PLAN_IDS].sort());

  for (const id of RANGE_RESCUE_PLAN_IDS) {
    const guidance = RANGE_RESCUE_VISUAL_GUIDANCE[id];
    for (const value of Object.values(guidance)) {
      assert.equal(typeof value, "string");
      assert.ok(value.trim().length > 0, `${id} has an empty visual guidance field`);
    }
  }
});
