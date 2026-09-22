import React, { useState, useEffect, useRef } from 'react';
import { Search, GraduationCap, BookOpen, Wrench } from 'lucide-react';
import { SEARCH_INDEX } from '../data/flwContent';
import { SearchResultItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(-1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickLinks = [
    { label: 'Education', url: 'education', icon: GraduationCap },
    { label: 'Glossary', url: 'glossary', icon: BookOpen },
    { label: 'Toolkit', url: 'toolkit', icon: Wrench }
  ];

  const trimmed = query.trim().toLowerCase();

  const pages = trimmed.length >= 2
    ? SEARCH_INDEX.filter(
        (item) =>
          item.type === 'page' &&
          (item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed))
      )
    : [];

  const lessons = trimmed.length >= 2
    ? SEARCH_INDEX.filter(
        (item) =>
          (item.type === 'lesson' || item.type === 'tool') &&
          (item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed))
      )
    : [];

  const glossaryItems = trimmed.length >= 2
    ? SEARCH_INDEX.filter(
        (item) =>
          item.type === 'glossary' &&
          (item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed))
      )
    : [];

  const allResults: SearchResultItem[] = [...pages, ...lessons, ...glossaryItems];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (trimmed.length < 2) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, quickLinks.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && quickLinks[selectedIndex]) {
        e.preventDefault();
        onSelect(quickLinks[selectedIndex].url);
        onClose();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && allResults[selectedIndex]) {
      e.preventDefault();
      onSelect(allResults[selectedIndex].url);
      onClose();
    }
  };

  if (!isOpen) return null;

  let currentIndex = -1;

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) onClose();
      }}
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[min(18vh,140px)] animate-in fade-in duration-200"
    >
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-[520px] mx-5 animate-in zoom-in-95 duration-200"
      >
        <div className="relative rounded-xl overflow-hidden border border-white/[0.05] bg-[#0a0b0f] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.9)]">
          {/* Top highlight hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none rounded-t-xl" />

          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 h-14">
            <Search className="w-4 h-4 shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Search lessons, glossary..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-600 font-mono">
              {query ? (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                'ESC'
              )}
            </kbd>
          </div>

          <div className="h-px bg-white/[0.04] mx-4" />

          {/* Search Content */}
          <div className="max-h-[min(46vh,380px)] overflow-y-auto overscroll-contain py-2 px-2">
            {trimmed.length < 2 && (
              <div className="grid grid-cols-3 gap-1.5 p-1">
                {quickLinks.map((ql, idx) => {
                  const Icon = ql.icon;
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={ql.label}
                      onClick={() => {
                        onSelect(ql.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-white/[0.06] text-gray-300'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className="w-4 h-4 opacity-40" />
                      <span>{ql.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {trimmed.length >= 2 && allResults.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-[13px] text-gray-600">No results for “{query}”</p>
              </div>
            )}

            {trimmed.length >= 2 && pages.length > 0 && (
              <>
                <p className="px-3 pt-2 pb-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em]">
                  Pages
                </p>
                {pages.map((item) => {
                  currentIndex++;
                  const isSelected = selectedIndex === currentIndex;
                  const itemIndex = currentIndex;
                  return (
                    <div
                      key={item.url}
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-100 cursor-pointer ${
                        isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className={`text-[13px] truncate ${
                          isSelected ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-gray-600' : 'text-gray-700'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {trimmed.length >= 2 && lessons.length > 0 && (
              <>
                <p className="px-3 pt-2 pb-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em]">
                  Lessons
                </p>
                {lessons.map((item) => {
                  currentIndex++;
                  const isSelected = selectedIndex === currentIndex;
                  const itemIndex = currentIndex;
                  return (
                    <div
                      key={item.url}
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-100 cursor-pointer ${
                        isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className={`text-[13px] truncate ${
                          isSelected ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-gray-600' : 'text-gray-700'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {trimmed.length >= 2 && glossaryItems.length > 0 && (
              <>
                <p className="px-3 pt-3 pb-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em]">
                  Glossary
                </p>
                {glossaryItems.map((item) => {
                  currentIndex++;
                  const isSelected = selectedIndex === currentIndex;
                  const itemIndex = currentIndex;
                  return (
                    <div
                      key={item.url}
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-100 cursor-pointer ${
                        isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className={`text-[13px] truncate ${
                          isSelected ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-gray-600' : 'text-gray-700'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
