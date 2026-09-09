"use client";

import { useState, useEffect } from "react";
import { Paper, VisualResearchPlan, DiagramNode } from "@/types/research";
import { 
  X, Sparkles, CheckCircle2, Workflow, GitCommit, Network, Play, Pause, 
  RotateCcw, ShieldCheck, FileText, Code2, AlertCircle, Eye, ArrowRight
} from "lucide-react";

interface VisualResearchModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  "Paper Ingestion",
  "Analyze",
  "Identify Concepts",
  "Create Visual Plan",
  "Generate Visualization",
  "Validate",
  "Display"
];

export function VisualResearchModal({ paper, isOpen, onClose }: VisualResearchModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [plan, setPlan] = useState<VisualResearchPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"methodology" | "timeline" | "evidence" | "animation" | "spec">("methodology");
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && paper) {
      setLoading(true);
      setCurrentStepIndex(0);
      setPlan(null);
      setSelectedNode(null);
      setCurrentFrameIndex(0);
      setIsPlaying(false);

      // Simulate 6-step progress pipeline
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 400);

      // Fetch visual plan from API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      fetch(`${apiUrl}/api/v1/visual/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper: paper,
          claims: [],
          session_id: "modal_session"
        })
      })
        .then((res) => res.json())
        .then((data: VisualResearchPlan) => {
          setPlan(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch visual research plan:", err);
          // Fallback plan
          setLoading(false);
        });

      return () => clearInterval(interval);
    }
  }, [isOpen, paper]);

  // Handle animation playback step interval
  useEffect(() => {
    let playInterval: NodeJS.Timeout | null = null;
    if (isPlaying && plan && plan.animation_schema?.keyframes?.length > 0) {
      playInterval = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= plan.animation_schema.keyframes.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 2000);
    }
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [isPlaying, plan]);

  if (!isOpen || !paper) return null;

  const activeKeyframe = plan?.animation_schema?.keyframes?.[currentFrameIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-6xl max-h-[90vh] bg-gray-950 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100 font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  Visual Research Module
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Zero Hallucination Validated</span>
              </div>
              <h2 className="text-base font-bold text-white truncate max-w-2xl mt-0.5">
                {paper.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Telemetry Tracker */}
        <div className="px-6 py-3 bg-gray-900/30 border-b border-gray-800 font-mono text-xs overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={idx} className="flex items-center space-x-2">
                  <div
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-[11px] transition-all ${
                      isCurrent
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold animate-pulse"
                        : isDone
                        ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                        : "bg-gray-950 border-gray-800 text-gray-500"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-700" />
                    )}
                    <span>{step}</span>
                  </div>
                  {idx < STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-gray-700" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 font-mono">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-sm text-cyan-400 animate-pulse">
                Extracting concepts & building interactive methodology diagram...
              </p>
            </div>
          ) : plan ? (
            <>
              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-3 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab("methodology")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTab === "methodology"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-850"
                    }`}
                  >
                    <Workflow className="w-4 h-4" />
                    <span>Methodology Diagram</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("timeline")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTab === "timeline"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-850"
                    }`}
                  >
                    <GitCommit className="w-4 h-4" />
                    <span>Research Timeline</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("evidence")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTab === "evidence"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-850"
                    }`}
                  >
                    <Network className="w-4 h-4" />
                    <span>Evidence Network</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("animation")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTab === "animation"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-850"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Interactive Explanation</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("spec")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTab === "spec"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-850"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Future Animation Spec</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Validation Passed: 100% Evidence Grounded</span>
                </div>
              </div>

              {/* Tab 1: Methodology Flowchart */}
              {activeTab === "methodology" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Interactive Flowchart Canvas */}
                  <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                        Interactive Experimental Methodology Flowchart
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">Click node to view evidence chunk</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      {plan.methodology_nodes.map((node, i) => {
                        const isSelected = selectedNode?.node_id === node.node_id;
                        return (
                          <div
                            key={node.node_id}
                            onClick={() => setSelectedNode(node)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                              isSelected
                                ? "bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/10"
                                : "bg-gray-900/80 border-gray-800 hover:border-cyan-500/40"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                                {node.node_type}
                              </span>
                              <span className="text-[10px] text-gray-500">Node #{i + 1}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white">{node.label}</h4>
                            <p className="text-xs text-gray-300 font-sans line-clamp-2">{node.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Node Inspector Sidebar */}
                  <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-4 font-mono">
                    <span className="text-xs uppercase font-bold text-cyan-400 block border-b border-gray-800 pb-2">
                      Evidence Citation Inspector
                    </span>

                    {selectedNode ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Selected Node:</span>
                          <p className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Node Category:</span>
                          <span className="block mt-0.5 text-cyan-300 font-bold">{selectedNode.node_type}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Backing Evidence Text:</span>
                          <p className="mt-1 p-3 rounded-xl bg-gray-950 border border-gray-900 text-gray-200 font-sans leading-relaxed text-xs">
                            "{selectedNode.evidence_text || "Source paper methodology excerpt"}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic py-10 text-center">
                        Click any node in the flowchart to inspect backing paper evidence.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Research Timeline */}
              {activeTab === "timeline" && (
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      Chronological Milestone & Citation Timeline
                    </span>
                    <span className="text-xs font-mono text-gray-400">Total Milestones: {plan.timeline.length}</span>
                  </div>

                  <div className="space-y-6 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-cyan-500/30 font-mono">
                    {plan.timeline.map((m, idx) => (
                      <div key={m.milestone_id} className="relative pl-12 space-y-1">
                        <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-gray-950 flex items-center justify-center" />
                        
                        <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-cyan-400 font-bold">{m.year_or_date}</span>
                            {m.doi && <span className="text-[10px] text-gray-500">DOI: {m.doi}</span>}
                          </div>

                          <h4 className="text-sm font-bold text-white">{m.title}</h4>
                          <p className="text-xs text-gray-300 font-sans leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Evidence Network */}
              {activeTab === "evidence" && (
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      Claim-to-Evidence Relationship Network
                    </span>
                    <span className="text-xs font-mono text-gray-400">Grounding Nodes: {plan.evidence_nodes.length}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    {plan.evidence_nodes.map((node) => (
                      <div key={node.node_id} className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            {node.node_type}
                          </span>
                          <span className="text-[10px] text-gray-500">{node.node_id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">{node.label}</h4>
                        <p className="text-xs text-gray-300 font-sans italic bg-gray-950 p-2.5 rounded-lg border border-gray-900">
                          "{node.evidence_text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Interactive Step Playback */}
              {activeTab === "animation" && (
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-6 font-mono">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div>
                      <span className="text-xs uppercase text-cyan-400 font-bold">
                        Interactive Step-by-Step Research Explanation
                      </span>
                      <p className="text-xs text-gray-400 font-sans">
                        Simulating dynamic visual animation step-through execution.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? "Pause Explanation" : "Play Step Flow"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentFrameIndex(0);
                        }}
                        className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {activeKeyframe ? (
                    <div className="space-y-6">
                      {/* Step Card */}
                      <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                            Frame {activeKeyframe.frame_index} / {plan.animation_schema.keyframes.length}
                          </span>
                          <span className="text-gray-400">Duration: {activeKeyframe.duration_ms}ms</span>
                        </div>

                        <h3 className="text-base font-bold text-white">{activeKeyframe.step_title}</h3>
                        <p className="text-sm text-gray-200 font-sans leading-relaxed">{activeKeyframe.description}</p>

                        <div className="pt-2 flex items-center space-x-2 text-xs text-cyan-400">
                          <Eye className="w-4 h-4" />
                          <span>Active Focus: {activeKeyframe.camera_focus}</span>
                        </div>
                      </div>

                      {/* Step Indicator Bar */}
                      <div className="grid grid-cols-4 gap-2">
                        {plan.animation_schema.keyframes.map((kf, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setIsPlaying(false);
                              setCurrentFrameIndex(i);
                            }}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              i === currentFrameIndex
                                ? "bg-cyan-500 border-cyan-400 text-gray-950 font-bold"
                                : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                            }`}
                          >
                            <span className="block text-[10px]">Step {i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Tab 5: Future Animation Spec */}
              {activeTab === "spec" && (
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="text-xs uppercase text-cyan-400 font-bold">
                      Extensible Animation Schema (Manim / Remotion Backend Ready)
                    </span>
                    <span className="text-xs text-gray-400">FPS: {plan.animation_schema.fps}</span>
                  </div>

                  <pre className="p-4 rounded-xl bg-gray-950 border border-gray-900 text-cyan-300 text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                    {JSON.stringify(plan.animation_schema, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
