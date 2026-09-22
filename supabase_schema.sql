-- ==============================================================================
-- FLW Institutional Orderflow Suite - Supabase Database Schema
-- Run this script in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Users table (Trading Profile & Authentication)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  account_equity NUMERIC NOT NULL DEFAULT 50000,
  risk_percent NUMERIC NOT NULL DEFAULT 1.0,
  preferred_instrument TEXT NOT NULL DEFAULT 'NQ',
  prop_firm_code TEXT NOT NULL DEFAULT 'CLAUDIO',
  member_since TEXT NOT NULL,
  discord_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Journal Trades table (Orderflow & Execution Journal)
CREATE TABLE IF NOT EXISTS public.trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  instrument TEXT NOT NULL,
  setup TEXT NOT NULL,
  direction TEXT NOT NULL,
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC NOT NULL,
  pnl NUMERIC NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  discipline_rating INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON public.trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON public.trades(created_at DESC);

-- 3. Pre-Trade Checklist Items table
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS idx_checklist_user_id ON public.checklist_items(user_id);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for both authenticated and anon roles during app development
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to users') THEN
    CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to trades') THEN
    CREATE POLICY "Allow public access to trades" ON public.trades FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to checklist') THEN
    CREATE POLICY "Allow public access to checklist" ON public.checklist_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ==============================================================================
-- Optional Initial Seed Data
-- ==============================================================================
INSERT INTO public.users (id, name, email, account_equity, risk_percent, preferred_instrument, prop_firm_code, member_since)
VALUES ('usr_claudio', 'Claudio', 'claudio@flw.io', 50000, 1.0, 'NQ', 'CLAUDIO', 'Sep 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trades (id, user_id, date, instrument, setup, direction, entry_price, exit_price, pnl, status, notes, discipline_rating)
VALUES
  ('t-101', 'usr_claudio', 'Today, 10:14 AM', 'NQ', 'Absorption at POC', 'LONG', 20432.50, 20455.00, 450.00, 'WIN', 'Waited for iceberg ask absorption before entering. Target taken at VAH perimeter.', 10),
  ('t-102', 'usr_claudio', 'Today, 09:42 AM', 'ES', 'Single Print Fill', 'SHORT', 5680.25, 5674.50, 287.50, 'WIN', 'Responsive rejection off yesterday single prints. Clean rotation.', 9),
  ('t-103', 'usr_claudio', 'Yesterday, 02:15 PM', 'NQ', 'Failed Auction Breakout', 'LONG', 20380.00, 20371.00, -180.00, 'LOSS', 'Cut immediately when CVD reversed. Followed hard stop with zero hesitation.', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.checklist_items (id, user_id, category, label, checked)
VALUES
  ('c1', 'usr_claudio', 'Context', 'Higher timeframe trend and Daily Value Area identified', false),
  ('c2', 'usr_claudio', 'Context', 'No high-impact economic news within 15 minutes (CPI/FOMC)', false),
  ('c3', 'usr_claudio', 'Setup', 'Price is testing an auction extreme (VAL, VAH, POC, Single Prints)', false),
  ('c4', 'usr_claudio', 'Setup', 'Orderflow confirmation: absorption or delta divergence spotted on DOM', false),
  ('c5', 'usr_claudio', 'Risk', 'Invalidation level and hard stop defined BEFORE clicking entry', false),
  ('c6', 'usr_claudio', 'Risk', 'Potential reward is at least 2x the predefined risk (R:R >= 1:2)', false),
  ('c7', 'usr_claudio', 'Mindset', 'Calm, focused, completely at peace with taking a full loss', false)
ON CONFLICT (user_id, id) DO NOTHING;
