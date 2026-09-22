import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { OrderflowLadder } from './OrderflowLadder';
import { Stat } from './Stat';
import { NavRoute } from '../types';

interface HeroProps {
  onNavigate: (route: NavRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center pt-24 pb-16 xl:pt-0 xl:pb-0 overflow-hidden">
      {/* Interactive Ambient Background */}
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        {/* Dual ambient glow orbs matching original site */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(900px 600px at 20% 10%, rgba(58,139,255,0.15), transparent 60%),
              radial-gradient(900px 600px at 80% 20%, rgba(255,74,74,0.09), transparent 60%),
              radial-gradient(700px 600px at 50% 90%, rgba(58,139,255,0.08), transparent 70%)
            `
          }}
        />

        {/* Ambient Blur Spheres */}
        <div className="absolute top-[20%] left-[8%] w-[320px] h-[320px] rounded-full blur-[110px] bg-[#3a8bff] opacity-[0.10]" />
        <div className="absolute top-[50%] right-[8%] w-[340px] h-[340px] rounded-full blur-[120px] bg-[#ff4a4a] opacity-[0.06]" />

        {/* Bottom soft gradient fade */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent, var(--color-surface-0))'
          }}
        />
      </div>

      <div className="w-full max-w-[1500px] mx-auto px-6 md:px-10 z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-10 items-center">
          {/* Left Column: Headlines & Call to Action */}
          <div className="xl:col-span-7 flex flex-col items-center xl:items-start text-center xl:text-left">
            {/* Top Eyebrow Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto inline-flex items-center gap-3"
            >
              <span className="block w-6 h-px bg-[linear-gradient(90deg,transparent,var(--color-brand-blue))]" />
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.24em] text-[var(--color-ink-3)]">
                Free Orderflow Education
              </span>
            </motion.div>

            {/* Giant Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-medium tracking-[-0.04em] leading-[0.95] mt-16 sm:mt-20 xl:mt-10 pointer-events-auto"
            >
              <span
                className="block text-[1.35rem] sm:text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.85rem] text-[var(--color-ink-3)] font-normal tracking-[-0.015em]"
                style={{ fontVariationSettings: '"wght" 400' }}
              >
                Read the
              </span>
              <span className="relative block -mt-1 md:-mt-2 font-bold tracking-[-0.09em] text-[var(--color-ink-1)]">
                <span className="inline-block text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] leading-[0.9]">
                  auction<span className="text-[var(--color-brand-blue)]">.</span>
                </span>
              </span>
            </motion.h1>

            {/* Glowing animated tape slide bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 sm:mt-6 pointer-events-none origin-left"
              aria-hidden="true"
            >
              <div
                className="relative h-[2px] w-[160px] sm:w-[200px] overflow-hidden"
                style={{
                  maskImage:
                    'linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)'
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-[55%] animate-tape-slide"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(58,139,255,0.85) 50%, transparent 100%)',
                    filter: 'blur(0.5px)'
                  }}
                />
              </div>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-[15px] md:text-[17px] text-[var(--color-ink-3)] font-normal mt-7 sm:mt-9 xl:mt-7 pointer-events-auto tracking-[-0.01em] leading-[1.55]"
            >
              Learn to read what most traders never see.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-3 mt-12 sm:mt-14 xl:mt-8 pointer-events-auto"
            >
              <button
                onClick={() => onNavigate('education/amt')}
                className="h-11 px-6 rounded-lg bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_4px_24px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                Start learning
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-[14px] font-semibold text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)] transition-colors px-4 py-2.5 cursor-pointer"
              >
                Dashboard
              </button>
            </motion.div>

            {/* Meta Statistics Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-14 sm:mt-16 xl:mt-12 w-full max-w-3xl"
            >
              <div className="flex items-center justify-center xl:justify-start gap-x-8 gap-y-2 flex-wrap text-[12px] tracking-[-0.005em] text-[var(--color-ink-3)]">
                <a
                  href="https://discord.gg/bsuM3urQCX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-[var(--color-ink-1)] transition-colors"
                >
                  <span className="relative flex w-1.5 h-1.5 shrink-0">
                    <span
                      className="absolute inset-0 rounded-full bg-[var(--color-success)] opacity-55 animate-ping"
                      style={{ animationDuration: '2.5s' }}
                    />
                    <span className="relative rounded-full w-1.5 h-1.5 bg-[var(--color-success)]" />
                  </span>
                  <span className="tabular-nums text-[var(--color-ink-2)]">2,512</span>
                  <span>traders</span>
                </a>
                <button
                  onClick={() => onNavigate('brain')}
                  className="inline-flex items-center gap-2 hover:text-[var(--color-ink-1)] transition-colors cursor-pointer"
                >
                  <span className="tabular-nums text-[var(--color-ink-2)]">140+</span>
                  <span>concepts</span>
                </button>
                <span className="inline-flex items-center gap-2">
                  <span className="text-[var(--color-brand-blue)]">100%</span>
                  <span>free</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Orderflow Depth of Market Simulator */}
          <div className="hidden xl:block xl:col-span-5 pointer-events-auto">
            <div className="relative w-full max-w-[620px] mx-auto select-none">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 blur-3xl opacity-50"
                style={{
                  background:
                    'radial-gradient(45% 50% at 50% 35%, rgba(58,139,255,0.12), transparent 70%), radial-gradient(40% 50% at 50% 75%, rgba(255,74,74,0.08), transparent 70%)'
                }}
              />
              <OrderflowLadder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
