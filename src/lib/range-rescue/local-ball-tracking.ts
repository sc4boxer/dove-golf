export type TrackPoint = { x: number; y: number; time: number };
export type PixelFrame = { width: number; height: number; data: Uint8ClampedArray };
type Blob = { x: number; y: number; area: number; light: number };
export type BallTrackState = Blob & { vx: number; vy: number; originX: number; originY: number; initialArea: number; threshold: number; previous: PixelFrame };
export type TrackResult = { points: TrackPoint[]; status: "tracked" | "lost" | "camera_moved" | "no_motion"; detail: string };
const gray = (frame: PixelFrame, x: number, y: number) => {
  const i = (Math.floor(y) * frame.width + Math.floor(x)) * 4;
  return (frame.data[i] * 3 + frame.data[i + 1] * 6 + frame.data[i + 2]) / 10;
};
function validateFrame(frame: PixelFrame) {
  if (!Number.isInteger(frame.width) || !Number.isInteger(frame.height) || frame.width < 16 || frame.height < 16 || frame.width > 640 || frame.height > 640 || frame.data.length !== frame.width * frame.height * 4) throw new Error("Unsupported analysis frame.");
}
function blobs(frame: PixelFrame, cx: number, cy: number, radius: number, threshold: number, maxArea: number): Blob[] {
  const x0 = Math.max(0, Math.floor(cx - radius)), y0 = Math.max(0, Math.floor(cy - radius));
  const x1 = Math.min(frame.width - 1, Math.ceil(cx + radius)), y1 = Math.min(frame.height - 1, Math.ceil(cy + radius));
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const seen = new Uint8Array(w * h);
  const bright = (x: number, y: number) => {
    const i = (y * frame.width + x) * 4;
    const r = frame.data[i], g = frame.data[i + 1], b = frame.data[i + 2];
    return gray(frame, x, y) >= threshold && Math.max(r, g, b) - Math.min(r, g, b) < 90;
  };
  const result: Blob[] = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const index = (y - y0) * w + x - x0;
    if (seen[index]) continue;
    seen[index] = 1;
    if (!bright(x, y)) continue;
    const queue = [[x, y]]; let area = 0, sx = 0, sy = 0, light = 0;
    let minX = x, maxX = x, minY = y, maxY = y;
    for (let head = 0; head < queue.length; head++) {
      const [px, py] = queue[head]; area++; sx += px; sy += py; light += gray(frame, px, py);
      minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py);
      for (const [nx, ny] of [[px - 1, py], [px + 1, py], [px, py - 1], [px, py + 1]]) {
        if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
        const ni = (ny - y0) * w + nx - x0;
        if (seen[ni]) continue;
        seen[ni] = 1; if (bright(nx, ny)) queue.push([nx, ny]);
      }
    }
    const bw = maxX - minX + 1, bh = maxY - minY + 1;
    if (area >= 2 && area <= maxArea && Math.max(bw / bh, bh / bw) <= 2.8 && area / (bw * bh) >= .3 && minX > x0 && maxX < x1 && minY > y0 && maxY < y1) result.push({ x: sx / area, y: sy / area, area, light: light / area });
  }
  return result;
}

export function findBallSeed(frame: PixelFrame, seed: { x: number; y: number }): BallTrackState {
  validateFrame(frame);
  if (![seed.x, seed.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) throw new Error("Mark the ball inside the picture.");
  const x = seed.x * (frame.width - 1), y = seed.y * (frame.height - 1);
  const candidates = blobs(frame, x, y, 14, 155, 150).map(blob => ({ ...blob, distance: Math.hypot(blob.x - x, blob.y - y) })).filter(blob => blob.distance <= 9).sort((a, b) => a.distance - b.distance);
  if (!candidates.length || candidates[1] && candidates[1].distance - candidates[0].distance < 3) throw new Error("Could not isolate a small, light-colored ball at that point. Try a clearer frame and mark its center. This experiment may not work with this clip.");
  const ball = candidates[0];
  return { ...ball, vx: 0, vy: 0, originX: ball.x, originY: ball.y, initialArea: ball.area, threshold: Math.max(145, Math.min(220, ball.light - 40)), previous: frame };
}

function backgroundMoved(before: PixelFrame, after: PixelFrame, ball: Blob) {
  const votes: string[] = [];
  let changed = 0, samples = 0;
  for (const [qx, qy] of [[.25, .25], [.75, .25], [.25, .75], [.75, .75]]) {
    const positions: [number, number][] = [];
    for (let dy = -18; dy <= 18; dy += 6) for (let dx = -18; dx <= 18; dx += 6) {
      const x = Math.round(after.width * qx + dx), y = Math.round(after.height * qy + dy);
      if (x < 6 || y < 6 || x >= after.width - 6 || y >= after.height - 6 || Math.hypot(x - ball.x, y - ball.y) < 40) continue;
      positions.push([x, y]);
      if (Math.abs(gray(before, x, y) - gray(after, x, y)) > 32) changed++;
      samples++;
    }
    if (positions.length < 12) continue;
    const score = (dx: number, dy: number) => positions.reduce((sum, [x, y]) => sum + Math.abs(gray(before, x, y) - gray(after, x + dx, y + dy)), 0) / positions.length;
    const baseline = score(0, 0); let best = baseline, shift = "";
    for (const dy of [-4, -2, 0, 2, 4]) for (const dx of [-4, -2, 0, 2, 4]) {
      const value = score(dx, dy); if (value < best) { best = value; shift = `${dx},${dy}`; }
    }
    if (shift && baseline - best > 8) votes.push(shift);
  }
  return votes.some(vote => votes.filter(v => v === vote).length >= 3) || samples > 30 && changed / samples > .5;
}

export function stepBallTrack(state: BallTrackState, frame: PixelFrame): { state?: BallTrackState; stopped?: "lost" | "camera_moved" } {
  validateFrame(frame);
  if (frame.width !== state.previous.width || frame.height !== state.previous.height) return { stopped: "lost" };
  if (backgroundMoved(state.previous, frame, state)) return { stopped: "camera_moved" };
  const predictedX = Math.max(0, Math.min(frame.width - 1, state.x + state.vx));
  const predictedY = Math.max(0, Math.min(frame.height - 1, state.y + state.vy));
  const candidates = blobs(frame, predictedX, predictedY, 72, state.threshold, Math.max(12, state.initialArea * 2.5))
    .filter(blob => blob.area >= Math.max(2, state.initialArea * .3) && Math.hypot(blob.x - state.x, blob.y - state.y) <= 85)
    .filter(blob => Math.hypot(blob.x - state.x, blob.y - state.y) < 3 || Math.abs(gray(state.previous, blob.x, blob.y) - blob.light) > 18)
    .map(blob => ({ ...blob, score: Math.hypot(blob.x - predictedX, blob.y - predictedY) / 72 + Math.abs(Math.log(blob.area / state.area)) * .3 + Math.abs(blob.light - state.light) / 160 }))
    .sort((a, b) => a.score - b.score);
  const best = candidates[0];
  if (!best || best.score > 1.3 || candidates[1] && candidates[1].score - best.score < .15) return { stopped: "lost" };
  return { state: { ...state, ...best, vx: best.x - state.x, vy: best.y - state.y, previous: frame } };
}

function seekVideo(video: HTMLVideoElement, time: number, signal: AbortSignal) {
  signal.throwIfAborted();
  if (Math.abs(video.currentTime - time) < .001 && video.readyState >= 2) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener("seeked", done); video.removeEventListener("error", fail); signal.removeEventListener("abort", abort); };
    const done = () => { cleanup(); resolve(); };
    const fail = () => { cleanup(); reject(new Error("Could not decode this part of the video. Try another clip.")); };
    const abort = () => { cleanup(); reject(new DOMException("Tracking canceled", "AbortError")); };
    const timer = setTimeout(fail, 4000);
    video.addEventListener("seeked", done, { once: true }); video.addEventListener("error", fail, { once: true }); signal.addEventListener("abort", abort, { once: true });
    video.currentTime = time;
  });
}

export async function trackBallInVideo(video: HTMLVideoElement, seed: { x: number; y: number }, { signal, onProgress }: { signal: AbortSignal; onProgress: (progress: number) => void }): Promise<TrackResult> {
  if (!video.videoWidth || !video.videoHeight || !Number.isFinite(video.duration) || video.duration <= 0 || video.duration > 30) throw new Error("Choose a playable clip up to 30 seconds long.");
  const start = video.currentTime;
  const source = video.currentSrc || video.src;
  if (video.duration - start < .15) throw new Error("Move the replay to just before the shot, then mark the ball again.");
  video.pause();
  const ratio = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas"); canvas.width = Math.round(video.videoWidth * ratio); canvas.height = Math.round(video.videoHeight * ratio);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser cannot read video frames. You can still record your outcome.");
  const grab = () => { context.drawImage(video, 0, 0, canvas.width, canvas.height); return context.getImageData(0, 0, canvas.width, canvas.height); };
  const points: TrackPoint[] = [];
  const startedAt = performance.now();
  try {
    signal.throwIfAborted();
    await seekVideo(video, start, signal);
    let state = findBallSeed(grab(), seed);
    points.push({ x: state.x / (canvas.width - 1), y: state.y / (canvas.height - 1), time: start });
    const count = Math.min(90, Math.floor((video.duration - start - .01) * 30));
    let maxMove = 0;
    for (let i = 1; i <= count; i++) {
      signal.throwIfAborted();
      if (performance.now() - startedAt > 20000) throw new Error("Tracking took too long on this device. Try a shorter clip.");
      await seekVideo(video, start + i / 30, signal);
      const next = stepBallTrack(state, grab());
      onProgress(Math.round(i / count * 100));
      if (!next.state) return { points, status: next.stopped!, detail: next.stopped === "camera_moved" ? "The background moved too much to keep a reliable candidate. Keep the phone still and try again. No flight has been inferred." : "The candidate was lost or became ambiguous. The line stops at the last candidate position; nothing has been filled in." };
      state = next.state;
      maxMove = Math.max(maxMove, Math.hypot(state.x - state.originX, state.y - state.originY));
      points.push({ x: state.x / (canvas.width - 1), y: state.y / (canvas.height - 1), time: video.currentTime });
    }
    onProgress(100);
    return maxMove < 4
      ? { points, status: "no_motion", detail: "No clear movement was followed in this short window. This does not mean you missed. Check the starting frame and confirm what you saw." }
      : { points, status: "tracked", detail: "A small bright candidate was followed through these frames. Replay to check it is your ball. The line does not measure height, distance, or prove contact." };
  } finally {
    canvas.width = 0; canvas.height = 0;
    if ((video.currentSrc || video.src) === source && video.isConnected) video.currentTime = start;
  }
}
