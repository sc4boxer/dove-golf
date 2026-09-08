import assert from "node:assert/strict";
import { test } from "node:test";
import { findBallSeed, stepBallTrack, trackBallInVideo, searchAutomaticBall, autoTrackBallInVideo } from "./local-ball-tracking.ts";

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
function videoHarness(t, { moving = true, failSeek = false, frameAt, initialTransparent = false } = {}) {
  let decoded = !initialTransparent;
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
      if (value > 0) decoded = true;
      queueMicrotask(() => this.dispatchEvent(new Event(failSeek ? "error" : "seeked")));
    }
    pause() { this.paused = true; }
  }
  const video = new Video();
  const canvas = {
    width: 0, height: 0,
    getContext: () => ({
      drawImage() {},
      getImageData: () => !decoded ? { width: 160, height: 120, data: new Uint8ClampedArray(160 * 120 * 4) } : frameAt ? frameAt(video.currentTime) : dot(frame(), 80 + (moving ? Math.round(video.currentTime * 60) : 0), 70),
    }),
  };
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  let canvasCount = 0;
  Object.defineProperty(globalThis, "document", { configurable: true, value: { createElement: () => canvasCount++ === 0 ? canvas : { ...canvas } } });
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

test("automatic search finds a non-centered candidate only after rest and successive movement", () => {
  let search;
  for (let i = 0; i < 6; i++) {
    const result = searchAutomaticBall(search, dot(frame(), 30 + Math.max(0, i - 2) * 6, 95), i / 10);
    search = result.search;
    if (i < 5) assert.equal(result.seed, undefined);
    else assert.deepEqual(result.seed, { x: 30 / 159, y: 95 / 119, time: .2 });
  }
});

test("automatic search does not turn stationary, missing, or already moving dots into a shot", () => {
  for (const draw of [() => frame(), () => dot(frame(), 30, 95), i => dot(frame(), 30 + i * 6, 95), i => i < 3 ? dot(frame(), 30, 95) : frame()]) {
    let search;
    for (let i = 0; i < 8; i++) {
      const result = searchAutomaticBall(search, draw(i), i / 10);
      search = result.search;
      assert.equal(result.seed, undefined);
    }
  }
});

test("automatic search refuses simultaneous moving balls instead of picking one", () => {
  let search;
  for (let i = 0; i < 4; i++) {
    const dx = Math.max(0, i - 2) * 6;
    const result = searchAutomaticBall(search, dot(dot(frame(320, 240), 50 + dx, 190), 240 + dx, 190), i / 10);
    search = result.search;
    assert.equal(result.seed, undefined);
    if (i === 3) assert.equal(result.problem, "ambiguous");
  }
});

test("automatic search can distinguish a moving candidate from a separate stationary ball", () => {
  let search;
  for (let i = 0; i < 6; i++) {
    const result = searchAutomaticBall(search, dot(dot(frame(320, 240), 50 + Math.max(0, i - 2) * 6, 190), 240, 190), i / 10);
    search = result.search;
    assert.equal(result.problem, undefined);
    if (i === 5) assert.equal(result.seed.x, 50 / 319);
  }
});

test("automatic search rejects crowded candidates and camera translation", () => {
  const crowded = frame(320, 240);
  for (let i = 0; i < 13; i++) dot(crowded, 15 + i * 20, 190);
  assert.equal(searchAutomaticBall(undefined, crowded, 0).problem, "ambiguous");
  const texture = (x, y) => 20 + ((x * 73 + y * 47 + x * y * 13) % 115 + 115) % 115;
  const initial = searchAutomaticBall(undefined, dot(frame(320, 240, texture), 160, 120), 0);
  const shifted = dot(frame(320, 240, (x, y) => texture(x - 4, y)), 164, 120);
  assert.equal(searchAutomaticBall(initial.search, shifted, .1).problem, "camera_moved");
  assert.throws(() => searchAutomaticBall(initial.search, shifted, 0), /advance in time/);
});

test("automatic video analysis scans from the beginning without a user seed and restores the original replay position", async t => {
  const { video, canvas, signal } = videoHarness(t, { frameAt: time => dot(frame(), 30 + Math.round(Math.max(0, time - .4) * 60), 95) });
  video.duration = 1.2;
  video.time = .9;
  const progress = [];
  const result = await autoTrackBallInVideo(video, { signal, onProgress: value => progress.push(value) });
  assert.ok(result.track);
  assert.ok(result.track.points[0].x < .25);
  assert.ok(result.track.points.at(-1).x > result.track.points[0].x);
  assert.equal(progress.at(-1), 100);
  assert.equal(video.currentTime, .9);
  assert.equal(canvas.width, 0);
  assert.match(result.detail, /does not establish contact or flight/);
});

test("automatic video analysis returns no claimed track for stationary footage", async t => {
  const { video, canvas, signal } = videoHarness(t, { moving: false });
  const result = await autoTrackBallInVideo(video, { signal, onProgress() {} });
  assert.equal(result.track, null);
  assert.match(result.detail, /does not mean you missed/);
  assert.equal(canvas.width, 0);
});

test("automatic analysis aborts and releases resources without rewinding a replacement clip", async t => {
  const { video, canvas } = videoHarness(t);
  const controller = new AbortController();
  await assert.rejects(autoTrackBallInVideo(video, {
    signal: controller.signal,
    onProgress: () => { video.currentSrc = "blob:replacement"; video.time = .2; controller.abort(); },
  }), { name: "AbortError" });
  assert.equal(video.currentTime, .2);
  assert.equal(canvas.width, 0);
});

test("automatic analysis restores the replay on decode failure", async t => {
  const { video, canvas, signal } = videoHarness(t, { failSeek: true });
  video.time = .2;
  await assert.rejects(autoTrackBallInVideo(video, { signal, onProgress() {} }), /Could not decode/);
  assert.equal(video.currentTime, .2);
  assert.equal(canvas.width, 0);
});

test("automatic analysis searches beyond the opening seconds for a late shot", async t => {
  const { video, signal } = videoHarness(t, { frameAt: time => dot(frame(), 30 + Math.round(Math.max(0, time - 20) * 30), 95) });
  video.duration = 22;
  const result = await autoTrackBallInVideo(video, { signal, onProgress() {} });
  assert.ok(result.track);
  assert.ok(result.track.points[0].time >= 20);
});

test("automatic analysis can return a partial visible path but describes the loss", async t => {
  const { video, signal } = videoHarness(t, { frameAt: time => time > 1 ? frame() : dot(frame(), 30 + Math.round(Math.max(0, time - .4) * 60), 95) });
  video.duration = 1.4;
  const result = await autoTrackBallInVideo(video, { signal, onProgress() {} });
  assert.equal(result.track.status, "lost");
  assert.ok(result.track.points.at(-1).time <= 1);
  assert.match(result.detail, /stops at the last detected position/);
});

test("automatic analysis aborts a source replacement during seeking before drawing it", async t => {
  const { video, canvas, signal } = videoHarness(t);
  video.time = .2;
  video.addEventListener("seeked", () => { video.currentSrc = "blob:new"; video.time = .3; }, { once: true });
  await assert.rejects(autoTrackBallInVideo(video, { signal, onProgress() {} }), { name: "AbortError" });
  assert.equal(video.currentTime, .3);
  assert.equal(canvas.width, 0);
});

test("automatic analysis cancellation during refinement restores the original time", async t => {
  const { video, canvas } = videoHarness(t, { frameAt: time => dot(frame(), 30 + Math.round(Math.max(0, time - .4) * 60), 95) });
  video.duration = 1.2;
  video.time = .9;
  const controller = new AbortController();
  await assert.rejects(autoTrackBallInVideo(video, { signal: controller.signal, onProgress: progress => { if (progress > 65) controller.abort(); } }), { name: "AbortError" });
  assert.equal(video.currentTime, .9);
  assert.equal(canvas.width, 0);
});

test("automatic analysis forces decoding before reading an initially transparent video surface", async t => {
  const { video, signal } = videoHarness(t, { initialTransparent: true, frameAt: time => dot(frame(), 30 + Math.round(Math.max(0, time - .4) * 60), 95) });
  video.readyState = 4;
  video.duration = 1.2;
  const result = await autoTrackBallInVideo(video, { signal, onProgress() {} });
  assert.ok(result.track);
  assert.equal(video.currentTime, 0);
});

test("transparent frame data is a decode problem, not evidence of background motion", () => {
  const transparent = { width: 160, height: 120, data: new Uint8ClampedArray(160 * 120 * 4) };
  assert.throws(() => searchAutomaticBall(undefined, transparent, 0), /not ready to read/);
  const initial = searchAutomaticBall(undefined, dot(frame(), 30, 95), 0);
  assert.throws(() => searchAutomaticBall(initial.search, transparent, .1), /not ready to read/);
});
