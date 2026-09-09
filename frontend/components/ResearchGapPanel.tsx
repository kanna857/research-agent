"use client";

import { ResearchGap } from "@/types/research";
import { Search, Compass, BookOpen, Layers } from "lucide-react";

interface ResearchGapPanelProps {
  gaps: ResearchGap[];
}

export function ResearchGapPanel({ gaps }: ResearchGapPanelProps) {
  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
        <Compass className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
            Literature-Linked Research Gap Finder
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Understudied areas, missing datasets, missing populations, and unresolved empirical contradictions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gaps.map((gap) => (
          <div key={gap.gap_id} className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-bold uppercase">
              {gap.understudied_area}
            </span>
            <h4 className="text-sm font-bold text-white leading-snug">{gap.title}</h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">{gap.description}</p>
            <div className="text-[11px] font-mono text-gray-500 pt-2 border-t border-gray-900">
              Connected Papers: {gap.connected_paper_ids.length > 0 ? gap.connected_paper_ids.join(", ") : "Literature wide"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
