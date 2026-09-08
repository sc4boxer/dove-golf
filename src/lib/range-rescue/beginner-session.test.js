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

test("driver keeps the same comparison rules with club-appropriate next steps", () => {
  const set = (value) => Array(5).fill(value);
  const cases = [
    [set("unsure"), set("air")],
    [set("miss"), set("contact")],
    [set("air"), set("air")],
    [set("miss"), set("miss")],
    [set("air"), set("contact")],
    [set("air"), ["air", "air", "air", "miss", "miss"]],
  ];
  for (const [before, after] of cases) {
    const original = getSessionFeedback(before, after);
    assert.deepEqual(getSessionFeedback(before, after, "iron"), original);
    const driver = getSessionFeedback(before, after, "driver");
    assert.equal(driver.title, original.title, "club choice does not change scoring");
    assert.match(driver.next, /driver/);
    assert.doesNotMatch(driver.next, /low tee|grass|mat|brush/i);
  }
  assert.match(getSessionFeedback(set("unsure"), set("air"), "driver").next, /cannot compare/);
  assert.match(getSessionFeedback(set("air"), set("contact"), "driver").next, /new starting set/);
  assert.throws(() => getSessionFeedback([], set("air"), "driver"), /five shots/);
});
