import React from 'react';
import {
  BookOpen,
  CheckSquare,
  Calculator,
  Activity,
  ArrowRight,
  Tag,
  BarChart2,
  CheckCircle
} from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { MotionReveal } from './MotionReveal';
import { NavRoute } from '../types';

interface ToolkitSectionProps {
  onNavigate: (route: NavRoute) => void;
  onOpenLogin?: () => void;
}

export const ToolkitSection: React.FC<ToolkitSectionProps> = ({ onNavigate, onOpenLogin }) => {
  const tools = [
    {
      id: 'checklist',
      title: 'Pre-Trade Checklist',
      description: 'Run through your process before every trade.',
      icon: CheckSquare,
      route: 'toolkit/checklist' as NavRoute
    },
    {
      id: 'risk-calculator',
      title: 'Risk Calculator',
      description: 'Define risk, let math handle position sizing.',
      icon: Calculator,
      route: 'toolkit/risk-calculator' as NavRoute
    },
    {
      id: 'monte-carlo',
      title: 'Monte Carlo',
      description: 'Stress-test your edge across thousands of runs.',
      icon: Activity,
      route: 'toolkit/monte-carlo' as NavRoute
    }
  ];

  return (
    <div className="w-full py-28 relative">
      {/* Top Center hairline divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[var(--color-hair-3)] to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header matching original layout wrapped in MotionReveal */}
        <MotionReveal>
          <div className="mb-14">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <Eyebrow variant="blue" className="mb-5">
                  03 · Toolkit
                </Eyebrow>
                <h2 className="font-display text-[2.5rem] md:text-[3.5rem] font-bold text-[var(--color-ink-1)] tracking-[-0.045em] leading-[0.95]">
                  Your <span className="text-[#3a8bff]">toolkit.</span>
                </h2>
              </div>
              <p className="text-[var(--color-ink-3)] text-[14px]">
                Sharpen your process.{' '}
                {onOpenLogin && (
                  <>
                    <button
                      onClick={onOpenLogin}
                      className="text-[var(--color-brand-blue)] hover:text-white transition-colors font-semibold cursor-pointer"
                    >
                      Log in
                    </button>{' '}
                    to access.
                  </>
                )}
              </p>
            </div>
          </div>
        </MotionReveal>

        {/* Hero Card: Trade Journal wrapped in MotionReveal */}
        <MotionReveal delay={0} className="mb-5">
          <div
            onClick={() => onNavigate('toolkit/journal')}
            className="rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[var(--color-hair-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] cursor-pointer group/card transition-all duration-500 hover:border-[var(--color-hair-3)] hover:-translate-y-[2px] overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="flex-1 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-blue-tint)] border border-[var(--color-brand-blue)]/25 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--color-brand-blue)]" />
                  </div>
                  <Eyebrow variant="blue">Core Tool</Eyebrow>
                </div>
                <h3 className="font-display text-2xl md:text-[2rem] font-bold text-[var(--color-ink-1)] tracking-[-0.03em] mb-4">
                  Trade Journal
                </h3>
                <p className="text-[var(--color-ink-3)] text-[14.5px] leading-relaxed max-w-md mb-7">
                  Log every trade, tag your setups, track your process. The journal is where patterns
                  in your execution become visible over time.
                </p>
                <span className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] text-[13px] font-semibold group-hover/card:gap-3 transition-all">
                  Open Journal <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div className="hidden md:block w-px bg-[var(--color-hair-1)]" />

              <div className="hidden md:flex flex-col justify-center gap-4 p-8 w-72 shrink-0 bg-white/[0.015]">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[var(--color-ink-4)] shrink-0" />
                  <span className="text-[12.5px] text-[var(--color-ink-2)] tracking-[-0.005em]">
                    Setup tagging
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-4 h-4 text-[var(--color-ink-4)] shrink-0" />
                  <span className="text-[12.5px] text-[var(--color-ink-2)] tracking-[-0.005em]">
                    Performance stats
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[var(--color-ink-4)] shrink-0" />
                  <span className="text-[12.5px] text-[var(--color-ink-2)] tracking-[-0.005em]">
                    Process review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* 3 Secondary Tools Grid with MotionReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <MotionReveal key={tool.id} delay={(index + 1) * 0.08} className="h-full">
                <div
                  onClick={() => onNavigate(tool.route)}
                  className="h-full rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 transition-all duration-500 ease-out cursor-pointer group/card hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] hover:-translate-y-[2px] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-5 group-hover/card:border-white/[0.12] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--color-ink-2)] group-hover/card:text-white transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-ink-1)] tracking-[-0.02em] mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-[var(--color-ink-3)] text-[13.5px] leading-relaxed mb-6">
                      {tool.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hair-1)]">
                    <span className="text-[13px] font-semibold text-[var(--color-ink-2)] group-hover/card:text-[var(--color-brand-blue)] flex items-center gap-1.5 transition-colors">
                      Open tool
                      <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};
