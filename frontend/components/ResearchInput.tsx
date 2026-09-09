"use client";

import { useState } from "react";
import { Search, Sparkles, ArrowRight, BookOpen, AlertTriangle, Zap, Sliders, Globe, HelpCircle } from "lucide-react";
import { ClarificationModal } from "@/components/ClarificationModal";
import { getClarificationQuestions } from "@/lib/api";
import { ClarificationResponse } from "@/types/research";

interface ResearchInputProps {
  onSubmit: (
    query: string,
    maxPapers: number,
    breadth?: number,
    depth?: number,
    enableWebSearch?: boolean,
    clarificationAnswers?: Record<string, string>
  ) => void;
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
  const [breadth, setBreadth] = useState(3);
  const [depth, setDepth] = useState(2);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  
  // Intake Clarification state
  const [clarificationData, setClarificationData] = useState<ClarificationResponse | null>(null);
  const [isClarifyOpen, setIsClarifyOpen] = useState(false);
  const [isFetchingClarify, setIsFetchingClarify] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim(), maxPapers, breadth, depth, enableWebSearch);
  };

  const handleRunPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    onSubmit(presetQuery, maxPapers, breadth, depth, enableWebSearch);
  };

  const handleFetchClarification = async () => {
    if (!query.trim()) return;
    setIsFetchingClarify(true);
    try {
      const data = await getClarificationQuestions(query.trim());
      setClarificationData(data);
      setIsClarifyOpen(true);
    } catch (err) {
      console.error("Clarification intake error:", err);
      // Fallback modal launch
      setClarificationData({
        query: query.trim(),
        suggested_refinements: [
          `${query.trim()} with quantitative evaluation benchmarks`,
          `Empirical analysis of ${query.trim()} comparing baseline models`,
          `Literature review of ${query.trim()} focusing on cross-domain robustness`
        ],
        followup_questions: [
          {
            id: "target_scope",
            question: "What evaluation scope should the investigation prioritize?",
            options: [
              "Peer-reviewed academic papers only",
              "Academic literature + technical web docs & open-source implementations",
              "Cross-domain benchmark generalizability"
            ],
            suggested_default: "Academic literature + technical web docs & open-source implementations"
          }
        ]
      });
      setIsClarifyOpen(true);
    } finally {
      setIsFetchingClarify(false);
    }
  };

  const handleConfirmClarification = (answers: Record<string, string>, refinedQuery?: string) => {
    const finalQuery = refinedQuery || query.trim();
    if (refinedQuery) setQuery(refinedQuery);
    onSubmit(finalQuery, maxPapers, breadth, depth, enableWebSearch, answers);
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
              <button
                type="button"
                onClick={handleFetchClarification}
                disabled={!query.trim() || isFetchingClarify || isLoading}
                className="text-xs font-mono text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                {isFetchingClarify ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5" />
                )}
                <span>Refine & Clarify Query</span>
              </button>
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

          {/* Configurable Scope Controls: Breadth, Depth & Web Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-mono">
            {/* Breadth Control */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Breadth (Paths):
                </span>
                <span className="font-bold text-cyan-400">{breadth} branches</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={breadth}
                onChange={(e) => setBreadth(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                disabled={isLoading}
              />
            </div>

            {/* Depth Control */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Depth (Levels):
                </span>
                <span className="font-bold text-purple-400">{depth} levels</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                disabled={isLoading}
              />
            </div>

            {/* Broad Web Search & Crawling Toggle */}
            <div className="flex items-center justify-between px-2 pt-1 md:pt-0">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Web Crawling:
              </span>
              <button
                type="button"
                onClick={() => setEnableWebSearch(!enableWebSearch)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                  enableWebSearch
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-900 text-slate-500 border-slate-800"
                }`}
                disabled={isLoading}
              >
                {enableWebSearch ? "ENABLED" : "OFF"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Corpus:</span>
              <span className="text-slate-200">
                OpenAlex • PubMed • arXiv {enableWebSearch && "• Web Crawl"}
              </span>
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
                <label htmlFor="max-papers">Papers:</label>
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

      {/* Pre-Research Intake Clarification Modal */}
      <ClarificationModal
        isOpen={isClarifyOpen}
        onClose={() => setIsClarifyOpen(false)}
        clarificationData={clarificationData}
        onConfirm={handleConfirmClarification}
      />
    </div>
  );
}
