"use client";

import { useState, useEffect } from "react";
import { ResearchInput } from "@/components/ResearchInput";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Dashboard } from "@/components/Dashboard";
import { ConfidenceMap } from "@/components/ConfidenceMap";
import { PaperExplorer } from "@/components/PaperExplorer";
import { ClaimExplorer } from "@/components/ClaimExplorer";
import { EvidenceGraph } from "@/components/EvidenceGraph";
import { ContradictionExplorer } from "@/components/ContradictionExplorer";
import { TrustVisualization } from "@/components/TrustVisualization";
import { UncertaintyPanel } from "@/components/UncertaintyPanel";
import { BiasPanel } from "@/components/BiasPanel";
import { ReproducibilityPanel } from "@/components/ReproducibilityPanel";
import { ResearchGapPanel } from "@/components/ResearchGapPanel";
import { RedTeamPanel } from "@/components/RedTeamPanel";
import { JudgeVerdict } from "@/components/JudgeVerdict";
import { ExecutiveReport } from "@/components/ExecutiveReport";
import { startResearch, getResearchStatus } from "@/lib/api";
import { PaperRankPanel } from "@/components/PaperRankPanel";
import { PaperAuditPanel } from "@/components/PaperAuditPanel";
import { ReplicationPanel } from "@/components/ReplicationPanel";
import { VisualResearchModal } from "@/components/VisualResearchModal";
import { ScienceWorkbench } from "@/components/ScienceWorkbench";
import { Paper, ResearchStatus } from "@/types/research";
import { ShieldCheck, Database, Cpu, Network, Sparkles, LayoutDashboard, Terminal } from "lucide-react";

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<ResearchStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVisualPaper, setSelectedVisualPaper] = useState<Paper | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "workbench" | "claims" | "graph" | "papers" | "ranking" | "audit" | "replication" | "contradictions" | "trust" | "uncertainty" | "bias" | "reproducibility" | "gaps" | "redteam" | "judge" | "report"
  >("overview");

  const handleStartResearch = async (query: string, maxPapers: number) => {
    setIsLoading(true);
    try {
      const initRes = await startResearch(query, maxPapers);
      setSessionId(initRes.session_id);
      setStatus(initRes);
    } catch (err: any) {
      console.error(err);
      alert(`Error starting research: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(async () => {
      try {
        const updated = await getResearchStatus(sessionId);
        setStatus(updated);
        if (updated.current_stage === "COMPLETED" || updated.current_stage === "FAILED") {
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <section className="text-center space-y-5 pt-2 pb-2 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZERO HALLUCINATION PROTOCOL</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          KNOWSURE
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
          "AI that investigates what the evidence <span className="gradient-text font-semibold">actually supports</span>."
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400 pt-1">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>OpenAlex • Semantic Scholar • arXiv</span>
          </div>
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-purple-400" />
            <span>Neo4j Evidence Graph</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Evidence Firewall</span>
          </div>
        </div>
      </section>

      {/* 1. Research Workspace Input */}
      <section className="w-full space-y-6">
        <ResearchInput onSubmit={handleStartResearch} isLoading={isLoading} />
        
        {/* Render Science Workbench when no active pipeline status or when selected */}
        {!status && (
          <div className="pt-4">
            <ScienceWorkbench />
          </div>
        )}
      </section>

      {/* Active Research Session Workspace */}
      {status && (
        <section className="space-y-8 animate-fadeIn">
          {/* 2. Research Progress Tracker */}
          <ProgressTracker
            currentStage={status.current_stage}
            progressPercentage={status.progress_percentage}
            error={status.error}
          />

          {/* Professional Scientific Workspace Tab Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-800 pb-3 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === "overview"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("workbench")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === "workbench"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Science Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab("claims")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "claims"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Claims ({status.claims.length})
            </button>

            <button
              onClick={() => setActiveTab("graph")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "graph"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Evidence Graph
            </button>

            <button
              onClick={() => setActiveTab("papers")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "papers"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Papers ({status.papers.length})
            </button>

            <button
              onClick={() => setActiveTab("ranking")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "ranking"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Paper Ranking
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "audit"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Paper Audit
            </button>

            <button
              onClick={() => setActiveTab("replication")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "replication"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Replication
            </button>

            <button
              onClick={() => setActiveTab("contradictions")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "contradictions"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Contradictions ({status.contradictions.length})
            </button>

            <button
              onClick={() => setActiveTab("trust")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "trust"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Trust Score
            </button>

            <button
              onClick={() => setActiveTab("uncertainty")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "uncertainty"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Uncertainty
            </button>

            <button
              onClick={() => setActiveTab("bias")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "bias"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Bias Analysis
            </button>

            <button
              onClick={() => setActiveTab("reproducibility")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "reproducibility"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Reproducibility
            </button>

            <button
              onClick={() => setActiveTab("gaps")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "gaps"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Research Gaps ({status.research_gaps.length})
            </button>

            <button
              onClick={() => setActiveTab("redteam")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "redteam"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Red Team ({status.red_team_findings.length})
            </button>

            <button
              onClick={() => setActiveTab("judge")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "judge"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Judge Verdict
            </button>

            <button
              onClick={() => setActiveTab("report")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "report"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Executive Report
            </button>
          </div>

          {/* Active Tab Panels */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <JudgeVerdict judgement={status.final_judgement} />
              <Dashboard status={status} />
              <ConfidenceMap claims={status.claims} />
            </div>
          )}

          {activeTab === "workbench" && <ScienceWorkbench />}
          {activeTab === "claims" && <ClaimExplorer claims={status.claims} />}
          {activeTab === "graph" && <EvidenceGraph sessionId={status.session_id} />}
          {activeTab === "papers" && (
            <PaperExplorer
              papers={status.papers}
              onSelectVisualResearch={(p) => setSelectedVisualPaper(p)}
              onSelectAudit={() => setActiveTab("audit")}
              onSelectReplication={() => setActiveTab("replication")}
            />
          )}
          {activeTab === "ranking" && <PaperRankPanel papers={status.papers} />}
          {activeTab === "audit" && <PaperAuditPanel papers={status.papers} />}
          {activeTab === "replication" && <ReplicationPanel papers={status.papers} />}
          {activeTab === "contradictions" && <ContradictionExplorer contradictions={status.contradictions} />}
          {activeTab === "trust" && <TrustVisualization trustAnalysis={status.trust_analysis} />}
          {activeTab === "uncertainty" && <UncertaintyPanel trustAnalysis={status.trust_analysis} />}
          {activeTab === "bias" && <BiasPanel papers={status.papers} />}
          {activeTab === "reproducibility" && <ReproducibilityPanel papers={status.papers} />}
          {activeTab === "gaps" && <ResearchGapPanel gaps={status.research_gaps} />}
          {activeTab === "redteam" && <RedTeamPanel findings={status.red_team_findings} />}
          {activeTab === "judge" && <JudgeVerdict judgement={status.final_judgement} />}
          {activeTab === "report" && (
            <ExecutiveReport reportMarkdown={status.report_markdown} query={status.query} />
          )}
        </section>
      )}

      {/* Visual Research Modal */}
      <VisualResearchModal
        paper={selectedVisualPaper}
        isOpen={Boolean(selectedVisualPaper)}
        onClose={() => setSelectedVisualPaper(null)}
      />
    </div>
  );
}
