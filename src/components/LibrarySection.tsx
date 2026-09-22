import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';

export const LibrarySection: React.FC = () => {
  const videos = [
    {
      id: 'ZFNQfzhaKcE',
      title: 'Education #1: Context Building',
      author: '@Hedge'
    },
    {
      id: 'u0UiVL7YUUM',
      title: 'Education #2: TPO Analogy',
      author: '@3rik'
    },
    {
      id: 'J8cxMfat6H0',
      title: 'Weekly Class #3: TPO & VWAP',
      author: '@3rik'
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
        {/* Section Header with Split Alignment wrapped in MotionReveal */}
        <MotionReveal>
          <SectionHeader
            eyebrow="05 · Library"
            title="Watch &"
            accent="learn."
            accentColor="blue"
            description="Live classes, breakdowns, deep dives into orderflow."
            align="split"
            className="mb-14"
          />
        </MotionReveal>

        {/* 3 Video Cards Grid wrapped in MotionReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {videos.map((vid, index) => (
            <MotionReveal key={vid.id} delay={index * 0.08} className="h-full">
              <a
                href={`https://www.youtube.com/watch?v=${vid.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-3)] hover:-translate-y-[2px] overflow-hidden transition-all duration-500 ease-silk shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-[var(--color-surface-2)] overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${vid.id}/maxresdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-silk"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* YouTube Play Button Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-10 rounded-xl bg-[#FF0000]/95 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_24px_rgba(255,0,0,0.4)] group-hover:scale-110 transition-all duration-300 ease-silk">
                      <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>

                {/* Title and Author row */}
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <h3 className="text-[13.5px] font-semibold text-[var(--color-ink-1)] group-hover:text-[var(--color-brand-blue)] transition-colors truncate tracking-[-0.005em]">
                    {vid.title}
                  </h3>
                  <span className="text-[11.5px] text-[var(--color-ink-3)] shrink-0 font-mono">
                    {vid.author}
                  </span>
                </div>
              </a>
            </MotionReveal>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <MotionReveal delay={videos.length * 0.08} className="text-center">
          <a
            href="https://www.youtube.com/@orderflw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-[var(--color-hair-2)] hover:border-white/20 hover:bg-white/[0.06] text-[13px] font-medium text-[var(--color-ink-2)] hover:text-white transition-all shadow-[0_2px_12px_rgba(0,0,0,0.4)] cursor-pointer group"
          >
            <svg className="w-4 h-4 text-[#ff0000] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>Watch more on YouTube</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-ink-3)] group-hover:text-white transition-colors" />
          </a>
        </MotionReveal>
      </div>
    </div>
  );
};
