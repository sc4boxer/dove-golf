create extension if not exists pgcrypto;

create table if not exists public.product_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  module text not null check (module in ('range-rescue')),
  plan_id text not null check (plan_id in (
    'ground-first', 'thin-or-top', 'starts-left', 'starts-right',
    'curves-left', 'curves-right', 'no-pattern'
  )),
  helpful boolean not null,
  experience text check (experience is null or experience in (
    'prefer-not-to-say', 'just-starting', 'under-one-year',
    'one-to-three-years', 'more-than-three-years'
  )),
  next_help text check (next_help is null or next_help in (
    'better-contact', 'start-direction', 'curve-control',
    'distance', 'equipment', 'practice-plan'
  )),
  comment text check (comment is null or char_length(comment) <= 500)
);

alter table public.product_feedback enable row level security;

comment on table public.product_feedback is
  'Anonymous, optional product feedback. No account, email, IP address, user agent, or persistent visitor identifier is stored.';

create index if not exists product_feedback_created_at_idx
  on public.product_feedback (created_at desc);

create index if not exists product_feedback_module_helpful_idx
  on public.product_feedback (module, helpful);
