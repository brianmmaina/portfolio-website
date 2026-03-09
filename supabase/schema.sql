create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  stack text[] not null default '{}',
  status text not null default 'Coming Soon',
  featured boolean not null default false,
  sort_order integer not null default 999,
  repo_url text,
  live_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read featured projects" on public.projects;
create policy "Public can read featured projects"
on public.projects
for select
to anon, authenticated
using (featured = true);

drop policy if exists "No direct writes on projects" on public.projects;
create policy "No direct writes on projects"
on public.projects
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists "No direct reads contact messages" on public.contact_messages;
create policy "No direct reads contact messages"
on public.contact_messages
for select
to anon, authenticated
using (false);

drop policy if exists "No direct writes contact messages" on public.contact_messages;
create policy "No direct writes contact messages"
on public.contact_messages
for all
to anon, authenticated
using (false)
with check (false);
