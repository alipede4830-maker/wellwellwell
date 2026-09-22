import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MotionReveal } from './MotionReveal';
import { Stat } from './Stat';
import { NavRoute } from '../types';

interface KnowledgeGraphSectionProps {
  onNavigate: (route: NavRoute) => void;
}

export const KnowledgeGraphSection: React.FC<KnowledgeGraphSectionProps> = ({ onNavigate }) => {
  const nodes = [
    { name: 'Toolkit', x: 500, y: 180, r: 24, isCenter: true },
    { name: 'AMT', x: 300, y: 100, r: 16 },
    { name: 'VWAP', x: 700, y: 110, r: 16 },
    { name: 'VLD', x: 350, y: 260, r: 15 },
    { name: 'OS9', x: 650, y: 270, r: 15 },
    { name: 'Psychology', x: 200, y: 180, r: 17 },
    { name: 'Software', x: 800, y: 190, r: 17 }
  ];

  const secondaryNodes = [
    { x: 180, y: 70, r: 4 },
    { x: 250, y: 160, r: 5 },
    { x: 820, y: 80, r: 4 },
    { x: 760, y: 170, r: 5 },
    { x: 250, y: 290, r: 4 },
    { x: 420, y: 310, r: 5 },
    { x: 750, y: 300, r: 4 },
    { x: 580, y: 310, r: 5 },
    { x: 130, y: 140, r: 4 },
    { x: 880, y: 150, r: 4 }
  ];

  const lines = [
    // Center to primary nodes
    { x1: 500, y1: 180, x2: 300, y2: 100, stroke: 'rgba(58,139,255,0.22)' },
    { x1: 500, y1: 180, x2: 700, y2: 110, stroke: 'rgba(58,139,255,0.22)' },
    { x1: 500, y1: 180, x2: 350, y2: 260, stroke: 'rgba(58,139,255,0.22)' },
    { x1: 500, y1: 180, x2: 650, y2: 270, stroke: 'rgba(58,139,255,0.22)' },
    { x1: 500, y1: 180, x2: 200, y2: 180, stroke: 'rgba(58,139,255,0.22)' },
    { x1: 500, y1: 180, x2: 800, y2: 190, stroke: 'rgba(58,139,255,0.22)' },
    // Outer connections
    { x1: 300, y1: 100, x2: 180, y2: 70, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 300, y1: 100, x2: 250, y2: 160, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 700, y1: 110, x2: 820, y2: 80, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 700, y1: 110, x2: 760, y2: 170, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 350, y1: 260, x2: 250, y2: 290, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 350, y1: 260, x2: 420, y2: 310, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 650, y1: 270, x2: 750, y2: 300, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 650, y1: 270, x2: 580, y2: 310, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 200, y1: 180, x2: 130, y2: 140, stroke: 'rgba(255,255,255,0.06)' },
    { x1: 800, y1: 190, x2: 880, y2: 150, stroke: 'rgba(255,255,255,0.06)' }
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
            eyebrow="04 · Knowledge Graph"
            title="The"
            accent="brain."
            accentColor="red"
            align="centered"
            description="Every concept, every connection, mapped in one interactive knowledge graph."
            className="mb-14"
          />
        </MotionReveal>

        {/* Constellation Preview Card linking to /brain wrapped in MotionReveal */}
        <MotionReveal delay={0.08}>
          <div
            onClick={() => onNavigate('brain')}
            className="rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,var(--color-surface-2),var(--color-surface-1))] border border-[var(--color-hair-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)] cursor-pointer group/card transition-all duration-500 hover:border-[var(--color-hair-3)] hover:-translate-y-[2px] overflow-hidden"
          >
            <div className="relative h-[300px] md:h-[360px] overflow-hidden bg-dotgrid">
              {/* Ambient center glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(58,139,255,0.25), transparent 60%)'
                }}
              />

              {/* SVG Constellation Graph */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 360"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Connection Lines */}
                {lines.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke={l.stroke}
                    strokeWidth="1"
                  />
                ))}

                {/* Secondary Outer Dots */}
                {secondaryNodes.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={pt.r}
                    fill="rgba(255,255,255,0.15)"
                  />
                ))}

                {/* Core Nodes */}
                {nodes.map((node) => (
                  <g key={node.name} className="transition-transform duration-300">
                    {/* Halo */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={node.isCenter ? 'rgba(58,139,255,0.18)' : 'rgba(58,139,255,0.12)'}
                      stroke={node.isCenter ? 'rgba(58,139,255,0.5)' : 'rgba(58,139,255,0.3)'}
                      strokeWidth="1.5"
                    />
                    {/* Center Dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.isCenter ? 7 : 4.5}
                      fill="var(--color-brand-blue)"
                      opacity="0.9"
                    />
                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + (node.isCenter ? 36 : 26)}
                      textAnchor="middle"
                      className="font-mono text-[11px] font-semibold fill-[#b4b8c5] uppercase tracking-wider select-none pointer-events-none"
                    >
                      {node.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bottom Card Bar with Animated Stats matching real site */}
            <div className="p-8 md:p-10 border-t border-[var(--color-hair-1)] -mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] text-[13.5px] font-semibold group-hover/card:gap-3 transition-all">
                <span>Explore the graph</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex flex-row gap-10 shrink-0">
                <Stat value={13} label="Topics" accent="blue" size="md" />
                <Stat value={140} suffix="+" label="Concepts" accent="red" size="md" />
                <Stat value={200} suffix="+" label="Connections" accent="success" size="md" />
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
};
