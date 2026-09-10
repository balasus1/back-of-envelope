'use client';

import { useStore } from '../lib/store';
import { Search, RotateCcw, Menu, Activity } from 'lucide-react';

export function TopNav() {
  const { resetToDefault, derivations, setCommandPaletteOpen, setMobileSidebarOpen, scenario } = useStore();

  return (
    <header className="h-12 bg-[#0c0d14]/95 border-b border-white/[0.08] backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 z-40 sticky top-0 font-sans flex-shrink-0">
      {/* Left: Mobile Drawer Trigger, Search & Ticker */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="inline-flex md:hidden p-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
          title="Open Menu"
        >
          <Menu size={16} />
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] text-xs text-zinc-400 hover:text-zinc-200 transition-colors shadow-sm shrink-0"
        >
          <Search size={13} className="text-zinc-500 shrink-0" />
          <span className="hidden sm:inline">Quick Jump...</span>
          <span className="inline sm:hidden">Search</span>
          <kbd className="hidden sm:inline rounded border border-white/[0.1] bg-black/40 px-1 py-0.2 text-[10px] font-mono text-zinc-400">
            ⌘K
          </kbd>
        </button>

        {/* Live Headline Stat Ticker (Clean, Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-white/[0.08] text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans">Peak RPS</span>
            <span className="font-semibold text-zinc-200">
              {Math.round(derivations.peakRps.value).toLocaleString()}
            </span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans">App Pods</span>
            <span className="font-semibold text-indigo-300">
              {derivations.totalAppInstances.value}
            </span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans">DB QPS</span>
            <span className="font-semibold text-emerald-300">
              {Math.round(derivations.actualDbQps.value).toLocaleString()}
            </span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans">Cost/mo</span>
            <span className="font-semibold text-amber-300">
              ${Math.round(derivations.totalMonthlyCost.value).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Active Scenario Indicator & Reset */}
      <div className="flex items-center gap-2 shrink-0">
        {scenario !== 'Normal' && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Activity size={11} /> {scenario} Active
          </span>
        )}

        <button
          onClick={resetToDefault}
          title="Reset all inputs to Excel defaults"
          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
        >
          <RotateCcw size={12} className="shrink-0" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
