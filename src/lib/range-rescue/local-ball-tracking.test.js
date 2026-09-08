import assert from "node:assert/strict";
import { test } from "node:test";
import { findBallSeed, stepBallTrack, trackBallInVideo } from "./local-ball-tracking.ts";

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

// Exercise the browser lifecycle boundary without claiming to test real codecs.
function videoHarness(t, { moving = true, failSeek = false } = {}) {
  class Video extends EventTarget {
    videoWidth = 160;
    videoHeight = 120;
    duration = .4;
    readyState = 2;
    currentSrc = "blob:original";
    isConnected = true;
    paused = false;
    time = 0;
    get currentTime() { return this.time; }
    set currentTime(value) {
      this.time = value;
      queueMicrotask(() => this.dispatchEvent(new Event(failSeek ? "error" : "seeked")));
    }
    pause() { this.paused = true; }
  }
  const video = new Video();
  const canvas = {
    width: 0, height: 0,
    getContext: () => ({
      drawImage() {},
      getImageData: () => dot(frame(), 80 + (moving ? Math.round(video.currentTime * 60) : 0), 70),
    }),
  };
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: { createElement: () => canvas } });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  });
  return { video, canvas, signal: new AbortController().signal, seed: { x: 80 / 159, y: 70 / 119 } };
}

test("video analysis reports detected motion and restores the replay and canvas", async t => {
  const { video, canvas, signal, seed } = videoHarness(t);
  const progress = [];
  const result = await trackBallInVideo(video, seed, { signal, onProgress: value => progress.push(value) });
  assert.equal(result.status, "tracked");
  assert.ok(result.points.length > 2);
  assert.ok(result.points.at(-1).x > result.points[0].x);
  assert.equal(progress.at(-1), 100);
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(canvas.width, 0);
  assert.equal(canvas.height, 0);
});

test("video analysis distinguishes no visible motion from a confirmed miss", async t => {
  const { video, signal, seed } = videoHarness(t, { moving: false });
  const result = await trackBallInVideo(video, seed, { signal, onProgress() {} });
  assert.equal(result.status, "no_motion");
  assert.match(result.detail, /does not mean you missed/);
});

test("canceling an active analysis rejects and releases the canvas and replay", async t => {
  const { video, canvas, seed } = videoHarness(t);
  const controller = new AbortController();
  await assert.rejects(trackBallInVideo(video, seed, {
    signal: controller.signal,
    onProgress: () => controller.abort(),
  }), { name: "AbortError" });
  assert.equal(video.currentTime, 0);
  assert.equal(canvas.width, 0);
  assert.equal(canvas.height, 0);
});

test("a decode failure rejects and releases analysis resources", async t => {
  const { video, canvas, signal, seed } = videoHarness(t, { failSeek: true });
  await assert.rejects(trackBallInVideo(video, seed, { signal, onProgress() {} }), /Could not decode/);
  assert.equal(video.currentTime, 0);
  assert.equal(canvas.width, 0);
});

test("cleanup does not rewind a replacement clip after cancellation", async t => {
  const { video, canvas, seed } = videoHarness(t);
  const controller = new AbortController();
  await assert.rejects(trackBallInVideo(video, seed, {
    signal: controller.signal,
    onProgress: () => {
      video.currentSrc = "blob:replacement";
      video.time = .2;
      controller.abort();
    },
  }), { name: "AbortError" });
  assert.equal(video.currentTime, .2);
  assert.equal(canvas.width, 0);
});
