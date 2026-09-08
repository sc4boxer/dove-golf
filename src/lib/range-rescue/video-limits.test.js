import test from "node:test";
import assert from "node:assert/strict";
import { isValidVideoDuration } from "./video-limits.ts";

test("short recordings accept the ten-second boundary and reject longer or invalid durations", () => {
  for (const duration of [.1, 9.99, 10]) assert.equal(isValidVideoDuration(duration), true);
  for (const duration of [10.01, 30, 0, -1, NaN, Infinity]) assert.equal(isValidVideoDuration(duration), false);
});
