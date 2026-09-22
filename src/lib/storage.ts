import { JournalTrade } from '../types';

const STORAGE_KEYS = {
  TRADES: 'flw_trade_journal_v1',
  CHECKLIST: 'flw_pretrade_checklist_v1',
  USER: 'flw_user_profile_v1',
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

  // ================= Trades =================
  async getTrades(): Promise<JournalTrade[]> {
    try {
      const res = await fetch('/api/trades', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const trades = Array.isArray(data.trades) ? data.trades : [];
        try {
          localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
        } catch {}
        return trades;
      }

      if (res.status === 401) {
        return [];
      }
    } catch (err) {
      console.warn('API getTrades failed:', err);
    }

    return this.getLocalTrades();
  },

  async saveTrades(trades: JournalTrade[]): Promise<void> {
    const res = await fetch('/api/trades', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trades })
    });

    if (!res.ok) {
      throw new Error('Failed to save trades');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch {}
  },

  async addTrade(trade: JournalTrade): Promise<JournalTrade[]> {
    const res = await fetch('/api/trades', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trade })
    });

    if (!res.ok) {
      throw new Error('Failed to save trade');
    }

    const data = await res.json();
    const trades = Array.isArray(data.trades) ? data.trades : [];

    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch {}

    return trades;
  },

  async deleteTrade(tradeId: string): Promise<JournalTrade[]> {
    const res = await fetch(`/api/trades/${encodeURIComponent(tradeId)}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to delete trade');
    }

    const trades = this.getLocalTrades().filter(t => t.id !== tradeId);

    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    } catch {}

    return trades;
  },

  // ================= Checklist =================
  async getChecklist(): Promise<typeof INITIAL_CHECKLIST_ITEMS> {
    try {
      const res = await fetch('/api/checklist', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const checklist = Array.isArray(data.checklist) ? data.checklist : [];
        try {
          localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
        } catch {}
        return checklist;
      }

      if (res.status === 401) {
        return [];
      }
    } catch (err) {
      console.warn('API getChecklist failed:', err);
    }

    return this.getLocalChecklist();
  },

  async saveChecklist(items: typeof INITIAL_CHECKLIST_ITEMS): Promise<void> {
    const res = await fetch('/api/checklist', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    if (!res.ok) {
      throw new Error('Failed to save checklist');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    } catch {}
  },

  // ================= User Profile =================
  async getUser(): Promise<UserProfile | null> {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.status === 401) {
        try {
          localStorage.removeItem(STORAGE_KEYS.USER);
        } catch {}
        return null;
      }

      if (!res.ok) {
        throw new Error('Failed to verify session');
      }

      const data = await res.json();
      if (!data.user) {
        return null;
      }

      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      } catch {}

      return data.user;
    } catch (err) {
      console.warn('Server session check failed:', err);
      return this.getLocalUser();
    }
  },

  async saveUser(user: UserProfile): Promise<void> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (!res.ok) {
      throw new Error('Failed to save user profile');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  },

  async clearUser(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed to clear local user cache', e);
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
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