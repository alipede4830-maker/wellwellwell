import React from 'react';
import { NavRoute } from '../types';

interface SiteFooterProps {
  onNavigate: (route: NavRoute) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Education',
      links: [
        { label: 'AMT', route: 'education/amt' as NavRoute },
        { label: 'Volume Profile', route: 'education/volume-profile' as NavRoute },
        { label: 'Orderflow', route: 'education/dom' as NavRoute }
      ]
    },
    {
      title: 'Toolkit',
      links: [
        { label: 'Journal', route: 'toolkit/journal' as NavRoute },
        { label: 'Risk Calc', route: 'toolkit/risk-calculator' as NavRoute },
        { label: 'Checklist', route: 'toolkit/checklist' as NavRoute }
      ]
    },
    {
      title: 'Discover',
      links: [
        { label: 'Brain', route: 'brain' as NavRoute },
        { label: 'Glossary', route: 'glossary' as NavRoute },
        { label: 'Prop Firms', route: 'propfirm' as NavRoute },
        { label: 'Dashboard', route: 'dashboard' as NavRoute }
      ]
    }
  ];

  return (
    <footer
      className="relative z-10 mt-20 w-screen left-1/2 -translate-x-1/2 overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-0)' }}
    >
      {/* Top Hairline Divider */}
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)]" />

      <div className="relative max-w-[1500px] mx-auto px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* Brand Logo */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="relative block w-10 h-10 cursor-pointer group"
              aria-label="FLW Home"
            >
              <img
                src="/assets/flw_logo_nav.png"
                alt="FLW"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
            </button>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 flex justify-between max-w-2xl">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h4 className="text-[9.5px] font-mono font-semibold text-[var(--color-ink-3)] tracking-[0.22em] uppercase mb-3">
                  {sec.title}
                </h4>
                <ul className="space-y-1.5">
                  {sec.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => onNavigate(link.route)}
                        className="text-[12.5px] text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)] transition-colors tracking-[-0.005em] cursor-pointer text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Icons: Discord + YouTube */}
          <div className="md:col-span-2 flex md:justify-end items-center gap-2">
            <a
              href="https://discord.gg/bsuM3urQCX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] border border-[var(--color-hair-2)] text-[var(--color-ink-3)] hover:bg-[#5865F2]/10 hover:border-[#5865F2]/30 hover:text-[#b0b5ff] transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.0913a18.68 18.68 0 00-5.4868 0c-.1636-.3193-.4034-.716-.6196-1.0913a.074.074 0 00-.0781-.0376 19.6366 19.6366 0 00-4.8855 1.5151.0741.0741 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.33c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@orderflw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] border border-[var(--color-hair-2)] text-[var(--color-ink-3)] hover:bg-[#ff0000]/10 hover:border-[#ff0000]/30 hover:text-[#ff6666] transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Disclaimer Paragraph */}
        <div className="mt-8 pt-6 border-t border-[var(--color-hair-1)] text-[12px] text-[var(--color-ink-3)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-ink-2)] font-semibold">Disclaimer:</strong> FLW provides free educational content on orderflow trading. All content on this website is for educational and informational purposes only and should not be considered financial or investment advice. We are not licensed financial advisors, and nothing shared here constitutes a recommendation to buy, sell, or hold any financial instrument. Trading and investing in financial markets involve significant risk and may not be suitable for all individuals.
          </p>
        </div>

        {/* Bottom Line */}
        <div className="mt-6 pt-4 border-t border-[var(--color-hair-1)] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[var(--color-ink-4)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 FLW</span>
            <button
              onClick={() => onNavigate('impressum')}
              className="hover:text-[var(--color-ink-2)] transition-colors cursor-pointer"
            >
              Imprint
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-[var(--color-ink-2)] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[var(--color-ink-2)] transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-[var(--color-ink-2)] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
          <p>Built for traders, by traders.</p>
        </div>
      </div>
    </footer>
  );
};
