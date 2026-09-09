"use client";

import { useState } from "react";
import { Search, Sparkles, ArrowRight, BookOpen, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

interface ResearchInputProps {
  onSubmit: (query: string, maxPapers: number) => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES = [
  "Can large language models reliably detect misinformation across different languages and domains?",
  "Does zero-shot chain-of-thought prompting improve mathematical reasoning reproducibility in LLMs?",
  "What empirical evidence exists for transformer attention mechanisms failing under adversarial perturbations?"
];

export function ResearchInput({ onSubmit, isLoading }: ResearchInputProps) {
  const [query, setQuery] = useState("");
  const [maxPapers, setMaxPapers] = useState(10);
  const [mode, setMode] = useState("DEEP_RESEARCH");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim(), maxPapers);
  };

  const handleRunPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    onSubmit(presetQuery, maxPapers);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Autonomous Research Investigation Query
              </label>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Retrieval Connected
              </span>
            </div>

            <div className="relative group">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter scientific question (e.g. Can large language models reliably detect misinformation across different languages and domains?)..."
                rows={3}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans text-base leading-relaxed resize-none shadow-inner"
                disabled={isLoading}
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Corpus:</span>
              <span className="text-slate-200">OpenAlex • PubMed • Europe PMC • arXiv</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <label htmlFor="research-mode">Mode:</label>
                <select
                  id="research-mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-cyan-400 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-cyan-500 font-bold"
                  disabled={isLoading}
                >
                  <option value="DEEP_RESEARCH">🔬 Deep Research</option>
                  <option value="QUICK_RESEARCH">⚡ Quick Research</option>
                  <option value="LITERATURE_REVIEW">📚 Literature Review</option>
                  <option value="PAPER_RANKING">📊 Paper Ranking</option>
                  <option value="PAPER_AUDIT">🔍 Paper Audit</option>
                  <option value="REPLICATION_ANALYSIS">🧪 Replication Analysis</option>
                  <option value="RESEARCH_COMPARISON">⚔️ Research Comparison</option>
                  <option value="RESEARCH_GAP_FINDER">🎯 Research Gap Finder</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <label htmlFor="max-papers">Depth:</label>
                <select
                  id="max-papers"
                  value={maxPapers}
                  onChange={(e) => setMaxPapers(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-cyan-400 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                >
                  <option value={5}>5 Papers</option>
                  <option value={10}>10 Papers</option>
                  <option value={20}>20 Papers</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 text-slate-950 font-extrabold tracking-wider text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>RUNNING PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <span>START RESEARCH</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Example Research Prompts with One-Click Execution */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            Click Any Sample Prompt to Run Instantly:
          </p>
          <span className="text-[11px] font-mono text-blue-400">1-Click Launch</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLE_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleRunPreset(q)}
              disabled={isLoading}
              className="text-left p-3.5 rounded-xl glass-card border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-xs text-slate-300 transition-all font-sans leading-relaxed flex items-start space-x-2.5 group shadow-sm hover:shadow-md"
            >
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <span className="group-hover:text-white transition-colors">{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Zero Hallucination Protocol Callout */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-amber-300 text-xs font-mono shadow-md">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-bold text-amber-200 uppercase block mb-0.5">Strict Zero-Hallucination Protocol:</span>
          KnowSure never invents backing citations or synthetic metrics. Claims without verified peer-reviewed evidence trigger the strict fallback: <code className="bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300 font-bold">INSUFFICIENT_EVIDENCE</code>.
        </div>
      </div>
    </div>
  );
}
