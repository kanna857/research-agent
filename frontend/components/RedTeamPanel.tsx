"use client";

import { RedTeamFinding } from "@/types/research";
import { ShieldAlert, AlertTriangle, ChevronRight } from "lucide-react";

interface RedTeamPanelProps {
  findings: RedTeamFinding[];
}

export function RedTeamPanel({ findings }: RedTeamPanelProps) {
  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-6">
      <div className="flex items-center space-x-3">
        <ShieldAlert className="w-6 h-6 text-rose-400" />
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-rose-400 font-bold">
            Adversarial Red-Team Audit
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Active hypothesis challenging: Methodological flaws, dataset constraints, overgeneralization risks.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {findings.map((f, i) => (
          <div
            key={i}
            className="glass-card p-4 rounded-xl border border-rose-500/30 space-y-2 text-xs font-mono"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold text-[10px]">
                {f.category.replace("_", " ")}
              </span>
              <span className="text-rose-400 font-bold">Severity: {f.severity}</span>
            </div>
            <p className="text-gray-200 font-sans leading-relaxed text-sm">
              {f.challenge}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
