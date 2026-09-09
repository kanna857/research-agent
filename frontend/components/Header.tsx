"use client";

import Link from "next/link";
import { ShieldCheck, Cpu, Database, Activity, FileText, Network } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 bg-[#0b0f19]/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-gray-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xl font-bold tracking-wider text-white">KNOWSURE</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Autonomous AI
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">Evidence-Backed Research Intelligence</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
          <Link href="/" className="flex items-center space-x-2 hover:text-cyan-400 transition-colors">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Investigate</span>
          </Link>
          <div className="flex items-center space-x-2 text-gray-400 cursor-not-allowed opacity-60">
            <Network className="w-4 h-4" />
            <span>Evidence Graph</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 cursor-not-allowed opacity-60">
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </div>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Firewall Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
