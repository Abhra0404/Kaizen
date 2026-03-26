-- ============================================================
-- Kaizen – Complete Supabase Database Schema (Idempotent)
-- Safe to run multiple times — all statements handle "already exists"
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
--
-- PREREQUISITES:
--   1. Enable pg_cron and pg_net from Dashboard → Database → Extensions
--   2. Replace <YOUR_SERVICE_ROLE_KEY> below with your actual key
--      (Dashboard → Settings → API → service_role secret)
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- PART 0: Verify extensions are enabled
-- ═══════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    RAISE EXCEPTION 'pg_cron is not enabled. Enable it from Dashboard → Database → Extensions first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RAISE EXCEPTION 'pg_net is not enabled. Enable it from Dashboard → Database → Extensions first.';
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- PART 1: App Config Table (stores settings for pg_cron jobs)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS app_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Only postgres/service_role should read this (contains secrets)
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
-- No RLS policies = no user access. Only service_role (bypasses RLS) and
-- pg_cron (runs as postgres, bypasses RLS) can read.

-- Upsert config values
INSERT INTO app_config (key, value) VALUES
  ('supabase_url',      'https://rbkliofzwotkwotuakqs.supabase.co'),
  ('service_role_key',  '<YOUR_SERVICE_ROLE_KEY>'),
  ('cron_secret',       'f92a485876a25176a399ef369ff32e114b6832b32f7e9b0a03960697dbef84ed')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ═══════════════════════════════════════════════════════════════
-- PART 2: Core Tables
-- ═══════════════════════════════════════════════════════════════

-- ── habits ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  frequency   TEXT NOT NULL CHECK (frequency IN ('Daily', 'Weekly')),
  streak      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habits: user can select own" ON habits;
CREATE POLICY "habits: user can select own" ON habits
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "habits: user can insert own" ON habits;
CREATE POLICY "habits: user can insert own" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "habits: user can update own" ON habits;
CREATE POLICY "habits: user can update own" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "habits: user can delete own" ON habits;
CREATE POLICY "habits: user can delete own" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- ── projects ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Review', 'Done')),
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  team        TEXT[] NOT NULL DEFAULT '{}',
  tags        TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects: user can select own" ON projects;
CREATE POLICY "projects: user can select own" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects: user can insert own" ON projects;
CREATE POLICY "projects: user can insert own" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects: user can update own" ON projects;
CREATE POLICY "projects: user can update own" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects: user can delete own" ON projects;
CREATE POLICY "projects: user can delete own" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- ── dsa_problems ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dsa_problems (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title         TEXT NOT NULL,
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic         TEXT NOT NULL DEFAULT '',
  solved        BOOLEAN NOT NULL DEFAULT false,
  date          DATE NOT NULL DEFAULT current_date,
  source        TEXT NOT NULL DEFAULT 'manual',
  leetcode_slug TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE dsa_problems ENABLE ROW LEVEL SECURITY;

-- Add columns if upgrading from older schema (safe if already exist)
ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS leetcode_slug TEXT DEFAULT '';

-- One entry per LeetCode problem per user (prevents duplicates on re-sync)
CREATE UNIQUE INDEX IF NOT EXISTS idx_dsa_problems_user_leetcode_slug
  ON dsa_problems (user_id, leetcode_slug)
  WHERE leetcode_slug != '';

DROP POLICY IF EXISTS "dsa_problems: user can select own" ON dsa_problems;
CREATE POLICY "dsa_problems: user can select own" ON dsa_problems
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "dsa_problems: user can insert own" ON dsa_problems;
CREATE POLICY "dsa_problems: user can insert own" ON dsa_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "dsa_problems: user can update own" ON dsa_problems;
CREATE POLICY "dsa_problems: user can update own" ON dsa_problems
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "dsa_problems: user can delete own" ON dsa_problems;
CREATE POLICY "dsa_problems: user can delete own" ON dsa_problems
  FOR DELETE USING (auth.uid() = user_id);

-- ── goals ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  deadline    TEXT NOT NULL DEFAULT 'No deadline',
  category    TEXT NOT NULL DEFAULT 'General',
  completed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "goals: user can select own" ON goals;
CREATE POLICY "goals: user can select own" ON goals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals: user can insert own" ON goals;
CREATE POLICY "goals: user can insert own" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals: user can update own" ON goals;
CREATE POLICY "goals: user can update own" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals: user can delete own" ON goals;
CREATE POLICY "goals: user can delete own" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- PART 3: LeetCode Integration Tables
-- ═══════════════════════════════════════════════════════════════

-- ── user_profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username  TEXT NOT NULL DEFAULT '',
  leetcode_session   TEXT DEFAULT '',
  last_synced_at     TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add columns if upgrading from older schema
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS leetcode_session TEXT DEFAULT '';

-- Cron sync metadata columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'idle';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_sync_error TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_sync_problems_found INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_sync_problems_inserted INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS cron_sync_enabled BOOLEAN DEFAULT TRUE;

-- Add CHECK constraint for sync_status (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_profiles_sync_status_check'
      AND conrelid = 'user_profiles'::regclass
  ) THEN
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_sync_status_check
      CHECK (sync_status IN ('idle', 'syncing', 'healthy', 'error', 'expired_session'));
  END IF;
END $$;

DROP POLICY IF EXISTS "user_profiles: user can select own" ON user_profiles;
CREATE POLICY "user_profiles: user can select own" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles: user can insert own" ON user_profiles;
CREATE POLICY "user_profiles: user can insert own" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles: user can update own" ON user_profiles;
CREATE POLICY "user_profiles: user can update own" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ── leetcode_problem_cache ────────────────────────────────
CREATE TABLE IF NOT EXISTS leetcode_problem_cache (
  title_slug   TEXT PRIMARY KEY,
  difficulty   TEXT NOT NULL DEFAULT 'Easy',
  topic        TEXT NOT NULL DEFAULT '',
  cached_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leetcode_problem_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leetcode_problem_cache: anyone can read" ON leetcode_problem_cache;
CREATE POLICY "leetcode_problem_cache: anyone can read" ON leetcode_problem_cache
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "leetcode_problem_cache: authenticated can insert" ON leetcode_problem_cache;
CREATE POLICY "leetcode_problem_cache: authenticated can insert" ON leetcode_problem_cache
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "leetcode_problem_cache: authenticated can update" ON leetcode_problem_cache;
CREATE POLICY "leetcode_problem_cache: authenticated can update" ON leetcode_problem_cache
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════════════════════════
-- PART 4: Sync Logs (observability for cron auto-sync)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sync_logs (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'running'
                      CHECK (status IN ('running', 'success', 'error', 'skipped', 'expired_session')),
  mode              TEXT CHECK (mode IN ('full', 'quick', 'incremental')),
  problems_found    INTEGER DEFAULT 0,
  problems_inserted INTEGER DEFAULT 0,
  pages_scanned     INTEGER DEFAULT 0,
  early_exit        BOOLEAN DEFAULT FALSE,
  error_message     TEXT,
  triggered_by      TEXT NOT NULL DEFAULT 'cron'
                      CHECK (triggered_by IN ('cron', 'manual', 'initial'))
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_user_started
  ON sync_logs(user_id, started_at DESC);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sync_logs: user can view own" ON sync_logs;
CREATE POLICY "sync_logs: user can view own" ON sync_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- PART 5: Enable Supabase Realtime (idempotent)
-- ═══════════════════════════════════════════════════════════════

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE dsa_problems;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- already added
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- already added
END $$;

-- ═══════════════════════════════════════════════════════════════
-- PART 6: Schedule Cron Jobs (idempotent)
-- Reads URL, service_role_key, cron_secret from app_config table
-- ═══════════════════════════════════════════════════════════════

-- Remove existing jobs first (safe if they don't exist)
DO $$
BEGIN
  PERFORM cron.unschedule('leetcode-cron-sync');
EXCEPTION WHEN OTHERS THEN
  NULL; -- job didn't exist
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-old-sync-logs');
EXCEPTION WHEN OTHERS THEN
  NULL; -- job didn't exist
END $$;

-- Every 10 minutes: trigger batch sync Edge Function
-- Reads secrets from app_config table at runtime
SELECT cron.schedule(
  'leetcode-cron-sync',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT value FROM app_config WHERE key = 'supabase_url')
           || '/functions/v1/leetcode-batch-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer '
           || (SELECT value FROM app_config WHERE key = 'service_role_key')
    ),
    body := jsonb_build_object(
      'cronSecret', (SELECT value FROM app_config WHERE key = 'cron_secret'),
      'triggeredBy', 'cron'
    )
  );
  $$
);

-- Daily at 3:17 AM UTC: clean up sync logs older than 30 days
SELECT cron.schedule(
  'cleanup-old-sync-logs',
  '17 3 * * *',
  $$
  DELETE FROM sync_logs WHERE started_at < NOW() - INTERVAL '30 days';
  $$
);

-- ═══════════════════════════════════════════════════════════════
-- DONE! Verify with:
--   SELECT * FROM cron.job;
--   SELECT * FROM app_config;
-- ═══════════════════════════════════════════════════════════════
