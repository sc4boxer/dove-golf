import assert from "node:assert/strict";
import test from "node:test";
import { nextToolIndex, swipeStep } from "./showcaseInteraction.ts";

test("taps, short drags, and vertical scrolling never change previews", () => {
  for (const [dx, dy] of [[0, 0], [12, 0], [48, 0], [-48, 0], [60, 100], [-60, -100], [65, 50]]) {
    assert.equal(swipeStep(dx, dy), 0, `${dx}, ${dy}`);
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(swipeStep(value, 0), 0);
    assert.equal(swipeStep(60, value), 0);
  }
});

test("deliberate swipes advance once and wrap in either direction", () => {
  assert.equal(nextToolIndex(0 + swipeStep(80, 4), 3), 2);
  assert.equal(nextToolIndex(2 + swipeStep(-80, -4), 3), 0);
  assert.equal(nextToolIndex(0 + swipeStep(-500, 10), 3), 1);
  assert.equal(nextToolIndex(2 + swipeStep(500, -10), 3), 1);
});

test("keyboard and automatic next selection cycle through every module", () => {
  let selected = 0;
  const visited = [];
  for (let i = 0; i < 6; i++) {
    selected = nextToolIndex(selected + 1, 3);
    visited.push(selected);
  }
  assert.deepEqual(visited, [1, 2, 0, 1, 2, 0]);
});
