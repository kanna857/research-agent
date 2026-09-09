"use client";

import { FileText, Download } from "lucide-react";

interface ExecutiveReportProps {
  reportMarkdown?: string;
  query: string;
}

export function ExecutiveReport({ reportMarkdown, query }: ExecutiveReportProps) {
  if (!reportMarkdown) return null;

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KnowSure_Research_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full glass-panel p-8 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 font-bold">
              Evidence-Backed Executive Research Synthesis
            </h3>
            <p className="text-xs text-gray-400 font-mono">Protected by KnowSure Final Evidence Firewall</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {reportMarkdown.includes("[FIREWALL CORRECTION APPLIED]") ? (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">
              ⚠ Needs Review (Firewall Revision Applied)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              ✓ Evidence Verified
            </span>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs font-mono text-cyan-400 hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 font-sans leading-relaxed text-sm space-y-4 whitespace-pre-wrap font-mono bg-gray-950 p-6 rounded-xl border border-gray-900 overflow-x-auto">
        {reportMarkdown}
      </div>
    </div>
  );
}
