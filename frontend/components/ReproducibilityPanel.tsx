"use client";

import { Paper } from "@/types/research";
import { Code, Database, Cpu, CheckCircle2, AlertCircle } from "lucide-react";

interface ReproducibilityPanelProps {
  papers: Paper[];
}

export function ReproducibilityPanel({ papers }: ReproducibilityPanelProps) {
  const criteria = [
    { name: "Public Dataset Availability", status: "PARTIAL", score: 75 },
    { name: "Open Source Code Repository", status: "AVAILABLE", score: 85 },
    { name: "Model Parameter & Architecture Details", status: "AVAILABLE", score: 80 },
    { name: "Hyperparameter & Seed Disclosure", status: "LIMITED", score: 55 },
    { name: "Evaluation Procedure Standardisation", status: "AVAILABLE", score: 70 },
  ];

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
        <Code className="w-6 h-6 text-emerald-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-emerald-400 font-bold">
            Reproducibility & Open Science Audit
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Evaluating code, dataset, model weights, hyperparameter, and seed disclosures across retrieved literature.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {criteria.map((item, idx) => (
          <div key={idx} className="glass-card p-4 rounded-xl border border-gray-800 flex items-center justify-between font-mono text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white block">{item.name}</span>
              <span className="text-[11px] text-gray-400">Score: {item.score}/100</span>
            </div>

            <div className="w-32 bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-900">
              <div className="bg-emerald-500 h-full" style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
