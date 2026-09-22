-- FLW Institutional Orderflow Database Schema
-- Version: 001
-- Tables: users, trades, checklist_items

-- 1. Users table (UserProfile + authentication)
CREATE TABLE IF NOT EXISTS users (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Journal Trades table (JournalTrade type)
CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);

-- 3. Pre-Trade Checklist Items table
CREATE TABLE IF NOT EXISTS checklist_items (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS idx_checklist_user_id ON checklist_items(user_id);
