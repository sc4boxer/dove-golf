-- Run explicitly on the intended Supabase project after review. Server role only.
create table public.putting_rounds (
  token_hash text primary key,
  course_version text not null,
  expires_at timestamptz not null default now() + interval '2 hours',
  used_at timestamptz
);
create table public.putting_scores (
  id uuid primary key default gen_random_uuid(),
  round_hash text not null unique references public.putting_rounds(token_hash),
  initials text not null check (initials ~ '^[A-Z0-9]{3}$'),
  score integer not null check (score between 0 and 2500 and score % 100 = 0),
  course_version text not null,
  created_at timestamptz not null default now(),
  rank_at_submission bigint not null check (rank_at_submission > 0),
  hidden boolean not null default false
);
create index putting_scores_board on public.putting_scores(course_version, score desc, created_at) where not hidden;
create table public.putting_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  attempts integer not null
);
alter table public.putting_rounds enable row level security;
alter table public.putting_scores enable row level security;
alter table public.putting_rate_limits enable row level security;
revoke all on public.putting_rounds, public.putting_scores, public.putting_rate_limits from public, anon, authenticated;
grant all on public.putting_rounds, public.putting_scores, public.putting_rate_limits to service_role;

create function public.putting_check_limit(p_key text, p_limit integer) returns void
language plpgsql set search_path = public as $$
declare n integer;
begin
  insert into putting_rate_limits(key, window_start, attempts) values(p_key, date_trunc('hour', now()), 1)
  on conflict(key) do update set
    attempts = case when putting_rate_limits.window_start = date_trunc('hour', now()) then putting_rate_limits.attempts + 1 else 1 end,
    window_start = date_trunc('hour', now()) returning attempts into n;
  if n > p_limit then raise exception 'putting_rate_limit'; end if;
  delete from putting_rate_limits where window_start < now() - interval '2 days';
end $$;

create function public.putting_start_round(p_token_hash text, p_client_hash text, p_version text) returns timestamptz
language plpgsql set search_path = public as $$
declare expiry timestamptz;
begin
  perform putting_check_limit('start:' || p_client_hash, 120);
  -- Keep rows referenced by scores, remove only expired unsubmitted rounds.
  delete from putting_rounds where expires_at < now() and used_at is null;
  insert into putting_rounds(token_hash, course_version) values(p_token_hash, p_version) returning expires_at into expiry;
  return expiry;
end $$;

create function public.putting_submit_score(p_token_hash text, p_initials text, p_score integer, p_version text) returns jsonb
language plpgsql set search_path = public as $$
declare r putting_rounds; s putting_scores; placing bigint;
begin
  select * into r from putting_rounds where token_hash = p_token_hash for update;
  if not found or r.course_version <> p_version then raise exception 'putting_invalid_round'; end if;
  if r.used_at is not null then
    -- Safe retry after a lost response: same token and result returns its original entry.
    select * into s from putting_scores where round_hash = p_token_hash and initials = p_initials and score = p_score and not hidden;
    if not found then raise exception 'putting_invalid_round'; end if;
    return to_jsonb(s) - 'round_hash' - 'hidden';
  end if;
  if r.expires_at < now() then raise exception 'putting_invalid_round'; end if;
  -- Serialize rank assignment for a course, including simultaneous equal scores.
  perform pg_advisory_xact_lock(hashtext('putting:' || p_version));
  select count(*) + 1 into placing from putting_scores
    where course_version = p_version and not hidden and score > p_score
      and created_at >= (date_trunc('week', now() at time zone 'UTC') at time zone 'UTC');
  insert into putting_scores(round_hash, initials, score, course_version, rank_at_submission)
    values(p_token_hash, p_initials, p_score, p_version, placing) returning * into s;
  update putting_rounds set used_at = now() where token_hash = p_token_hash;
  return to_jsonb(s) - 'round_hash' - 'hidden';
end $$;

create function public.putting_leaderboard(p_version text, p_weekly boolean default true)
returns table(id uuid, initials text, score integer, course_version text, created_at timestamptz, rank bigint)
language sql stable set search_path = public as $$
  select id, initials, score, course_version, created_at, rank() over(order by score desc)
  from putting_scores
  where course_version = p_version and not hidden
    and (not p_weekly or created_at >= (date_trunc('week', now() at time zone 'UTC') at time zone 'UTC'))
  order by score desc, created_at asc, id asc limit 10;
$$;

revoke all on function public.putting_check_limit(text, integer), public.putting_start_round(text,text,text), public.putting_submit_score(text,text,integer,text), public.putting_leaderboard(text,boolean) from public, anon, authenticated;
grant execute on function public.putting_check_limit(text, integer), public.putting_start_round(text,text,text), public.putting_submit_score(text,text,integer,text), public.putting_leaderboard(text,boolean) to service_role;
