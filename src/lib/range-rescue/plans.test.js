import assert from "node:assert/strict";
import { RANGE_RESCUE_PLAN_IDS, RANGE_RESCUE_PLANS, getRangeRescuePlan } from "./plans.ts";

assert.equal(RANGE_RESCUE_PLANS.length, 7, "keep existing plan IDs available to saved links and visual guidance");
assert.deepEqual(RANGE_RESCUE_PLANS.map((plan) => plan.id), RANGE_RESCUE_PLAN_IDS);

for (const plan of RANGE_RESCUE_PLANS) {
  assert.equal(getRangeRescuePlan(plan.id), plan);
  assert.equal(plan.test.length, 3);
  for (const field of [plan.optionLabel, plan.title, plan.summary, plan.reset, plan.change, plan.better, plan.fallback]) {
    assert.ok(field.trim().length > 0, `${plan.id} has complete guidance`);
  }
  assert.ok(plan.test.some((step) => /hit 5 balls/i.test(step)), `${plan.id} must supply all five counted balls, separate from rehearsals`);
  assert.match(plan.better, /of 5/, `${plan.id} must assess the same five-ball set`);
  assert.match(plan.better, /starting shots/, `${plan.id} must compare with the golfer's own starting point`);
}

const serialized = JSON.stringify(RANGE_RESCUE_PLANS).toLowerCase();
for (const forbidden of ["supabase", "localstorage", "email", "account", "personality", "analytics"]) {
  assert.equal(serialized.includes(forbidden), false, `plans must not mention ${forbidden}`);
}

for (const jargon of ["one more club", "shorter club", "short iron", "three-quarter", "70%", "toe line", "playable shape", "chip or pitch"]) {
  assert.equal(serialized.includes(jargon), false, `beginner instructions must not depend on unexplained wording: ${jargon}`);
}

assert.match(getRangeRescuePlan("no-pattern").optionLabel, /not sure/, "beginners do not need to classify their own swing fault");
assert.match(getRangeRescuePlan("no-pattern").better, /even if it rolls/, "first contact counts without requiring height or accuracy");
assert.doesNotMatch(getRangeRescuePlan("thin-or-top").change, /closer/, "low ball flight alone does not establish a stance-distance correction");
for (const id of ["curves-left", "curves-right"]) {
  assert.match(getRangeRescuePlan(id).better, /because they travel less/, "a shorter flight is not proof of corrected swing mechanics");
}

console.log("range rescue content tests passed");
