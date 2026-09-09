"use client";

import { useState } from "react";
import { Claim } from "@/types/research";
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, Info, ExternalLink } from "lucide-react";

interface ConfidenceMapProps {
  claims: Claim[];
}

export function ConfidenceMap({ claims }: ConfidenceMapProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUPPORTED":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold"><CheckCircle2 className="w-3.5 h-3.5" /><span>SUPPORTED</span></span>;
      case "PARTIALLY_SUPPORTED":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold"><Info className="w-3.5 h-3.5" /><span>PARTIALLY SUPPORTED</span></span>;
      case "CONTRADICTED":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold"><XCircle className="w-3.5 h-3.5" /><span>CONTRADICTED</span></span>;
      default:
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold"><AlertTriangle className="w-3.5 h-3.5" /><span>INSUFFICIENT EVIDENCE</span></span>;
    }
  };

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
            Visual Claim Confidence Map
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Click any claim to inspect underlying empirical evidence & source citation.
          </p>
        </div>
        <span className="text-xs font-mono text-gray-400">Total Claims: {claims.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => setSelectedClaim(claim)}
            className="glass-card p-5 rounded-xl border border-gray-800/80 hover:border-cyan-500/50 hover:bg-gray-800/40 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              {getStatusBadge(claim.verification_status)}
              <span className="font-mono text-xs font-bold text-cyan-400">{claim.confidence_score}% CONFIDENCE</span>
            </div>

            <p className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
              {claim.statement}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-2 border-t border-gray-800/60">
              <span className="truncate max-w-[200px]">Source: {claim.paper_title || claim.paper_id}</span>
              <span className="text-cyan-400 group-hover:underline flex items-center space-x-1">
                <span>Inspect Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-gray-800 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(selectedClaim.verification_status)}
                  <span className="font-mono text-xs text-cyan-400">Confidence Score: {selectedClaim.confidence_score}%</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{selectedClaim.statement}</h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">Source Paper:</span>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 font-mono text-xs">
                  {selectedClaim.paper_title || selectedClaim.paper_id}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">Extracted Empirical Evidence:</span>
                <p className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 leading-relaxed italic">
                  "{selectedClaim.evidence_text}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block">Methodology:</span>
                  <span className="text-white font-semibold">{selectedClaim.methodology || "N/A"}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block">Dataset:</span>
                  <span className="text-white font-semibold">{selectedClaim.dataset || "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">Verification Explanation:</span>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {selectedClaim.explanation}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-5 py-2 rounded-xl bg-gray-800 text-white font-mono text-xs hover:bg-gray-700 transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
