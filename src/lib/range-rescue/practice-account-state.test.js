import test from "node:test";
import assert from "node:assert/strict";
import { createPracticeAccountStore } from "./practice-account-state.ts";

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function setup(t, overrides = {}) {
  let callback;
  const calls = [];
  const client = { auth: {
    onAuthStateChange(fn) { callback = fn; return { data: { subscription: { unsubscribe() {} } } }; },
    signInWithOtp: async () => ({ error: null }), verifyOtp: async () => ({ error: null }), signOut: async () => ({ error: null }),
  } };
  const store = createPracticeAccountStore({ client,
    fetchAccountSessions: async (_client, id) => { calls.push(id); return [{ id }]; },
    saveAccountSessions: async (_client, sessions) => sessions,
    clearAccountSessions: async () => {}, ...overrides,
  });
  const stop = store.start(); t.after(stop);
  return { store, client, stop, calls, auth: (id) => callback("TOKEN_REFRESHED", id ? { user: { id } } : null) };
}

test("repeated same-user auth does not restart loading or invalidate a save", async (t) => {
  const pending = deferred();
  const { store, auth, calls } = setup(t, { saveAccountSessions: () => pending.promise });
  auth("A"); await settle();
  const saving = store.actions.save([{ id: "saved" }]);
  auth("A"); auth("A"); await settle();
  assert.equal(store.getSnapshot().ready, true);
  assert.deepEqual(calls, ["A"]);
  pending.resolve([{ id: "saved" }]);
  assert.equal(await saving, true);
  assert.deepEqual(store.getSnapshot().sessions, [{ id: "saved" }]);
  assert.equal(store.getSnapshot().busy, false);
});

test("late A fetch cannot reveal A sessions after switching to B", async (t) => {
  const pending = deferred();
  const { store, auth } = setup(t, { fetchAccountSessions: (_client, id) => id === "A" ? pending.promise : Promise.resolve([{ id: "B" }]) });
  auth("A"); await settle(); auth("B");
  assert.deepEqual(store.getSnapshot().sessions, []);
  await settle(); pending.resolve([{ id: "A" }]); await settle();
  assert.deepEqual(store.getSnapshot().sessions, [{ id: "B" }]);
  assert.equal(store.getSnapshot().ready, true);
});

for (const method of ["save", "forget"]) test(`stale ${method} success and failure cannot modify B state`, async (t) => {
  for (const fail of [false, true]) {
    const pending = deferred();
    const { store, auth } = setup(t, { [method === "save" ? "saveAccountSessions" : "clearAccountSessions"]: () => pending.promise });
    auth("A"); await settle();
    const action = method === "save" ? store.actions.save([{ id: "A-saved" }]) : store.actions.forget();
    auth("B"); await settle();
    const before = store.getSnapshot();
    if (fail) pending.reject(new Error("A failure")); else pending.resolve([{ id: "A-saved" }]);
    const result = await action;
    if (method === "save") assert.equal(result, false);
    assert.deepEqual(store.getSnapshot(), before);
  }
});

test("stale operation cannot clear a new account operation's busy state", async (t) => {
  const first = deferred(), second = deferred();
  const { store, auth } = setup(t, { saveAccountSessions: (_client, _sessions, id) => id === "A" ? first.promise : second.promise });
  auth("A"); await settle(); const a = store.actions.save([]);
  auth("B"); await settle(); const b = store.actions.save([]);
  first.resolve([]); assert.equal(await a, false);
  assert.equal(store.getSnapshot().busy, true);
  second.resolve([{ id: "B" }]); assert.equal(await b, true);
  assert.equal(store.getSnapshot().busy, false);
});

test("loading errors settle ready and focus refresh can recover", async (t) => {
  let fail = true;
  const { store, auth } = setup(t, { fetchAccountSessions: async () => { if (fail) throw new Error("offline"); return [{ id: "A" }]; } });
  auth("A"); await settle();
  assert.equal(store.getSnapshot().ready, true); assert.match(store.getSnapshot().error, /couldn’t load/);
  fail = false; await store.refresh();
  assert.equal(store.getSnapshot().error, null); assert.deepEqual(store.getSnapshot().sessions, [{ id: "A" }]);
});

test("logout clears account data and pending requests cannot restore it", async (t) => {
  const pending = deferred();
  const { store, auth } = setup(t, { saveAccountSessions: () => pending.promise });
  auth("A"); await settle(); const action = store.actions.save([]);
  auth(null); pending.resolve([{ id: "A" }]); assert.equal(await action, false);
  assert.equal(store.getSnapshot().user, null); assert.deepEqual(store.getSnapshot().sessions, []);
  auth("B"); await settle(); await store.actions.signOut();
  assert.equal(store.getSnapshot().user, null); assert.deepEqual(store.getSnapshot().sessions, []);
});

test("unmount ignores queued auth, loads, mutations, and notifications", async (t) => {
  const pending = deferred();
  const { store, auth, stop } = setup(t, { fetchAccountSessions: () => pending.promise });
  auth("A"); await settle(); stop();
  const before = store.getSnapshot(); let notices = 0; store.subscribe(() => notices++);
  auth("B"); pending.resolve([{ id: "A" }]); await settle();
  assert.equal(store.getSnapshot(), before); assert.equal(notices, 0);
  assert.equal(await store.actions.save([]), false);
});

test("initial auth and account fetch timeouts expose usable ready state", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const pending = deferred();
  const { store, auth } = setup(t, { fetchAccountSessions: () => pending.promise });
  t.mock.timers.tick(15000);
  assert.equal(store.getSnapshot().ready, true); assert.match(store.getSnapshot().error, /longer than expected/);
  auth("A"); await settle(); assert.equal(store.getSnapshot().ready, false);
  t.mock.timers.tick(15000);
  assert.equal(store.getSnapshot().ready, true);
  pending.resolve([{ id: "A" }]); await settle();
  assert.equal(store.getSnapshot().error, null);
});

test("failed save during initial fetch settles loading and reports the save error", async (t) => {
  const pending = deferred();
  const { store, auth } = setup(t, { fetchAccountSessions: () => pending.promise, saveAccountSessions: async () => { throw new Error("offline"); } });
  auth("A"); await settle(); assert.equal(store.getSnapshot().ready, false);
  assert.equal(await store.actions.save([]), false);
  assert.equal(store.getSnapshot().ready, true); assert.equal(store.getSnapshot().busy, false);
  assert.match(store.getSnapshot().error, /wasn’t saved/);
  pending.resolve([{ id: "old" }]); await settle();
  assert.deepEqual(store.getSnapshot().sessions, []);
});

test("unmounted mutation failure cannot update the next mounted lifecycle", async (t) => {
  const pending = deferred();
  const { store, auth, stop } = setup(t, { saveAccountSessions: () => pending.promise });
  auth("A"); await settle(); const saving = store.actions.save([]);
  stop(); const stopAgain = store.start(); t.after(stopAgain);
  auth("B"); await settle();
  const before = store.getSnapshot(); pending.reject(new Error("old request"));
  assert.equal(await saving, false); assert.deepEqual(store.getSnapshot(), before);
});
