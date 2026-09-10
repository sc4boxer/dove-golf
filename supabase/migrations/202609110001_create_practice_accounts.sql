-- Apply only to the reviewed Supabase project. No changes to game score tables.
create table public.practice_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null check (id ~ '^[a-zA-Z0-9_-]{1,128}$'),
  completed_at timestamptz not null,
  local_date date not null,
  club text not null check (club in ('iron', 'driver')),
  before_shots text[] not null check (cardinality(before_shots) = 5 and array_position(before_shots, null) is null and before_shots <@ array['air','contact','miss','unsure']::text[]),
  after_shots text[] not null check (cardinality(after_shots) = 5 and array_position(after_shots, null) is null and after_shots <@ array['air','contact','miss','unsure']::text[]),
  primary key (user_id, id),
  check (abs(local_date - (completed_at at time zone 'UTC')::date) <= 1)
);
create index practice_sessions_recent on public.practice_sessions(user_id, completed_at desc, id);
alter table public.practice_sessions enable row level security;
create policy practice_select_own on public.practice_sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy practice_insert_own on public.practice_sessions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy practice_delete_own on public.practice_sessions for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.practice_sessions from public, anon, authenticated;
grant select, delete on public.practice_sessions to authenticated;
-- Direct INSERT/UPDATE is deliberately not granted: all writes must enforce the
-- cap inside the serialized RPC. RLS also protects any future direct grant.

create function public.save_practice_sessions(p_sessions jsonb, p_expected_user_id uuid)
returns setof public.practice_sessions
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
  v_completed timestamptz;
  v_local date;
  v_before text[];
  v_after text[];
begin
  if v_user is null or v_user is distinct from p_expected_user_id then raise exception 'Authentication required or account changed' using errcode = '42501'; end if;
  if jsonb_typeof(p_sessions) is distinct from 'array' then raise exception 'Expected session array' using errcode = '22023'; end if;
  if jsonb_array_length(p_sessions) > 30 then raise exception 'At most 30 sessions' using errcode = '22023'; end if;
  if (select count(*) <> count(distinct item->>'id') from jsonb_array_elements(p_sessions) item) then
    raise exception 'Duplicate or missing session IDs' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 84631));
  for v_item in select value from jsonb_array_elements(p_sessions) loop
    if jsonb_typeof(v_item) is distinct from 'object'
      or jsonb_typeof(v_item->'id') is distinct from 'string'
      or (v_item->>'id') !~ '^[a-zA-Z0-9_-]{1,128}$'
      or jsonb_typeof(v_item->'club') is distinct from 'string'
      or (v_item->>'club') not in ('iron','driver')
      or jsonb_typeof(v_item->'completedAt') is distinct from 'string'
      or (v_item->>'completedAt') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$'
      or jsonb_typeof(v_item->'localDate') is distinct from 'string'
      or (v_item->>'localDate') !~ '^\d{4}-\d{2}-\d{2}$'
      or jsonb_typeof(v_item->'before') is distinct from 'array'
      or jsonb_typeof(v_item->'after') is distinct from 'array' then
      raise exception 'Invalid session' using errcode = '22023';
    end if;
    if jsonb_array_length(v_item->'before') <> 5 or jsonb_array_length(v_item->'after') <> 5
      or exists (select 1 from jsonb_array_elements((v_item->'before') || (v_item->'after')) shot
        where jsonb_typeof(shot) <> 'string' or shot #>> '{}' not in ('air','contact','miss','unsure')) then
      raise exception 'Expected two complete shot sets' using errcode = '22023';
    end if;
    v_completed := (v_item->>'completedAt')::timestamptz;
    v_local := (v_item->>'localDate')::date;
    if to_char(v_completed at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') <> v_item->>'completedAt'
      or v_completed > clock_timestamp()
      or abs(v_local - (v_completed at time zone 'UTC')::date) > 1 then
      raise exception 'Invalid completion date' using errcode = '22023';
    end if;
    select array_agg(value) into v_before from jsonb_array_elements_text(v_item->'before');
    select array_agg(value) into v_after from jsonb_array_elements_text(v_item->'after');
    insert into public.practice_sessions(user_id,id,completed_at,local_date,club,before_shots,after_shots)
      values(v_user,v_item->>'id',v_completed,v_local,v_item->>'club',v_before,v_after)
      on conflict (user_id,id) do nothing;
  end loop;
  delete from public.practice_sessions where user_id = v_user and id in (
    select id from public.practice_sessions where user_id = v_user order by completed_at desc, id offset 30
  );
  return query select * from public.practice_sessions where user_id = v_user order by completed_at desc, id;
end;
$$;
revoke all on function public.save_practice_sessions(jsonb,uuid) from public, anon;
grant execute on function public.save_practice_sessions(jsonb,uuid) to authenticated;

create function public.clear_practice_sessions(p_expected_user_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null or v_user is distinct from p_expected_user_id then raise exception 'Authentication required or account changed' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 84631));
  delete from public.practice_sessions where user_id = v_user;
end;
$$;
revoke all on function public.clear_practice_sessions(uuid) from public, anon;
grant execute on function public.clear_practice_sessions(uuid) to authenticated;
comment on table public.practice_sessions is 'Private, optional Range Rescue history. Latest 30 completed sessions per account. No raw video or analytics data.';
