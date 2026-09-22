import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NavRoute } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  routeLink?: { label: string; route: NavRoute };
}

interface FloatingChatProps {
  onNavigate: (route: NavRoute) => void;
}

const KNOWLEDGE_BASE: Record<string, { answer: string; route?: NavRoute; routeLabel?: string }> = {
  amt: {
    answer:
      'Auction Market Theory (AMT) views financial markets as continuous two-way auctions designed to facilitate trade. Price moves to discover where buyers and sellers agree on value (balance/acceptance) or reject unfair prices (imbalance/discovery). Key concepts include Value Area (VAH/VAL), Point of Control (POC), and Excess.',
    route: 'education/amt',
    routeLabel: 'Read AMT Curriculum'
  },
  cvd: {
    answer:
      'Cumulative Volume Delta (CVD) aggregates aggressive market buys minus aggressive market sells over time. Divergences between CVD and price reveal absorption: if price reaches higher highs while CVD fails or falls, passive sellers are absorbing aggressive buyers.',
    route: 'education/dom',
    routeLabel: 'Explore Orderflow & CVD'
  },
  absorption: {
    answer:
      'Absorption occurs when large limit orders (passive liquidity) consume aggressive market orders without allowing price to move further. On the DOM ladder, you will see high market buy volume but no upward price progression, followed by aggressive rejection.',
    route: 'education/dom',
    routeLabel: 'Study DOM Mechanics'
  },
  risk: {
    answer:
      'Risk management is the foundation of long-term survival. Never risk more than 1-2% of total equity on any single idea. Always calculate your contract size based on tick distance to invalidation, not emotional conviction.',
    route: 'toolkit/risk-calculator',
    routeLabel: 'Open Risk Calculator'
  },
  journal: {
    answer:
      'The FLW Trade Journal tracks every execution, setup type (e.g. IB Extension, Failed Breakout, Absorption), emotional state, and P&L metrics so you can review patterns and eliminate leaks.',
    route: 'toolkit/journal',
    routeLabel: 'Open Trade Journal'
  }
};

const SUGGESTIONS = [
  { label: 'What is AMT?', key: 'amt' },
  { label: 'How does CVD work?', key: 'cvd' },
  { label: 'Explain Absorption', key: 'absorption' },
  { label: 'Position Sizing Rules', key: 'risk' }
];

export const FloatingChat: React.FC<FloatingChatProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi, welcome to FLW. Ask me anything about orderflow trading, auction market theory, volume profiles, or our tools.',
      time: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || input;
    const query = rawText.trim();
    if (!query || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: timeStr
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: nextMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.text) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            routeLink: data.suggestedRoute
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('AI chat API fallback to built-in knowledge base:', err);
    }

    // Fallback if API is unreachable
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = false;
      let replyText =
        'Orderflow trading focuses on understanding real-time supply and demand imbalances, market participant intent, and liquidity mechanics rather than lagging indicators. Check out our free roadmap for detailed breakdowns.';
      let replyRoute: { label: string; route: NavRoute } | undefined = {
        label: 'Start Curriculum',
        route: 'education/amt'
      };

      for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
        if (lower.includes(key) || lower.includes(key.replace('-', ' '))) {
          replyText = data.answer;
          if (data.route && data.routeLabel) {
            replyRoute = { label: data.routeLabel, route: data.route };
          }
          matched = true;
          break;
        }
      }

      if (!matched) {
        if (lower.includes('firm') || lower.includes('funded') || lower.includes('onxy') || lower.includes('onyx')) {
          replyText =
            'We partner with Onyx Futures to help traders trade real capital with forgiving end-of-day drawdowns, no daily loss limits, and fast payouts. Use code CLAUDIO for special discounts.';
          replyRoute = { label: 'View Prop Firms', route: 'propfirm' };
        } else if (lower.includes('profile') || lower.includes('tpo') || lower.includes('market profile')) {
          replyText =
            'Market and Volume Profiles organize trading activity by price and time rather than just candlesticks. They show where trading volume accumulated and reveal value migrations.';
          replyRoute = { label: 'Explore Volume Profile', route: 'education/volume-profile' };
        } else if (lower.includes('discord') || lower.includes('community')) {
          replyText =
            'Our Discord community has over 2,500 active orderflow traders, daily pre-market breakdowns, and live market voice channels.';
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routeLink: replyRoute
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[195] w-[calc(100vw-2rem)] sm:w-[410px] max-h-[580px] h-[550px] rounded-2xl bg-[#090a0e]/95 border border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(58,139,255,0.12)] flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300"
          role="dialog"
          aria-label="Orderflow AI Assistant"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue)] flex items-center justify-center text-white shadow-[0_0_12px_rgba(58,139,255,0.4)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13.5px] font-semibold text-white tracking-tight">FLW Assistant</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/15 border border-[var(--color-brand-blue)]/30 px-1.5 py-0.2 rounded">
                    Beta
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22d68f] shadow-[0_0_6px_rgba(34,214,143,0.8)]" />
                  <span className="text-[10.5px] text-[var(--color-ink-3)] font-mono">Orderflow Engine Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[13px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[var(--color-brand-blue)] text-white font-medium rounded-tr-sm'
                      : 'bg-white/[0.04] border border-white/[0.07] text-[var(--color-ink-2)] rounded-tl-sm'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="text-[13px] leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:my-1.5 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:my-1.5 [&_strong]:text-white [&_strong]:font-semibold">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}

                  {msg.routeLink && (
                    <button
                      onClick={() => {
                        onNavigate(msg.routeLink!.route);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-brand-blue)]/15 border border-[var(--color-brand-blue)]/30 text-[11.5px] font-semibold text-[#68abff] hover:bg-[var(--color-brand-blue)] hover:text-white transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{msg.routeLink.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <span className="block text-[9.5px] text-right mt-1 opacity-50 font-mono">
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/[0.1] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-[12px] text-[var(--color-ink-3)]">
                <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-blue-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.05]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-4 py-2 border-t border-white/[0.05] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {SUGGESTIONS.map((item) => (
              <button
                key={item.key}
                onClick={() => handleSend(item.label)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono text-[var(--color-ink-3)] bg-white/[0.03] border border-white/[0.08] hover:border-[var(--color-brand-blue)]/50 hover:text-white transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/[0.08] bg-[#0c0d12]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= 250) setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about orderflow..."
                maxLength={250}
                rows={1}
                className="flex-1 resize-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brand-blue)]/60 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-[var(--color-brand-blue)] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shrink-0 shadow-md shadow-blue-500/20"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5 px-1">
              <span>AI generated, may not always be accurate.</span>
              <span>{input.length}/250</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open Orderflow AI chat'}
        className={`fixed bottom-6 right-6 z-[190] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/40 transition-all duration-300 cursor-pointer ${
          isOpen
            ? 'bg-white/[0.08] border border-white/[0.15] text-gray-400 hover:text-white'
            : 'bg-[var(--color-brand-blue)] text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(0,153,255,0.4)]'
        }`}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        )}
      </button>
    </>
  );
};
