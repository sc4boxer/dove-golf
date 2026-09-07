import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeShots, getSessionFeedback } from "./beginner-session.ts";

test("airborne shots also count as contact", () => {
  assert.deepEqual(summarizeShots(["air", "contact", "miss", "air", "miss"]), { contact: 3, airborne: 2 });
});
test("incomplete sets cannot produce a comparison", () => {
  assert.throws(() => getSessionFeedback([], Array(5).fill("air")), /five shots/);
});
test("uncertain observations do not count as contact or produce improvement claims", () => {
  assert.deepEqual(summarizeShots(["unsure", "miss"]), { contact: 0, airborne: 0 });
  assert.match(getSessionFeedback(Array(5).fill("unsure"), Array(5).fill("air")).next, /cannot compare/);
});
test("feedback adapts to improvement, repeatability, struggle, and regression", () => {
  const set = (value) => Array(5).fill(value);
  assert.match(getSessionFeedback(set("miss"), set("contact")).title, /useful starting/);
  assert.match(getSessionFeedback(set("air"), set("air")).title, /repeat/);
  assert.match(getSessionFeedback(set("miss"), set("miss")).next, /instructor/);
  assert.match(getSessionFeedback(set("air"), set("contact")).next, /low tee/);
  assert.match(getSessionFeedback(set("air"), ["air", "air", "air", "miss", "miss"]).title, /simple/);
});
