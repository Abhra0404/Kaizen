-- ============================================================
-- Kaizen – Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── habits ────────────────────────────────────────────────
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  frequency   text not null check (frequency in ('Daily', 'Weekly')),
  streak      integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table habits enable row level security;

create policy "habits: user can select own" on habits
  for select using (auth.uid() = user_id);

create policy "habits: user can insert own" on habits
  for insert with check (auth.uid() = user_id);

create policy "habits: user can update own" on habits
  for update using (auth.uid() = user_id);

create policy "habits: user can delete own" on habits
  for delete using (auth.uid() = user_id);

-- ── projects ──────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text not null default '',
  status      text not null default 'Planning' check (status in ('Planning', 'In Progress', 'Review', 'Done')),
  progress    integer not null default 0 check (progress between 0 and 100),
  team        text[] not null default '{}',
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

alter table projects enable row level security;

create policy "projects: user can select own" on projects
  for select using (auth.uid() = user_id);

create policy "projects: user can insert own" on projects
  for insert with check (auth.uid() = user_id);

create policy "projects: user can update own" on projects
  for update using (auth.uid() = user_id);

create policy "projects: user can delete own" on projects
  for delete using (auth.uid() = user_id);

-- ── dsa_problems ─────────────────────────────────────────
create table if not exists dsa_problems (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  difficulty  text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  topic       text not null default '',
  solved      boolean not null default false,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

alter table dsa_problems enable row level security;

create policy "dsa_problems: user can select own" on dsa_problems
  for select using (auth.uid() = user_id);

create policy "dsa_problems: user can insert own" on dsa_problems
  for insert with check (auth.uid() = user_id);

create policy "dsa_problems: user can update own" on dsa_problems
  for update using (auth.uid() = user_id);

create policy "dsa_problems: user can delete own" on dsa_problems
  for delete using (auth.uid() = user_id);

-- ── goals ─────────────────────────────────────────────────
create table if not exists goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text not null default '',
  progress    integer not null default 0 check (progress between 0 and 100),
  deadline    text not null default 'No deadline',
  category    text not null default 'General',
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table goals enable row level security;

create policy "goals: user can select own" on goals
  for select using (auth.uid() = user_id);

create policy "goals: user can insert own" on goals
  for insert with check (auth.uid() = user_id);

create policy "goals: user can update own" on goals
  for update using (auth.uid() = user_id);

create policy "goals: user can delete own" on goals
  for delete using (auth.uid() = user_id);
