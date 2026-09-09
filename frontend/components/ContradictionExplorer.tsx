"use client";

import { Contradiction } from "@/types/research";
import { AlertOctagon, GitCompare, HelpCircle, Layers } from "lucide-react";

interface ContradictionExplorerProps {
  contradictions: Contradiction[];
}

export function ContradictionExplorer({ contradictions }: ContradictionExplorerProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "direct_contradiction":
        return <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">DIRECT CONTRADICTION</span>;
      case "different_datasets":
        return <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">DIFFERENT DATASETS</span>;
      case "different_populations":
        return <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">LANGUAGE / POPULATION VARIANCE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">EXPERIMENTAL CONDITION VARIANCE</span>;
    }
  };

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-6">
      <div className="flex items-center space-x-3">
        <GitCompare className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-amber-400 font-bold">
            Cross-Paper Contradiction Explorer
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Distinguishing direct contradictions from dataset, metric, population, and prompt variance.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {contradictions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-gray-500 glass-card rounded-xl">
            No direct or contextual paper contradictions detected across retrieved literature.
          </div>
        ) : (
          contradictions.map((c) => (
            <div
              key={c.contradiction_id}
              className="glass-card p-5 rounded-xl border border-amber-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                {getTypeBadge(c.type)}
                <span className="font-mono text-[11px] text-gray-400">ID: {c.contradiction_id}</span>
              </div>

              <p className="text-sm font-sans text-gray-200 leading-relaxed">
                {c.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-gray-800/60">
                <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-900">
                  <span className="text-gray-400 block text-[10px]">Claim A (Paper 1):</span>
                  <span className="text-cyan-400 font-semibold">{c.paper_a_id}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-900">
                  <span className="text-gray-400 block text-[10px]">Claim B (Paper 2):</span>
                  <span className="text-rose-400 font-semibold">{c.paper_b_id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
