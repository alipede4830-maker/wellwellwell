import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, LayoutDashboard, Bookmark, LogOut } from 'lucide-react';
import { NavRoute } from '../types';

interface SiteHeaderProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  userLoggedIn: boolean;
  userName?: string;
  onSignOut?: () => void;
}

export const DAILY_INSIGHTS = [
  "Process over outcome. A losing trade taken with discipline is a win for your system.",
  "Your journal is your edge. If you're not reviewing, you're not improving.",
  "Risk management is not optional. Define your max loss before the session starts.",
  "Trading is a game of probabilities. No single trade matters. The process matters.",
  "When in doubt, sit out. The market will be there tomorrow.",
  "The goal is not to be right. The goal is to follow your plan and manage risk.",
  "Revenge trading is your subconscious trying to undo pain. Recognize it. Walk away.",
  "Boredom is not a setup. If you're forcing trades, you're bleeding edge.",
  "Your worst losses come after your best wins. Stay humble, stay disciplined.",
  "Fear of missing out leads to chasing. Chasing leads to poor entries. Poor entries lead to tilt.",
  "Confidence comes from preparation, not from your last trade.",
  "The market doesn't care about your position. Detach your ego from your P&L.",
  "A break after a loss is not weakness. It's the strongest move you can make.",
  "Consistency beats intensity. Show up with the same process every single day.",
  "You don't need to trade every day. Some of the best trading days are the ones you sit out.",
  "Discipline is doing the boring thing when your emotions scream for action.",
  "Your edge is fragile. One emotional trade can undo a week of disciplined work.",
  "Master your emotions first. The market will teach you everything else.",
  "The best traders are not fearless. They feel the fear and follow the plan anyway.",
  "Size down when you're off. There's no shame in protecting your capital and your confidence.",
  "Stop comparing your P&L to others. Your only competition is yesterday's version of you.",
  "Overtrading is the most expensive habit in this game. Less is more.",
  "Accept uncertainty. Every trade is a probability, not a guarantee.",
  "Patience is not passive. Waiting for your setup is the most active thing you can do.",
  "The market rewards those who wait. It punishes those who force."
];

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenLogin,
  userLoggedIn,
  userName,
  onSignOut
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showInsight, setShowInsight] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dailyInsight, setDailyInsight] = useState(DAILY_INSIGHTS[0]);

  useEffect(() => {
    // Pick random daily insight on mount
    const randomIdx = Math.floor(Math.random() * DAILY_INSIGHTS.length);
    setDailyInsight(DAILY_INSIGHTS[randomIdx]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setIsScrolled(sy > 8);
      setShowInsight(sy <= 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; path: NavRoute }[] = [
    { name: 'Home', path: 'home' },
    { name: 'Education', path: 'education' },
    { name: 'Toolkit', path: 'toolkit' },
    { name: 'Glossary', path: 'glossary' },
    { name: 'Brain', path: 'brain' },
    { name: 'Prop Firms', path: 'propfirm' }
  ];

  const isLinkActive = (path: NavRoute) => {
    if (path === 'home') return currentRoute === 'home';
    return currentRoute === path || currentRoute.startsWith(`${path}/`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[rgba(9,9,12,0.82)] backdrop-blur-xl border-b border-[var(--color-hair-2)] shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
            : 'bg-[rgba(9,9,12,0.65)] backdrop-blur-md border-b border-[var(--color-hair-1)]'
        }`}
      >
        <div className="relative max-w-[1500px] mx-auto px-6 md:px-8 h-[68px] flex items-center justify-between">
          {/* Left: Brand Logo Icon */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center group cursor-pointer"
            aria-label="FLW Home"
          >
            <div className="relative w-10 h-10 transition-transform duration-500 ease-silk group-hover:scale-105 flex items-center justify-center">
              <img
                src="/assets/flw_logo_nav.png"
                alt="FLW Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_2px_12px_rgba(58,139,255,0.4)]"
              />
            </div>
          </button>

          {/* Center: Desktop Nav Pill Menu (Centered in screen) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-[var(--color-hair-1)] rounded-full p-1 absolute left-1/2 -translate-x-1/2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`relative px-4 py-1.5 text-[13px] font-medium tracking-[-0.005em] rounded-full transition-all duration-300 ease-silk ${
                    active
                      ? 'text-white bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                      : 'text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)] hover:bg-white/[0.03]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Right Actions: Quick Search (⌘K), User / Login, Hamburger */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg bg-white/[0.02] border border-[var(--color-hair-1)] hover:bg-white/[0.04] hover:border-[var(--color-hair-2)] transition-all duration-200 text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)] cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[12px] font-medium">Search</span>
              <span className="ml-2 flex items-center gap-0.5">
                <kbd className="flex items-center justify-center w-5 h-5 rounded-[5px] bg-white/[0.04] border border-[var(--color-hair-1)] text-[9px] font-mono text-[var(--color-ink-3)]">
                  ⌘
                </kbd>
                <kbd className="flex items-center justify-center w-5 h-5 rounded-[5px] bg-white/[0.04] border border-[var(--color-hair-1)] text-[9px] font-mono text-[var(--color-ink-3)]">
                  K
                </kbd>
              </span>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.02] border border-[var(--color-hair-1)] text-[var(--color-ink-3)] hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Account or Log in */}
            {userLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full bg-white/[0.02] border border-[var(--color-hair-1)] hover:bg-white/[0.04] hover:border-[var(--color-hair-2)] transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#5865F2,#3a8bff)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {userName ? userName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <span className="hidden md:block text-[13px] text-[var(--color-ink-1)] font-medium max-w-[110px] truncate">
                    {userName || 'Claudio'}
                  </span>
                  <ChevronDown
                    className={`hidden md:block w-3 h-3 text-[var(--color-ink-4)] transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f1015] border border-white/[0.09] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-ink-2)] hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#3a8bff]" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('glossary');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-ink-2)] hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-[#22d68f]" />
                      Bookmarks
                    </button>
                    {onSignOut && (
                      <>
                        <div className="my-1 border-t border-white/[0.08]" />
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="group/login relative inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12.5px] font-semibold text-white bg-[linear-gradient(180deg,#4a97ff,#2d7ae8)] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_6px_20px_-6px_rgba(58,139,255,0.5),0_0_0_1px_rgba(58,139,255,0.35)] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_28px_-6px_rgba(58,139,255,0.65),0_0_0_1px_rgba(58,139,255,0.45)] hover:-translate-y-[1px] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover/login:translate-x-full transition-transform duration-[900ms] ease-out"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)'
                  }}
                />
                <span className="relative">Login</span>
                <svg
                  className="relative w-3 h-3 transition-transform duration-300 group-hover/login:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg bg-white/[0.03] border border-[var(--color-hair-2)] hover:bg-white/[0.06] transition-all duration-200 gap-[5px] cursor-pointer"
              aria-label="Open menu"
              aria-controls="mobile-nav"
              aria-expanded={mobileOpen}
            >
              <span className="block w-4 h-px bg-[var(--color-ink-2)]" />
              <span className="block w-4 h-px bg-[var(--color-ink-2)]" />
              <span className="block w-3 h-px bg-[var(--color-ink-2)] self-end mr-[6px]" />
            </button>
          </div>
        </div>

        {/* Daily Insight Bar - Hidden on brain route */}
        {currentRoute !== 'brain' && (
          <div
            className={`overflow-hidden transition-all duration-500 ease-silk ${
              showInsight ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-[var(--color-hair-1)] bg-[rgba(9,9,12,0.5)]">
              <div className="max-w-[1500px] mx-auto px-8 h-9 flex items-center justify-center">
                <div className="flex items-center gap-3 leading-none">
                  <span className="inline-flex items-center gap-2 shrink-0 leading-none">
                    <span className="relative inline-block w-1.5 h-1.5 translate-y-[1px]">
                      <span
                        className="absolute inset-0 rounded-full bg-[var(--color-brand-blue)] opacity-60 animate-ping"
                        style={{ animationDuration: '3s' }}
                      />
                      <span className="relative block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-brand-blue)] tracking-[0.22em] uppercase font-semibold leading-none">
                      Daily Insight
                    </span>
                  </span>
                  <span aria-hidden={true} className="hidden sm:block w-px h-3 bg-[var(--color-hair-2)]" />
                  <p className="text-[12px] text-[#9aa0ad] hidden sm:block tracking-[-0.005em] leading-none">
                    {dailyInsight}
                  </p>
                  <p className="text-[12px] text-[#9aa0ad] sm:hidden truncate max-w-[200px] leading-none">
                    {dailyInsight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Backdrop and Sidebar */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileOpen(false);
        }}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--color-surface-1)] border-l border-[var(--color-hair-2)] shadow-[0_0_60px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-silk ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-hair-1)]">
            <span className="font-display font-bold text-[14px] tracking-[-0.01em] text-white">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 rounded-lg bg-white/[0.03] border border-[var(--color-hair-1)] hover:bg-white/[0.06] flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                className="w-4 h-4 text-[var(--color-ink-2)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col px-3 py-4 gap-1">
            {navLinks.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigate(item.path);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium tracking-[-0.005em] transition-all duration-200 text-left cursor-pointer ${
                    active
                      ? 'text-white bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                      : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink-1)] hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.name}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
