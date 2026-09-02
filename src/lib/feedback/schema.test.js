import assert from "node:assert/strict";
import test from "node:test";
import { validateProductFeedback } from "./schema.ts";

test("accepts a minimal anonymous Range Rescue response", () => {
  const result = validateProductFeedback({
    module: "range-rescue",
    planId: "ground-first",
    helpful: true,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.ok && result.value, {
    module: "range-rescue",
    planId: "ground-first",
    helpful: true,
  });
});

test("accepts allowlisted product context and trims the comment", () => {
  const result = validateProductFeedback({
    module: "range-rescue",
    planId: "curves-right",
    helpful: false,
    experience: "just-starting",
    nextHelp: "curve-control",
    comment: "  I needed a slower example.  ",
  });

  assert.equal(result.ok, true);
  assert.equal(result.ok && result.value.comment, "I needed a slower example.");
});

test("rejects arbitrary categories and oversized free text", () => {
  assert.equal(validateProductFeedback({ module: "other", planId: "ground-first", helpful: true }).ok, false);
  assert.equal(validateProductFeedback({ module: "range-rescue", planId: "unknown", helpful: true }).ok, false);
  assert.equal(validateProductFeedback({ module: "range-rescue", planId: "ground-first", helpful: true, experience: "exact-age-24" }).ok, false);
  assert.equal(validateProductFeedback({ module: "range-rescue", planId: "ground-first", helpful: true, comment: "x".repeat(501) }).ok, false);
});
