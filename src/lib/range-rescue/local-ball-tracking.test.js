import assert from "node:assert/strict";
import { test } from "node:test";
import { findBallSeed, stepBallTrack } from "./local-ball-tracking.ts";

function frame(width = 160, height = 120, background = () => 25) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const index = (y * width + x) * 4;
    data.fill(background(x, y), index, index + 3);
    data[index + 3] = 255;
  }
  return { width, height, data };
}

function dot(image, x, y, size = 3) {
  const radius = Math.floor(size / 2);
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
    const index = ((y + dy) * image.width + x + dx) * 4;
    image.data.fill(255, index, index + 3);
  }
  return image;
}

function seed(image, x = 80, y = 70) {
  return findBallSeed(image, { x: x / (image.width - 1), y: y / (image.height - 1) });
}

test("finds the tapped ball center and follows several clear moving frames", () => {
  let state = seed(dot(frame(), 80, 70));
  assert.equal(state.x, 80);
  assert.equal(state.y, 70);
  assert.equal(state.initialArea, 9);
  for (const [x, y] of [[86, 66], [92, 62], [98, 58]]) {
    const result = stepBallTrack(state, dot(frame(), x, y));
    assert.equal(result.stopped, undefined);
    assert.ok(result.state);
    assert.equal(result.state.x, x);
    assert.equal(result.state.y, y);
    assert.equal(result.state.originX, 80);
    assert.equal(result.state.originY, 70);
    assert.equal(result.state.vx, 6);
    assert.equal(result.state.vy, -4);
    state = result.state;
  }
});

test("a stationary ball remains stationary without manufactured motion", () => {
  let state = seed(dot(frame(), 80, 70));
  for (let index = 0; index < 3; index++) {
    const result = stepBallTrack(state, dot(frame(), 80, 70));
    assert.ok(result.state);
    assert.equal(result.state.x, 80);
    assert.equal(result.state.y, 70);
    assert.equal(result.state.vx, 0);
    assert.equal(result.state.vy, 0);
    state = result.state;
  }
});

test("disappearance stops tracking without an extrapolated replacement", () => {
  const initial = seed(dot(frame(), 80, 70));
  const moved = stepBallTrack(initial, dot(frame(), 86, 66)).state;
  assert.ok(moved);
  assert.deepEqual(stepBallTrack(moved, frame()), { stopped: "lost" });
});

test("equally plausible moving bright balls stop the track", () => {
  const initial = seed(dot(frame(), 80, 70));
  const ambiguous = dot(dot(frame(), 70, 70), 90, 70);
  assert.deepEqual(stepBallTrack(initial, ambiguous), { stopped: "lost" });
});

test("a much larger bright occluder cannot replace the ball", () => {
  const initial = seed(dot(frame(), 80, 70));
  assert.deepEqual(stepBallTrack(initial, dot(frame(), 82, 68, 11)), { stopped: "lost" });
});

test("rejects missing or ambiguous seeds and coordinates outside the picture", () => {
  assert.throws(() => seed(frame()), /Could not isolate/);
  assert.throws(() => seed(dot(dot(frame(), 76, 70), 84, 70)), /Could not isolate/);
  for (const position of [{ x: -0.01, y: 0.5 }, { x: 1.01, y: 0.5 }, { x: 0.5, y: NaN }, { x: Infinity, y: 0.5 }]) {
    assert.throws(() => findBallSeed(dot(frame(), 80, 70), position), /inside the picture/);
  }
});

test("invalid frame dimensions or pixel buffers reject; changed frame size stops", () => {
  const initial = seed(dot(frame(), 80, 70));
  for (const image of [frame(15, 120), frame(641, 120), frame(160, 15),
    { ...frame(), width: 160.5 }, { ...frame(), height: NaN },
    { ...frame(), data: new Uint8ClampedArray(4) }]) {
    assert.throws(() => seed(image), /Unsupported analysis frame/);
    assert.throws(() => stepBallTrack(initial, image), /Unsupported analysis frame/);
  }
  assert.deepEqual(stepBallTrack(initial, frame(161, 120)), { stopped: "lost" });
});

test("translated textured background stops even when a ball candidate remains visible", () => {
  // Deterministic, sub-threshold texture gives each background patch a distinct pattern.
  const texture = (x, y) => 20 + ((x * 73 + y * 47 + x * y * 13) % 115 + 115) % 115;
  const before = dot(frame(320, 240, texture), 160, 120);
  const after = dot(frame(320, 240, (x, y) => texture(x - 4, y)), 164, 120);
  assert.deepEqual(stepBallTrack(seed(before, 160, 120), after), { stopped: "camera_moved" });
});

test("unchanged textured background permits clear local ball movement", () => {
  const texture = (x, y) => 20 + (x * 73 + y * 47 + x * y * 13) % 115;
  const before = dot(frame(320, 240, texture), 160, 120);
  const after = dot(frame(320, 240, texture), 170, 115);
  const result = stepBallTrack(seed(before, 160, 120), after);
  assert.ok(result.state);
  assert.equal(result.state.x, 170);
  assert.equal(result.state.y, 115);
});
