"use client";

import { ResearchStatus } from "@/types/research";
import { BookCheck, FileText, CheckCircle, AlertTriangle, HelpCircle, ShieldAlert, Sparkles, Scale } from "lucide-react";

interface DashboardProps {
  status: ResearchStatus;
}

export function Dashboard({ status }: DashboardProps) {
  const trustScore = status.trust_analysis?.overall_trust_score ?? 0;
  const confidenceLevel = status.trust_analysis?.confidence_level ?? "INSUFFICIENT_EVIDENCE";

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case "HIGH_CONFIDENCE":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">HIGH CONFIDENCE</span>;
      case "MODERATE_CONFIDENCE":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">MODERATE CONFIDENCE</span>;
      case "UNCERTAIN":
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">UNCERTAIN</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400">INSUFFICIENT EVIDENCE</span>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Verdict Bar */}
      {status.final_judgement && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Scale className="w-7 h-7 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Final Research Verdict</h2>
                <p className="text-xs text-gray-400 font-mono">Verified by Evidence Firewall</p>
              </div>
            </div>
            {getConfidenceBadge(confidenceLevel)}
          </div>
          <p className="text-base text-cyan-100 font-sans leading-relaxed">
            {status.final_judgement.main_conclusion}
          </p>
          <p className="text-xs text-gray-400 font-mono italic">
            {status.final_judgement.reasoning}
          </p>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Papers Analyzed</span>
            <BookCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{status.papers_found_count}</div>
          <p className="text-[11px] text-gray-400 font-mono">Peer-reviewed literature</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Claims Extracted</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{status.claims_extracted_count}</div>
          <p className="text-[11px] text-gray-400 font-mono">Empirical claim units</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Supported Claims</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400">{status.supported_claims_count}</div>
          <p className="text-[11px] text-gray-400 font-mono">Backed by literature</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Trust Score</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-cyan-400">{trustScore}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <p className="text-[11px] text-gray-400 font-mono">Transparent multi-factor</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-card border border-gray-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
            {status.supported_claims_count}
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase">Supported Evidence</div>
            <div className="text-sm font-bold text-white">Fully verified findings</div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-gray-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
            {status.contradictions.length}
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase">Contradictions Detected</div>
            <div className="text-sm font-bold text-white">Cross-paper variations</div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-gray-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold">
            {status.insufficient_claims_count}
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase">Insufficient Claims</div>
            <div className="text-sm font-bold text-white">Missing empirical proof</div>
          </div>
        </div>
      </div>
    </div>
  );
}
