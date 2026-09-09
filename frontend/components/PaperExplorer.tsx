"use client";

import { Paper } from "@/types/research";
import { BookOpen, ExternalLink, Award, FileText, User } from "lucide-react";

interface PaperExplorerProps {
  papers: Paper[];
  onSelectVisualResearch?: (paper: Paper) => void;
  onSelectAudit?: (paper: Paper) => void;
  onSelectReplication?: (paper: Paper) => void;
}

export function PaperExplorer({ papers, onSelectVisualResearch, onSelectAudit, onSelectReplication }: PaperExplorerProps) {
  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
            Academic Paper Explorer
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Normalized metadata retrieved directly from peer-reviewed repositories.
          </p>
        </div>
        <span className="text-xs font-mono text-gray-400">Total Papers: {papers.length}</span>
      </div>

      <div className="space-y-4">
        {papers.map((paper) => (
          <div
            key={paper.id || paper.paper_id}
            className="glass-card p-6 rounded-xl border border-gray-800 space-y-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 max-w-3xl">
                <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[11px] font-semibold">
                  {paper.source}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">{paper.title}</h4>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSelectVisualResearch && onSelectVisualResearch(paper)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 transition-colors font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Visual Research</span>
                </button>

                <button
                  onClick={() => onSelectAudit && onSelectAudit(paper)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-xs font-mono text-purple-300 hover:bg-purple-500/30 transition-colors font-bold"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Audit Paper</span>
                </button>

                <button
                  onClick={() => onSelectReplication && onSelectReplication(paper)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:bg-emerald-500/30 transition-colors font-bold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Replication</span>
                </button>

                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs font-mono text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown Authors"}</span>
              </div>

              {paper.year && (
                <div>Published: <span className="text-gray-200 font-semibold">{paper.year}</span></div>
              )}

              <div>Citations: <span className="text-emerald-400 font-bold">{paper.citation_count}</span></div>

              {paper.doi && (
                <div className="truncate max-w-xs">DOI: <span className="text-gray-300">{paper.doi}</span></div>
              )}
            </div>

            {paper.abstract && (
              <p className="text-xs text-gray-300 font-sans leading-relaxed p-4 rounded-xl bg-gray-950/60 border border-gray-900 line-clamp-3">
                {paper.abstract}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
