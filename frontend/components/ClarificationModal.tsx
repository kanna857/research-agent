"use client";

import React, { useState } from "react";
import { ClarificationResponse, ClarificationQuestion } from "@/types/research";
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight, X, Sliders } from "lucide-react";

interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clarificationData: ClarificationResponse | null;
  onConfirm: (answers: Record<string, string>, refinedQuery?: string) => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  clarificationData,
  onConfirm
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedRefinement, setSelectedRefinement] = useState<string | null>(null);

  if (!isOpen || !clarificationData) return null;

  const handleOptionSelect = (questionId: string, optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionText
    }));
  };

  const handleStart = () => {
    onConfirm(answers, selectedRefinement || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden text-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Pre-Research Clarification Intake
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  Intake Step
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Clarify user goals and refine research directions before engine execution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Query Refinements */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Suggested Prompt Refinements (Optional)
          </label>
          <div className="space-y-1.5">
            {clarificationData.suggested_refinements.map((ref, idx) => {
              const isSelected = selectedRefinement === ref;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRefinement(isSelected ? null : ref)}
                  className={`w-full text-left p-3 rounded-lg border font-sans text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-200 font-semibold shadow-sm"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span>{ref}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Follow-Up Intake Questions */}
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Intake Clarification Questions
          </label>
          {clarificationData.followup_questions.map((q: ClarificationQuestion) => {
            const currentAnswer = answers[q.id] || q.suggested_default;
            return (
              <div key={q.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-semibold text-white leading-relaxed">{q.question}</h4>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isChecked = currentAnswer === opt;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(q.id, opt)}
                        className={`w-full text-left p-2.5 rounded-md border text-xs font-sans transition-all flex items-center justify-between ${
                          isChecked
                            ? "bg-blue-600/20 border-blue-500 text-blue-300 font-medium"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Skip Clarification
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>Proceed to Autonomous Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
