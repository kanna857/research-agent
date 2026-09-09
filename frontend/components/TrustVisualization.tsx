"use client";

import { TrustAnalysis } from "@/types/research";
import { Sparkles, CheckCircle2, ShieldCheck, Scale, Award } from "lucide-react";

interface TrustVisualizationProps {
  trustAnalysis?: TrustAnalysis;
}

export function TrustVisualization({ trustAnalysis }: TrustVisualizationProps) {
  if (!trustAnalysis) return null;

  const { overall_trust_score, confidence_level, breakdown, explanation } = trustAnalysis;

  const factors = [
    { label: "Evidence Quality", score: breakdown.evidence_quality, weight: "25%", color: "bg-cyan-500" },
    { label: "Source Reliability", score: breakdown.source_reliability, weight: "20%", color: "bg-emerald-500" },
    { label: "Independent Agreement", score: breakdown.independent_agreement, weight: "20%", color: "bg-blue-500" },
    { label: "Methodology Quality", score: breakdown.methodology_quality, weight: "15%", color: "bg-indigo-500" },
    { label: "Reproducibility", score: breakdown.reproducibility, weight: "10%", color: "bg-purple-500" },
    { label: "Citation Support", score: breakdown.citation_support, weight: "10%", color: "bg-pink-500" },
  ];

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
              Transparent Multi-Factor Trust Engine Breakdown
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Explainable Trust Score calculation with weighted scientific factor metrics.
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-3xl font-bold text-cyan-400">{overall_trust_score}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{confidence_level}</span>
        </div>
      </div>

      {/* Factor Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((f, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-200 font-semibold">{f.label} <span className="text-gray-500 text-[10px]">({f.weight})</span></span>
              <span className="font-bold text-cyan-400">{f.score}/100</span>
            </div>
            <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-900">
              <div
                className={`${f.color} h-full transition-all duration-500`}
                style={{ width: `${f.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Formula Rationale */}
      <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 text-xs font-mono text-gray-300 leading-relaxed">
        <span className="text-cyan-400 font-bold uppercase block mb-1">Scoring Formula Explanation:</span>
        {explanation}
      </div>
    </div>
  );
}
