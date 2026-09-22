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

create policy "anon can insert thoughts"
  on public.thoughts
  for insert
  to anon
  with check (true);

-- No update/delete policies exist, so RLS denies those operations to every role.
grant select, insert on public.thoughts to anon;

-- Enable Realtime so new posts broadcast to clients without a refresh.
alter publication supabase_realtime add table public.thoughts;
