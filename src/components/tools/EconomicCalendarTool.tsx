import React, { useState } from 'react';
import { Calendar, AlertTriangle, Filter, Clock, ShieldAlert } from 'lucide-react';

interface CalendarEvent {
  id: string;
  timeEst: string;
  timeUtc: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast: string;
  previous: string;
  actual?: string;
  description: string;
}

const EVENTS: CalendarEvent[] = [
  {
    id: 'cpi',
    timeEst: '08:30 EST',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    event: 'Consumer Price Index (CPI) MoM / YoY',
    impact: 'High',
    forecast: '0.2% / 2.9%',
    previous: '0.2% / 3.0%',
    description: 'Primary inflation indicator monitored by the Federal Reserve. Causes massive instant orderbook liquidity pulls.'
  },
  {
    id: 'fomc',
    timeEst: '14:00 EST',
    timeUtc: '19:00 UTC',
    currency: 'USD',
    event: 'FOMC Interest Rate Decision & Statement',
    impact: 'High',
    forecast: '5.25%',
    previous: '5.25%',
    description: 'Benchmark interest rate decision. Violent swings across Treasury yields and index futures.'
  },
  {
    id: 'powell',
    timeEst: '14:30 EST',
    timeUtc: '19:30 UTC',
    currency: 'USD',
    event: 'FOMC Press Conference (Fed Chair Powell)',
    impact: 'High',
    forecast: '-',
    previous: '-',
    description: 'Q&A session. Algorithmic news headline parsing triggers high-frequency rotations.'
  },
  {
    id: 'nfp',
    timeEst: '08:30 EST',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    event: 'Non-Farm Employment Change & Unemployment Rate',
    impact: 'High',
    forecast: '165K / 4.2%',
    previous: '142K / 4.3%',
    description: 'Employment benchmark published first Friday of each month. Severe slippage window.'
  },
  {
    id: 'pce',
    timeEst: '08:30 EST',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    event: 'Core PCE Price Index MoM / YoY',
    impact: 'High',
    forecast: '0.2% / 2.7%',
    previous: '0.2% / 2.6%',
    description: 'The Fed’s officially preferred inflation gauge.'
  },
  {
    id: 'jobless',
    timeEst: '08:30 EST',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    event: 'Initial Jobless Claims',
    impact: 'Medium',
    forecast: '221K',
    previous: '219K',
    description: 'Weekly initial unemployment claims measuring labor market velocity.'
  },
  {
    id: 'pmi',
    timeEst: '10:00 EST',
    timeUtc: '15:00 UTC',
    currency: 'USD',
    event: 'ISM Manufacturing PMI',
    impact: 'High',
    forecast: '47.5',
    previous: '47.2',
    description: 'Purchasing managers index indicating industrial sector expansion or contraction.'
  },
  {
    id: 'crude-inv',
    timeEst: '10:30 EST',
    timeUtc: '15:30 UTC',
    currency: 'USD',
    event: 'EIA Crude Oil Inventories',
    impact: 'Medium',
    forecast: '-0.8M',
    previous: '+1.6M',
    description: 'High volatility release for Crude Oil (CL) futures contracts.'
  }
];

// TODO: connect to a real economic calendar API via backend proxy (client-side call is blocked by CORS/API key security for most providers)

export const EconomicCalendarTool: React.FC = () => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');

  const filtered = EVENTS.filter((e) => {
    if (impactFilter === 'All') return true;
    return e.impact === impactFilter;
  });

  return (
    <div className="space-y-8">
      {/* Sample Data Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-[#E2B03D]/10 border border-[#E2B03D]/30 flex items-center gap-3 text-[13px] text-[#F4CC68]">
        <AlertTriangle className="w-5 h-5 text-[#E2B03D] shrink-0" />
        <span className="leading-relaxed">
          ⚠️ Sample data for demonstration purposes. Check an official source (e.g. ForexFactory, Investing.com) for real-time event times and figures.
        </span>
      </div>

      {/* Risk Banner: Execution Rule */}
      <div className="p-6 rounded-2xl bg-[#ff4a4a]/10 border border-[#ff4a4a]/30 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-[#ff4a4a] shrink-0 mt-0.5" />
        <div className="text-[13.5px] leading-relaxed">
          <strong className="text-white block font-semibold mb-1">
            Orderflow Execution Protocol: High-Impact Macro Events
          </strong>
          <p className="text-[var(--color-ink-2)]">
            Institutional market makers cancel resting limit bids and asks 30–60 seconds prior to red-folder announcements (CPI, FOMC, NFP). The depth-of-market thins by 80%+, resulting in massive slippage on market orders. <span className="text-white font-medium">Rule: Never hold open scalp positions or resting orders through high-impact releases. Wait for initial balance stabilization 3–5 minutes post-release.</span>
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0f1015] border border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-ink-3)]" />
          <span className="text-[12px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider">
            Filter Impact:
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'High', 'Medium'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setImpactFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-medium transition-all cursor-pointer ${
                impactFilter === filter
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.04] text-[var(--color-ink-3)] hover:text-white'
              }`}
            >
              {filter} Impact
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Card List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isHigh = item.impact === 'High';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-[#0f1015] border transition-all ${
                isHigh ? 'border-white/[0.08] hover:border-[#ff4a4a]/40' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider ${
                        isHigh
                          ? 'bg-[#ff4a4a]/15 text-[#ff7a7a] border border-[#ff4a4a]/30'
                          : 'bg-[#E2B03D]/15 text-[#F4CC68] border border-[#E2B03D]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isHigh ? 'bg-[#ff4a4a]' : 'bg-[#E2B03D]'
                        }`}
                      />
                      {item.impact} Volatility
                    </span>

                    <span className="text-[12px] font-mono text-[var(--color-ink-4)]">
                      {item.currency}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-[18px] text-white tracking-tight mb-1">
                    {item.event}
                  </h4>

                  <p className="text-[13px] text-[var(--color-ink-3)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap md:flex-col items-start md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                  <div className="flex items-center gap-2 text-[13px] font-mono font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-[#3a8bff]" />
                    <span>{item.timeEst}</span>
                    <span className="text-[var(--color-ink-4)] font-normal text-[11px]">
                      ({item.timeUtc})
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] font-mono">
                    <div>
                      <span className="text-[var(--color-ink-4)]">Forecast: </span>
                      <span className="text-white">{item.forecast}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-ink-4)]">Prev: </span>
                      <span className="text-[var(--color-ink-3)]">{item.previous}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
