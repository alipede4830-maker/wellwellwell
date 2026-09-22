import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, ShieldCheck, BookOpen, CheckSquare, Calculator, LogOut, Bookmark, ExternalLink, TrendingUp, Award, Clock } from 'lucide-react';
import { NavRoute, JournalTrade } from '../types';
import { StorageService, INITIAL_CHECKLIST_ITEMS } from '../lib/storage';

interface DashboardViewProps {
  userName: string;
  userEmail: string;
  onNavigate: (route: NavRoute) => void;
  onSignOut: () => void;
  onBack: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  userEmail,
  onNavigate,
  onSignOut,
  onBack
}) => {
  const [trades, setTrades] = useState<JournalTrade[]>(() => StorageService.getLocalTrades());
  const [checklist, setChecklist] = useState<typeof INITIAL_CHECKLIST_ITEMS>(() => StorageService.getLocalChecklist());

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const [t, c] = await Promise.all([
        StorageService.getTrades(),
        StorageService.getChecklist()
      ]);
      if (mounted) {
        setTrades(t);
        setChecklist(c);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);
  const checkedItems = checklist.filter(c => c.checked).length;
  const checklistPercent = Math.round((checkedItems / checklist.length) * 100);

  const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = trades.filter(t => t.status === 'WIN');
  const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : '0';
  const totalDiscipline = trades.reduce((acc, t) => acc + t.disciplineRating, 0);
  const avgDiscipline = trades.length > 0 ? (totalDiscipline / trades.length).toFixed(1) : '10.0';

  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-8 text-[13px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Trader Profile Header */}
      <div className="p-8 rounded-3xl bg-[#0f1015]/90 border border-white/[0.08] shadow-2xl mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3a8bff] to-[#5865F2] flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/10">
            {userName ? userName[0].toUpperCase() : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-[1.75rem] font-bold text-white">
                {userName || 'Orderflow Trader'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#22d68f]/15 text-[#22d68f] text-[10.5px] font-mono font-semibold">
                PRO OPERATOR
              </span>
            </div>
            <p className="text-[13px] text-[var(--color-ink-3)] font-mono mt-0.5">
              {userEmail || 'trader@orderflw.com'}
            </p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[var(--color-ink-3)] hover:text-white text-[12.5px] font-mono transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Real-Time Journal Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-10">
        <div className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06]">
          <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block mb-1">
            Persisted Net P&L
          </span>
          <span className={`font-display text-[2rem] font-bold block ${totalPnl >= 0 ? 'text-[#22d68f]' : 'text-[#ff4a4a]'}`}>
            {totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`}
          </span>
          <span className="text-[11.5px] font-mono text-[var(--color-ink-4)] mt-1 block">
            Across {trades.length} recorded trades
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06]">
          <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block mb-1">
            Execution Win Rate
          </span>
          <span className="font-display text-[2rem] font-bold text-white block">
            {winRate}%
          </span>
          <span className="text-[11.5px] font-mono text-[var(--color-ink-4)] mt-1 block">
            {wins.length} wins / {trades.length - wins.length} losses
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06]">
          <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block mb-1">
            Discipline Rating
          </span>
          <span className="font-display text-[2rem] font-bold text-[#3a8bff] block">
            {avgDiscipline} <span className="text-[14px] text-[var(--color-ink-4)]">/ 10</span>
          </span>
          <span className="text-[11.5px] font-mono text-[var(--color-ink-4)] mt-1 block">
            Self-evaluated adherence
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06]">
          <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block mb-1">
            Checklist Status
          </span>
          <span className={`font-display text-[2rem] font-bold block ${checklistPercent === 100 ? 'text-[#22d68f]' : 'text-[#ffb341]'}`}>
            {checklistPercent}%
          </span>
          <span className="text-[11.5px] font-mono text-[var(--color-ink-4)] mt-1 block">
            {checkedItems} of {checklist.length} parameters ready
          </span>
        </div>
      </div>

      {/* Operator Quick Launch Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => onNavigate('toolkit/journal')}
          className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06] hover:border-[#3a8bff]/40 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#3a8bff]/10 border border-[#3a8bff]/20 flex items-center justify-center text-[#3a8bff] mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-display text-[16px] font-bold text-white mb-1">Open Trade Journal</h3>
          <p className="text-[12.5px] text-[var(--color-ink-3)]">Review all historical executions, notes, and backup your records.</p>
        </div>

        <div
          onClick={() => onNavigate('toolkit/checklist')}
          className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06] hover:border-[#22d68f]/40 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#22d68f]/10 border border-[#22d68f]/20 flex items-center justify-center text-[#22d68f] mb-4 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="font-display text-[16px] font-bold text-white mb-1">Pre-Execution Checklist</h3>
          <p className="text-[12.5px] text-[var(--color-ink-3)]">Validate higher timeframe value areas and orderflow absorption before taking risk.</p>
        </div>

        <div
          onClick={() => onNavigate('propfirm')}
          className="p-6 rounded-2xl bg-[#0f1015]/80 border border-white/[0.06] hover:border-[#ffb341]/40 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ffb341]/10 border border-[#ffb341]/20 flex items-center justify-center text-[#ffb341] mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display text-[16px] font-bold text-white mb-1">Onyx Futures Partner</h3>
          <p className="text-[12.5px] text-[var(--color-ink-3)]">Activate your funded account evaluation with exclusive discount code CLAUDIO.</p>
        </div>
      </div>
    </div>
  );
};
