import { Pool } from 'pg';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  accountEquity: number;
  riskPercent: number;
  preferredInstrument: string;
  propFirmCode: string;
  memberSince: string;
  discordId?: string;
  avatar?: string;
}

export interface TradeRecord {
  id: string;
  userId?: string;
  date: string;
  instrument: string;
  setup: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  status: string;
  notes?: string;
  disciplineRating: number;
}

export interface ChecklistRecord {
  id: string;
  category: string;
  label: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistRecord[] = [
  { id: 'c1', category: 'Context', label: 'Higher timeframe trend and Daily Value Area identified', checked: false },
  { id: 'c2', category: 'Context', label: 'No high-impact economic news within 15 minutes (CPI/FOMC)', checked: false },
  { id: 'c3', category: 'Setup', label: 'Price is testing an auction extreme (VAL, VAH, POC, Single Prints)', checked: false },
  { id: 'c4', category: 'Setup', label: 'Orderflow confirmation: absorption or delta divergence spotted on DOM', checked: false },
  { id: 'c5', category: 'Risk', label: 'Invalidation level and hard stop defined BEFORE clicking entry', checked: false },
  { id: 'c6', category: 'Risk', label: 'Potential reward is at least 2x the predefined risk (R:R >= 1:2)', checked: false },
  { id: 'c7', category: 'Mindset', label: 'Calm, focused, completely at peace with taking a full loss', checked: false }
];

const DEFAULT_TRADES: TradeRecord[] = [
  {
    id: 't-101',
    date: 'Today, 10:14 AM',
    instrument: 'NQ',
    setup: 'Absorption at POC',
    direction: 'LONG',
    entryPrice: 20432.5,
    exitPrice: 20455.0,
    pnl: 450.0,
    status: 'WIN',
    notes: 'Waited for iceberg ask absorption before entering. Target taken at VAH perimeter.',
    disciplineRating: 10
  },
  {
    id: 't-102',
    date: 'Today, 09:42 AM',
    instrument: 'ES',
    setup: 'Single Print Fill',
    direction: 'SHORT',
    entryPrice: 5680.25,
    exitPrice: 5674.5,
    pnl: 287.5,
    status: 'WIN',
    notes: 'Responsive rejection off yesterday single prints. Clean rotation.',
    disciplineRating: 9
  },
  {
    id: 't-103',
    date: 'Yesterday, 02:15 PM',
    instrument: 'NQ',
    setup: 'Failed Auction Breakout',
    direction: 'LONG',
    entryPrice: 20380.0,
    exitPrice: 20371.0,
    pnl: -180.0,
    status: 'LOSS',
    notes: 'Cut immediately when CVD reversed. Followed hard stop with zero hesitation.',
    disciplineRating: 10
  }
];

class DatabaseService {
  private pool: Pool | null = null;
  private isPostgresReady = false;

  // Resilient memory store when DATABASE_URL is not configured
  private memUsers = new Map<string, UserRecord>();
  private memTrades = new Map<string, TradeRecord[]>();
  private memChecklist = new Map<string, ChecklistRecord[]>();

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
      console.log('[DB] No DATABASE_URL provided. Operating with high-performance persistent in-memory repository.');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });

      // Test connection and initialize schema
      const client = await this.pool.connect();
      try {
        await client.query(`
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
        `);
        this.isPostgresReady = true;
        console.log('[DB] PostgreSQL connected and initial schema verified successfully.');
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn('[DB] PostgreSQL connection error. Falling back to internal memory repository:', err?.message || err);
      this.isPostgresReady = false;
    }
  }

  // ================= USERS =================
  async getUserById(id: string): Promise<UserRecord | null> {
    if (this.isPostgresReady && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          accountEquity: Number(row.account_equity),
          riskPercent: Number(row.risk_percent),
          preferredInstrument: row.preferred_instrument,
          propFirmCode: row.prop_firm_code,
          memberSince: row.member_since,
          discordId: row.discord_id,
          avatar: row.avatar
        };
      } catch (e) {
        console.warn('[DB] Error querying user by id:', e);
      }
    }
    return this.memUsers.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const normalized = email.toLowerCase().trim();
    if (this.isPostgresReady && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [normalized]);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          accountEquity: Number(row.account_equity),
          riskPercent: Number(row.risk_percent),
          preferredInstrument: row.preferred_instrument,
          propFirmCode: row.prop_firm_code,
          memberSince: row.member_since,
          discordId: row.discord_id,
          avatar: row.avatar
        };
      } catch (e) {
        console.warn('[DB] Error querying user by email:', e);
      }
    }

    for (const u of this.memUsers.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return null;
  }

  async upsertUser(user: UserRecord): Promise<UserRecord> {
    if (this.isPostgresReady && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO users (id, name, email, account_equity, risk_percent, preferred_instrument, prop_firm_code, member_since, discord_id, avatar, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             account_equity = EXCLUDED.account_equity,
             risk_percent = EXCLUDED.risk_percent,
             preferred_instrument = EXCLUDED.preferred_instrument,
             prop_firm_code = EXCLUDED.prop_firm_code,
             updated_at = CURRENT_TIMESTAMP`,
          [
            user.id,
            user.name,
            user.email.toLowerCase().trim(),
            user.accountEquity,
            user.riskPercent,
            user.preferredInstrument,
            user.propFirmCode,
            user.memberSince,
            user.discordId || null,
            user.avatar || null
          ]
        );
      } catch (e) {
        console.warn('[DB] Error upserting user in Postgres:', e);
      }
    }
    this.memUsers.set(user.id, user);
    return user;
  }

  // ================= TRADES =================
  async getTrades(userId: string): Promise<TradeRecord[]> {
    if (this.isPostgresReady && this.pool) {
      try {
        const res = await this.pool.query(
          'SELECT * FROM trades WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        if (res.rows.length > 0) {
          return res.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            date: row.date,
            instrument: row.instrument,
            setup: row.setup,
            direction: row.direction as 'LONG' | 'SHORT',
            entryPrice: Number(row.entry_price),
            exitPrice: Number(row.exit_price),
            pnl: Number(row.pnl),
            status: row.status,
            notes: row.notes,
            disciplineRating: Number(row.discipline_rating)
          }));
        }
      } catch (e) {
        console.warn('[DB] Error getting trades:', e);
      }
    }

    if (!this.memTrades.has(userId)) {
      // Seed default trades for new user
      this.memTrades.set(userId, [...DEFAULT_TRADES]);
    }
    return this.memTrades.get(userId) || [];
  }

  async saveTrades(userId: string, trades: TradeRecord[]): Promise<TradeRecord[]> {
    if (this.isPostgresReady && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM trades WHERE user_id = $1', [userId]);
        for (const t of trades) {
          await client.query(
            `INSERT INTO trades (id, user_id, date, instrument, setup, direction, entry_price, exit_price, pnl, status, notes, discipline_rating)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              t.id,
              userId,
              t.date,
              t.instrument,
              t.setup,
              t.direction,
              t.entryPrice,
              t.exitPrice,
              t.pnl,
              t.status,
              t.notes || '',
              t.disciplineRating
            ]
          );
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        console.warn('[DB] Error saving trades:', e);
      } finally {
        client.release();
      }
    }

    this.memTrades.set(userId, trades);
    return trades;
  }

  async addTrade(userId: string, trade: TradeRecord): Promise<TradeRecord[]> {
    if (this.isPostgresReady && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO trades (id, user_id, date, instrument, setup, direction, entry_price, exit_price, pnl, status, notes, discipline_rating)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO UPDATE SET
             date = EXCLUDED.date,
             instrument = EXCLUDED.instrument,
             setup = EXCLUDED.setup,
             direction = EXCLUDED.direction,
             entry_price = EXCLUDED.entry_price,
             exit_price = EXCLUDED.exit_price,
             pnl = EXCLUDED.pnl,
             status = EXCLUDED.status,
             notes = EXCLUDED.notes,
             discipline_rating = EXCLUDED.discipline_rating`,
          [
            trade.id,
            userId,
            trade.date,
            trade.instrument,
            trade.setup,
            trade.direction,
            trade.entryPrice,
            trade.exitPrice,
            trade.pnl,
            trade.status,
            trade.notes || '',
            trade.disciplineRating
          ]
        );
      } catch (e) {
        console.warn('[DB] Error adding trade:', e);
      }
    }

    const current = await this.getTrades(userId);
    const filtered = current.filter(t => t.id !== trade.id);
    const updated = [trade, ...filtered];
    this.memTrades.set(userId, updated);
    return updated;
  }

  async deleteTrade(userId: string, tradeId: string): Promise<boolean> {
    if (this.isPostgresReady && this.pool) {
      try {
        await this.pool.query('DELETE FROM trades WHERE id = $1 AND user_id = $2', [tradeId, userId]);
      } catch (e) {
        console.warn('[DB] Error deleting trade:', e);
      }
    }

    const current = await this.getTrades(userId);
    const updated = current.filter(t => t.id !== tradeId);
    this.memTrades.set(userId, updated);
    return true;
  }

  // ================= CHECKLIST =================
  async getChecklist(userId: string): Promise<ChecklistRecord[]> {
    if (this.isPostgresReady && this.pool) {
      try {
        const res = await this.pool.query(
          'SELECT id, category, label, checked FROM checklist_items WHERE user_id = $1 ORDER BY id ASC',
          [userId]
        );
        if (res.rows.length > 0) {
          return res.rows.map(row => ({
            id: row.id,
            category: row.category,
            label: row.label,
            checked: Boolean(row.checked)
          }));
        }
      } catch (e) {
        console.warn('[DB] Error getting checklist:', e);
      }
    }

    if (!this.memChecklist.has(userId)) {
      this.memChecklist.set(userId, [...DEFAULT_CHECKLIST]);
    }
    return this.memChecklist.get(userId) || [];
  }

  async saveChecklist(userId: string, items: ChecklistRecord[]): Promise<ChecklistRecord[]> {
    if (this.isPostgresReady && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        for (const item of items) {
          await client.query(
            `INSERT INTO checklist_items (id, user_id, category, label, checked, updated_at)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id, id) DO UPDATE SET
               checked = EXCLUDED.checked,
               updated_at = CURRENT_TIMESTAMP`,
            [item.id, userId, item.category, item.label, item.checked]
          );
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        console.warn('[DB] Error saving checklist in Postgres:', e);
      } finally {
        client.release();
      }
    }

    this.memChecklist.set(userId, items);
    return items;
  }
}

export const db = new DatabaseService();
