import assert from "node:assert/strict";
import { test } from "node:test";
import { getSessionFeedback } from "./beginner-session.ts";
import { MAX_SESSIONS, appendSession, createSession, getClubSessions, getNextPractice, getPracticeSeries, getWeeklyChallenge, parseHistory } from "./practice-history.ts";

const shots = (outcome) => Array(5).fill(outcome);
const session = (date = "2025-01-06", id = date, club = "iron") => createSession(club, shots("miss"), shots("air"), new Date(`${date}T12:00:00`), id);
const raw = (sessions) => JSON.stringify({ version: 1, enabled: true, sessions });

test("storage parsing accepts only complete opted-in versioned history", () => {
  assert.deepEqual(parseHistory(raw([])), { version: 1, enabled: true, sessions: [] });
  for (const value of [null, "", "{", "null", "[]", JSON.stringify({ version: 2, enabled: true, sessions: [] }), JSON.stringify({ version: 1, enabled: false, sessions: [] }), raw(Array(31).fill(session()))]) {
    assert.equal(parseHistory(value), null);
  }
});

test("one corrupt record rejects the document including invalid dates, IDs and shot sets", () => {
  const valid = session();
  for (const change of [
    { id: "" }, { id: "x".repeat(129) }, { id: "<script>" }, { club: "putter" },
    { before: shots("bad") }, { before: shots("air").slice(1) }, { after: [] },
    { localDate: "2025-02-30" }, { localDate: "2024-01-01" }, { localDate: "2025-1-6" },
    { completedAt: "2025-02-30T12:00:00.000Z" }, { completedAt: "invalid" },
    { completedAt: "2099-01-01T12:00:00.000Z", localDate: "2099-01-01" },
  ]) assert.equal(parseHistory(raw([{ ...valid, id: "valid" }, { ...valid, ...change }])), null, JSON.stringify(change));
  assert.equal(parseHistory(raw([valid, valid])), null);
});

test("parsing canonicalizes shape and order without trusting extra stored fields", () => {
  const first = session("2025-01-01");
  const second = session("2025-01-02");
  const parsed = parseHistory(raw([{ ...first, score: 999 }, second]));
  assert.deepEqual(parsed.sessions, [second, first]);
  assert.equal(parseHistory(JSON.stringify(parsed)).sessions.length, 2);
  assert.deepEqual(parseHistory(JSON.stringify(parsed)), parsed);
});

test("saved local day remains valid after travel across the date line", () => {
  const value = { ...session(), completedAt: "2025-01-06T23:30:00.000Z", localDate: "2025-01-07" };
  assert.ok(parseHistory(raw([value]), new Date("2025-01-06T23:35:00.000Z")));
  assert.equal(parseHistory(raw([value]), new Date("2025-01-06T23:00:00.000Z")), null);
});

test("creation copies outcomes and uses the actual local calendar date", () => {
  const before = shots("contact");
  const after = shots("unsure");
  const result = createSession("driver", before, after, new Date(2025, 0, 6, 23, 50), "test");
  before[0] = "miss";
  after[0] = "miss";
  assert.equal(result.localDate, "2025-01-06");
  assert.equal(result.before[0], "contact");
  assert.equal(result.after[0], "unsure");
  assert.match(createSession("iron", shots("air"), shots("air")).id, /^[\da-f-]{36}$/);
  assert.throws(() => createSession("iron", [], shots("air")), /complete/);
  assert.throws(() => createSession("iron", shots("air"), shots("air"), new Date("invalid")), /valid/);
});

test("append deduplicates by ID, replaces a retried save and caps newest sessions without mutation", () => {
  const existing = Array.from({ length: 31 }, (_, i) => session(`2025-01-${String(i + 1).padStart(2, "0")}`));
  const original = structuredClone(existing);
  const result = appendSession(existing, session("2025-02-01", "new"));
  assert.equal(result.length, MAX_SESSIONS);
  assert.equal(result[0].id, "new");
  assert.equal(result.at(-1).localDate, "2025-01-03");
  assert.deepEqual(existing, original);
  const updated = { ...result[0], after: shots("unsure") };
  const retry = appendSession(result, updated);
  assert.equal(retry.length, MAX_SESSIONS);
  assert.equal(retry.filter((item) => item.id === "new").length, 1);
  updated.after[0] = "miss";
  assert.equal(retry[0].after[0], "unsure");
});

test("series credit uses separate practice days and clubs, never shot performance", () => {
  const unclear = { ...session("2025-01-06", "first"), before: shots("unsure"), after: shots("miss") };
  const sessions = [unclear, session("2025-01-06", "again"), session("2025-01-07", "driver", "driver")];
  assert.equal(getPracticeSeries(sessions, "iron").completed, 1);
  assert.equal(getPracticeSeries(sessions, "iron").currentIndex, 1);
  assert.equal(getPracticeSeries(sessions, "driver").completed, 1);
  assert.equal(getPracticeSeries([], "iron").currentIndex, 0);
  const completed = getPracticeSeries([...sessions, session("2025-01-07"), session("2025-01-08"), session("2025-01-09")], "iron");
  assert.equal(completed.completed, 3);
  assert.equal(completed.currentIndex, 2);
  assert.equal(completed.complete, true);
  assert.equal(completed.steps.length, 3);
});

test("weekly challenge counts practice days across clubs on local Monday through Sunday", () => {
  const sessions = [session("2024-12-29"), session("2024-12-30"), session("2024-12-30", "driver", "driver"), session("2025-01-01"), session("2025-01-05"), session("2025-01-06")];
  const monday = getWeeklyChallenge(sessions, new Date(2024, 11, 30, 23));
  assert.deepEqual(monday, { count: 1, target: 2, complete: false, weekStart: "2024-12-30", weekEnd: "2025-01-05" });
  const wednesday = getWeeklyChallenge(sessions, new Date(2025, 0, 1, 23));
  assert.equal(wednesday.count, 2);
  assert.equal(wednesday.complete, true);
  assert.equal(getWeeklyChallenge(sessions, new Date(2025, 0, 5, 23)).count, 3);
  assert.equal(getWeeklyChallenge(sessions, new Date(2025, 0, 6, 23)).count, 1);
});

test("future completions on today do not count toward the weekly challenge", () => {
  const item = session("2025-01-06");
  assert.equal(getWeeklyChallenge([item], new Date(2025, 0, 6, 10)).count, 0);
});

test("next practice preserves existing feedback and isolates each club", () => {
  const iron = session("2025-01-06");
  const driver = { ...session("2025-01-07", "driver", "driver"), after: shots("unsure") };
  const records = [driver, iron];
  assert.deepEqual(getClubSessions(records, "iron"), [iron]);
  assert.deepEqual(getNextPractice(records, "iron"), getSessionFeedback(iron.before, iron.after, "iron"));
  assert.deepEqual(getNextPractice(records, "driver"), getSessionFeedback(driver.before, driver.after, "driver"));
  assert.match(getNextPractice(records, "driver").next, /cannot compare/);
  assert.match(getNextPractice([], "driver").next, /driver setup/);
  assert.match(getNextPractice([], "iron").next, /iron setup/);
});
