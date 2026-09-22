import React from 'react';
import { Sparkles, Flame, ArrowRight, GraduationCap } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';
import { NavRoute } from '../types';

interface PsychologySectionProps {
  onNavigate: (route: NavRoute) => void;
}

export const PsychologySection: React.FC<PsychologySectionProps> = ({ onNavigate }) => {
  return (
    <div className="w-full py-28 relative">
      {/* Top Center hairline divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[var(--color-hair-3)] to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header Centered wrapped in MotionReveal */}
        <MotionReveal>
          <SectionHeader
            eyebrow="02 · Psychology"
            title="The"
            accent="inner game."
            accentColor="red"
            align="centered"
            description="Strategy is only 20%. The rest is you. Master both sides of your mind."
            className="mb-14"
          />
        </MotionReveal>

        {/* Two Minds Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Conscious Mind */}
          <MotionReveal delay={0} className="h-full">
            <div className="h-full rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:border-[var(--color-hair-3)]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-blue-tint)] border border-[var(--color-brand-blue)]/25 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[var(--color-brand-blue)]" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-ink-1)] tracking-[-0.02em]">
                    The Conscious Mind
                  </h3>
                </div>

                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-6">
                  The Planner. Slow, logical, rigorous. It builds the plan when the market is closed.
                  It writes the rules, defines the edge, sets the boundaries.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Planning', 'Analysis', 'Rules', 'Journaling'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-semibold tracking-[0.08em] text-[var(--color-brand-blue-soft)] bg-[var(--color-brand-blue-tint)] border border-[var(--color-brand-blue)]/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </MotionReveal>

          {/* Subconscious Mind */}
          <MotionReveal delay={0.08} className="h-full">
            <div className="h-full rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:border-[var(--color-hair-3)]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-red-tint)] border border-[var(--color-brand-red)]/25 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[var(--color-brand-red)]" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-ink-1)] tracking-[-0.02em]">
                    The Subconscious Mind
                  </h3>
                </div>

                <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed mb-6">
                  The Executor. Fast, emotional, reactive. It pulls the trigger in the heat of battle.
                  It doesn't think. It reacts.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Fear', 'Greed', 'Revenge', 'FOMO'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-semibold tracking-[0.08em] text-[var(--color-brand-red-soft)] bg-[var(--color-brand-red-tint)] border border-[var(--color-brand-red)]/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Bottom Callout Banner: Master your mind */}
        <MotionReveal delay={0.16}>
          <div
            onClick={() => onNavigate('education/psychology')}
            className="rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[var(--color-hair-2)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group hover:border-[var(--color-hair-3)] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-red-tint)] border border-[var(--color-brand-red)]/25 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-[#ff7a7a]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[17px] text-[var(--color-ink-1)] tracking-tight">
                  Master your mind
                </h4>
                <p className="text-[13.5px] text-[var(--color-ink-3)] mt-0.5">
                  Your edge lives between discipline, routine, and repetition.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center text-[#ff7a7a] group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
};
