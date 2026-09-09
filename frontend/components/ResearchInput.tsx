"use client";

import { useState } from "react";
import { Search, Sparkles, ArrowRight, BookOpen, AlertTriangle } from "lucide-react";

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Research Question Investigation
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter scientific question (e.g. Can large language models reliably detect misinformation across different languages and domains?)..."
                rows={3}
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl p-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans text-lg resize-none"
                disabled={isLoading}
              />
              <Search className="absolute right-4 top-4 w-6 h-6 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-3 text-sm text-gray-400 font-mono">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Target Sources:</span>
              <span className="text-gray-200">OpenAlex • Semantic Scholar • arXiv</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400 font-mono">
                <label htmlFor="research-mode">Mode:</label>
                <select
                  id="research-mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="bg-gray-900 border border-gray-800 text-cyan-400 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-cyan-500 font-bold"
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

              <div className="flex items-center space-x-2 text-sm text-gray-400 font-mono">
                <label htmlFor="max-papers">Depth:</label>
                <select
                  id="max-papers"
                  value={maxPapers}
                  onChange={(e) => setMaxPapers(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-800 text-cyan-400 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
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
                className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-gray-950 font-bold tracking-wide shadow-lg shadow-cyan-500/25 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>INVESTIGATING...</span>
                  </>
                ) : (
                  <>
                    <span>START RESEARCH</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Example Prompt Shortcuts */}
      <div className="space-y-3">
        <p className="text-xs uppercase font-mono tracking-wider text-gray-400">
          Example Research Investigations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLE_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuery(q)}
              className="text-left p-3.5 rounded-xl glass-card border border-gray-800/80 hover:border-cyan-500/50 hover:bg-gray-800/50 text-xs text-gray-300 transition-all font-sans leading-relaxed flex items-start space-x-2 group"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Core Principle Callout */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-amber-300 text-xs font-mono">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <div>
          <span className="font-bold text-amber-200 uppercase">Strict Evidence Protocol:</span> KnowSure never invents citations or claims. If peer-reviewed literature is insufficient to substantiate an answer, the platform explicitly flags <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-400 font-bold">INSUFFICIENT EVIDENCE</code>.
        </div>
      </div>
    </div>
  );
}
