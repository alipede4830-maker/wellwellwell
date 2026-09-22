import React from 'react';
import { Eyebrow, EyebrowVariant } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  accent?: string;
  accentColor?: 'blue' | 'red' | 'mixed';
  description?: string;
  align?: 'split' | 'centered' | 'stack';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  accent,
  accentColor = 'blue',
  description,
  align = 'split',
  className = ''
}) => {
  const eyebrowVariant: EyebrowVariant = accentColor === 'red' ? 'red' : 'blue';

  const accentColorClass =
    accentColor === 'blue'
      ? 'text-[#3a8bff]'
      : accentColor === 'red'
      ? 'text-[#ff4a4a]'
      : 'text-white';

  const heading = (
    <h2 className="font-display text-[2.5rem] md:text-[3.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-[var(--color-ink-1)] pb-1">
      {title}
      {accent && (
        <>
          {' '}
          <span className={accentColorClass}>{accent}</span>
        </>
      )}
    </h2>
  );

  if (align === 'centered') {
    return (
      <div className={`text-center ${className}`}>
        {eyebrow && (
          <div className="flex justify-center mb-5">
            <Eyebrow variant={eyebrowVariant}>{eyebrow}</Eyebrow>
          </div>
        )}
        {heading}
        {description && (
          <p className="mt-5 max-w-xl mx-auto text-[var(--color-ink-3)] text-[15px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  if (align === 'stack') {
    return (
      <div className={`max-w-3xl ${className}`}>
        {eyebrow && (
          <Eyebrow variant={eyebrowVariant} className="mb-5">
            {eyebrow}
          </Eyebrow>
        )}
        {heading}
        {description && (
          <p className="mt-5 max-w-xl text-[var(--color-ink-3)] text-[15px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  // default: split
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-end ${className}`}>
      <div className="md:col-span-8">
        {eyebrow && (
          <Eyebrow variant={eyebrowVariant} className="mb-5">
            {eyebrow}
          </Eyebrow>
        )}
        {heading}
      </div>
      {description && (
        <div className="md:col-span-4">
          <p className="text-[var(--color-ink-3)] text-[14px] leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
