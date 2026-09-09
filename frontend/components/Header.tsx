"use client";

import Link from "next/link";
import { ShieldCheck, Cpu, Database, Activity, FileText, Network, Terminal, CheckCircle2, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#07090e]/90 px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xl font-extrabold tracking-wider text-white">KNOWSURE</span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0 • Autonomous AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span>Zero-Hallucination Evidence Intelligence</span>
            </p>
          </div>
        </Link>

        {/* Live Engine Status Indicators */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>OpenAlex & PubMed</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>Neo4j Graph</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Feynman CLI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
        </div>

        {/* Evidence Firewall Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400 shadow-md shadow-emerald-500/10">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Evidence Firewall Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
