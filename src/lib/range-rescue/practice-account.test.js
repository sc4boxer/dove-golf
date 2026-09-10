import assert from "node:assert/strict";
import { test } from "node:test";
import { clearAccountSessions, createAccountFetch, createPracticeAccountClient, fetchAccountSessions, parseAccountSessions, saveAccountSessions } from "./practice-account.ts";
import { createSession } from "./practice-history.ts";

const sample = createSession("iron", Array(5).fill("air"), Array(5).fill("unsure"), new Date("2025-01-06T12:00:00Z"), "sample");
const row = { id: sample.id, completed_at: "2025-01-06T12:00:00+00:00", local_date: sample.localDate, club: sample.club, before_shots: sample.before, after_shots: sample.after, user_id: "private-user" };
const auth = { getUser: async () => ({ data: { user: { id: "owner" } }, error: null }) };

test("account transport times out and aborts a stalled request", async () => {
  let signal;
  const fetch = createAccountFetch(async (_input, init) => { signal = init.signal; return new Promise(() => {}); }, 10);
  await assert.rejects(fetch("https://example.test"), /timed out/);
  assert.equal(signal.aborted, true);
});

test("account transport covers stalled response bodies as well as headers", async () => {
  const fetch = createAccountFetch(async () => new Response(new ReadableStream({ start() {} })), 10);
  await assert.rejects(fetch("https://example.test"), /timed out/);
});

test("caller and Request cancellation survive the timeout wrapper", async () => {
  const controller = new AbortController();
  let signal;
  const fetch = createAccountFetch(async (_input, init) => { signal = init.signal; return new Promise(() => {}); }, 1000);
  const request = fetch(new Request("https://example.test", { signal: controller.signal }));
  controller.abort();
  await assert.rejects(request, /cancelled/);
  assert.equal(signal.aborted, true);
  let calls = 0;
  const neverStart = createAccountFetch(async () => { calls++; return new Response(); });
  await assert.rejects(neverStart("https://example.test", { signal: controller.signal }), /cancelled/);
  assert.equal(calls, 0);
});

test("successful responses preserve JSON, status and headers and clear their deadline", async () => {
  let signal;
  const fetch = createAccountFetch(async (_input, init) => { signal = init.signal; return new Response('{"ok":true}', { status: 201, headers: { "x-test": "kept" } }); }, 10);
  const response = await fetch("https://example.test");
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("x-test"), "kept");
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(signal.aborted, false);
  assert.equal((await createAccountFetch(async () => new Response(null, { status: 204 }))("https://example.test")).status, 204);
});

test("browser no-content responses with an empty stream stay successful", async () => {
  // Chrome can expose a stream for an HTTP 204, unlike new Response(null).
  for (const status of [204, 205, 304]) {
    const browserResponse = new Response("", { headers: { "x-test": "kept" } });
    Object.defineProperty(browserResponse, "status", { value: status });
    assert.notEqual(browserResponse.body, null);
    const response = await createAccountFetch(async () => browserResponse)("https://example.test");
    assert.equal(response.status, status);
    assert.equal(response.body, null);
    assert.equal(await response.text(), "");
    assert.equal(response.headers.get("x-test"), "kept");
  }
});

test("account mapping normalizes database time and discards user IDs", () => {
  assert.deepEqual(parseAccountSessions([row]), [sample]);
  assert.deepEqual(parseAccountSessions([]), []);
});

test("account mapping rejects malformed, incomplete and duplicated documents", () => {
  for (const value of [null, {}, [null], [row, row], [{ ...row, completed_at: "bad" }], [{ ...row, after_shots: [] }], [{ ...row, club: "putter" }], Array(31).fill(row)]) {
    assert.throws(() => parseAccountSessions(value), /could not be read/);
  }
});

test("invalid uploads fail before network and valid uploads contain canonical sessions only", async () => {
  let calls = 0;
  const client = { auth, rpc: async (name, args) => {
    calls++;
    assert.equal(name, "save_practice_sessions");
    assert.deepEqual(args, { p_sessions: [sample], p_expected_user_id: "owner" });
    return { data: [row], error: null };
  } };
  await assert.rejects(saveAccountSessions(client, [{ ...sample, after: [] }], "owner"), /complete/);
  assert.equal(calls, 0);
  assert.deepEqual(await saveAccountSessions(client, [{ ...sample, unexpected: "not uploaded" }], "owner"), [sample]);
  assert.equal(calls, 1);
});

test("fetch uses bounded stable order and maps the response", async () => {
  const orders = [];
  const query = { select: fields => { assert.equal(fields.includes("user_id"), false); return query; }, eq: (field, value) => { assert.equal(field, "user_id"); assert.equal(value, "owner"); return query; }, order: (field, options) => { orders.push([field, options]); return query; }, limit: async count => { assert.equal(count, 30); return { data: [row], error: null }; } };
  const client = { auth, from: table => { assert.equal(table, "practice_sessions"); return query; } };
  assert.deepEqual(await fetchAccountSessions(client, "owner"), [sample]);
  assert.deepEqual(orders, [["completed_at", { ascending: false }], ["id", { ascending: true }]]);
});

test("RPC errors never masquerade as successful save or deletion", async () => {
  const client = { auth, rpc: async () => ({ data: null, error: { message: "private backend detail" } }) };
  await assert.rejects(saveAccountSessions(client, [sample], "owner"), /could not sync/);
  await assert.rejects(clearAccountSessions(client, "owner"), /could not be deleted/);
  let name;
  await clearAccountSessions({ auth, rpc: async (value, args) => { name = value; assert.deepEqual(args, { p_expected_user_id: "owner" }); return { error: null }; } }, "owner");
  assert.equal(name, "clear_practice_sessions");
});

test("a switched account cannot adopt an operation initiated by the previous user", async () => {
  let calls = 0;
  const client = { auth, rpc: async () => { calls++; }, from: () => { calls++; } };
  await assert.rejects(saveAccountSessions(client, [sample], "previous-owner"), /account changed/);
  await assert.rejects(clearAccountSessions(client, "previous-owner"), /account changed/);
  await assert.rejects(fetchAccountSessions(client, "previous-owner"), /account changed/);
  assert.equal(calls, 0);
});

test("public credentials do not activate guest accounts without the explicit rollout gate", () => {
  const keys = ["NEXT_PUBLIC_PRACTICE_ACCOUNTS", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
  const previous = keys.map(key => process.env[key]);
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    delete process.env.NEXT_PUBLIC_PRACTICE_ACCOUNTS;
    assert.equal(createPracticeAccountClient(), null);
    process.env.NEXT_PUBLIC_PRACTICE_ACCOUNTS = "false";
    assert.equal(createPracticeAccountClient(), null);
    process.env.NEXT_PUBLIC_PRACTICE_ACCOUNTS = "true";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_secret_not_allowed";
    assert.equal(createPracticeAccountClient(), null);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://example.supabase.co";
    assert.equal(createPracticeAccountClient(), null);
  } finally {
    keys.forEach((key, index) => { if (previous[index] === undefined) delete process.env[key]; else process.env[key] = previous[index]; });
  }
});
