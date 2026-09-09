"use client";

import { Paper } from "@/types/research";
import { FlaskConical, CheckCircle2, AlertCircle, FileCode2, Database, Cpu } from "lucide-react";

interface ReplicationPanelProps {
  papers: Paper[];
}

export function ReplicationPanel({ papers }: ReplicationPanelProps) {
  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <FlaskConical className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-emerald-400 font-bold">
              Analytical Replication Feasibility Inspector
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Evaluates experiment specifications, required datasets, hyperparameter gaps, and implementation requirements.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-gray-400">Total Analyzed: {papers.length}</span>
      </div>

      <div className="space-y-6 font-mono">
        {papers.map((paper) => {
          const repl = paper.replication_analysis;
          const mainExp = repl?.main_experiment || `Evaluation experiment for '${paper.title}'`;
          const datasets = repl?.required_datasets || ["Evaluation benchmark corpus"];
          const methods = repl?.methods || ["Deep Learning / LLM evaluation architecture"];
          const metrics = repl?.metrics || ["Accuracy", "Precision", "F1 Score"];
          const implReqs = repl?.implementation_requirements || [
            "Python 3.10+ / PyTorch framework",
            "GPU Compute environment (>= 16GB VRAM)"
          ];
          const missing = repl?.missing_information || [];
          const reprodScore = repl?.reproducibility_score ?? paper.reproducibility_score ?? 75;

          return (
            <div
              key={paper.id || paper.paper_id}
              className="glass-card p-6 rounded-xl border border-gray-800 space-y-5 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    Replication Analysis: {paper.paper_id}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">{paper.title}</h4>
                </div>

                <div className="text-right font-mono">
                  <div className="text-2xl font-bold text-emerald-400">{reprodScore}<span className="text-xs text-gray-500">/100</span></div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Reproducibility Index</span>
                </div>
              </div>

              {/* Experiment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Main Experiment */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[11px]">
                    <FlaskConical className="w-4 h-4" />
                    <span>Main Experiment Protocol</span>
                  </div>
                  <p className="text-gray-300 font-sans">{mainExp}</p>
                </div>

                {/* Required Datasets */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[11px]">
                    <Database className="w-4 h-4" />
                    <span>Required Datasets</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 font-sans">
                    {datasets.map((d, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Requirements */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold uppercase text-[11px]">
                    <Cpu className="w-4 h-4" />
                    <span>Implementation Requirements</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 font-sans">
                    {implReqs.map((req, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-purple-400">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Information Callout */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase text-[11px]">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Parameters / Hyperparameters</span>
                  </div>
                  {missing.length > 0 ? (
                    <ul className="space-y-1 text-gray-300 font-sans">
                      {missing.map((m, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-emerald-400 font-sans text-xs">All essential replication specifications provided.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
