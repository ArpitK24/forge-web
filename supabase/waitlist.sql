-- Run once in Supabase → SQL Editor
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  source text,
  user_agent text,
  created_at timestamptz not null default now()
);
-- Lock the table: only the server (service role key) can read/write.
alter table public.waitlist enable row level security;
