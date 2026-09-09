"use client";

import { useState } from "react";
import { Claim, VerificationStatus } from "@/types/research";
import { Search, Filter, CheckCircle2, Info, XCircle, AlertTriangle, ExternalLink } from "lucide-react";

interface ClaimExplorerProps {
  claims: Claim[];
}

export function ClaimExplorer({ claims }: ClaimExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "SUPPORTED":
        return (
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✓ Evidence Verified</span>
          </span>
        );
      case "PARTIALLY_SUPPORTED":
        return (
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-[11px] font-bold flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>⚠ Needs Review</span>
          </span>
        );
      case "CONTRADICTED":
        return (
          <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-[11px] font-bold flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>✕ Unsupported Claim</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[11px] font-bold flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>⚠ Needs Review</span>
          </span>
        );
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.statement.toLowerCase().includes(searchTerm.toLowerCase()) || (c.paper_title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
            Scientific Claim Explorer
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Granular claim-level evidence units with verification provenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono w-48"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-xs text-cyan-400 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
          >
            <option value="ALL">All Statuses ({claims.length})</option>
            <option value="SUPPORTED">Supported</option>
            <option value="PARTIALLY_SUPPORTED">Partially Supported</option>
            <option value="CONTRADICTED">Contradicted</option>
            <option value="INSUFFICIENT_EVIDENCE">Insufficient Evidence</option>
          </select>
        </div>
      </div>

      {/* Claim Cards Grid */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            className="glass-card p-5 rounded-xl border border-gray-800 space-y-3 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                {getStatusBadge(claim.verification_status)}
                <span className="font-mono text-xs text-cyan-400 font-bold">{claim.confidence_score}% Confidence</span>
              </div>
              <span className="font-mono text-[11px] text-gray-400">Paper ID: {claim.paper_id}</span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">{claim.statement}</h4>

            <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-900 space-y-1.5 text-xs">
              <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block">Retrieved Evidence Snippet:</span>
              <p className="text-gray-300 font-sans italic leading-relaxed">"{claim.evidence_text}"</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-gray-400 pt-1">
              <div>Method: <span className="text-gray-200">{claim.methodology || "N/A"}</span></div>
              <div>Dataset: <span className="text-gray-200">{claim.dataset || "N/A"}</span></div>
              <div>Metrics: <span className="text-gray-200">{claim.metrics || "N/A"}</span></div>
              <div>Sample Size: <span className="text-gray-200">{claim.sample_size || "N/A"}</span></div>
            </div>

            <div className="text-xs text-gray-400 font-mono pt-2 border-t border-gray-800/60">
              <span className="text-cyan-400">Provenance:</span> {claim.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
