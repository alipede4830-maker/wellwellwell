import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';
import { NavRoute } from '../types';

interface CurriculumSectionProps {
  onNavigate: (route: NavRoute) => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onNavigate }) => {
  const steps: {
    step: string;
    badge: string;
    title: string;
    description: string;
    action: string;
    route: NavRoute;
    isRaised: boolean;
  }[] = [
    {
      step: '01',
      badge: 'Foundation',
      title: 'Auction Market Theory',
      description:
        'The market is an auction. Price moves to find where buyers and sellers agree on value.',
      action: 'Start here',
      route: 'education/amt',
      isRaised: true
    },
    {
      step: '02',
      badge: 'Structure',
      title: 'Market Profiles',
      description: 'Where value is built. Organize auction data into opportunity.',
      action: 'Explore',
      route: 'education/volume-profile',
      isRaised: false
    },
    {
      step: '03',
      badge: 'The Data',
      title: 'Orderflow',
      description: 'See what happens inside every candle. The raw data behind price.',
      action: 'Explore',
      route: 'education/dom',
      isRaised: false
    }
  ];

  return (
    <div className="w-full pt-24 pb-32 relative">
      {/* Top Center hairline divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[var(--color-hair-3)] to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header with Split Alignment wrapped in MotionReveal */}
        <MotionReveal>
          <SectionHeader
            eyebrow="01 · Curriculum"
            title="The"
            accent="roadmap."
            accentColor="blue"
            description="Three layers of understanding. Don't skip steps."
            align="split"
            className="mb-16"
          />
        </MotionReveal>

        {/* Roadmap Steps */}
        <div className="relative">
          {/* Horizontal connecting line across cards on desktop */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[34px] left-[8%] right-[8%] h-px bg-[linear-gradient(90deg,transparent,var(--color-hair-3)_15%,var(--color-hair-3)_85%,transparent)] pointer-events-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {steps.map((item, index) => (
              <MotionReveal key={item.step} delay={index * 0.08} className="h-full">
                <div className="relative h-full flex flex-col items-stretch group">
                  {/* Number Circle Badge */}
                  <div className="relative z-10 mb-6 w-[68px] h-[68px] mx-auto rounded-full flex items-center justify-center bg-[var(--color-surface-1)] border border-[var(--color-hair-2)] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <div
                      aria-hidden="true"
                      className="absolute inset-[3px] rounded-full opacity-10 blur-sm bg-[var(--color-brand-blue)]"
                    />
                    <span className="relative font-display font-bold text-[20px] tabular-nums tracking-[-0.02em] text-[var(--color-brand-blue)]">
                      {item.step}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 flex">
                    <div
                      onClick={() => onNavigate(item.route)}
                      className={`h-full w-full rounded-[var(--radius-lg)] p-8 md:p-10 transition-all duration-500 ease-out cursor-pointer group/card flex flex-col justify-between ${
                        item.isRaised
                          ? 'bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[var(--color-hair-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] hover:border-[var(--color-hair-3)] hover:-translate-y-[2px]'
                          : 'bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-3)] hover:bg-[var(--color-surface-2)] hover:-translate-y-[2px]'
                      }`}
                    >
                      <div>
                        <span className="block text-[10px] font-mono font-semibold uppercase tracking-[0.22em] mb-3 text-[var(--color-brand-blue)]/85">
                          {item.badge}
                        </span>
                        <h3 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold text-[var(--color-ink-1)] tracking-[-0.03em] leading-[1.05] mb-3">
                          {item.title}
                        </h3>
                        <p className="text-[var(--color-ink-3)] text-[13.5px] leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[var(--color-hair-1)] flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[var(--color-ink-2)] group-hover/card:text-[var(--color-brand-blue)] flex items-center gap-1.5 transition-colors">
                          {item.action}
                          <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
