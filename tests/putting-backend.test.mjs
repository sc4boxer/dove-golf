import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Load the real TypeScript handlers and replay engine; replace only the network boundary.
function harness(rpc = async () => ({ data: null, error: null }), configured = true) {
  const cache = new Map();
  const calls = [];
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const loaded = { exports: {} }; cache.set(file, loaded);
    const source = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    function localRequire(name) {
      if (name === "server-only") return {};
      if (name === "@supabase/supabase-js") return { createClient: () => ({ rpc: async (name, args) => { calls.push({ name, args }); return rpc(name, args); } }) };
      if (name === "next/server") return { NextResponse: { json: (body, init) => Response.json(body, init) } };
      if (name.startsWith("@/")) return load(resolve("src", `${name.slice(2)}.ts`));
      if (name.startsWith(".")) return load(resolve(dirname(file), `${name}.ts`));
      return require(name);
    }
    runInNewContext(`(function(require,module,exports){${source}\n})`, { Buffer, Request, Response, URL, console: { error() {} }, process: { env: configured ? { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "test-placeholder" } : {} } })(localRequire, loaded, loaded.exports);
    return loaded.exports;
  }
  return { scores: load(resolve("src/app/api/putting/scores/route.ts")), round: load(resolve("src/app/api/putting/round/route.ts")), calls };
}
const token = "a".repeat(64);
const shots = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ angle: 0, power: 1 })));
function request(body, headers = {}) {
  return new Request("https://dovegolf.fit/api/putting/scores", { method: "POST", headers: { "content-type": "application/json", origin: "https://dovegolf.fit", ...headers }, body: JSON.stringify(body) });
}
test("cross-origin and oversized submissions never reach database", async () => {
  const h = harness();
  assert.equal((await h.scores.POST(request({}, { origin: "https://other.example" }))).status, 403);
  assert.equal((await h.scores.POST(request({ filler: "x".repeat(6001) }))).status, 413);
  assert.equal(h.calls.length, 0);
});
test("malformed JSON and initials fail before database work", async () => {
  const h = harness();
  const invalid = new Request("https://dovegolf.fit/api/putting/scores", { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal((await h.scores.POST(invalid)).status, 400);
  assert.equal((await h.scores.POST(request({ token, initials: "KKK", shots }))).status, 400);
  assert.equal(h.calls.length, 0);
});
test("replay rejects unfinished holes instead of trusting claimed score", async () => {
  const h = harness();
  const response = await h.scores.POST(request({ token, initials: "JSC", shots: [[{ angle: 0, power: 1 }]], score: 2500 }));
  assert.equal(response.status, 400);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].name, "putting_check_limit");
});
test("completed round computes points on server and strips raw bearer token", async () => {
  const h = harness(async (name, args) => name === "putting_submit_score" ? { data: { id: "saved", initials: args.p_initials, score: args.p_score, rank_at_submission: 3, created_at: "2026-09-07T12:00:00Z", course_version: args.p_version }, error: null } : { data: null, error: null });
  const response = await h.scores.POST(request({ token, initials: "jsc", shots, score: 2500, rank: 1 }));
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.entry.score, 0);
  assert.equal(body.entry.rank, 3);
  assert.equal(body.entry.initials, "JSC");
  const submit = h.calls.find(c => c.name === "putting_submit_score").args;
  assert.equal(submit.p_score, 0);
  assert.match(submit.p_token_hash, /^[a-f0-9]{64}$/);
  assert.notEqual(submit.p_token_hash, token);
  assert.equal(JSON.stringify(h.calls).includes(token), false);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("database rate limit and expired token errors are actionable", async () => {
  for (const [message, status] of [["putting_rate_limit", 429], ["putting_invalid_round", 409]]) {
    const h = harness(async () => ({ data: null, error: { message } }));
    assert.equal((await h.scores.POST(request({ token, initials: "JSC", shots }))).status, status);
  }
});
test("missing configuration and database errors return 503 without details", async () => {
  for (const h of [harness(undefined, false), harness(async () => ({ data: null, error: { code: "secret-detail", message: "internal table details" } }))]) {
    const response = await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores"));
    assert.equal(response.status, 503);
    assert.equal((await response.text()).includes("internal"), false);
  }
});
test("round start returns bearer token but sends only hash to storage", async () => {
  const h = harness(async () => ({ data: "2026-09-07T14:00:00Z", error: null }));
  const response = await h.round.POST(request({}));
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.match(body.token, /^[a-f0-9]{64}$/);
  assert.notEqual(h.calls[0].args.p_token_hash, body.token);
  assert.equal(body.expiresAt, "2026-09-07T14:00:00Z");
});
test("weekly default and all-time query forward exact board choice", async () => {
  const h = harness(async () => ({ data: [], error: null }));
  await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores"));
  await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores?period=alltime"));
  assert.equal(h.calls[0].args.p_weekly, true);
  assert.equal(h.calls[1].args.p_weekly, false);
});

test("original leaderboard returns stored history without relabeling or rewriting it", async () => {
  const original = { id: "old-score", initials: "JSC", score: 1600, rank: 2, created_at: "2026-09-07T12:00:00Z", course_version: "five-hole-v1" };
  const h = harness(async (name, args) => ({ data: args.p_version === "five-hole-v1" ? [original] : [], error: null }));
  const response = await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores?edition=original&period=alltime"));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, edition: "original", period: "alltime", entries: [{ id: "old-score", initials: "JSC", score: 1600, rank: 2, achievedAt: "2026-09-07T12:00:00Z", courseVersion: "five-hole-v1" }] });
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].name, "putting_leaderboard");
  assert.equal(h.calls[0].args.p_version, "five-hole-v1");
  assert.equal(h.calls[0].args.p_weekly, false);
  await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores?edition=original&period=weekly"));
  assert.equal(h.calls[1].args.p_version, "five-hole-v1");
  assert.equal(h.calls[1].args.p_weekly, true);
});

test("default and unknown editions keep the current leaderboard", async () => {
  const h = harness(async () => ({ data: [], error: null }));
  for (const suffix of ["", "?edition=current", "?edition=five-hole-v1", "?edition=unknown"]) {
    const response = await h.scores.GET(new Request(`https://dovegolf.fit/api/putting/scores${suffix}`));
    assert.equal((await response.json()).edition, "current");
    assert.equal(h.calls.at(-1).args.p_version, "five-hole-v2");
  }
});

test("reading history never permits posting new scores under old rules", async () => {
  const h = harness(async (name, args) => name === "putting_submit_score" ? { data: { id: "new-score", initials: args.p_initials, score: args.p_score, rank_at_submission: 1, created_at: "2026-09-08T12:00:00Z", course_version: args.p_version }, error: null } : { data: [], error: null });
  await h.scores.GET(new Request("https://dovegolf.fit/api/putting/scores?edition=original"));
  const response = await h.scores.POST(request({ token, initials: "JSC", shots, edition: "original", courseVersion: "five-hole-v1" }));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).entry.courseVersion, "five-hole-v2");
  assert.equal(h.calls.find(call => call.name === "putting_submit_score").args.p_version, "five-hole-v2");
});
