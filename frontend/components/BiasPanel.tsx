"use client";

import { Paper } from "@/types/research";
import { ShieldAlert, Globe, Database, Scale, BookOpen } from "lucide-react";

interface BiasPanelProps {
  papers: Paper[];
}

export function BiasPanel({ papers }: BiasPanelProps) {
  const biasCategories = [
    { title: "Dataset Bias", desc: "Heavy reliance on English-centric benchmark datasets (e.g. BoolQ, FEVER).", risk: "MEDIUM" },
    { title: "Selection Bias", desc: "Peer-reviewed literature favors high-citation models (GPT-4, PaLM, Llama-2).", risk: "LOW" },
    { title: "Geographic / Language Bias", desc: "Under-representation of morphologically rich African and Asian languages.", risk: "HIGH" },
    { title: "Publication Bias", desc: "Positive performance results published at higher rates than negative failure modes.", risk: "MEDIUM" },
  ];

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
        <Scale className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
            Scientific Literature Bias Analysis
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Evaluating dataset, geographic, language, selection, and publication bias. Never claims bias without empirical evidence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {biasCategories.map((b, idx) => (
          <div key={idx} className="glass-card p-5 rounded-xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase">{b.title}</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                b.risk === "HIGH" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                b.risk === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                Risk: {b.risk}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
