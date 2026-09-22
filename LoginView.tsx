import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { NavRoute } from '../types';
import { MotionReveal } from './MotionReveal';
import { StorageService, UserProfile } from '../lib/storage';

interface LoginViewProps {
  onNavigate: (route: NavRoute) => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customHandle, setCustomHandle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Listen for OAuth popup completion postMessage
  useEffect(() => {
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data?.token) {
          StorageService.setAuthToken(event.data.token);
        }
        const profile = await StorageService.getUser();
        if (profile) {
          onLoginSuccess(profile);
          onNavigate('dashboard');
        }
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [onLoginSuccess, onNavigate]);

  const handleDiscordLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const handle = customHandle.trim();
      // If user typed a custom handle, perform direct server-authenticated login
      if (handle) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ handle })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            StorageService.setAuthToken(data.token);
          }
          await StorageService.saveUser(data.user);
          setIsLoading(false);
          onLoginSuccess(data.user);
          onNavigate('dashboard');
          return;
        }
      }

      // Check if Discord OAuth credentials are configured on server
      const urlRes = await fetch('/api/auth/discord/url');
      if (urlRes.ok) {
        const urlData = await urlRes.json();
        if (urlData.configured && urlData.url) {
          const width = 500;
          const height = 750;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          window.open(
            urlData.url,
            'DiscordOAuthPopup',
            `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
          );
          setIsLoading(false);
          return;
        }
      }

      // Fallback to server direct login endpoint if Discord app credentials are not provided
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ handle: handle || 'claudio_017' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          StorageService.setAuthToken(data.token);
        }
        await StorageService.saveUser(data.user);
        setIsLoading(false);
        onLoginSuccess(data.user);
        onNavigate('dashboard');
      } else {
        throw new Error('Server returned login error');
      }
    } catch (err) {
      console.warn('Authentication fallback triggered:', err);
      const fallbackHandle = customHandle.trim() || 'claudio_017';
      const cleanName = fallbackHandle.replace(/^@/, '');
      const profile: UserProfile = {
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        email: `${cleanName.toLowerCase()}@discord.gg`,
        accountEquity: 50000,
        riskPercent: 1.0,
        preferredInstrument: 'NQ',
        propFirmCode: 'CLAUDIO',
        isLoggedIn: true,
        memberSince: new Date().toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
      };

      await StorageService.saveUser(profile);
      setIsLoading(false);
      onLoginSuccess(profile);
      onNavigate('dashboard');
    }
  };

  const unlockFeatures = [
    {
      num: 1,
      title: 'AI Assistant',
      desc: 'Ask the FLW bot any orderflow question, any time.'
    },
    {
      num: 2,
      title: 'Trade Journal',
      desc: 'Log trades, tag setups, review stats, see your edge.'
    },
    {
      num: 3,
      title: 'Personal Dashboard',
      desc: 'Progress, streak, journal snapshot, session timer.'
    },
    {
      num: 4,
      title: 'Full Toolkit',
      desc: 'Risk calc, Monte Carlo, checklist, calendar.'
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pt-32 sm:pt-36 pb-24 px-6 md:px-12 flex flex-col items-center relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-start">
        {/* Top Daily Insight Pill matching real site */}
        <MotionReveal delay={0.05} className="w-full flex items-center justify-start mb-10">
          <div className="inline-flex items-center gap-3 text-[12px] md:text-[13px] py-1.5 px-4 rounded-full bg-white/[0.02] border border-[var(--color-hair-1)] max-w-full">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-semibold text-[var(--color-brand-blue)] tracking-[0.16em] uppercase shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              DAILY INSIGHT
            </span>
            <span className="text-[var(--color-hair-3)]">|</span>
            <span className="text-[var(--color-ink-2)] truncate">
              The market doesn't care about your position. Detach your ego from your P&L.
            </span>
          </div>
        </MotionReveal>

        {/* Section Header */}
        <MotionReveal delay={0.1} className="w-full mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.24em] text-[var(--color-ink-3)]">
              SIGN IN
            </span>
          </div>

          <h1 className="font-display text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-[-0.05em] leading-[0.95] text-white">
            Connect your <span className="text-[#5865F2]">discord.</span>
          </h1>
        </MotionReveal>

        {/* Two-Column Cards Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Left Column: Sign in with Discord Card */}
          <MotionReveal delay={0.15} className="h-full">
            <div className="h-full rounded-[24px] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 md:p-10 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div>
                <h2 className="font-display text-[1.45rem] font-bold text-white tracking-[-0.02em] mb-3">
                  Sign in with Discord
                </h2>
                <p className="text-[13.5px] text-[var(--color-ink-3)] leading-relaxed mb-8">
                  We never see your Discord password. The OAuth flow shares username, avatar, email,
                  and guild membership only.
                </p>

                {/* Big Discord Button */}
                <button
                  onClick={() => handleDiscordLogin()}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] active:scale-[0.99] text-white font-semibold text-[14px] flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_4px_24px_rgba(88,101,242,0.35)] hover:shadow-[0_8px_32px_rgba(88,101,242,0.5)] cursor-pointer disabled:opacity-75 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting to Discord...</span>
                    </>
                  ) : (
                    <>
                      {/* Authentic Discord Vector Logo */}
                      <svg
                        className="w-5 h-5 fill-white shrink-0 group-hover:scale-105 transition-transform"
                        viewBox="0 0 127.14 96.36"
                      >
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                      </svg>
                      <span>Continue with Discord</span>
                    </>
                  )}
                </button>

                {/* Optional Custom Handle Toggle */}
                <div className="mt-3 text-center">
                  {!showCustomInput ? (
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="text-[11.5px] text-[var(--color-ink-4)] hover:text-[var(--color-ink-2)] transition-colors underline cursor-pointer"
                    >
                      Use custom Discord username
                    </button>
                  ) : (
                    <form onSubmit={handleDiscordLogin} className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="@your_discord_name"
                        value={customHandle}
                        onChange={(e) => setCustomHandle(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#5865F2]"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs text-white font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </form>
                  )}
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-hair-1)]" />
                  </div>
                  <span className="relative px-3 bg-[var(--color-surface-1)] text-[10.5px] font-mono uppercase tracking-[0.2em] text-[var(--color-ink-4)]">
                    OR
                  </span>
                </div>

                {/* Ghost Secondary Button */}
                <button
                  onClick={() => onNavigate('education')}
                  className="w-full h-12 rounded-xl bg-transparent border border-[var(--color-hair-2)] hover:border-[var(--color-hair-3)] hover:bg-white/[0.03] text-white font-medium text-[13.5px] flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <span>Browse the curriculum without an account</span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-ink-3)] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Bottom Policy Terms text */}
              <div className="text-[12px] text-[var(--color-ink-3)] mt-8">
                By signing in you agree to the{' '}
                <button
                  onClick={() => onNavigate('terms')}
                  className="underline text-[var(--color-ink-2)] hover:text-white transition-colors cursor-pointer"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  onClick={() => onNavigate('privacy')}
                  className="underline text-[var(--color-ink-2)] hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                .
              </div>
            </div>
          </MotionReveal>

          {/* Right Column: What you unlock Card */}
          <MotionReveal delay={0.2} className="h-full">
            <div className="h-full rounded-[24px] bg-[var(--color-surface-1)] border border-[var(--color-hair-1)] p-8 md:p-10 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] flex flex-col justify-start">
              <h2 className="font-display text-[1.45rem] font-bold text-white tracking-[-0.02em] mb-6">
                What you unlock
              </h2>

              <div className="space-y-3.5">
                {unlockFeatures.map((item) => (
                  <div
                    key={item.num}
                    className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-hair-1)] hover:border-[var(--color-hair-2)] transition-all flex items-start gap-4"
                  >
                    {/* Circle Number Badge */}
                    <div className="w-7 h-7 rounded-full bg-[var(--color-brand-blue-tint)] border border-[var(--color-brand-blue)]/30 text-[var(--color-brand-blue)] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.num}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-[14px] mb-1 tracking-[-0.01em]">
                        {item.title}
                      </h3>
                      <p className="text-[12.5px] text-[var(--color-ink-3)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </div>
  );
};
