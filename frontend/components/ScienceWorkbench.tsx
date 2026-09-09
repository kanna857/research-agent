"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  Zap,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  FileText,
  MessageSquare,
  Sparkles,
  GitPullRequest
} from "lucide-react";

interface CommandResult {
  workflow?: string;
  target?: string;
  status?: string;
  brief_summary?: string;
  summary?: string;
  consensus?: string;
  disagreements?: string[];
  open_questions?: string[];
  ranked_papers?: any[];
  resolved_paper?: any;
  audit_result?: any;
  replication_analysis?: any;
  recipes?: any[];
  matrix?: any[];
  draft_markdown?: string;
  criticism_severity?: string;
  strengths?: string[];
  concerns?: string[];
  revision_plan?: string[];
  answer?: string;
  papers?: any[];
  [key: string]: any;
}

const PRESET_COMMANDS = [
  { cmd: "/brief", label: "Quick Brief", desc: "Searches literature & generates cited brief", icon: Zap },
  { cmd: "/deepresearch", label: "Deep Research", desc: "Multi-agent research & ranking investigation", icon: Sparkles },
  { cmd: "/lit", label: "Literature Review", desc: "Consensus, disagreements & open questions", icon: BookOpen },
  { cmd: "/rank", label: "Paper Ranking", desc: "Evaluates methods, citations & provenance", icon: Layers },
  { cmd: "/audit", label: "Paper Audit", desc: "Traceability check (Paper -> Claim -> Code)", icon: CheckCircle2 },
  { cmd: "/replicate", label: "Replication", desc: "Hardware, protocol & dataset feasibility", icon: Cpu },
  { cmd: "/recipe", label: "ML Recipes", desc: "Hub training recipes & hyperparameters", icon: GitPullRequest },
  { cmd: "/review", label: "Peer Review", desc: "Critique, strengths, concerns & revisions", icon: AlertTriangle },
  { cmd: "/compare", label: "Compare Sources", desc: "Dimension matrix comparison", icon: FileText },
  { cmd: "/draft", label: "Draft Synthesis", desc: "Produces paper-ready markdown draft", icon: FileText },
  { cmd: "/btw", label: "Side Note", desc: "Off-pipeline side query", icon: MessageSquare }
];

export const ScienceWorkbench: React.FC = () => {
  const [selectedCmd, setSelectedCmd] = useState<string>("/deepresearch");
  const [inputQuery, setInputQuery] = useState<string>("mechanistic interpretability sparse autoencoders");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; target: string; time: string }>>([]);

  const handleExecute = async (overrideCmd?: string, overrideQuery?: string) => {
    const cmdToRun = overrideCmd || selectedCmd;
    const queryToRun = overrideQuery || inputQuery;

    if (!queryToRun.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/commands/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: cmdToRun,
          query_or_target: queryToRun
        })
      });

      if (!res.ok) {
        throw new Error(`Command execution failed: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
      setCommandHistory((prev) => [
        { cmd: cmdToRun, target: queryToRun, time: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to execute workbench command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              Science Workbench & CLI Execution Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                Feynman Engine
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Autonomous research commands, paper ranking, literature reviews, replication analysis, and ML training recipes.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Command Chips */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Command Preset
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {PRESET_COMMANDS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedCmd === preset.cmd;
            return (
              <button
                key={preset.cmd}
                onClick={() => setSelectedCmd(preset.cmd)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono font-medium text-sm mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  {preset.cmd}
                </div>
                <span className="text-xs text-slate-400 line-clamp-1">{preset.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Command Input Field */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm px-2 font-bold select-none">
          <span>feynman</span>
          <span className="text-slate-500">{selectedCmd}</span>
        </div>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExecute()}
          placeholder="Enter research topic, paper title, DOI, or target..."
          className="flex-1 bg-transparent border-0 focus:ring-0 text-white font-mono text-sm placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleExecute()}
          disabled={loading || !inputQuery.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm rounded-md transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <span className="flex items-center gap-2 font-mono text-xs">
              <span className="animate-spin">🌀</span> Executing...
            </span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Execute</span>
            </>
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong className="font-semibold block">Workbench Execution Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Output Panel */}
      {result && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white font-mono text-sm">
                Workflow Output: <span className="text-blue-400">{result.workflow || "Command Output"}</span>
              </h3>
            </div>
            {result.status && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                {result.status}
              </span>
            )}
          </div>

          {/* Research Brief / Summary */}
          {(result.brief_summary || result.summary) && (
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Executive Synthesis
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {result.brief_summary || result.summary}
              </p>
            </div>
          )}

          {/* Literature Review Breakdown */}
          {result.consensus && (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-emerald-500/20">
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider block mb-1">
                  Empirical Consensus
                </span>
                <p className="text-xs text-slate-300">{result.consensus}</p>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-amber-500/20">
                <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider block mb-1">
                  Disagreements ({result.disagreements?.length || 0})
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {result.disagreements?.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-blue-500/20">
                <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider block mb-1">
                  Open Questions ({result.open_questions?.length || 0})
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {result.open_questions?.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Paper Ranking Results */}
          {result.ranked_papers && result.ranked_papers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Ranked Research Corpus
              </h4>
              <div className="space-y-2">
                {result.ranked_papers.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <h5 className="text-sm font-medium text-white">{p.title}</h5>
                        <p className="text-xs text-slate-400 font-sans">{p.explanation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-emerald-400">{p.score}</span>
                      <span className="text-xs text-slate-500 block">PaperRank</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paper Audit Output */}
          {result.audit_result && (
            <div className="p-4 bg-slate-900 rounded-lg border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Paper vs Codebase Audit Summary</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  Trust Score: {result.audit_result.overall_audit_score}/100
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">Claims Verified</span>
                  <span className="text-white font-bold">{result.audit_result.traceability_chain?.verified_claims || 0}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">Code Anchors</span>
                  <span className="text-white font-bold">{result.audit_result.traceability_chain?.code_anchors_found || 0}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">Discrepancies</span>
                  <span className="text-amber-400 font-bold">{result.audit_result.discrepancies?.length || 0}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">Audit Verdict</span>
                  <span className="text-emerald-400 font-bold">{result.audit_result.audit_verdict || "PASSED"}</span>
                </div>
              </div>
            </div>
          )}

          {/* ML Recipes List */}
          {result.recipes && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Hugging Face & Training Recipes ({result.recipes.length})
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {result.recipes.map((rec: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-400">{rec.recipe_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {rec.framework}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{rec.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
                      <span>Hardware: {rec.recommended_hardware}</span>
                      <span>Feasibility: {rec.feasibility_score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compare Matrix */}
          {result.matrix && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Source Comparison Matrix
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="p-2.5 border-b border-slate-800">Dimension</th>
                      <th className="p-2.5 border-b border-slate-800">Paper A</th>
                      <th className="p-2.5 border-b border-slate-800">Paper B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950 font-sans">
                    {result.matrix.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2.5 text-slate-300 font-medium font-mono">{row.dimension}</td>
                        <td className="p-2.5 text-slate-400">{row.Paper_A}</td>
                        <td className="p-2.5 text-slate-400">{row.Paper_B}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paper Draft Markdown Preview */}
          {result.draft_markdown && (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Draft Synthesis Markdown
              </h4>
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap p-3 bg-slate-950 rounded border border-slate-800">
                {result.draft_markdown}
              </pre>
            </div>
          )}

          {/* Raw JSON Toggle / Detailed Viewer */}
          <details className="mt-4 pt-2 border-t border-slate-800">
            <summary className="text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-400">
              View raw payload output JSON
            </summary>
            <pre className="mt-2 p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-400 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Command History Footprint */}
      {commandHistory.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Execution Log ({commandHistory.length})
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {commandHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCmd(item.cmd);
                  setInputQuery(item.target);
                  handleExecute(item.cmd, item.target);
                }}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
              >
                <span className="text-blue-400 font-semibold">{item.cmd}</span>
                <span className="truncate max-w-[120px] text-slate-300">{item.target}</span>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
