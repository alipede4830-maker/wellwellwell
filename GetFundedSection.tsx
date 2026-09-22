import React, { useState } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';
import { NavRoute } from '../types';

interface GetFundedSectionProps {
  onNavigate: (route: NavRoute) => void;
}

export const GetFundedSection: React.FC<GetFundedSectionProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('CLAUDIO');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full py-28 relative">
      {/* Top Center hairline divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[var(--color-hair-3)] to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header with Split Alignment wrapped in MotionReveal */}
        <MotionReveal>
          <SectionHeader
            eyebrow="06 · Get Funded"
            title="Trade real"
            accent="capital."
            accentColor="blue"
            description="Build the edge here, then trade it with a prop firm's money. Start with our partner, Onyx Futures."
            align="split"
            className="mb-14"
          />
        </MotionReveal>

        {/* Onyx Futures Raised Partner Card wrapped in MotionReveal */}
        <MotionReveal delay={0.08}>
          <div
            onClick={() => onNavigate('propfirm')}
            className="relative rounded-[var(--radius-lg)] p-8 md:p-12 overflow-hidden cursor-pointer group/card transition-all duration-500 hover:-translate-y-[2px] bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[rgba(226,176,61,0.28)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)]"
          >
            {/* Gold Ambient Blur Orb */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 -right-20 w-[380px] h-[380px] rounded-full blur-[120px] opacity-[0.18]"
              style={{ background: '#E2B03D' }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left Info Column */}
              <div className="min-w-0">
                {/* Partner Eyebrow Pill */}
                <span
                  className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-[8px] text-[10.5px] uppercase font-semibold font-mono tracking-[0.12em] mb-4"
                  style={{
                    color: '#F4CC68',
                    background: 'rgba(226,176,61,0.10)',
                    border: '1px solid rgba(226,176,61,0.30)'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E2B03D' }} />
                  Affiliated Partner
                </span>

                {/* Title & Onyx Logo */}
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src="/assets/propfirms/onyx.svg"
                    alt="Onyx Futures"
                    className="w-10 h-10 shrink-0"
                  />
                  <h3 className="font-display text-[1.75rem] md:text-[2.25rem] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--color-ink-0)]">
                    Onyx Futures
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-2)] max-w-xl">
                  Our partner prop firm for futures traders. A forgiving end-of-day drawdown model, no
                  daily loss limit, and fast payouts. Run an evaluation, get funded, and trade with code{' '}
                  <strong className="text-white font-mono">CLAUDIO</strong>.
                </p>
              </div>

              {/* Right Action Column */}
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                {/* Promo Code Box with Copy */}
                <div className="inline-flex items-center gap-2.5">
                  <span className="text-[12px] text-[var(--color-ink-3)]">Code</span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-[12px] font-mono font-semibold text-[14px] tracking-[0.14em] transition-all hover:scale-105 cursor-pointer"
                    style={{
                      color: '#F4CC68',
                      background: 'rgba(226,176,61,0.10)',
                      border: '1px dashed rgba(226,176,61,0.45)'
                    }}
                    title="Click to copy code"
                  >
                    <span>CLAUDIO</span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#22d68f]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                    )}
                  </button>
                </div>

                {/* Link */}
                <span
                  className="inline-flex items-center gap-2 text-[13.5px] font-semibold group-hover/card:gap-3 transition-all"
                  style={{ color: '#F4CC68' }}
                >
                  <span>View all prop firms</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
};
