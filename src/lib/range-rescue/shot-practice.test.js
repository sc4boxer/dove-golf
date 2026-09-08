import assert from "node:assert/strict";
import { test } from "node:test";
import { getShotPractice, getShotPracticeFeedback, SAMPLE_START, SAMPLE_AFTER } from "./shot-practice.ts";
import { getSessionFeedback } from "./beginner-session.ts";

test("practice selection requires five valid outcomes", () => {
  for (const count of [0, 4, 6]) {
    assert.throws(() => getShotPractice(Array(count).fill("air")), /exactly five shots/);
  }
  for (const invalid of ["landed", null, undefined, 1]) {
    assert.throws(() => getShotPractice(["air", "air", "air", "air", invalid]), /Each shot must/);
  }
  assert.throws(() => getShotPractice(Array(5)), /Each shot must/);
});

test("any unclear result asks for observation instead of choosing an exercise", () => {
  for (const known of ["miss", "contact", "air"]) {
    const result = getShotPractice([known, known, "unsure", known, known]);
    assert.equal(result.id, "clarify");
    assert.match(result.observation, /cannot support a confident practice choice/);
    assert.match(result.instruction, /fresh five-shot starting set/);
    assert.doesNotMatch(result.observation, /You recorded contact/);
  }
});

test("zero contacts gets a smaller task and instructor fallback", () => {
  const result = getShotPractice(Array(5).fill("miss"));
  assert.equal(result.id, "contact");
  assert.match(result.observation, /contact on 0 of 5/);
  assert.match(result.instruction, /waist height/);
  assert.match(result.instruction, /range instructor/);
});

test("some contact and fewer than three airborne attempts selects the brush exercise", () => {
  for (const shots of [Array(5).fill("contact"), ["contact", "miss", "miss", "miss", "miss"], SAMPLE_START]) {
    const result = getShotPractice(shots);
    assert.equal(result.id, "height");
    assert.match(result.instruction, /brush the grass or mat/);
  }
  assert.equal(getShotPractice(SAMPLE_START).observation, "You recorded contact on 4 of 5 attempts. 2 of 5 became airborne.");
});

test("three or more airborne attempts selects repetition without a grade", () => {
  for (const shots of [["air", "air", "air", "miss", "miss"], SAMPLE_AFTER, Array(5).fill("air")]) {
    const result = getShotPractice(shots);
    assert.equal(result.id, "repeat");
    assert.match(result.instruction, /same swing at an easy pace/);
    assert.match(result.measure, /do not establish a lasting swing change/);
  }
});

test("every practice preserves the comparison setup and leaves inputs unchanged", () => {
  for (const shots of [Array(5).fill("unsure"), Array(5).fill("miss"), SAMPLE_START, SAMPLE_AFTER]) {
    const before = [...shots];
    const result = getShotPractice(shots);
    assert.match(result.instruction, /same iron, ball position, and grass, mat, or tee setup for both sets/);
    assert.deepEqual(shots, before);
  }
  assert.deepEqual(SAMPLE_START, ["miss", "contact", "air", "contact", "air"]);
  assert.deepEqual(SAMPLE_AFTER, ["contact", "air", "air", "air", "air"]);
  assert.ok(Object.isFrozen(SAMPLE_START));
  assert.ok(Object.isFrozen(SAMPLE_AFTER));
});

test("repeat comparisons retain the instructed easy swing without introducing a smaller swing", () => {
  const before = ["air", "air", "air", "miss", "miss"];
  for (const after of [Array(5).fill("air"), before, Array(5).fill("contact")]) {
    const result = getShotPracticeFeedback(before, after);
    assert.equal(result.title, getSessionFeedback(before, after).title);
    assert.match(result.next, /same swing at an easy pace/);
    assert.match(result.next, /same iron, ball position/);
    assert.match(result.next, /do not establish a lasting swing change/);
    assert.doesNotMatch(result.next, /small swing|smaller swing|low tee/);
  }
});

test("comparison uncertainty, no contact and non-repeat tasks preserve existing feedback", () => {
  const repeat = Array(5).fill("air");
  const cases = [
    [repeat, ["air", "air", "air", "air", "unsure"]],
    [repeat, Array(5).fill("miss")],
    [SAMPLE_START, SAMPLE_AFTER],
    [Array(5).fill("miss"), Array(5).fill("contact")],
    [Array(5).fill("unsure"), SAMPLE_AFTER],
  ];
  for (const [before, after] of cases) {
    assert.deepEqual(getShotPracticeFeedback(before, after), getSessionFeedback(before, after));
  }
  assert.throws(() => getShotPracticeFeedback([], repeat), /five shots/);
  assert.throws(() => getShotPracticeFeedback(repeat, []), /five shots/);
});
