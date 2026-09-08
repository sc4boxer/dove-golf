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
  assert.deepEqual(SAMPLE_START, ["air", "contact", "miss", "contact", "air"]);
  assert.deepEqual(SAMPLE_AFTER, ["contact", "air", "air", "air", "air"]);
  assert.ok(Object.isFrozen(SAMPLE_START));
  assert.ok(Object.isFrozen(SAMPLE_AFTER));
});

test("driver tasks cover every practice branch with a consistent tee setup", () => {
  const cases = [
    [Array(5).fill("unsure"), "clarify"],
    [Array(5).fill("miss"), "contact"],
    [Array(5).fill("contact"), "height"],
    [SAMPLE_START, "height"],
    [["air", "air", "air", "miss", "miss"], "repeat"],
  ];
  for (const [shots, id] of cases) {
    const original = [...shots];
    const result = getShotPractice(shots, "driver");
    assert.equal(result.id, id);
    assert.match(result.instruction, /same driver, tee height, and ball position for both sets/);
    assert.doesNotMatch(JSON.stringify(result), /brush|low tee|same iron|waist height/);
    if (["contact", "height"].includes(id)) {
      assert.match(result.instruction, /shorter backswing/);
      assert.match(result.instruction, /above the mat or grass/);
    }
    if (id === "clarify") assert.match(result.measure, /raised tee does not count/);
    if (id === "height") assert.match(result.measure, /above the ground beyond the tee/);
    if (id === "repeat") assert.match(result.instruction, /same swing at an easy pace/);
    assert.deepEqual(shots, original);
  }
  assert.throws(() => getShotPractice([], "driver"), /exactly five/);
  assert.throws(() => getShotPractice(["air", "air", "air", "air", "invalid"], "driver"), /Each shot must/);
});

test("driver non-repeat feedback reuses established driver feedback for all comparison branches", () => {
  const before = SAMPLE_START;
  const cases = [
    [before, ["air", "air", "air", "air", "unsure"]],
    [Array(5).fill("unsure"), SAMPLE_AFTER],
    [before, Array(5).fill("miss")],
    [before, SAMPLE_AFTER],
    [Array(5).fill("miss"), Array(5).fill("contact")],
    [before, Array(5).fill("contact")],
  ];
  for (const [initial, after] of cases) {
    const result = getShotPracticeFeedback(initial, after, "driver");
    assert.deepEqual(result, getSessionFeedback(initial, after, "driver"));
    assert.doesNotMatch(result.next, /brush|low tee|same iron/);
    assert.match(result.next, /tee height/);
  }
});

test("driver repeat feedback preserves the easy swing for improvements, stable and worse sets", () => {
  const before = ["air", "air", "air", "miss", "miss"];
  for (const after of [Array(5).fill("air"), before, Array(5).fill("contact")]) {
    const result = getShotPracticeFeedback(before, after, "driver");
    assert.equal(result.title, getSessionFeedback(before, after, "driver").title);
    assert.match(result.next, /same swing at an easy pace/);
    assert.match(result.next, /same driver, tee height, and ball position/);
    assert.match(result.next, /do not measure accuracy or a corrected curve/);
    assert.doesNotMatch(result.next, /shorter|brush|low tee|same iron/);
  }
  for (const after of [Array(5).fill("miss"), ["air", "air", "air", "air", "unsure"]]) {
    assert.deepEqual(getShotPracticeFeedback(before, after, "driver"), getSessionFeedback(before, after, "driver"));
  }
  assert.throws(() => getShotPracticeFeedback(before, [], "driver"), /five shots/);
});

test("explicit iron mode preserves all default practice and feedback behavior", () => {
  for (const before of [Array(5).fill("unsure"), Array(5).fill("miss"), SAMPLE_START, SAMPLE_AFTER]) {
    assert.deepEqual(getShotPractice(before, "iron"), getShotPractice(before));
    for (const after of [Array(5).fill("unsure"), Array(5).fill("miss"), SAMPLE_START, SAMPLE_AFTER]) {
      assert.deepEqual(getShotPracticeFeedback(before, after, "iron"), getShotPracticeFeedback(before, after));
    }
  }
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
