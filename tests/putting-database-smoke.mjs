// Optional SQL smoke test. Install @electric-sql/pglite outside this repository,
// then pass its package directory as argv[2]. No production connection is used.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

if (!process.argv[2]) throw new Error("Usage: node tests/putting-database-smoke.mjs <temporary-prefix>/node_modules/@electric-sql/pglite");
const require = createRequire(import.meta.url);
const { PGlite } = require(resolve(process.argv[2]));
const db = await PGlite.create();
let checks = 0;
const check = (name) => { checks++; console.log(`PASS ${name}`); };
try {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to anon, authenticated, service_role;");
  await db.exec(await readFile(new URL("../supabase/migrations/202609070001_create_putting_leaderboard.sql", import.meta.url), "utf8"));
  check("unmodified migration executes");
  await db.exec("set role service_role");
  const start = (token) => db.query("select putting_start_round($1,$2,$3)", [token, "smoke-client", "smoke-v1"]);
  const submit = async (token, score = 1500, initials = "JSC") => (await db.query("select putting_submit_score($1,$2,$3,$4) as entry", [token, initials, score, "smoke-v1"])).rows[0].entry;
  await start("first");
  const first = await submit("first");
  assert.equal(first.score, 1500);
  assert.equal(first.rank_at_submission, 1);
  assert.equal((await submit("first")).id, first.id);
  assert.equal((await db.query("select count(*)::integer as n from putting_scores")).rows[0].n, 1);
  check("service role starts, submits, and identical retry inserts once");
  await assert.rejects(submit("first", 1400), /putting_invalid_round/);
  await assert.rejects(submit("first", 1500, "ABC"), /putting_invalid_round/);
  check("used token cannot alter score or initials");
  await start("expired");
  await db.exec("update putting_rounds set expires_at = now() - interval '1 second' where token_hash = 'expired'");
  await assert.rejects(submit("expired"), /putting_invalid_round/);
  check("expired token rejected");
  await start("tie");
  assert.equal((await submit("tie")).rank_at_submission, 1);
  await start("lower");
  assert.equal((await submit("lower", 1000)).rank_at_submission, 3);
  const board = await db.query("select * from putting_leaderboard('smoke-v1',true)");
  assert.deepEqual(board.rows.map(r => Number(r.rank)), [1, 1, 3]);
  check("equal scores share competition rank");
  await start("previous-week");
  await submit("previous-week", 2500);
  await db.exec("update putting_scores set created_at = date_trunc('week',now() at time zone 'UTC') at time zone 'UTC' - interval '1 second' where round_hash = 'previous-week'");
  assert.equal((await db.query("select * from putting_leaderboard('smoke-v1',true)")).rows.length, 3);
  assert.equal((await db.query("select * from putting_leaderboard('smoke-v1',false)")).rows.length, 4);
  check("UTC weekly boundary excludes old scores only from weekly board");
  await db.query("select putting_check_limit('limited',2)");
  await db.query("select putting_check_limit('limited',2)");
  await assert.rejects(db.query("select putting_check_limit('limited',2)"), /putting_rate_limit/);
  await assert.rejects(db.query("select putting_check_limit('limited',2)"), /putting_rate_limit/);
  check("durable limit remains enforced after rejected transaction");
  await db.exec("update putting_scores set hidden = true where round_hash = 'first'");
  assert.equal((await db.query("select * from putting_leaderboard('smoke-v1',true)")).rows.length, 2);
  await assert.rejects(submit("first"), /putting_invalid_round/);
  check("moderated score hidden and cannot be revived through retry");
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`reset role; set role ${role}`);
    await assert.rejects(db.query("select * from putting_scores"), /permission denied/);
    await assert.rejects(db.query("insert into putting_rounds(token_hash,course_version) values('forged','smoke-v1')"), /permission denied/);
    await assert.rejects(db.query("select putting_start_round('forged','forged','smoke-v1')"), /permission denied/);
    await assert.rejects(db.query("select putting_submit_score('first','JSC',2500,'smoke-v1')"), /permission denied/);
    await assert.rejects(db.query("select * from putting_leaderboard('smoke-v1',true)"), /permission denied/);
    check(`${role} direct reads, writes, and RPC calls denied`);
  }
  console.log(`${checks} SQL smoke checks passed. PGlite is single-connection; true parallel contention is not verified.`);
} catch (error) {
  console.error(`SQL smoke failed after ${checks} checks: ${error.message} (code ${error.code ?? "unknown"}, position ${error.position ?? "unknown"})`);
  process.exitCode = 1;
} finally { await db.close(); }
