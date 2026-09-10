import assert from "node:assert/strict";
import { test } from "node:test";
import { createPracticeStore } from "./practice-store.ts";
import { createSession, STORAGE_KEY } from "./practice-history.ts";

const session = (id = "sample") => createSession("iron", Array(5).fill("miss"), Array(5).fill("air"), new Date("2025-01-02T12:00:00.000Z"), id);
function memory() {
  const data = new Map();
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}

test("does not write until opt-in and persists a complete session only once", () => {
  const storage = memory();
  const store = createPracticeStore(() => storage);
  assert.equal(store.getServerSnapshot().ready, false);
  assert.equal(store.getSnapshot().enabled, false);
  assert.equal(store.save(session()), false);
  assert.equal(storage.data.size, 0);
  assert.equal(store.save(session(), true), true);
  assert.equal(store.save(session()), true);
  assert.equal(store.getSnapshot().sessions.length, 1);
  const refreshed = createPracticeStore(() => storage);
  assert.equal(refreshed.getSnapshot().enabled, true);
  assert.equal(refreshed.getSnapshot().sessions[0].id, "sample");
  assert.equal(refreshed.getSnapshot(), refreshed.getSnapshot(), "snapshots must remain referentially stable");
});

test("reads current storage before saving, preserving another tab and honoring opt-out", () => {
  const storage = memory();
  const one = createPracticeStore(() => storage);
  const two = createPracticeStore(() => storage);
  one.enable();
  two.getSnapshot();
  one.save(session("first"));
  two.save(session("second"));
  assert.equal(one.getSnapshot().sessions.length, 2);
  one.forget();
  assert.equal(two.save(session("third")), false);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(two.getSnapshot().enabled, false);
});

test("blocked storage never claims data was saved and an available retry succeeds", () => {
  let blocked = true;
  const storage = memory();
  const store = createPracticeStore(() => { if (blocked) throw new Error("blocked"); return storage; });
  assert.match(store.getSnapshot().error, /unavailable/);
  assert.equal(store.save(session(), true), false);
  assert.equal(store.getSnapshot().sessions.length, 0);
  assert.equal(store.getSnapshot().enabled, false);
  blocked = false;
  assert.equal(store.save(session(), true), true);
  assert.equal(store.getSnapshot().error, null);
});

test("quota and deletion failures preserve already-saved data with actionable errors", () => {
  const storage = memory();
  const store = createPracticeStore(() => storage);
  store.save(session(), true);
  storage.setItem = () => { throw new Error("quota"); };
  assert.equal(store.save(session("unsaved")), false);
  assert.equal(store.getSnapshot().sessions.length, 1);
  assert.match(store.getSnapshot().error, /wasn’t saved/);
  storage.removeItem = () => { throw new Error("blocked"); };
  assert.equal(store.forget(), false);
  assert.equal(store.getSnapshot().sessions.length, 1);
  assert.match(store.getSnapshot().error, /couldn’t clear/);
});

test("corrupt and invalid records fail safely, and clearing touches only practice data", () => {
  const storage = memory();
  storage.setItem(STORAGE_KEY, "broken");
  storage.setItem("other-feature", "keep");
  const store = createPracticeStore(() => storage);
  assert.equal(store.getSnapshot().enabled, false);
  assert.match(store.getSnapshot().error, /couldn’t read/);
  assert.equal(store.save({ ...session(), after: [] }, true), false);
  assert.equal(storage.getItem(STORAGE_KEY), "broken");
  assert.equal(store.forget(), true);
  assert.equal(store.getSnapshot().error, null);
  assert.equal(storage.getItem("other-feature"), "keep");
});

test("temporary read failures recover history and never permit overwriting unread data", () => {
  const storage = memory();
  const store = createPracticeStore(() => storage);
  store.save(session(), true);
  const read = storage.getItem;
  storage.getItem = () => { throw new Error("temporarily blocked"); };
  assert.match(store.getSnapshot().error, /unavailable/);
  assert.equal(store.enable(), false);
  assert.equal(store.save(session("new"), true), false);
  assert.equal(JSON.parse(storage.data.get(STORAGE_KEY)).sessions.length, 1);
  storage.getItem = read;
  assert.equal(store.getSnapshot().enabled, true);
  assert.equal(store.getSnapshot().sessions[0].id, "sample");
  assert.equal(store.save(session("new")), true);
  assert.equal(store.getSnapshot().sessions.length, 2);
});
