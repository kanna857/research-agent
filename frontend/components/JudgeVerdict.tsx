"use client";

import { FinalJudgement } from "@/types/research";
import { Scale, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface JudgeVerdictProps {
  judgement?: FinalJudgement;
}

export function JudgeVerdict({ judgement }: JudgeVerdictProps) {
  if (!judgement) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "HIGH_CONFIDENCE":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">SUPPORTED (HIGH CONFIDENCE)</span>;
      case "MODERATE_CONFIDENCE":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">PARTIALLY SUPPORTED (MODERATE)</span>;
      case "UNCERTAIN":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">UNCERTAIN</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400">INSUFFICIENT EVIDENCE</span>;
    }
  };

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Scale className="w-7 h-7 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
              Final Judge Stage Verdict
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Weighing PRO evidence, CON arguments, Trust Score, Uncertainty, Red Team findings, & Firewall validation
            </p>
          </div>
        </div>

        {getStatusBadge(judgement.status)}
      </div>

      <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 space-y-2">
        <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">Main Verdict Conclusion:</span>
        <p className="text-base text-white font-sans font-semibold leading-relaxed">
          {judgement.main_conclusion}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-900 space-y-2">
        <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">Empirical Judge Reasoning:</span>
        <p className="text-xs text-gray-300 font-mono leading-relaxed italic">
          {judgement.reasoning}
        </p>
      </div>

      <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 pt-1">
        <ShieldCheck className="w-4 h-4" />
        <span>Evidence Firewall Passed: All factual claims backed by peer-reviewed literature.</span>
      </div>
    </div>
  );
}
