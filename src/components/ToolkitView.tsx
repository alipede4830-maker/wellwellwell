import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CheckSquare,
  BookOpen,
  Activity,
  ArrowLeft,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Download,
  Upload,
  ArrowUpRight,
  TrendingUp,
  Award,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { JournalTrade } from '../types';
import { StorageService } from '../lib/storage';
import { SessionTimerTool } from './tools/SessionTimerTool';
import { EconomicCalendarTool } from './tools/EconomicCalendarTool';
import { MotionReveal } from './MotionReveal';

interface ToolkitViewProps {
  initialTool?: string;
  onNavigateTool: (tool: string) => void;
  onBack: () => void;
}

const INSTRUMENT_SPECS: Record<string, { name: string; tickVal: number; ticksPerPt: number }> = {
  NQ: { name: 'E-mini Nasdaq 100', tickVal: 5.0, ticksPerPt: 4 },
  MNQ: { name: 'Micro E-mini Nasdaq', tickVal: 0.5, ticksPerPt: 4 },
  ES: { name: 'E-mini S&P 500', tickVal: 12.5, ticksPerPt: 4 },
  MES: { name: 'Micro E-mini S&P', tickVal: 1.25, ticksPerPt: 4 },
  YM: { name: 'E-mini Dow Jones', tickVal: 5.0, ticksPerPt: 1 },
  GC: { name: 'Gold Futures', tickVal: 10.0, ticksPerPt: 10 },
  CL: { name: 'Crude Oil', tickVal: 10.0, ticksPerPt: 100 }
};

const TOOLS_METADATA = [
  {
    id: 'journal',
    slug: 'journal',
    name: 'Trade Journal',
    icon: BookOpen,
    category: 'Persistence & Review',
    desc: 'Log executions, track trade parameters, evaluate discipline scores, and compute real-time edge analytics with browser persistence.'
  },
  {
    id: 'risk-calculator',
    slug: 'risk-calculator',
    name: 'Risk Calculator',
    icon: Calculator,
    category: 'Position Sizing',
    desc: 'Precise futures tick value computation, stop-loss contract sizing, and dollar risk control for NQ, ES, CL, GC, and micros.'
  },
  {
    id: 'session-timer',
    slug: 'session-timer',
    name: 'Session Timer',
    icon: Clock,
    category: 'Market Timing',
    desc: 'Real-time countdown and active status for Asia, London, New York Cash RTH, and electronic futures settlement windows.'
  },
  {
    id: 'checklist',
    slug: 'checklist',
    name: 'Pre-Trade Checklist',
    icon: CheckSquare,
    category: 'Execution Protocol',
    desc: 'Institutional discipline checklist to prevent emotional entries, confirm auction context, and ensure alignment with market balance.'
  },
  {
    id: 'calendar',
    slug: 'calendar',
    name: 'Economic Calendar',
    icon: Calendar,
    category: 'Macro Liquidity',
    desc: 'High-impact macroeconomic releases, FOMC interest rate announcements, CPI, and NFP volatility windows with orderflow execution rules.'
  },
  {
    id: 'monte-carlo',
    slug: 'monte-carlo',
    name: 'Monte Carlo Simulator',
    icon: Activity,
    category: 'Risk Modeling',
    desc: 'Statistical system durability simulator running 1,000 iterations across 100 consecutive trades to evaluate probability of drawdown.'
  }
];

export const ToolkitView: React.FC<ToolkitViewProps> = ({
  initialTool,
  onNavigateTool,
  onBack
}) => {
  const isOverview = !initialTool || initialTool === 'overview' || initialTool === '';
  const currentToolId = initialTool || 'journal';

  // ==========================================
  // 1. RISK CALCULATOR STATE
  // ==========================================
  const [accountBalance, setAccountBalance] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopDistancePts, setStopDistancePts] = useState<number>(10);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('NQ');

  const spec = INSTRUMENT_SPECS[selectedInstrument] || INSTRUMENT_SPECS['NQ'];
  const dollarRisk = (accountBalance * riskPercent) / 100;
  const pointValue = spec.tickVal * spec.ticksPerPt;
  const riskPerContract = stopDistancePts * pointValue;
  const contractsAllowed = riskPerContract > 0 ? Math.max(1, Math.floor(dollarRisk / riskPerContract)) : 1;
  const actualRisk = contractsAllowed * riskPerContract;

  // ==========================================
  // 2. CHECKLIST STATE (PERSISTED)
  // ==========================================
  const [checklist, setChecklist] = useState(() => StorageService.getLocalChecklist());

  // ==========================================
  // 3. TRADE JOURNAL STATE (PERSISTED)
  // ==========================================
  const [trades, setTrades] = useState<JournalTrade[]>(() => StorageService.getLocalTrades());

  useEffect(() => {
    let mounted = true;
    async function loadToolkitData() {
      const [c, t] = await Promise.all([
        StorageService.getChecklist(),
        StorageService.getTrades()
      ]);
      if (mounted) {
        setChecklist(c);
        setTrades(t);
      }
    }
    loadToolkitData();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleCheck = async (id: string) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    setChecklist(updated);
    await StorageService.saveChecklist(updated);
  };

  const handleResetChecklist = async () => {
    const reset = checklist.map((item) => ({ ...item, checked: false }));
    setChecklist(reset);
    await StorageService.saveChecklist(reset);
  };

  const checkedCount = checklist.filter((c) => c.checked).length;
  const checklistPercent = Math.round((checkedCount / checklist.length) * 100);
  const [newSetup, setNewSetup] = useState('Absorption at POC');
  const [newDirection, setNewDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [newInstrument, setNewInstrument] = useState('NQ');
  const [newEntryPrice, setNewEntryPrice] = useState<number>(20450.0);
  const [newExitPrice, setNewExitPrice] = useState<number>(20465.0);
  const [newPnl, setNewPnl] = useState<number>(300);
  const [newDiscipline, setNewDiscipline] = useState<number>(10);

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const trade: JournalTrade = {
      id: 'trade-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      instrument: newInstrument,
      setup: newSetup,
      direction: newDirection,
      entryPrice: newEntryPrice,
      exitPrice: newExitPrice,
      pnl: newPnl,
      status: newPnl > 0 ? 'WIN' : newPnl < 0 ? 'LOSS' : 'BE',
      disciplineRating: newDiscipline
    };
    const updated = [trade, ...trades];
    setTrades(updated);
    await StorageService.saveTrades(updated);
  };

  const handleDeleteTrade = async (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    setTrades(updated);
    await StorageService.deleteTrade(id);
  };

  const handleExportData = async () => {
    const dataStr = await StorageService.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flw_journal_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (await StorageService.importData(content)) {
        const [freshTrades, freshChecklist] = await Promise.all([
          StorageService.getTrades(),
          StorageService.getChecklist()
        ]);
        setTrades(freshTrades);
        setChecklist(freshChecklist);
      }
    };
    reader.readAsText(file);
  };

  // Journal Computed Stats
  const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = trades.filter((t) => t.status === 'WIN');
  const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : '0';
  const totalDiscipline = trades.reduce((acc, t) => acc + t.disciplineRating, 0);
  const avgDiscipline = trades.length > 0 ? (totalDiscipline / trades.length).toFixed(1) : '10.0';

  // ==========================================
  // 4. MONTE CARLO STATE
  // ==========================================
  const [mcWinRate, setMcWinRate] = useState<number>(55);
  const [mcRewardRatio, setMcRewardRatio] = useState<number>(2.0);
  const [mcResult, setMcResult] = useState<{
    simulationsRun: number;
    medianProfit: number;
    maxDrawdownPct: number;
    winProb: number;
  } | null>(null);

  const handleRunMonteCarlo = () => {
    const runs = 1000;
    const tradesPerRun = 100;
    let profitableRuns = 0;
    let worstDrawdown = 0;
    let totalProfits = 0;

    for (let i = 0; i < runs; i++) {
      let balance = 50000;
      let peak = balance;
      let maxDd = 0;

      for (let t = 0; t < tradesPerRun; t++) {
        const isWin = Math.random() * 100 < mcWinRate;
        if (isWin) {
          balance += 500 * mcRewardRatio;
        } else {
          balance -= 500;
        }
        if (balance > peak) peak = balance;
        const dd = ((peak - balance) / peak) * 100;
        if (dd > maxDd) maxDd = dd;
      }

      if (balance > 50000) profitableRuns++;
      if (maxDd > worstDrawdown) worstDrawdown = maxDd;
      totalProfits += balance - 50000;
    }

    setMcResult({
      simulationsRun: runs,
      medianProfit: Math.round(totalProfits / runs),
      maxDrawdownPct: parseFloat(worstDrawdown.toFixed(1)),
      winProb: Math.round((profitableRuns / runs) * 100)
    });
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={isOverview ? onBack : () => onNavigateTool('')}
          className="inline-flex items-center gap-2 text-[13px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{isOverview ? 'Return to Home' : 'Back to All Tools'}</span>
        </button>

        {!isOverview && (
          <div className="text-[12px] font-mono text-[var(--color-ink-4)]">
            <span>Toolkit / </span>
            <span className="text-white font-semibold">
              {TOOLS_METADATA.find((t) => t.slug === currentToolId)?.name}
            </span>
          </div>
        )}
      </div>

      {/* OVERVIEW VIEW */}
      {isOverview ? (
        <div>
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-[#3a8bff]">
                Execution & Analytics Suite
              </span>
            </div>
            <h1 className="font-display text-[2.75rem] md:text-[3.5rem] font-bold tracking-tight text-white leading-tight">
              Orderflow <span className="text-[#3a8bff]">Toolkit.</span>
            </h1>
            <p className="text-[15px] text-[var(--color-ink-3)] mt-2 max-w-2xl leading-relaxed">
              Professional execution calculators, real-time auction session timers, macroeconomic calendars, pre-trade checklists, and statistical edge simulators.
            </p>
          </div>

          {/* 6 Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS_METADATA.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigateTool(tool.slug)}
                  className="group p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-3)] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#3a8bff]/10 border border-[#3a8bff]/20 flex items-center justify-center text-[#3a8bff] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[var(--color-ink-4)] uppercase tracking-wider">
                        {tool.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-[18px] text-white tracking-tight mb-2 group-hover:text-[#3a8bff] transition-colors">
                      {tool.name}
                    </h3>

                    <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mb-6">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-hair-1)] flex items-center justify-between text-[12px] font-semibold text-[#3a8bff] group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Tool</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* INDIVIDUAL TOOL VIEW */
        <div>
          {/* Tool Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[var(--color-hair-1)]">
            {TOOLS_METADATA.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentToolId === tool.slug;
              return (
                <button
                  key={tool.id}
                  onClick={() => onNavigateTool(tool.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/[0.03] text-[var(--color-ink-3)] hover:text-white border border-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.name}</span>
                </button>
              );
            })}
          </div>

          {/* 1. SESSION TIMER */}
          {currentToolId === 'session-timer' && <SessionTimerTool />}

          {/* 2. ECONOMIC CALENDAR */}
          {currentToolId === 'calendar' && <EconomicCalendarTool />}

          {/* 3. RISK CALCULATOR */}
          {currentToolId === 'risk-calculator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-[#0f1015] border border-white/[0.08] space-y-6">
                <div>
                  <h3 className="font-display font-bold text-[20px] text-white">
                    Futures Position Sizer
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-3)] mt-1">
                    Calculate contract limits based on strict account dollar risk and tick specifications.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-[13px]">
                  <div>
                    <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                      Account Balance ($)
                    </label>
                    <input
                      type="number"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                        Risk Per Trade (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                        Stop Distance (Pts)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={stopDistancePts}
                        onChange={(e) => setStopDistancePts(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                      Contract Instrument
                    </label>
                    <select
                      value={selectedInstrument}
                      onChange={(e) => setSelectedInstrument(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                    >
                      {Object.keys(INSTRUMENT_SPECS).map((k) => (
                        <option key={k} value={k}>
                          {k} - {INSTRUMENT_SPECS[k].name} (${INSTRUMENT_SPECS[k].tickVal * INSTRUMENT_SPECS[k].ticksPerPt}/pt)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <div className="p-8 rounded-2xl bg-[#0f1015] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#3a8bff] uppercase tracking-wider font-semibold">
                    Calculation Results
                  </span>
                  <div className="mt-4 mb-6">
                    <span className="text-[12px] font-mono text-[var(--color-ink-3)] block">
                      Maximum Recommended Sizing:
                    </span>
                    <div className="font-display text-[3.5rem] font-bold text-white tracking-tight">
                      {contractsAllowed}{' '}
                      <span className="text-[1.5rem] text-[var(--color-ink-3)] font-normal">
                        Contracts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-[13px] border-t border-white/[0.06] pt-5">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-ink-4)]">Max Allowed Dollar Loss:</span>
                      <span className="text-white">${dollarRisk.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-ink-4)]">Risk Per Single Contract:</span>
                      <span className="text-white">${riskPerContract.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-ink-4)]">Total Simulated Dollar Risk:</span>
                      <span className="text-[#3a8bff] font-bold">${actualRisk.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[12px] text-[var(--color-ink-3)]">
                  Rule: Never round up contracts beyond your calculated dollar threshold. If the distance to your auction invalidation level exceeds your dollar limit, switch to Micros (e.g. MNQ/MES).
                </div>
              </div>
            </div>
          )}

          {/* 4. PRE-TRADE CHECKLIST */}
          {currentToolId === 'checklist' && (
            <div className="p-8 rounded-2xl bg-[#0f1015] border border-white/[0.08] max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-[22px] text-white">
                    Pre-Execution Discipline Checklist
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-3)] mt-1">
                    Enforce institutional auction alignment before sending any live order.
                  </p>
                </div>
                <button
                  onClick={handleResetChecklist}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[12px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-[12px] font-mono mb-2">
                  <span className="text-[var(--color-ink-3)]">Preparedness Score:</span>
                  <span className={checklistPercent === 100 ? 'text-[#22d68f] font-bold' : 'text-white'}>
                    {checklistPercent}% ({checkedCount}/{checklist.length})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      checklistPercent === 100 ? 'bg-[#22d68f]' : 'bg-[#3a8bff]'
                    }`}
                    style={{ width: `${checklistPercent}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      item.checked
                        ? 'bg-[#22d68f]/5 border-[#22d68f]/30'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          item.checked ? 'bg-[#22d68f] text-black' : 'border border-white/[0.2]'
                        }`}
                      >
                        {item.checked && <CheckSquare className="w-4 h-4" />}
                      </div>
                      <span
                        className={`text-[14px] ${
                          item.checked ? 'text-white line-through opacity-80' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-[var(--color-ink-4)] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TRADE JOURNAL */}
          {currentToolId === 'journal' && (
            <div className="space-y-8">
              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-[#0f1015] border border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block">
                    Total Executions
                  </span>
                  <span className="text-2xl font-display font-bold text-white mt-1 block">
                    {trades.length}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-[#0f1015] border border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block">
                    Win Rate
                  </span>
                  <span className="text-2xl font-display font-bold text-[#3a8bff] mt-1 block">
                    {winRate}%
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-[#0f1015] border border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block">
                    Net Realized P&L
                  </span>
                  <span
                    className={`text-2xl font-display font-bold mt-1 block ${
                      totalPnl >= 0 ? 'text-[#22d68f]' : 'text-[#ff4a4a]'
                    }`}
                  >
                    ${totalPnl.toFixed(2)}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-[#0f1015] border border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider block">
                    Avg Discipline
                  </span>
                  <span className="text-2xl font-display font-bold text-white mt-1 block">
                    {avgDiscipline} / 10
                  </span>
                </div>
              </div>

              {/* Log Trade Form */}
              <div className="p-6 rounded-2xl bg-[#0f1015] border border-white/[0.08]">
                <h3 className="font-display font-bold text-[18px] text-white mb-4">
                  Log New Execution
                </h3>
                <form onSubmit={handleAddTrade} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[12.5px]">
                  <div>
                    <label className="block text-[var(--color-ink-4)] mb-1 uppercase text-[10px]">
                      Instrument
                    </label>
                    <select
                      value={newInstrument}
                      onChange={(e) => setNewInstrument(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                    >
                      {Object.keys(INSTRUMENT_SPECS).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--color-ink-4)] mb-1 uppercase text-[10px]">
                      Direction
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setNewDirection('LONG')}
                        className={`flex-1 py-2 rounded-lg text-center font-bold ${
                          newDirection === 'LONG' ? 'bg-[#22d68f] text-black' : 'bg-white/[0.05] text-[var(--color-ink-3)]'
                        }`}
                      >
                        LONG
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewDirection('SHORT')}
                        className={`flex-1 py-2 rounded-lg text-center font-bold ${
                          newDirection === 'SHORT' ? 'bg-[#ff4a4a] text-white' : 'bg-white/[0.05] text-[var(--color-ink-3)]'
                        }`}
                      >
                        SHORT
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--color-ink-4)] mb-1 uppercase text-[10px]">
                      Setup Archetype
                    </label>
                    <input
                      type="text"
                      value={newSetup}
                      onChange={(e) => setNewSetup(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--color-ink-4)] mb-1 uppercase text-[10px]">
                      Realized P&L ($)
                    </label>
                    <input
                      type="number"
                      value={newPnl}
                      onChange={(e) => setNewPnl(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-[#3a8bff]"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-[var(--color-ink-4)] mb-1 uppercase text-[10px]">
                      Discipline Rating (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newDiscipline}
                      onChange={(e) => setNewDiscipline(Number(e.target.value))}
                      className="w-full accent-[#3a8bff]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#3a8bff] text-white font-bold text-[13px] hover:bg-[#2d7ae8] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save Trade</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Trade Log Table */}
              <div className="p-6 rounded-2xl bg-[#0f1015] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-bold text-[16px] text-white">
                    Logged Executions ({trades.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--color-ink-3)] hover:text-white px-2.5 py-1 rounded bg-white/[0.04] transition-colors"
                      title="Export JSON Backup"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                    <label className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--color-ink-3)] hover:text-white px-2.5 py-1 rounded bg-white/[0.04] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import</span>
                      <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[12px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-[var(--color-ink-4)] uppercase text-[10px]">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Symbol</th>
                        <th className="pb-2">Side</th>
                        <th className="pb-2">Setup</th>
                        <th className="pb-2 text-right">P&L</th>
                        <th className="pb-2 text-right">Discipline</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {trades.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.01]">
                          <td className="py-3 text-[var(--color-ink-3)]">{t.date}</td>
                          <td className="py-3 font-semibold text-white">{t.instrument}</td>
                          <td className="py-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                t.direction === 'LONG' ? 'bg-[#22d68f]/10 text-[#22d68f]' : 'bg-[#ff4a4a]/10 text-[#ff4a4a]'
                              }`}
                            >
                              {t.direction}
                            </span>
                          </td>
                          <td className="py-3 text-[var(--color-ink-2)]">{t.setup}</td>
                          <td
                            className={`py-3 text-right font-bold ${
                              t.pnl >= 0 ? 'text-[#22d68f]' : 'text-[#ff4a4a]'
                            }`}
                          >
                            ${t.pnl.toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-white">{t.disciplineRating}/10</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteTrade(t.id)}
                              className="text-[var(--color-ink-4)] hover:text-red-400 transition-colors p-1"
                              title="Delete Trade"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {trades.length === 0 && (
                    <div className="text-center py-10 text-[var(--color-ink-4)]">
                      No trades logged yet. Use the form above to record your first execution.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. MONTE CARLO SIMULATOR */}
          {currentToolId === 'monte-carlo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-[#0f1015] border border-white/[0.08] space-y-6">
                <div>
                  <h3 className="font-display font-bold text-[20px] text-white">
                    System Edge Simulator
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-3)] mt-1">
                    Simulate 1,000 runs of 100 consecutive trades to evaluate probability of survival and maximum drawdown.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-[13px]">
                  <div>
                    <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                      Expected Win Rate (%): {mcWinRate}%
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="75"
                      value={mcWinRate}
                      onChange={(e) => setMcWinRate(Number(e.target.value))}
                      className="w-full accent-[#3a8bff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--color-ink-3)] mb-1 text-[11px] uppercase tracking-wider">
                      Risk / Reward Ratio (R:R): {mcRewardRatio}R
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="4.0"
                      step="0.1"
                      value={mcRewardRatio}
                      onChange={(e) => setMcRewardRatio(Number(e.target.value))}
                      className="w-full accent-[#3a8bff]"
                    />
                  </div>

                  <button
                    onClick={handleRunMonteCarlo}
                    className="w-full py-3 rounded-xl bg-[#3a8bff] text-white font-bold text-[13px] hover:bg-[#2d7ae8] transition-all cursor-pointer shadow-lg mt-4"
                  >
                    Run 1,000 Simulations
                  </button>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="p-8 rounded-2xl bg-[#0f1015] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#3a8bff] uppercase tracking-wider font-semibold">
                    Simulation Analytics
                  </span>

                  {mcResult ? (
                    <div className="mt-4 space-y-5">
                      <div>
                        <span className="text-[12px] font-mono text-[var(--color-ink-3)] block">
                          Probability of Profitability:
                        </span>
                        <div className="font-display text-[3.2rem] font-bold text-[#22d68f] tracking-tight">
                          {mcResult.winProb}%
                        </div>
                      </div>

                      <div className="space-y-3 font-mono text-[13px] border-t border-white/[0.06] pt-5">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-ink-4)]">Simulations Completed:</span>
                          <span className="text-white">{mcResult.simulationsRun.toLocaleString()} runs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-ink-4)]">Median Projected Net P&L:</span>
                          <span className="text-white font-bold">${mcResult.medianProfit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-ink-4)]">Worst Max Drawdown Encountered:</span>
                          <span className="text-[#ff4a4a] font-bold">{mcResult.maxDrawdownPct}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-[var(--color-ink-4)] font-mono text-[13px]">
                      Click "Run 1,000 Simulations" to calculate system probability distribution.
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[12px] text-[var(--color-ink-3)]">
                  Even a 60% win rate system with 2:1 reward will encounter consecutive loss streaks of 5–8 trades over 100 executions. Position sizing determines survival.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
