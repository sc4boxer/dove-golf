import assert from "node:assert/strict";
import { RANGE_RESCUE_PLAN_IDS, RANGE_RESCUE_PLANS, getRangeRescuePlan } from "./plans.ts";

assert.equal(RANGE_RESCUE_PLANS.length, 7, "MVP should keep the choice set bounded");
assert.deepEqual(RANGE_RESCUE_PLANS.map((plan) => plan.id), RANGE_RESCUE_PLAN_IDS);

for (const plan of RANGE_RESCUE_PLANS) {
  assert.equal(getRangeRescuePlan(plan.id), plan);
  assert.equal(plan.test.length, 3);
  for (const field of [plan.optionLabel, plan.title, plan.summary, plan.reset, plan.change, plan.better, plan.fallback]) {
    assert.ok(field.trim().length > 0, `${plan.id} has complete guidance`);
  }
}

const serialized = JSON.stringify(RANGE_RESCUE_PLANS).toLowerCase();
for (const forbidden of ["supabase", "localstorage", "email", "account", "personality", "analytics"]) {
  assert.equal(serialized.includes(forbidden), false, `plans must not mention ${forbidden}`);
}

console.log("range rescue content tests passed");
