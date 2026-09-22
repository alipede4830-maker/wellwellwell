import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  X,
  ArrowUpRight,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';
import * as d3 from 'd3';
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from '../data/flwContent';
import { GraphNode } from '../types';

interface BrainViewProps {
  onBack: () => void;
}

interface SimNode extends d3.SimulationNodeDatum, Omit<GraphNode, 'x' | 'y'> {
  color?: string;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
}

export const BrainView: React.FC<BrainViewProps> = ({ onBack }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNode, setSelectedNode] = useState<GraphNode | SimNode | null>(KNOWLEDGE_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | SimNode | null>(null);
  const [isSimRunning, setIsSimRunning] = useState(true);

  const categories = ['All', 'Foundation', 'Structure', 'Orderflow', 'Psychology', 'Tools'];

  const categoryColors: Record<string, string> = {
    Foundation: '#3a8bff',
    Structure: '#7ab3ff',
    Orderflow: '#22d68f',
    Psychology: '#ff4a4a',
    Tools: '#E2B03D'
  };

  // Connected nodes for the selected node
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const ids = new Set<string>();
    KNOWLEDGE_EDGES.forEach((edge) => {
      if (edge.from === selectedNode.id) ids.add(edge.to);
      if (edge.to === selectedNode.id) ids.add(edge.from);
    });
    return ids;
  }, [selectedNode]);

  // Setup D3 Force Simulation & Zoom
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 1000;
    const height = containerRef.current.clientHeight || 700;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear on mount/remount

    // Container for zoomable content
    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom setup
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Initial zoom center
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
    );

    // Deep clone nodes and links to prevent simulation mutations on immutable arrays
    const nodes: SimNode[] = KNOWLEDGE_NODES.map((n) => ({
      ...n,
      color: categoryColors[n.category] || '#3a8bff',
      x: n.x ? (n.x - 480) * 1.8 : (Math.random() - 0.5) * 400,
      y: n.y ? (n.y - 210) * 1.8 : (Math.random() - 0.5) * 400
    }));

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const links: SimLink[] = KNOWLEDGE_EDGES.filter(
      (e) => nodeMap.has(e.from) && nodeMap.has(e.to)
    ).map((e) => ({
      source: e.from,
      target: e.to
    }));

    // Forces
    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(90)
          .strength(0.4)
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('collision', d3.forceCollide().radius(36))
      .force('center', d3.forceCenter(0, 0).strength(0.05));

    // Render Links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.12)')
      .attr('stroke-width', 1.2);

    // Render Nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer glow circle
    node
      .append('circle')
      .attr('r', 16)
      .attr('fill', (d) => d.color || '#3a8bff')
      .attr('fill-opacity', 0.15)
      .attr('class', 'glow-ring');

    // Node core circle
    node
      .append('circle')
      .attr('r', 7)
      .attr('fill', (d) => d.color || '#3a8bff')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.85);

    // Node text label
    node
      .append('text')
      .attr('dy', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-ink-2)')
      .attr('font-size', '11px')
      .attr('font-family', 'var(--font-sans)')
      .attr('font-weight', '500')
      .style('pointer-events', 'none')
      .text((d) => d.label);

    // Interactivity
    node.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedNode(d);
    });

    node.on('mouseenter', (event, d) => {
      setHoveredNode(d);
    });

    node.on('mouseleave', () => {
      setHoveredNode(null);
    });

    svg.on('click', () => {
      // clicking background closes selection if wanted
    });

    // Tick update
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x || 0)
        .attr('y1', (d) => (d.source as SimNode).y || 0)
        .attr('x2', (d) => (d.target as SimNode).x || 0)
        .attr('y2', (d) => (d.target as SimNode).y || 0);

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  // Update styles and highlights based on selectedNode, hoveredNode, search, category
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const activeNode = hoveredNode || selectedNode;

    // Highlight links
    svg
      .selectAll<SVGLineElement, SimLink>('.links line')
      .transition()
      .duration(150)
      .attr('stroke', (d) => {
        const s = (d.source as SimNode).id;
        const t = (d.target as SimNode).id;
        if (activeNode && (s === activeNode.id || t === activeNode.id)) {
          return '#3a8bff';
        }
        return 'rgba(255, 255, 255, 0.08)';
      })
      .attr('stroke-width', (d) => {
        const s = (d.source as SimNode).id;
        const t = (d.target as SimNode).id;
        if (activeNode && (s === activeNode.id || t === activeNode.id)) {
          return 2.5;
        }
        return 1.2;
      })
      .attr('stroke-opacity', (d) => {
        const s = (d.source as SimNode).id;
        const t = (d.target as SimNode).id;
        if (activeNode && (s === activeNode.id || t === activeNode.id)) {
          return 0.9;
        }
        return 0.3;
      });

    // Highlight nodes
    svg.selectAll<SVGGElement, SimNode>('.node-group').each(function (d) {
      const gNode = d3.select(this);
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchesSearch = !search || d.label.toLowerCase().includes(search.toLowerCase());
      const isSelected = selectedNode?.id === d.id;
      const isHovered = hoveredNode?.id === d.id;
      const isConnected = selectedNode && connectedNodeIds.has(d.id);

      const isDimmed =
        (!matchesCategory || !matchesSearch) ||
        (activeNode && !isSelected && !isHovered && !isConnected);

      gNode
        .transition()
        .duration(150)
        .style('opacity', isDimmed ? 0.18 : 1);

      gNode
        .select('.glow-ring')
        .transition()
        .duration(150)
        .attr('r', isSelected || isHovered ? 24 : 16)
        .attr('fill-opacity', isSelected || isHovered ? 0.4 : 0.15);

      gNode
        .select('text')
        .attr('fill', isSelected ? '#ffffff' : 'var(--color-ink-2)')
        .attr('font-weight', isSelected ? '700' : '500');
    });
  }, [selectedNode, hoveredNode, search, selectedCategory, connectedNodeIds]);

  // Zoom controls
  const handleZoom = (scaleFactor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy, scaleFactor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !containerRef.current || !zoomBehaviorRef.current) return;
    const width = containerRef.current.clientWidth || 1000;
    const height = containerRef.current.clientHeight || 700;
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(400)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
      );
  };

  return (
    <div className="w-full h-screen relative bg-[#09090c] overflow-hidden flex flex-col pt-16">
      {/* Top Floating Bar */}
      <div className="absolute top-20 left-6 right-6 z-30 pointer-events-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="pointer-events-auto flex items-center gap-4 bg-[var(--color-surface-1)]/90 backdrop-blur-md border border-[var(--color-hair-2)] px-4 py-2.5 rounded-2xl shadow-xl">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-mono text-[var(--color-ink-3)] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <div className="w-px h-4 bg-white/[0.1]" />
          <div>
            <span className="font-display font-bold text-white text-[15px] tracking-tight">
              The Brain
            </span>
            <span className="text-[11px] font-mono text-[#3a8bff] ml-2">
              {KNOWLEDGE_NODES.length} Concepts
            </span>
          </div>
        </div>

        {/* Center: Search & Categories */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[var(--color-surface-1)]/90 backdrop-blur-md border border-[var(--color-hair-2)] p-1.5 rounded-2xl shadow-xl">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--color-ink-4)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-[12.5px] placeholder-[var(--color-ink-4)] focus:outline-none focus:border-[#3a8bff] w-36 sm:w-48"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'text-[var(--color-ink-3)] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Zoom & Control Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[var(--color-surface-1)]/90 backdrop-blur-md border border-[var(--color-hair-2)] p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => handleZoom(1.3)}
            className="p-2 rounded-xl text-[var(--color-ink-3)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.75)}
            className="p-2 rounded-xl text-[var(--color-ink-3)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl text-[var(--color-ink-3)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen D3 Force Canvas */}
      <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute bottom-6 right-6 w-full max-w-sm z-30 pointer-events-auto">
          <div className="p-6 rounded-2xl bg-[var(--color-surface-1)]/95 backdrop-blur-xl border border-[var(--color-hair-2)] shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider mb-2"
                  style={{
                    color: categoryColors[selectedNode.category] || '#3a8bff',
                    backgroundColor: `${categoryColors[selectedNode.category] || '#3a8bff'}18`,
                    border: `1px solid ${categoryColors[selectedNode.category] || '#3a8bff'}33`
                  }}
                >
                  {selectedNode.category}
                </span>
                <h3 className="font-display font-bold text-[20px] text-white tracking-tight">
                  {selectedNode.label}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-[var(--color-ink-4)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13.5px] text-[var(--color-ink-2)] leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Connected Concepts */}
            <div className="pt-3 border-t border-[var(--color-hair-1)]">
              <span className="text-[11px] font-mono text-[var(--color-ink-4)] uppercase tracking-wider block mb-2">
                Connected Nodes ({connectedNodeIds.size})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {Array.from(connectedNodeIds).map((id) => {
                  const node = KNOWLEDGE_NODES.find((n) => n.id === id);
                  if (!node) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedNode(node)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#3a8bff]/15 hover:text-[#3a8bff] border border-white/[0.06] text-[12px] font-mono text-[var(--color-ink-2)] transition-colors cursor-pointer"
                    >
                      {node.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
