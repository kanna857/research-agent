"use client";

import { useState, useEffect } from "react";
import { Network, Filter, Info, BookOpen, FileText, Database, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  name: string;
  group: string;
  details?: Record<string, any>;
}

interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  label: string;
}

interface EvidenceGraphProps {
  sessionId: string;
}

export function EvidenceGraph({ sessionId }: EvidenceGraphProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/graph/session/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setNodes(data.graph.nodes || []);
          setLinks(data.graph.links || []);
        }
      } catch (err) {
        console.error("Error fetching graph data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (sessionId) {
      fetchGraph();
    }
  }, [sessionId]);

  const getNodeColor = (group: string) => {
    switch (group) {
      case "paper": return "bg-cyan-500/20 border-cyan-500 text-cyan-400";
      case "author": return "bg-blue-500/20 border-blue-500 text-blue-400";
      case "claim": return "bg-emerald-500/20 border-emerald-500 text-emerald-400";
      case "evidence": return "bg-purple-500/20 border-purple-500 text-purple-400";
      case "dataset": return "bg-amber-500/20 border-amber-500 text-amber-400";
      case "method": return "bg-indigo-500/20 border-indigo-500 text-indigo-400";
      case "result": return "bg-rose-500/20 border-rose-500 text-rose-400";
      default: return "bg-gray-800 border-gray-700 text-gray-300";
    }
  };

  const filteredNodes = activeGroupFilter === "ALL" 
    ? nodes 
    : nodes.filter(n => n.group === activeGroupFilter.toLowerCase());

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = links.filter(l => filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target));

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <Network className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
              Interactive Evidence Knowledge Graph
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Visualizing Paper → Claim → Evidence → Dataset and Claim → Contradicting Paper
            </p>
          </div>
        </div>

        {/* Node Group Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {["ALL", "PAPER", "AUTHOR", "CLAIM", "EVIDENCE", "DATASET", "METHOD"].map((grp) => (
            <button
              key={grp}
              onClick={() => setActiveGroupFilter(grp)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                activeGroupFilter === grp
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center font-mono text-xs text-cyan-400 animate-pulse">
          Loading Evidence Knowledge Graph...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Graph Canvas */}
          <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-gray-800 space-y-4 min-h-[420px] relative overflow-hidden">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              <span>Nodes: {filteredNodes.length} • Relationships: {filteredLinks.length}</span>
              <span className="text-cyan-400 italic">Click node to inspect path</span>
            </div>

            {/* Visual Node Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${getNodeColor(node.group)} ${
                    selectedNode?.id === node.id ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20" : "hover:scale-[1.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-mono font-bold">
                    <span>{node.label}</span>
                    <span className="opacity-80">ID: {node.id.slice(0, 12)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{node.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Node Inspection Detail Drawer */}
          <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Info className="w-4 h-4" />
              <span>Node Inspector</span>
            </h4>

            {selectedNode ? (
              <div className="space-y-4 font-sans text-xs">
                <div>
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold block">Type:</span>
                  <span className="inline-block px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase mt-1">
                    {selectedNode.label}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold block">Identifier / Name:</span>
                  <p className="text-sm font-bold text-white mt-1 leading-snug">{selectedNode.name}</p>
                </div>

                {selectedNode.details && (
                  <div className="space-y-2 font-mono">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Node Attributes:</span>
                    <pre className="p-3 rounded-lg bg-gray-950 border border-gray-900 text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedNode.details, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Connected Links Section */}
                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold block">Connected Relationships:</span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {links
                      .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                      .map((l, idx) => (
                        <div key={idx} className="p-2 rounded bg-gray-900/80 border border-gray-800 text-gray-300 flex items-center justify-between">
                          <span className="text-cyan-400 font-semibold">{l.relationship}</span>
                          <span className="text-gray-400">{l.source === selectedNode.id ? `➔ ${l.target}` : `⬅ ${l.source}`}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-center font-mono text-xs text-gray-500 italic">
                Click any node in the graph to inspect detailed attributes, paper links, evidence provenance, and dataset connections.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
