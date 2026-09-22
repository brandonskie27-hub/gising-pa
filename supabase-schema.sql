create table public.thoughts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  category text not null check (category in ('senti', 'academic', 'family', 'career', 'personal')),
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

alter table public.thoughts enable row level security;

create policy "anon can read thoughts"
  on public.thoughts
  for select
  to anon
  using (true);

-- Returns true only during the app's 10pm-3am Philippine time window.
-- Used to enforce the time-gate at the database level (not just client-side),
-- so it can't be bypassed by editing frontend code.
create or replace function public.is_gising_hours()
returns boolean
language sql
stable
as $$
  select extract(hour from (now() at time zone 'Asia/Manila')) >= 22
      or extract(hour from (now() at time zone 'Asia/Manila')) < 3;
$$;

create policy "anon can insert thoughts during gising hours"
  on public.thoughts
  for insert
  to anon
  with check (public.is_gising_hours());

-- No update/delete policies exist, so RLS denies those operations to every role.
grant select, insert on public.thoughts to anon;

-- Enable Realtime so new posts broadcast to clients without a refresh.
alter publication supabase_realtime add table public.thoughts;
