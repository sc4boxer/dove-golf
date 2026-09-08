import assert from "node:assert/strict";
import test from "node:test";
import { readScoreChallenge } from "./leaderboardChallenge.ts";

const board = { ok: true, edition: "current", period: "alltime", entries: [{ rank: 1, initials: "ABC", score: 1500 }] };

test("shows a verified leader including a legitimate zero score", () => {
  assert.deepEqual(readScoreChallenge(board), { status: "ready", initials: "ABC", score: 1500 });
  assert.deepEqual(readScoreChallenge({ ...board, entries: [{ ...board.entries[0], score: 0 }] }), { status: "ready", initials: "ABC", score: 0 });
});

test("distinguishes an empty board from an unavailable board", () => {
  assert.deepEqual(readScoreChallenge({ ...board, entries: [] }), { status: "empty" });
  for (const payload of [null, {}, { ok: false }, { ...board, entries: null }]) {
    assert.deepEqual(readScoreChallenge(payload), { status: "unavailable" });
  }
});

test("never presents original-course or weekly scores as the current all-time record", () => {
  assert.deepEqual(readScoreChallenge({ ...board, edition: "original" }), { status: "unavailable" });
  assert.deepEqual(readScoreChallenge({ ...board, period: "weekly" }), { status: "unavailable" });
});

test("rejects malformed leaders instead of inventing or skipping a record", () => {
  for (const leader of [null, {}, { rank: 2, initials: "ABC", score: 1500 }, { rank: 1, initials: "<b>", score: 1500 }, ...[-1, 1.5, Infinity, "1500"].map(score => ({ ...board.entries[0], score }))]) {
    assert.deepEqual(readScoreChallenge({ ...board, entries: [leader, board.entries[0]] }), { status: "unavailable" });
  }
});

