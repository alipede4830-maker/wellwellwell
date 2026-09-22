import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useTransform, animate } from 'motion/react';

function Counter({
  value,
  suffix = '',
  className = ''
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1]
      });
      return () => controls.stop();
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
  }, [rounded, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

export function Stat({
  value,
  suffix = '',
  label,
  accent = 'blue',
  size = 'md',
  animated = true,
  className = ''
}: {
  value: number;
  suffix?: string;
  label?: string;
  accent?: 'blue' | 'red' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}) {
  const sizeClass = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl'
  }[size];

  const accentClass = {
    blue: 'text-[var(--color-brand-blue)]',
    red: 'text-[var(--color-brand-red)]',
    success: 'text-[var(--color-success)]',
    neutral: 'text-[var(--color-ink-1)]'
  }[accent];

  return (
    <div className={className}>
      <div
        className={`font-display font-bold tracking-[-0.04em] tabular-nums ${sizeClass} ${accentClass}`}
      >
        {animated && typeof value === 'number' ? (
          <Counter value={value} suffix={suffix} />
        ) : (
          <>
            {value.toLocaleString()}
            {suffix}
          </>
        )}
      </div>
      {label && (
        <div className="mt-1.5 text-[10.5px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
          {label}
        </div>
      )}
    </div>
  );
}
