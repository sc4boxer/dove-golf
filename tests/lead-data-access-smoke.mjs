// In-memory check: public practice clients cannot access leads; server routes can.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require = createRequire(import.meta.url);
const {PGlite} = require(resolve(process.argv[2]));
const db = await PGlite.create();
try {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create table public.leads(id int primary key, email text); grant usage on schema public to anon,authenticated,service_role; grant all on public.leads to anon,authenticated,service_role; insert into public.leads values(1,'test@example.invalid');");
  await db.exec(await readFile(new URL('../supabase/migrations/202609110002_protect_leads_from_public_clients.sql',import.meta.url),'utf8'));
  for (const role of ['anon','authenticated']) {
    await db.exec(`set role ${role}`);
    await assert.rejects(db.query('select * from public.leads'), /permission denied/);
    await assert.rejects(db.query("insert into public.leads values(2,'blocked@example.invalid')"), /permission denied/);
    await assert.rejects(db.query("update public.leads set email='blocked@example.invalid'"), /permission denied/);
    await db.exec('reset role');
  }
  await db.exec('set role service_role');
  assert.equal((await db.query('select count(*)::int as count from public.leads')).rows[0].count,1);
  await db.exec("insert into public.leads values(2,'server@example.invalid'); update public.leads set email='updated@example.invalid' where id=2;");
  assert.equal((await db.query('select email from public.leads where id=2')).rows[0].email,'updated@example.invalid');
  console.log('PASS public lead access denied; server read, insert and update preserved.');
} finally {await db.close();}
