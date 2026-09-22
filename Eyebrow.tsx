import React from 'react';

export type EyebrowVariant = 'neutral' | 'blue' | 'red' | 'success' | 'warning' | 'discord';
export type EyebrowSize = 'xs' | 'sm' | 'md';

interface EyebrowProps {
  variant?: EyebrowVariant;
  size?: EyebrowSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<EyebrowVariant, string> = {
  neutral: 'text-[var(--color-ink-2)] bg-white/[0.04] border border-[var(--color-hair-2)]',
  blue: 'text-[#7ab3ff] bg-[rgba(58,139,255,0.12)] border border-[#3a8bff]/25',
  red: 'text-[#ff7a7a] bg-[rgba(255,74,74,0.12)] border border-[#ff4a4a]/25',
  success: 'text-[#7cf1c0] bg-[rgba(34,214,143,0.10)] border border-[rgba(34,214,143,0.25)]',
  warning: 'text-[#ffcf7a] bg-[rgba(255,179,65,0.10)] border border-[rgba(255,179,65,0.25)]',
  discord: 'text-[#8b92ff] bg-[rgba(88,101,242,0.10)] border border-[rgba(88,101,242,0.25)]'
};

const sizeStyles: Record<EyebrowSize, string> = {
  xs: 'h-5 px-2 text-[10px] rounded-[6px] tracking-[0.14em]',
  sm: 'h-6 px-2.5 text-[10.5px] rounded-[8px] tracking-[0.12em]',
  md: 'h-7 px-3 text-[11px] rounded-[10px] tracking-[0.10em]'
};

export const Eyebrow: React.FC<EyebrowProps> = ({
  variant = 'neutral',
  size = 'sm',
  icon,
  children,
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase font-semibold font-mono tabular-nums ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};
