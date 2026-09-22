import React from 'react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';

export const CreatorsSection: React.FC = () => {
  const team = [
    {
      displayName: 'Claudio',
      role: 'Owner' as const,
      discordHandle: 'claudio_017',
      tiktokHandle: 'es.claudio',
      discordUserId: '1254034015338369050',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces'
    },
    {
      displayName: 'jzn',
      role: 'Owner' as const,
      discordHandle: 'j4nnes',
      tiktokHandle: 'jznnes',
      discordUserId: '1249652457429139479',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces'
    },
    {
      displayName: 'hf',
      role: 'Hedge' as const,
      discordHandle: 'hedgedfunds',
      tiktokHandle: 'pvqry',
      discordUserId: '488973055473745921',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=crop&crop=faces'
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
        {/* Centered Section Header wrapped in MotionReveal */}
        <MotionReveal>
          <SectionHeader
            eyebrow="06 · The Creators"
            title="About"
            accent="us."
            accentColor="red"
            align="centered"
            className="mb-14"
          />
        </MotionReveal>

        {/* 3 Creators Cards Grid wrapped in MotionReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <MotionReveal key={member.discordUserId} delay={index * 0.08} className="h-full">
              <div className="h-full rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 text-center flex flex-col items-center justify-between transition-all duration-500 ease-out hover:border-[var(--color-hair-3)] hover:-translate-y-[2px]">
                <div className="flex flex-col items-center w-full">
                  {/* Avatar with live status ring */}
                  <div className="relative mb-5">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[var(--color-surface-2)] ring-1 ring-white/[0.08]">
                      <img
                        src={member.avatar}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[var(--color-surface-1)] rounded-full flex items-center justify-center z-10 ring-2 ring-[var(--color-surface-1)]">
                      <div className="w-2.5 h-2.5 bg-[var(--color-success)] rounded-full shadow-[0_0_8px_rgba(34,214,143,0.7)]" />
                    </div>
                  </div>

                  {/* Display Name */}
                  <h3 className="font-display text-[1.35rem] font-bold text-[var(--color-ink-1)] mb-2 tracking-[-0.025em]">
                    {member.displayName}
                  </h3>

                  {/* Role Pill */}
                  <span className="inline-flex h-6 items-center px-3 rounded-full bg-white/[0.04] border border-[var(--color-hair-2)] text-[11px] font-mono font-semibold text-[var(--color-ink-2)] uppercase tracking-[0.14em] mb-5">
                    {member.role}
                  </span>

                  {/* Social Badges: Discord & TikTok */}
                  <div className="w-full space-y-2">
                    {/* Discord Handle */}
                    <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.02] border border-[var(--color-hair-1)] text-[var(--color-ink-3)] text-[12px] font-mono justify-center">
                      <svg className="w-3.5 h-3.5 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.0913a18.68 18.68 0 00-5.4868 0c-.1636-.3193-.4034-.716-.6196-1.0913a.074.074 0 00-.0781-.0376 19.6366 19.6366 0 00-4.8855 1.5151.0741.0741 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.33c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                      <span>@{member.discordHandle}</span>
                    </div>

                    {/* TikTok Link */}
                    <a
                      href={`https://www.tiktok.com/@${member.tiktokHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.02] border border-[var(--color-hair-1)] text-[var(--color-ink-3)] hover:text-white hover:bg-white/[0.05] hover:border-[var(--color-hair-2)] text-[12px] font-mono justify-center transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.35 22a6.33 6.33 0 0 0 6.33-6.32V8.92a8.28 8.28 0 0 0 3.91 1v-3.23z" />
                      </svg>
                      <span>@{member.tiktokHandle}</span>
                    </a>
                  </div>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Server notice */}
        <p className="text-center text-[var(--color-ink-3)] text-[12.5px] mt-10">
          Please don't DM us about educational topics. All questions are welcome in the server.
        </p>
      </div>
    </div>
  );
};
