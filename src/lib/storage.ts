import { JournalTrade } from '../types';
import { getSupabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  TRADES: 'flw_trade_journal_v1',
  CHECKLIST: 'flw_pretrade_checklist_v1',
  USER: 'flw_user_profile_v1',
  TOKEN: 'flw_auth_token_v1',
  BOOKMARKS: 'flw_bookmarked_lessons_v1',
  STATS: 'flw_trader_stats_v1'
};

export const INITIAL_STORAGE_TRADES: JournalTrade[] = [
  {
    id: 't-101',
    date: 'Today, 10:14 AM',
    instrument: 'NQ',
    setup: 'Absorption at POC',
    direction: 'LONG',
    entryPrice: 20432.50,
    exitPrice: 20455.00,
    pnl: 450.00,
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
    exitPrice: 5674.50,
    pnl: 287.50,
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
    entryPrice: 20380.00,
    exitPrice: 20371.00,
    pnl: -180.00,
    status: 'LOSS',
    notes: 'Cut immediately when CVD reversed. Followed hard stop with zero hesitation.',
    disciplineRating: 10
  }
];

export const INITIAL_CHECKLIST_ITEMS = [
  { id: 'c1', category: 'Context', label: 'Higher timeframe trend and Daily Value Area identified', checked: false },
  { id: 'c2', category: 'Context', label: 'No high-impact economic news within 15 minutes (CPI/FOMC)', checked: false },
  { id: 'c3', category: 'Setup', label: 'Price is testing an auction extreme (VAL, VAH, POC, Single Prints)', checked: false },
  { id: 'c4', category: 'Setup', label: 'Orderflow confirmation: absorption or delta divergence spotted on DOM', checked: false },
  { id: 'c5', category: 'Risk', label: 'Invalidation level and hard stop defined BEFORE clicking entry', checked: false },
  { id: 'c6', category: 'Risk', label: 'Potential reward is at least 2x the predefined risk (R:R >= 1:2)', checked: false },
  { id: 'c7', category: 'Mindset', label: 'Calm, focused, completely at peace with taking a full loss', checked: false }
];

export interface UserProfile {
  name: string;
  email: string;
  accountEquity: number;
  riskPercent: number;
  preferredInstrument: string;
  propFirmCode: string;
  isLoggedIn: boolean;
  memberSince: string;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Ignore localStorage access restrictions if any
  }
  return headers;
}

function mapDbToJournalTrade(row: any): JournalTrade {
  return {
    id: row.id,
    date: row.date,
    instrument: row.instrument,
    setup: row.setup,
    direction: row.direction as 'LONG' | 'SHORT',
    entryPrice: Number(row.entry_price ?? row.entryPrice ?? 0),
    exitPrice: Number(row.exit_price ?? row.exitPrice ?? 0),
    pnl: Number(row.pnl ?? 0),
    status: row.status as 'WIN' | 'LOSS' | 'BE',
    notes: row.notes || '',
    disciplineRating: Number(row.discipline_rating ?? row.disciplineRating ?? 10)
  };
}

function mapJournalTradeToDb(t: JournalTrade, userId: string): any {
  return {
    id: t.id,
    user_id: userId,
    date: t.date,
    instrument: t.instrument,
    setup: t.setup,
    direction: t.direction,
    entry_price: t.entryPrice,
    exit_price: t.exitPrice,
    pnl: t.pnl,
    status: t.status,
    notes: t.notes || '',
    discipline_rating: t.disciplineRating
  };
}

export const StorageService = {
  // Sync Cache Helpers
  getLocalTrades(): JournalTrade[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRADES);
      if (!data) return INITIAL_STORAGE_TRADES;
      return JSON.parse(data);
    } catch {
      return INITIAL_STORAGE_TRADES;
    }
  },

  getLocalChecklist(): typeof INITIAL_CHECKLIST_ITEMS {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (!data) return INITIAL_CHECKLIST_ITEMS;
      return JSON.parse(data);
    } catch {
      return INITIAL_CHECKLIST_ITEMS;
    }
  },

  getLocalUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setAuthToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    } catch {
      // ignore
    }
  },

  getAuthToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },

  // ================= Trades =================
  async getTrades(): Promise<JournalTrade[]> {
    // 1. Try direct Supabase if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const { data, error } = await client
            .from('trades')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapDbToJournalTrade);
            try {
              localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(mapped));
            } catch {}
            return mapped;
          }
        } catch (e) {
          console.warn('[Supabase] Failed to fetch trades, trying REST API:', e);
        }
      }
    }

    // 2. Try REST API endpoint
    try {
      const res = await fetch('/api/trades', {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.trades && Array.isArray(data.trades)) {
          try {
            localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(data.trades));
          } catch {}
          return data.trades;
        }
      }
    } catch (err) {
      console.warn('Network error fetching trades from API, using fallback cache:', err);
    }

    // 3. Fallback to LocalStorage
    return this.getLocalTrades();
  },

  async saveTrades(trades: JournalTrade[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch (e) {
      console.error('Failed to save trades to local cache', e);
    }

    // Direct Supabase sync
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const user = this.getLocalUser();
          const userId = user?.email || 'usr_claudio';
          const dbRows = trades.map(t => mapJournalTradeToDb(t, userId));
          await client.from('trades').upsert(dbRows, { onConflict: 'id' });
        } catch (err) {
          console.warn('[Supabase] Failed to save trades:', err);
        }
      }
    }

    // Express backend sync
    try {
      await fetch('/api/trades', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ trades })
      });
    } catch (err) {
      console.warn('Failed to sync saved trades to server:', err);
    }
  },

  async addTrade(trade: JournalTrade): Promise<JournalTrade[]> {
    const current = this.getLocalTrades();
    const trades = [trade, ...current.filter(t => t.id !== trade.id)];
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch {}

    // Direct Supabase sync
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const user = this.getLocalUser();
          const userId = user?.email || 'usr_claudio';
          await client.from('trades').upsert(mapJournalTradeToDb(trade, userId), { onConflict: 'id' });
        } catch (err) {
          console.warn('[Supabase] Failed to insert trade:', err);
        }
      }
    }

    // Express backend sync
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ trade })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.trades) {
          try {
            localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(data.trades));
          } catch {}
          return data.trades;
        }
      }
    } catch (err) {
      console.warn('Failed to send trade to server:', err);
    }

    return trades;
  },

  async deleteTrade(tradeId: string): Promise<JournalTrade[]> {
    const current = this.getLocalTrades();
    const trades = current.filter(t => t.id !== tradeId);
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch {}

    // Direct Supabase delete
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          await client.from('trades').delete().eq('id', tradeId);
        } catch (err) {
          console.warn('[Supabase] Failed to delete trade:', err);
        }
      }
    }

    // Express backend delete
    try {
      await fetch(`/api/trades/${encodeURIComponent(tradeId)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.warn('Failed to delete trade on server:', err);
    }

    return trades;
  },

  // ================= Checklist =================
  async getChecklist(): Promise<typeof INITIAL_CHECKLIST_ITEMS> {
    // 1. Try direct Supabase
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const { data, error } = await client
            .from('checklist_items')
            .select('*')
            .order('id', { ascending: true });
          if (!error && data && data.length > 0) {
            const mapped = data.map((row: any) => ({
              id: row.id,
              category: row.category,
              label: row.label,
              checked: Boolean(row.checked)
            }));
            try {
              localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(mapped));
            } catch {}
            return mapped;
          }
        } catch (err) {
          console.warn('[Supabase] Failed to get checklist:', err);
        }
      }
    }

    // 2. Try REST API
    try {
      const res = await fetch('/api/checklist', {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checklist && Array.isArray(data.checklist)) {
          try {
            localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(data.checklist));
          } catch {}
          return data.checklist;
        }
      }
    } catch (err) {
      console.warn('Network error fetching checklist, using fallback cache:', err);
    }

    // 3. Fallback
    return this.getLocalChecklist();
  },

  async saveChecklist(items: typeof INITIAL_CHECKLIST_ITEMS): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save checklist to local cache', e);
    }

    // Direct Supabase sync
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const user = this.getLocalUser();
          const userId = user?.email || 'usr_claudio';
          const dbRows = items.map(it => ({
            id: it.id,
            user_id: userId,
            category: it.category,
            label: it.label,
            checked: it.checked
          }));
          await client.from('checklist_items').upsert(dbRows, { onConflict: 'user_id,id' });
        } catch (err) {
          console.warn('[Supabase] Failed to save checklist:', err);
        }
      }
    }

    // Express backend sync
    try {
      await fetch('/api/checklist', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ items })
      });
    } catch (err) {
      console.warn('Failed to sync checklist to server:', err);
    }
  },

  // ================= User Profile =================
  async getUser(): Promise<UserProfile | null> {
    // 1. Try Supabase session / table
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const { data: authData } = await client.auth.getSession();
          if (authData.session?.user) {
            const u = authData.session.user;
            const { data: profData } = await client.from('users').select('*').eq('id', u.id).single();
            if (profData) {
              const profile: UserProfile = {
                name: profData.name || u.email?.split('@')[0] || 'Trader',
                email: profData.email || u.email || '',
                accountEquity: Number(profData.account_equity || 50000),
                riskPercent: Number(profData.risk_percent || 1.0),
                preferredInstrument: profData.preferred_instrument || 'NQ',
                propFirmCode: profData.prop_firm_code || 'CLAUDIO',
                isLoggedIn: true,
                memberSince: profData.member_since || 'Sep 2026'
              };
              try {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
              } catch {}
              return profile;
            }
          }
        } catch (e) {
          console.warn('[Supabase] Error getting user:', e);
        }
      }
    }

    // 2. Try REST API endpoint
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          } catch {}
          return data.user;
        }
      } else if (res.status === 401) {
        // Explicitly unauthenticated
        try {
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch {}
        return null;
      }
    } catch (err) {
      console.warn('Error verifying session from server:', err);
    }
    return this.getLocalUser();
  },

  async saveUser(user: UserProfile): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user in local cache', e);
    }

    // Supabase update
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          await client.from('users').upsert({
            id: user.email,
            name: user.name,
            email: user.email,
            account_equity: user.accountEquity,
            risk_percent: user.riskPercent,
            preferred_instrument: user.preferredInstrument,
            prop_firm_code: user.propFirmCode,
            member_since: user.memberSince
          }, { onConflict: 'id' });
        } catch (err) {
          console.warn('[Supabase] Failed to update user:', err);
        }
      }
    }

    // Express update
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.warn('Failed to update user profile on server:', err);
    }
  },

  async clearUser(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.error('Failed to clear local user cache', e);
    }

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          await client.auth.signOut();
        } catch (err) {
          console.warn('[Supabase] Sign out error:', err);
        }
      }
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.warn('Failed to call logout on server:', err);
    }
  },

  // ================= Export / Import =================
  async exportData(): Promise<string> {
    const [trades, checklist, user] = await Promise.all([
      this.getTrades(),
      this.getChecklist(),
      this.getUser()
    ]);

    const dump = {
      trades,
      checklist,
      user,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(dump, null, 2);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.trades && Array.isArray(parsed.trades)) {
        await this.saveTrades(parsed.trades);
      }
      if (parsed.checklist && Array.isArray(parsed.checklist)) {
        await this.saveChecklist(parsed.checklist);
      }
      if (parsed.user) {
        await this.saveUser(parsed.user);
      }
      return true;
    } catch {
      return false;
    }
  }
};
