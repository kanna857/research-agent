"use client";

import { TrustAnalysis } from "@/types/research";
import { HelpCircle, CheckCircle2, AlertTriangle, FileQuestion, ArrowUpRight } from "lucide-react";

interface UncertaintyPanelProps {
  trustAnalysis?: TrustAnalysis;
}

export function UncertaintyPanel({ trustAnalysis }: UncertaintyPanelProps) {
  if (!trustAnalysis) return null;

  const { confidence_level, knowns, unknowns, missing_evidence } = trustAnalysis;

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
        <HelpCircle className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-amber-400 font-bold">
            Uncertainty Engine & Evidence Sufficiency Gate
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Explicitly identifying knowns, unknowns, missing evidence, and confidence bounds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Knowns */}
        <div className="glass-card p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase text-[11px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Empirically Known</span>
          </div>
          <ul className="space-y-2 text-gray-300 font-sans text-xs">
            {knowns.map((k, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-400">•</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unknowns */}
        <div className="glass-card p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase text-[11px]">
            <AlertTriangle className="w-4 h-4" />
            <span>Unresolved Unknowns</span>
          </div>
          <ul className="space-y-2 text-gray-300 font-sans text-xs">
            {unknowns.map((u, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-amber-400">•</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Evidence */}
        <div className="glass-card p-5 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase text-[11px]">
            <FileQuestion className="w-4 h-4" />
            <span>Missing Evidence</span>
          </div>
          <ul className="space-y-2 text-gray-300 font-sans text-xs">
            {missing_evidence.map((m, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-rose-400">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
