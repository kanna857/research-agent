"use client";

import { WorkflowStage } from "@/types/research";
import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";

interface ProgressTrackerProps {
  currentStage: WorkflowStage;
  progressPercentage: number;
  error?: string;
}

const STAGES: { stage: WorkflowStage; label: string }[] = [
  { stage: "PLANNING", label: "Research Planner" },
  { stage: "RETRIEVAL", label: "Academic Retrieval" },
  { stage: "EVIDENCE_EXTRACTION", label: "Evidence Extraction" },
  { stage: "CLAIM_VERIFICATION", label: "Claim Verification" },
  { stage: "CONTRADICTION_DETECTION", label: "Contradictions" },
  { stage: "TRUST_ANALYSIS", label: "Trust Engine" },
  { stage: "RED_TEAM", label: "Red Team Audit" },
  { stage: "JUDGE", label: "Judge Stage" },
  { stage: "FIREWALL", label: "Evidence Firewall" }
];

export function ProgressTracker({ currentStage, progressPercentage, error }: ProgressTrackerProps) {
  const getStageStatus = (stage: WorkflowStage) => {
    if (error) return "error";
    if (currentStage === "COMPLETED") return "completed";
    if (currentStage === stage) return "active";

    const stageOrder = STAGES.map(s => s.stage);
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stage);

    if (currentIndex === -1) return "pending";
    return stageIndex < currentIndex ? "completed" : "pending";
  };

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Autonomous Pipeline Orchestration</span>
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Current Stage: <span className="text-white font-bold">{currentStage}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-bold text-cyan-400">{progressPercentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {STAGES.map(({ stage, label }) => {
          const status = getStageStatus(stage);
          return (
            <div
              key={stage}
              className={`p-2.5 rounded-xl border text-center font-mono text-xs flex flex-col items-center justify-center space-y-1.5 transition-all ${
                status === "completed"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : status === "active"
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/20 animate-pulse"
                  : status === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-gray-900/50 border-gray-800/80 text-gray-400"
              }`}
            >
              {status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {status === "active" && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
              {status === "pending" && <Circle className="w-4 h-4 text-gray-600" />}
              {status === "error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span className="truncate w-full font-semibold">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
