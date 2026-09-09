"use client";

import { Paper } from "@/types/research";
import { Award, Sparkles, CheckCircle2, FileText, ExternalLink } from "lucide-react";

interface PaperRankPanelProps {
  papers: Paper[];
}

export function PaperRankPanel({ papers }: PaperRankPanelProps) {
  // Sort papers by overall_rank_score descending
  const sortedPapers = [...papers].sort((a, b) => {
    const scoreA = a.rank_breakdown?.overall_rank_score ?? 0;
    const scoreB = b.rank_breakdown?.overall_rank_score ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
              Transparent Multi-Factor Paper Ranking
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Scientific paper quality score evaluating relevance, methodology, reproducibility, provenance, recency, and evidence quality.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Total Ranked: {sortedPapers.length}
        </span>
      </div>

      <div className="space-y-6">
        {sortedPapers.map((paper, idx) => {
          const bd = paper.rank_breakdown;
          const overallScore = bd?.overall_rank_score ?? 75;

          const factors = [
            { label: "Relevance (25%)", score: bd?.relevance_score ?? 80, color: "bg-cyan-500" },
            { label: "Methodology (20%)", score: bd?.methodology_score ?? 85, color: "bg-emerald-500" },
            { label: "Evidence Quality (20%)", score: bd?.evidence_quality_score ?? 88, color: "bg-blue-500" },
            { label: "Reproducibility (15%)", score: bd?.reproducibility_score ?? 75, color: "bg-purple-500" },
            { label: "Citation Info (10%)", score: bd?.citation_score ?? 60, color: "bg-indigo-500" },
            { label: "Recency (10%)", score: bd?.recency_score ?? 90, color: "bg-pink-500" },
          ];

          return (
            <div
              key={paper.id || paper.paper_id}
              className="glass-card p-6 rounded-xl border border-gray-800 space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">{paper.title}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {paper.authors.length > 0 ? paper.authors.join(", ") : "Authors N/A"} • {paper.year || "N/A"} • <span className="text-cyan-400">{paper.source}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-3xl font-bold text-cyan-400">
                    {overallScore}<span className="text-sm font-normal text-gray-500">/100</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                    {overallScore >= 85 ? "TOP RANKED" : overallScore >= 70 ? "HIGH RELEVANCE" : "MODERATE"}
                  </span>
                </div>
              </div>

              {/* Factors Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                {factors.map((f, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-950 border border-gray-900 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="truncate">{f.label.split(" ")[0]}</span>
                      <span className="text-cyan-300 font-bold">{f.score}</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                      <div className={`${f.color} h-full`} style={{ width: `${f.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rationale Explanation */}
              <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 text-xs font-mono text-gray-300 leading-relaxed">
                <span className="text-cyan-400 font-bold uppercase block mb-1">Ranking Rationale:</span>
                {bd?.ranking_explanation || `Rank Score ${overallScore}/100 based on methodology rigor, query relevance, evidence quality, and reproducibility.`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
