import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MotionReveal } from './MotionReveal';

interface PropFirmsViewProps {
  onBack: () => void;
}

interface OtherFirm {
  name: string;
  badge: string;
  logo: string;
  isLogoOnly?: boolean;
  accentColor: string;
  description: string;
  tags: string[];
  url: string;
}

export const PropFirmsView: React.FC<PropFirmsViewProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('CLAUDIO');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const otherFirms: OtherFirm[] = [
    {
      name: 'Topstep',
      badge: 'Not affiliated',
      logo: '/assets/propfirms/topstep.png',
      accentColor: '#FFFFFF',
      description:
        "One of the original funded-trading firms (since 2012). Its Trading Combine evaluation and long payout track record make it the genre's most recognized name.",
      tags: ['The Trading Combine', 'Since 2012', 'TopstepX platform', 'Coaching & community'],
      url: 'https://www.topstep.com'
    },
    {
      name: 'MyFundedFutures',
      badge: 'Not affiliated',
      logo: '/assets/propfirms/mffu.svg',
      isLogoOnly: true,
      accentColor: '#3A82F7',
      description:
        'Texas-based futures firm known for funded plans with no daily loss limit and some of the fastest, most frequent payouts in the space.',
      tags: ['No daily loss limit', 'Fast, frequent payouts', 'One-day eval option', 'Multi-platform'],
      url: 'https://myfundedfutures.com'
    },
    {
      name: 'Lucid Trading',
      badge: 'Not affiliated',
      logo: '/assets/propfirms/lucid.png',
      accentColor: '#FFFFFF',
      description:
        'A newer futures firm built around same-day payouts and no recurring fees, with both evaluation and instant-funding paths and few strategy restrictions.',
      tags: ['Same-day payouts', 'No recurring fees', 'Instant funding option', 'Strategy-friendly'],
      url: 'https://lucidtrading.com'
    },
    {
      name: 'Alpha Futures',
      badge: 'Not affiliated',
      logo: '/assets/propfirms/alpha.svg',
      isLogoOnly: true,
      accentColor: '#00E096',
      description:
        'UK-based firm (part of Alpha Group) with a low-friction one-step evaluation, a 90% performance split, and same-day payout processing.',
      tags: ['One-step evaluation', '90% profit split', 'Same-day payouts', 'Alpha Group backed'],
      url: 'https://alpha-futures.com'
    }
  ];

  return (
    <div className="w-full min-h-screen pt-28 md:pt-32 pb-0 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.08] bg-[var(--color-brand-blue)]" />
        <div className="absolute top-[40%] right-[-12%] w-[560px] h-[560px] rounded-full blur-[180px] opacity-[0.07] bg-[var(--color-brand-red)]" />
      </div>

      <div className="container mx-auto max-w-5xl px-6 pb-24">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 text-[13px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home</span>
        </button>

        {/* Hero Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] mb-5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-brand-blue)]" />
            Partners · Funding
          </div>
          <h1 className="font-display text-[2.5rem] md:text-[4.5rem] font-bold text-[var(--color-ink-1)] tracking-[-0.05em] leading-[0.92]">
            Get <span className="text-accent-blue">funded.</span>
          </h1>
          <p className="mt-6 text-[15px] md:text-[17px] text-[var(--color-ink-3)] max-w-xl leading-relaxed">
            You build the edge here. A prop firm gives you the capital to trade it. Below is the one firm we partner with, plus other reputable futures firms worth knowing.
          </p>
        </div>

        {/* Partner Card: Onyx Futures */}
        <div className="mb-16">
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-8 md:p-10"
            style={{
              border: '1px solid rgba(226,176,61,0.28)',
              background: 'linear-gradient(180deg, rgba(226,176,61,0.07), var(--color-surface-1) 60%)'
            }}
          >
            {/* Ambient Gold Glow */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 -right-20 w-[380px] h-[380px] rounded-full blur-[120px] opacity-[0.20]"
              style={{ background: '#E2B03D' }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(244,204,104,0.65), transparent)'
              }}
            />

            <div className="relative z-[1]">
              <span
                className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-[8px] text-[10.5px] uppercase font-semibold font-mono tracking-[0.12em] mb-6"
                style={{
                  color: '#F4CC68',
                  background: 'rgba(226,176,61,0.10)',
                  border: '1px solid rgba(226,176,61,0.30)'
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: '#E2B03D' }} />
                Affiliated Partner
              </span>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/assets/propfirms/onyx.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-11 h-11 shrink-0"
                />
                <h3 className="font-display text-[2rem] md:text-[2.5rem] font-bold leading-[1.02] tracking-[-0.04em] text-[var(--color-ink-0)]">
                  Onyx Futures
                </h3>
              </div>

              <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)] max-w-2xl mb-6">
                Our partner prop firm for futures traders. A forgiving end-of-day drawdown model, no daily loss limit, and fast payouts. Run an evaluation, get funded, and trade with code CLAUDIO.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  'End-of-day drawdown',
                  'No daily loss limit',
                  'Payouts under 24h',
                  'Up to 100% split',
                  'Up to 10 accounts'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center h-7 px-3 rounded-full text-[12px] tracking-[-0.005em]"
                    style={{
                      color: '#F4CC68',
                      background: 'rgba(226,176,61,0.08)',
                      border: '1px solid rgba(226,176,61,0.25)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA and Code Area */}
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="https://onyx-futures.com/?ref=CLAUDIO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[14px] text-[14.5px] font-semibold tracking-[-0.005em] overflow-hidden transition-all duration-300 ease-silk hover:-translate-y-[1px] active:translate-y-0"
                  style={{
                    color: '#1a1305',
                    background: 'linear-gradient(180deg, #F4CC68, #E2B03D)',
                    boxShadow:
                      '0 1px 0 0 rgba(255,255,255,0.35) inset, 0 12px 32px -10px rgba(226,176,61,0.6), 0 0 0 1px rgba(226,176,61,0.4)'
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)'
                    }}
                  />
                  <span className="relative z-[1]">Get funded with Onyx</span>
                  <svg
                    className="relative z-[1] w-[1.1em] h-[1.1em]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>

                <a
                  href="https://discord.gg/Sm68QAZHjQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[14px] text-[14px] font-semibold text-[var(--color-ink-1)] bg-white/[0.03] border border-[var(--color-hair-2)] transition-all duration-300 ease-silk hover:-translate-y-[1px] hover:border-[#5865F2]/45 hover:bg-[#5865F2]/12 hover:text-[#b0b5ff]"
                >
                  <svg
                    className="w-[1.15em] h-[1.15em]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.0913a18.68 18.68 0 00-5.4868 0c-.1636-.3193-.4034-.716-.6196-1.0913a.074.074 0 00-.0781-.0376 19.6366 19.6366 0 00-4.8855 1.5151.0741.0741 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                  </svg>
                  Join their Discord
                </a>

                <div className="inline-flex items-center gap-2.5">
                  <span className="text-[12px] text-[var(--color-ink-3)]">Use code</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center h-9 px-4 rounded-[12px] font-mono font-semibold text-[14px] tracking-[0.14em] cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                      color: '#F4CC68',
                      background: 'rgba(226,176,61,0.10)',
                      border: '1px dashed rgba(226,176,61,0.45)'
                    }}
                    title="Click to copy code"
                  >
                    {copied ? 'COPIED' : 'CLAUDIO'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title: Other Reputable Firms */}
        <div className="mb-8">
          <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold tracking-[-0.03em] text-[var(--color-ink-1)] mb-2">
            Other reputable firms
          </h2>
          <p className="text-[14px] text-[var(--color-ink-3)] leading-relaxed max-w-2xl">
            We are not affiliated with the firms below and earn nothing from them. They are listed so you can compare options and pick what fits you.
          </p>
        </div>

        {/* 2x2 Grid of Other Reputable Firms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {otherFirms.map((firm) => (
            <div
              key={firm.name}
              className="group relative h-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] transition-all duration-500 ease-silk hover:border-[var(--color-hair-3)] hover:-translate-y-[2px] p-7 flex flex-col"
            >
              {/* Top Accent Gradient Bar */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${firm.accentColor}, transparent)`
                }}
              />

              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center min-h-[44px]">
                  {firm.isLogoOnly ? (
                    <img
                      src={firm.logo}
                      alt={`${firm.name} logo`}
                      className={`w-auto object-contain ${
                        firm.name === 'MyFundedFutures' ? 'h-12 max-w-[220px]' : 'h-7 max-w-[220px]'
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="inline-flex items-center gap-3">
                      <img
                        src={firm.logo}
                        alt=""
                        aria-hidden="true"
                        className="h-10 w-auto object-contain rounded-[9px]"
                        loading="lazy"
                      />
                      <span className="font-display text-[1.3rem] font-bold tracking-[-0.02em] text-[var(--color-ink-1)]">
                        {firm.name}
                      </span>
                    </span>
                  )}
                </div>

                <span className="shrink-0 inline-flex items-center h-5 px-2 rounded-[6px] text-[10px] uppercase font-semibold font-mono tracking-[0.12em] text-[var(--color-ink-3)] bg-white/[0.03] border border-[var(--color-hair-2)]">
                  {firm.badge}
                </span>
              </div>

              <p className="text-[14px] leading-relaxed text-[var(--color-ink-3)] mb-5">
                {firm.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {firm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center h-7 px-3 rounded-full text-[12px] tracking-[-0.005em]"
                    style={{
                      color: 'var(--color-ink-2)',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-hair-2)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              <div className="mt-auto pt-1">
                <a
                  href={firm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-ink-2)] transition-colors group-hover:text-white"
                >
                  <span>Visit {firm.name}</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliate Disclosure Card */}
        <div className="p-6 rounded-[var(--radius-lg)] bg-white/[0.02] border border-[var(--color-hair-1)] text-[12.5px] text-[var(--color-ink-3)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-ink-1)]">Affiliate disclosure: </strong>
            FLW earns a commission when you sign up to Onyx Futures through our link or code, at no extra cost to you. The other firms are listed for information only: we are not affiliated with them and receive nothing from them. Nothing on this page is financial advice. Prop firm trading carries risk, and rules and payouts differ between firms and change over time. Always read each firm&apos;s current terms before you fund an account.
          </p>
        </div>
      </div>
    </div>
  );
};
