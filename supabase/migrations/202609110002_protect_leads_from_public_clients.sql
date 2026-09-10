-- Lead capture and verification use the server-only service_role client.
-- Public practice-account clients must not read or modify lead records.
begin;
alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
commit;
