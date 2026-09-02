import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./TrajectoryComparison.tsx", import.meta.url), "utf8");

test("trajectory animation waits for visibility and can be replayed", () => {
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /begin="indefinite"/);
  assert.match(source, /data-delay/);
  assert.match(source, /Replay animation/);
  assert.match(source, /setRunId/);
});

test("trajectory sequence keeps the original timing order", () => {
  assert.match(source, /const tHighStart = 1\.1/);
  assert.match(source, /const tLowStart = tHighStart \+ tHighDur \+ 0\.35/);
  assert.match(source, /const tOptStart = tLowStart \+ tLowDur \+ 0\.35/);
});
