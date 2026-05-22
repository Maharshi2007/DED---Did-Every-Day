-- ============================================================
-- DED — Did Every Day | Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- GATE syllabus progress (one row per subtopic)
CREATE TABLE gate_syllabus_progress (
  subtopic_id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','completed','revision')),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GATE daily journal entries
CREATE TABLE gate_daily_entries (
  date DATE PRIMARY KEY,
  dtd_journal TEXT,
  rating_did_your_best INT CHECK (rating_did_your_best BETWEEN 1 AND 5),
  rating_can_be_better INT CHECK (rating_can_be_better BETWEEN 1 AND 5),
  topics_studied TEXT[] DEFAULT '{}',
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Football daily entries
CREATE TABLE football_daily_entries (
  date DATE PRIMARY KEY,
  matches_watched TEXT[] DEFAULT '{}',
  rating_day INT CHECK (rating_day BETWEEN 0 AND 5),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gym daily entries
CREATE TABLE gym_daily_entries (
  date DATE PRIMARY KEY,
  went_to_gym BOOLEAN DEFAULT FALSE,
  muscles_trained TEXT[] DEFAULT '{}',
  supplements JSONB DEFAULT '{"protein":false,"creatine":false,"omega_3":false}',
  rating_day INT CHECK (rating_day BETWEEN 0 AND 5),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (single user — allow all with anon key)
-- ============================================================
ALTER TABLE gate_syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON gate_syllabus_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON gate_daily_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON football_daily_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON gym_daily_entries FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Done! Your tables are ready.
-- ============================================================
