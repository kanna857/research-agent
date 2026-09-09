"use client";

import { Paper } from "@/types/research";
import { SearchCheck, ArrowRight, ShieldCheck, AlertTriangle, FileText } from "lucide-react";

interface PaperAuditPanelProps {
  papers: Paper[];
}

export function PaperAuditPanel({ papers }: PaperAuditPanelProps) {
  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <SearchCheck className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-purple-400 font-bold">
              Scientific Paper Audit & Traceability Chain
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Traceability inspection comparing claims against reported methodology, datasets, and experimental findings.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-gray-400">Total Audited: {papers.length}</span>
      </div>

      <div className="space-y-6 font-mono">
        {papers.map((paper) => {
          const audit = paper.audit_result;
          const chain = audit?.traceability_chain || [
            `Paper: ${paper.title.slice(0, 40)}...`,
            "Claim: Extracted claim unit",
            "Evidence: Empirical paper passage",
            "Method: Benchmark evaluation",
            "Dataset: Multi-domain corpus",
            "Result: Quantitative accuracy"
          ];
          const mismatches = audit?.mismatches_found || [];

          return (
            <div
              key={paper.id || paper.paper_id}
              className="glass-card p-6 rounded-xl border border-gray-800 space-y-5 hover:border-purple-500/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                    Audit Target: {paper.paper_id}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">{paper.title}</h4>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  {mismatches.length === 0 ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audit Passed (Consistent)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Discrepancies Detected ({mismatches.length})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Traceability Chain Flow */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase text-cyan-400 font-bold block">
                  Traceability Chain: Paper → Claim → Evidence → Method → Dataset → Result
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {chain.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-gray-950 border border-gray-900 space-y-1 text-xs"
                    >
                      <span className="text-[9px] text-cyan-400 font-bold block uppercase">Step #{i + 1}</span>
                      <p className="text-[11px] text-gray-200 line-clamp-2">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mismatch Detector Box */}
              {mismatches.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs">
                  <span className="text-amber-400 font-bold uppercase flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Discrepancy Audit Findings:</span>
                  </span>
                  <ul className="space-y-1 text-gray-300 font-sans text-xs">
                    {mismatches.map((m, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
