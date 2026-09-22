import React, { useState, useEffect, useRef } from 'react';

interface Level {
  price: number;
  lmtBid: number;
  lmtAsk: number;
  mktBuy: number;
  mktSell: number;
  pull: number;
  volume: number;
  delta: number;
  lastTouched: number;
  avgSize: number;
  tradeCount: number;
}

interface Trade {
  id: number;
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);
const formatTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

export const OrderflowLadder: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>(() => {
    const now = Date.now();
    return Array.from({ length: 25 }, (_, idx) => {
      const dist = Math.abs(12 - idx);
      const bidAskDepth = clamp(80 - 6 * dist + randomInt(-10, 10), 4, 99);
      const vol = clamp(60 - 4 * dist + randomInt(-15, 25), 8, 99);
      const delta = randomInt(-30, 30);
      const buyVol = clamp(80 - 8 * dist + randomInt(-25, 25), 4, 352);
      const sellVol = clamp(80 - 8 * dist + randomInt(-25, 25), 4, 352);
      return {
        price: +(5847.25 + (12 - idx) * 0.25).toFixed(2),
        lmtBid: idx > 12 ? bidAskDepth : 0,
        lmtAsk: idx < 12 ? bidAskDepth : 0,
        mktBuy: buyVol,
        mktSell: sellVol,
        pull: Math.random() > 0.7 ? randomInt(-40, 40) : 0,
        volume: vol,
        delta,
        lastTouched: now - randomInt(3000, 8000),
        avgSize: clamp(8 - dist + randomInt(-3, 4), 1, 22),
        tradeCount: clamp(40 - 3 * dist + randomInt(-10, 10), 5, 99)
      };
    });
  });

  const [centerIdx, setCenterIdx] = useState(12);
  const [trades, setTrades] = useState<Trade[]>(() => {
    const now = Date.now();
    return Array.from({ length: 26 }, (_, idx) => {
      const d = new Date(now - 320 * idx);
      const p = +(5847.25 + (Math.random() > 0.5 ? 1 : -1) * randomInt(0, 4) * 0.25).toFixed(2);
      const s: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      const sz = randomInt(1, 18);
      return { id: -idx - 1, time: formatTime(d), price: p, size: sz, side: s };
    });
  });

  const [activeTrade, setActiveTrade] = useState<{ idx: number; side: 'buy' | 'sell' } | null>(null);

  const biasRef = useRef(0);
  const tradeIdRef = useRef(0);
  const centerIdxRef = useRef(12);
  const levelsRef = useRef(levels);

  useEffect(() => {
    levelsRef.current = levels;
  }, [levels]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentBias = biasRef.current;
      const rand = Math.random();
      let dir = 0;
      const upProb = currentBias > 0 ? Math.min(0.18, 0.06 * currentBias) : 0;
      const downProb = currentBias < 0 ? Math.min(0.18, -0.06 * currentBias) : 0;

      if (rand < 0.225 + upProb) {
        dir = 1;
      } else if (rand < 0.45 + upProb + downProb) {
        dir = -1;
      }

      const currentCenter = centerIdxRef.current;
      let newCenter = currentCenter;
      let targetIdx: number | null = null;
      let tradeSide: 'buy' | 'sell' | null = null;
      let tradeSize = 0;

      if (dir === 1) {
        targetIdx = currentCenter - 1;
        tradeSide = 'buy';
        tradeSize = randomInt(2, 18);
        newCenter = currentCenter - 1;
        biasRef.current = clamp(currentBias + 1, -3, 3);
      } else if (dir === -1) {
        targetIdx = currentCenter + 1;
        tradeSide = 'sell';
        tradeSize = randomInt(2, 18);
        newCenter = currentCenter + 1;
        biasRef.current = clamp(currentBias - 1, -3, 3);
      } else {
        if (Math.random() > 0.6) {
          targetIdx = currentCenter;
          tradeSide = Math.random() > 0.5 ? 'buy' : 'sell';
          tradeSize = randomInt(1, 8);
        }
        biasRef.current = 0.6 * currentBias;
      }

      const currentLevels = levelsRef.current;
      const now = Date.now();

      let nextLevels = currentLevels.map((lvl, i) => ({
        ...lvl,
        lmtBid: i > currentCenter ? clamp(lvl.lmtBid + randomInt(-2, 2), 1, 99) : 0,
        lmtAsk: i < currentCenter ? clamp(lvl.lmtAsk + randomInt(-2, 2), 1, 99) : 0,
        pull: Math.random() > 0.92 ? randomInt(-50, 50) : Math.round(0.9 * lvl.pull)
      }));

      let execPrice = 0;

      if (targetIdx !== null && tradeSide && nextLevels[targetIdx]) {
        const lvl = nextLevels[targetIdx];
        const isStale = now - lvl.lastTouched > 2500;
        execPrice = lvl.price;
        const newTradeCount = isStale ? 1 : lvl.tradeCount + 1;
        const newAvgSize = isStale
          ? tradeSize
          : (lvl.avgSize * lvl.tradeCount + tradeSize) / newTradeCount;

        if (tradeSide === 'buy') {
          const baseBuy = isStale ? randomInt(15, 35) : lvl.mktBuy;
          nextLevels[targetIdx] = {
            ...lvl,
            mktBuy: clamp(baseBuy + tradeSize, 0, 352),
            volume: clamp(lvl.volume + Math.ceil(tradeSize / 3), 4, 99),
            delta: clamp(lvl.delta + Math.ceil(tradeSize / 2), -99, 99),
            lastTouched: now,
            avgSize: +newAvgSize.toFixed(1),
            tradeCount: clamp(newTradeCount, 1, 999)
          };
        } else {
          const baseSell = isStale ? randomInt(15, 35) : lvl.mktSell;
          nextLevels[targetIdx] = {
            ...lvl,
            mktSell: clamp(baseSell + tradeSize, 0, 352),
            volume: clamp(lvl.volume + Math.ceil(tradeSize / 3), 4, 99),
            delta: clamp(lvl.delta - Math.ceil(tradeSize / 2), -99, 99),
            lastTouched: now,
            avgSize: +newAvgSize.toFixed(1),
            tradeCount: clamp(newTradeCount, 1, 999)
          };
        }
      }

      if (newCenter !== currentCenter) {
        nextLevels = nextLevels.map((lvl, i) => {
          const isAsk = i < newCenter;
          const isBid = i > newCenter;
          return {
            ...lvl,
            lmtBid: isBid
              ? lvl.lmtBid > 0
                ? lvl.lmtBid
                : clamp(70 - 6 * Math.abs(newCenter - i) + randomInt(-10, 10), 4, 99)
              : 0,
            lmtAsk: isAsk
              ? lvl.lmtAsk > 0
                ? lvl.lmtAsk
                : clamp(70 - 6 * Math.abs(newCenter - i) + randomInt(-10, 10), 4, 99)
              : 0
          };
        });
      }

      let finalCenter = newCenter;
      if (newCenter <= 3) {
        const shift = 12 - newCenter;
        const currentCenterPrice = nextLevels[newCenter].price;
        const newTop = Array.from({ length: shift }, (_, i) => {
          const dist = Math.abs(12 - i);
          return {
            price: +(currentCenterPrice + (12 - i) * 0.25).toFixed(2),
            lmtBid: 0,
            lmtAsk: clamp(70 - 5 * dist + randomInt(-10, 10), 4, 99),
            mktBuy: clamp(180 - 12 * dist + randomInt(-40, 40), 4, 352),
            mktSell: clamp(180 - 12 * dist + randomInt(-40, 40), 4, 352),
            pull: 0,
            volume: clamp(50 - 3 * dist + randomInt(-15, 25), 8, 99),
            delta: randomInt(-20, 20),
            lastTouched: now - randomInt(3000, 8000),
            avgSize: clamp(6 + randomInt(-3, 4), 1, 22),
            tradeCount: clamp(20 + randomInt(-10, 10), 3, 99)
          };
        });
        nextLevels = [...newTop, ...nextLevels.slice(0, 25 - shift)].map((lvl, idx) => ({
          ...lvl,
          price: +(currentCenterPrice + (12 - idx) * 0.25).toFixed(2)
        }));
        finalCenter = 12;
      } else if (newCenter >= 21) {
        const shift = newCenter - 12;
        const currentCenterPrice = nextLevels[newCenter].price;
        const newBottom = Array.from({ length: shift }, (_, i) => {
          const targetIdx = 25 - shift + i;
          const dist = Math.abs(12 - targetIdx);
          return {
            price: +(currentCenterPrice + (12 - targetIdx) * 0.25).toFixed(2),
            lmtBid: clamp(70 - 5 * dist + randomInt(-10, 10), 4, 99),
            lmtAsk: 0,
            mktBuy: clamp(180 - 12 * dist + randomInt(-40, 40), 4, 352),
            mktSell: clamp(180 - 12 * dist + randomInt(-40, 40), 4, 352),
            pull: 0,
            volume: clamp(50 - 3 * dist + randomInt(-15, 25), 8, 99),
            delta: randomInt(-20, 20),
            lastTouched: now - randomInt(3000, 8000),
            avgSize: clamp(6 + randomInt(-3, 4), 1, 22),
            tradeCount: clamp(20 + randomInt(-10, 10), 3, 99)
          };
        });
        nextLevels = [...nextLevels.slice(shift), ...newBottom].map((lvl, idx) => ({
          ...lvl,
          price: +(currentCenterPrice + (12 - idx) * 0.25).toFixed(2)
        }));
        finalCenter = 12;
      }

      centerIdxRef.current = finalCenter;
      levelsRef.current = nextLevels;
      setLevels(nextLevels);
      setCenterIdx(finalCenter);

      if (targetIdx !== null && tradeSide) {
        const tid = ++tradeIdRef.current;
        setActiveTrade({ idx: targetIdx, side: tradeSide });
        setTrades((prev) =>
          [{ id: tid, time: formatTime(new Date()), price: execPrice, size: tradeSize, side: tradeSide }, ...prev].slice(0, 26)
        );
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const maxVolume = Math.max(20, ...levels.map((l) => l.volume));

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none font-mono">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(45% 50% at 50% 35%, rgba(58,139,255,0.10), transparent 70%), radial-gradient(40% 50% at 50% 75%, rgba(255,74,74,0.07), transparent 70%)'
        }}
      />

      {/* Main Container */}
      <div className="relative rounded-[14px] bg-[rgba(8,9,12,0.65)] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[1fr_140px]">
          {/* Left: Depth of Market */}
          <div className="border-r border-white/[0.06]">
            <div className="px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-2)] text-center border-b border-white/[0.06]">
              Depth of Market
            </div>

            <div className="py-1">
              {levels.map((lvl, i) => {
                const isCurrent = i === centerIdx;
                const isAsk = i < centerIdx;
                const isActive = activeTrade?.idx === i;
                const volWidth = (lvl.volume / maxVolume) * 100;
                const deltaRatio = clamp(Math.abs(lvl.delta) / maxVolume, 0, 1) * volWidth;
                const hitSide = activeTrade?.side;
                const highlightBg =
                  hitSide === 'buy'
                    ? 'rgba(90,154,239,0.18)'
                    : hitSide === 'sell'
                    ? 'rgba(232,117,117,0.18)'
                    : 'rgba(255,255,255,0.04)';

                return (
                  <div
                    key={`dom-row-${i}`}
                    className="relative grid grid-cols-[60px_14px_36px_36px_38px_38px_56px_36px_14px_60px] gap-x-[3px] items-center h-[16px] px-2 text-[9px]"
                    style={
                      isCurrent
                        ? {
                            background: `linear-gradient(90deg, transparent 0%, ${highlightBg} 18%, ${highlightBg} 82%, transparent 100%)`,
                            transition: 'background 600ms ease'
                          }
                        : undefined
                    }
                  >
                    {/* Volume profile bar */}
                    <div className="relative h-full overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-[15px] bg-[rgba(255,255,255,0.10)] transition-[width] duration-[260ms] ease-out"
                        style={{ width: `${volWidth}%` }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-[15px] transition-[width] duration-[260ms] ease-out"
                        style={{
                          width: `${deltaRatio}%`,
                          background: lvl.delta >= 0 ? 'rgba(90,154,239,0.5)' : 'rgba(232,117,117,0.5)'
                        }}
                      />
                    </div>

                    {/* Spacer */}
                    <div />

                    {/* Market Sell Volume */}
                    <div className="relative overflow-hidden flex items-center justify-center h-full">
                      {isActive && activeTrade?.side === 'sell' && (
                        <div aria-hidden="true" className="absolute inset-0 bg-white/[0.07]" />
                      )}
                      {lvl.mktSell > 0 && (
                        <span className="relative font-mono text-[9.5px] tabular-nums text-[#e87575]">
                          {lvl.mktSell}
                        </span>
                      )}
                    </div>

                    {/* Market Buy Volume */}
                    <div className="relative overflow-hidden flex items-center justify-center h-full">
                      {isActive && activeTrade?.side === 'buy' && (
                        <div aria-hidden="true" className="absolute inset-0 bg-white/[0.07]" />
                      )}
                      {lvl.mktBuy > 0 && (
                        <span className="relative font-mono text-[9.5px] tabular-nums text-[#5a9aef]">
                          {lvl.mktBuy}
                        </span>
                      )}
                    </div>

                    {/* Limit Bid */}
                    <div className="relative h-full overflow-hidden">
                      {i > centerIdx && lvl.lmtBid > 0 && (
                        <>
                          <div
                            aria-hidden="true"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-[15px] rounded-l-[2px] transition-[width] duration-[260ms] ease-out"
                            style={{
                              width: `${lvl.lmtBid}%`,
                              background: 'rgba(255,255,255,0.10)'
                            }}
                          />
                          <span className="absolute inset-0 flex items-center justify-end pr-1 font-mono text-[9px] tabular-nums text-[var(--color-ink-2)]">
                            {lvl.lmtBid}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Limit Ask */}
                    <div className="relative h-full overflow-hidden">
                      {isAsk && lvl.lmtAsk > 0 && (
                        <>
                          <div
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-[15px] rounded-r-[2px] transition-[width] duration-[260ms] ease-out"
                            style={{
                              width: `${lvl.lmtAsk}%`,
                              background: 'rgba(255,255,255,0.10)'
                            }}
                          />
                          <span className="absolute inset-0 flex items-center justify-start pl-1 font-mono text-[9px] tabular-nums text-[var(--color-ink-2)]">
                            {lvl.lmtAsk}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center overflow-hidden">
                      <span
                        className="font-mono text-[9.5px] tabular-nums text-[var(--color-ink-2)]"
                        style={{ fontWeight: isCurrent ? 600 : 400 }}
                      >
                        {lvl.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Pull/Stack */}
                    <div className="relative h-full overflow-hidden flex items-center justify-center">
                      {!isCurrent && lvl.pull !== 0 && Math.abs(i - centerIdx) <= 7 && (
                        <span
                          className="font-mono text-[9px] tabular-nums"
                          style={{
                            color: lvl.pull > 0 ? '#ffffff' : isAsk ? '#e87575' : '#5a9aef'
                          }}
                        >
                          {lvl.pull > 0 ? `+${lvl.pull}` : lvl.pull}
                        </span>
                      )}
                    </div>

                    {/* Spacer */}
                    <div />

                    {/* Avg Size */}
                    <div className="relative h-full overflow-hidden flex items-center">
                      <div
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[15px] bg-[rgba(255,255,255,0.10)] transition-[width] duration-[260ms] ease-out"
                        style={{ width: `${Math.min(100, (lvl.avgSize / 22) * 100)}%` }}
                      />
                      {lvl.avgSize >= 1 && (
                        <span
                          className="relative font-mono text-[9px] tabular-nums pl-1.5"
                          style={{
                            color: lvl.avgSize >= 12 ? '#ffffff' : 'var(--color-ink-2)',
                            fontWeight: lvl.avgSize >= 12 ? 600 : 400
                          }}
                        >
                          {lvl.avgSize.toFixed(lvl.avgSize < 10 ? 1 : 0)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Time & Sales */}
          <div className="flex flex-col min-h-0 overflow-hidden bg-white/[0.01]">
            <div className="px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-2)] text-center shrink-0 border-b border-white/[0.06]">
              Time & Sales
            </div>
            <div className="flex-1 px-2 py-1 overflow-hidden relative">
              <div className="absolute left-2 right-4 top-1 bottom-1 overflow-hidden">
                {trades.slice(0, 26).map((tr) => {
                  const sideColor = tr.side === 'buy' ? '#5a9aef' : '#e87575';
                  return (
                    <div
                      key={tr.id}
                      className="grid grid-cols-[44px_1fr_28px] items-center h-[16px] gap-1.5 font-mono text-[9px] tabular-nums transition-opacity duration-500"
                    >
                      <span className="text-[var(--color-ink-2)] text-[9px]">{tr.time}</span>
                      <span className="text-right" style={{ color: sideColor }}>
                        {tr.price.toFixed(2)}
                      </span>
                      <span
                        className="text-right"
                        style={{ color: sideColor, fontWeight: tr.size > 10 ? 600 : 400 }}
                      >
                        {tr.size}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
