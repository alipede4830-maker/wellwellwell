import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { GLOSSARY_ITEMS } from '../data/flwContent';

interface GlossaryViewProps {
  onBack: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flw_bookmarked_terms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleTerm = (term: string) => {
    setOpenTerms((prev) => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  const toggleBookmark = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = bookmarks.includes(term)
      ? bookmarks.filter((t) => t !== term)
      : [...bookmarks, term];
    setBookmarks(updated);
    try {
      localStorage.setItem('flw_bookmarked_terms', JSON.stringify(updated));
    } catch {}
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return GLOSSARY_ITEMS;
    const q = search.toLowerCase();
    return GLOSSARY_ITEMS.filter((item) => {
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.shortDesc?.toLowerCase().includes(q)
      );
    });
  }, [search]);

  // Group terms by letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof GLOSSARY_ITEMS> = {};
    const sorted = [...filtered].sort((a, b) => a.term.localeCompare(b.term));
    for (const item of sorted) {
      const firstChar = item.term.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    }
    return groups;
  }, [filtered]);

  const activeLetters = useMemo(() => {
    return new Set(Object.keys(groupedTerms));
  }, [groupedTerms]);

  return (
    <div className="w-full min-h-screen pt-28 md:pt-32 pb-0 relative overflow-hidden">
      {/* Ambience Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.08] bg-[var(--color-brand-blue)]" />
        <div className="absolute top-[40%] right-[-12%] w-[560px] h-[560px] rounded-full blur-[180px] opacity-[0.07] bg-[var(--color-brand-red)]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6 pb-24">
        {/* Return to Home */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 text-[13px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home</span>
        </button>

        {/* Hero Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1 h-1 rounded-full bg-[var(--color-brand-blue)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-brand-blue-soft)] font-semibold">
              Reference · A to Z
            </span>
          </div>
          <h1 className="font-display text-[2.5rem] md:text-[4.5rem] font-bold text-[var(--color-ink-1)] tracking-[-0.05em] leading-[0.92]">
            The <span className="text-accent-blue">glossary.</span>
          </h1>
          <p className="mt-6 text-[15px] md:text-[17px] text-[var(--color-ink-3)] max-w-xl leading-relaxed">
            Every term you need, defined clearly. Bookmarks save to your account.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-4)] group-focus-within:text-[var(--color-brand-blue)] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search terms…"
            aria-label="Search glossary terms"
            className="w-full pl-11 pr-12 h-12 rounded-[14px] bg-[var(--color-surface-1)] border border-[var(--color-hair-2)] text-[var(--color-ink-1)] text-[14px] font-medium tracking-[-0.005em] placeholder:text-[var(--color-ink-4)] focus:outline-none focus:border-[var(--color-brand-blue)]/40 focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* A-Z Jump Navigation Bar */}
        <div className="flex items-center gap-1 flex-wrap mb-10 py-2">
          {ALPHABET.map((letter) => {
            const hasItems = activeLetters.has(letter);
            return hasItems ? (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11.5px] font-mono font-semibold tabular-nums transition-all text-[var(--color-ink-1)] hover:bg-[var(--color-brand-blue-tint)] hover:text-[var(--color-brand-blue)]"
              >
                {letter}
              </a>
            ) : (
              <span
                key={letter}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11.5px] font-mono font-semibold tabular-nums transition-all text-[var(--color-ink-4)]/40 cursor-not-allowed"
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Grouped A-Z List */}
        <div className="space-y-12">
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => {
              const terms = groupedTerms[letter];
              return (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-display text-[1.75rem] font-bold text-[var(--color-ink-1)] tracking-[-0.035em]">
                      {letter}
                    </span>
                    <div className="flex-1 h-px bg-[var(--color-hair-1)]" />
                    <span className="font-mono text-[10.5px] text-[var(--color-ink-4)] uppercase tracking-[0.15em] tabular-nums">
                      {terms.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {terms.map((item) => {
                      const isOpen = !!openTerms[item.term];
                      const isBookmarked = bookmarks.includes(item.term);

                      return (
                        <button
                          key={item.term}
                          onClick={() => toggleTerm(item.term)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border cursor-pointer ${
                            isOpen
                              ? 'bg-[var(--color-surface-1)] border-[var(--color-hair-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]'
                              : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-[var(--color-hair-1)]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-[14px] font-semibold text-[var(--color-ink-1)] tracking-[-0.01em]">
                              {item.term}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                role="button"
                                tabIndex={0}
                                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                onClick={(e) => toggleBookmark(e, item.term)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    toggleBookmark(e as any, item.term);
                                  }
                                }}
                                className={`p-1 rounded transition-colors ${
                                  isBookmarked
                                    ? 'text-[var(--color-brand-blue)]'
                                    : 'text-[var(--color-ink-5)] hover:text-[var(--color-ink-2)]'
                                }`}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill={isBookmarked ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                  />
                                </svg>
                              </span>

                              <svg
                                className={`w-3 h-3 text-[var(--color-ink-4)] transition-transform duration-300 ${
                                  isOpen ? 'rotate-180 text-[var(--color-ink-2)]' : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>

                          <div
                            className={`grid transition-all duration-300 ease-silk ${
                              isOpen ? 'grid-rows-[1fr] opacity-100 pt-2.5' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="text-[var(--color-ink-3)] text-[13px] leading-relaxed tracking-[-0.005em]">
                                {item.definition}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[var(--color-ink-4)]">
              <p className="text-[14px]">No glossary entries found matching &quot;{search}&quot;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
