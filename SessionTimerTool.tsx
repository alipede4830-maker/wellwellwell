import React, { useState, useEffect } from 'react';
import { Clock, Globe, Zap, AlertCircle } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  region: string;
  startHourUtc: number; // in UTC
  startMinUtc: number;
  endHourUtc: number;
  endMinUtc: number;
  color: string;
  volumeTier: 'High' | 'Peak' | 'Medium' | 'Low';
  description: string;
}

const SESSIONS: Session[] = [
  {
    id: 'asia',
    name: 'Asian Session',
    region: 'Tokyo / Sydney / Hong Kong',
    startHourUtc: 0,
    startMinUtc: 0,
    endHourUtc: 9,
    endMinUtc: 0,
    color: '#3a8bff',
    volumeTier: 'Low',
    description: 'Initial balance formation for overnight electronic futures. Typically establishes early range boundaries.'
  },
  {
    id: 'london',
    name: 'London / European Session',
    region: 'Frankfurt / London',
    startHourUtc: 7,
    startMinUtc: 0,
    endHourUtc: 15,
    endMinUtc: 30,
    color: '#E2B03D',
    volumeTier: 'Medium',
    description: 'Significant European cross-border liquidity. Frequently tests overnight Asian high/low extremes.'
  },
  {
    id: 'ny-cash',
    name: 'New York RTH (Cash Equities)',
    region: 'New York (NYSE / NASDAQ)',
    startHourUtc: 13,
    startMinUtc: 30, // 09:30 EST
    endHourUtc: 20,
    endMinUtc: 0, // 16:00 EST
    color: '#22d68f',
    volumeTier: 'Peak',
    description: 'Primary institutional orderflow. Initial Balance (09:30-10:30 EST), VWAP rotations, and settlement.'
  },
  {
    id: 'cme-close',
    name: 'CME Futures Settlement',
    region: 'Chicago (CME / CBOT)',
    startHourUtc: 20,
    startMinUtc: 45,
    endHourUtc: 21,
    endMinUtc: 0,
    color: '#ff7a7a',
    volumeTier: 'High',
    description: 'Index futures daily closing benchmark and settlement volume prints.'
  }
];

export const SessionTimerTool: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  const currentUtcMinutes = utcHours * 60 + utcMinutes;

  const isSessionActive = (s: Session): boolean => {
    const start = s.startHourUtc * 60 + s.startMinUtc;
    const end = s.endHourUtc * 60 + s.endMinUtc;
    if (start <= end) {
      return currentUtcMinutes >= start && currentUtcMinutes < end;
    } else {
      // wraps around midnight
      return currentUtcMinutes >= start || currentUtcMinutes < end;
    }
  };

  const getTimeUntilSession = (s: Session): string => {
    const start = s.startHourUtc * 60 + s.startMinUtc;
    let diffMinutes = start - currentUtcMinutes;
    if (diffMinutes <= 0) diffMinutes += 1440; // next day
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const utcTimeStr = `${pad(utcHours)}:${pad(utcMinutes)}:${pad(utcSeconds)} UTC`;
  const localTimeStr = now.toLocaleTimeString();

  return (
    <div className="space-y-8">
      {/* Clock Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-[#0f1015] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5 text-[#3a8bff]" />
              <span>Universal Coordinated Time</span>
            </div>
            <div className="font-mono text-3xl font-bold text-white tabular-nums">
              {utcTimeStr}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#3a8bff]/10 border border-[#3a8bff]/20 text-[#3a8bff] text-[11px] font-mono font-medium">
            UTC Reference
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1015] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-[#22d68f]" />
              <span>Local System Time</span>
            </div>
            <div className="font-mono text-3xl font-bold text-white tabular-nums">
              {localTimeStr}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#22d68f]/10 border border-[#22d68f]/20 text-[#22d68f] text-[11px] font-mono font-medium">
            Local Clock
          </span>
        </div>
      </div>

      {/* 24-Hour Session Timeline */}
      <div className="p-6 rounded-2xl bg-[#0f1015] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[16px] text-white">
            24-Hour Global Auction Cycle
          </h3>
          <span className="text-[12px] font-mono text-[var(--color-ink-3)]">
            Current UTC: {pad(utcHours)}:{pad(utcMinutes)}
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="relative h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden flex">
          {/* Asia block: 00:00 - 09:00 = 9 hrs = 37.5% */}
          <div
            style={{ width: `${(9 / 24) * 100}%` }}
            className="h-full bg-[#3a8bff]/15 border-r border-[#3a8bff]/30 flex items-center justify-center text-[10px] font-mono text-[#3a8bff] font-semibold truncate px-1"
          >
            Asia (00-09)
          </div>

          {/* London block: 07:00 - 15:30 -> overlaps, simplified representation */}
          <div
            style={{ width: `${(4.5 / 24) * 100}%` }}
            className="h-full bg-[#E2B03D]/15 border-r border-[#E2B03D]/30 flex items-center justify-center text-[10px] font-mono text-[#E2B03D] font-semibold truncate px-1"
          >
            London (07-15:30)
          </div>

          {/* NY block: 13:30 - 20:00 = 6.5 hrs = 27% */}
          <div
            style={{ width: `${(6.5 / 24) * 100}%` }}
            className="h-full bg-[#22d68f]/20 border-r border-[#22d68f]/30 flex items-center justify-center text-[10px] font-mono text-[#22d68f] font-semibold truncate px-1"
          >
            New York RTH (13:30-20:00)
          </div>

          {/* Electronic Overnight */}
          <div
            className="flex-1 h-full bg-white/[0.02] flex items-center justify-center text-[10px] font-mono text-[var(--color-ink-4)] truncate px-1"
          >
            Overnight Globex
          </div>

          {/* Current Time Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(255,0,0,0.8)]"
            style={{ left: `${(currentUtcMinutes / 1440) * 100}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 -translate-x-[3px] -translate-y-1" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-4)] mt-2">
          <span>00:00 UTC</span>
          <span>06:00 UTC</span>
          <span>12:00 UTC</span>
          <span>18:00 UTC</span>
          <span>24:00 UTC</span>
        </div>
      </div>

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SESSIONS.map((s) => {
          const active = isSessionActive(s);
          const timeUntil = getTimeUntilSession(s);

          return (
            <div
              key={s.id}
              className={`p-6 rounded-2xl bg-[#0f1015] border transition-all ${
                active
                  ? 'border-[#22d68f]/50 shadow-[0_0_24px_-8px_rgba(34,214,143,0.3)]'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-[#22d68f] animate-pulse' : 'bg-[var(--color-ink-4)]'
                      }`}
                    />
                    <h4 className="font-display font-bold text-[17px] text-white">
                      {s.name}
                    </h4>
                  </div>
                  <p className="text-[12px] font-mono text-[var(--color-ink-3)] mt-0.5">
                    {s.region}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider ${
                    active
                      ? 'bg-[#22d68f]/15 border border-[#22d68f]/40 text-[#22d68f]'
                      : 'bg-white/[0.04] border border-white/[0.06] text-[var(--color-ink-4)]'
                  }`}
                >
                  {active ? 'ACTIVE' : `Opens in ${timeUntil}`}
                </span>
              </div>

              <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mb-4">
                {s.description}
              </p>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] font-mono">
                <div>
                  <span className="text-[var(--color-ink-4)]">Trading Hours: </span>
                  <span className="text-white">
                    {pad(s.startHourUtc)}:{pad(s.startMinUtc)} – {pad(s.endHourUtc)}:{pad(s.endMinUtc)} UTC
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-4)]">Volume: </span>
                  <span
                    className={
                      s.volumeTier === 'Peak'
                        ? 'text-[#22d68f] font-semibold'
                        : s.volumeTier === 'High'
                        ? 'text-[#3a8bff] font-semibold'
                        : 'text-[var(--color-ink-3)]'
                    }
                  >
                    {s.volumeTier}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Execution Transition Windows */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-white mb-3">
          <Zap className="w-4 h-4 text-[#E2B03D]" />
          <span>Key Institutional Orderflow Windows (New York Time)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[12px] font-mono">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[#E2B03D] block font-bold">09:30 - 10:30 EST</span>
            <span className="text-[var(--color-ink-3)]">Initial Balance (IB) range formation</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[#3a8bff] block font-bold">11:30 - 12:00 EST</span>
            <span className="text-[var(--color-ink-3)]">European session close rotation</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[#22d68f] block font-bold">13:30 - 14:30 EST</span>
            <span className="text-[var(--color-ink-3)]">Afternoon institutional continuation</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[#ff7a7a] block font-bold">15:50 - 16:00 EST</span>
            <span className="text-[var(--color-ink-3)]">Market on Close (MOC) imbalance prints</span>
          </div>
        </div>
      </div>
    </div>
  );
};
