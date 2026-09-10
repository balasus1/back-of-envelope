'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Globe, HardDrive, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';

export default function FrontendCDNPage() {
  const { inputs, derivations, updateInput } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 03
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Frontend & CDN Edge Caching</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global Content Delivery Network sizing, edge compression, and origin offload ratio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase text-emerald-400 block font-mono">Edge Hit Ratio</span>
            <span className="font-mono text-base font-bold text-emerald-300">
              {inputs.CDN_Cache_Hit_Ratio_Pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Bandwidth Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Interactive Sliders */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Globe size={14} className="text-indigo-400" />
            Edge Assumptions
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>CDN Cache Hit %</span>
                <span className="font-mono text-emerald-400">{inputs.CDN_Cache_Hit_Ratio_Pct}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="99.9"
                step="0.5"
                value={inputs.CDN_Cache_Hit_Ratio_Pct}
                onChange={(e) => updateInput('CDN_Cache_Hit_Ratio_Pct', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Static Asset / User</span>
                <span className="font-mono text-indigo-300">{inputs.Static_Asset_MB_Per_User} MB</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={inputs.Static_Asset_MB_Per_User}
                onChange={(e) => updateInput('Static_Asset_MB_Per_User', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Brotli Compression %</span>
                <span className="font-mono text-cyan-300">{inputs.Compression_Reduction_Pct}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={inputs.Compression_Reduction_Pct}
                onChange={(e) => updateInput('Compression_Reduction_Pct', Number(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* CDN Absorption Visualizer */}
        <div className="md:col-span-2 rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <HardDrive size={14} className="text-purple-400" />
            Static Asset & Bandwidth Offload Cascade
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
              <span className="text-[10px] uppercase text-zinc-500 font-mono block">Static Data/Day</span>
              <span className="font-mono text-base font-bold text-white">
                {derivations.staticDataGb.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} GB
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Asset demand</span>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
              <span className="text-[10px] uppercase text-emerald-400 font-mono block">CDN Absorbed</span>
              <span className="font-mono text-base font-bold text-emerald-300">
                {(derivations.staticDataGb.value - derivations.originTrafficGb.value).toFixed(1)} GB
              </span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">
                {inputs.CDN_Cache_Hit_Ratio_Pct}% edge cached
              </span>
            </div>

            <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3">
              <span className="text-[10px] uppercase text-rose-400 font-mono block">Origin Penetration</span>
              <span className="font-mono text-base font-bold text-rose-300">
                {derivations.originTrafficGb.value.toFixed(1)} GB
              </span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">Misses reaching backend</span>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
              <span className="text-[10px] uppercase text-zinc-500 font-mono block">Global Edge PoPs</span>
              <span className="font-mono text-base font-bold text-indigo-300">
                {derivations.edgeNodes.value} Nodes
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">5k RPS / PoP</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3 text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Dynamic API RPS passing edge to Gateway:
            </span>
            <span className="font-mono font-bold text-white">
              {Math.round(derivations.originBoundDynamicRps.value).toLocaleString()} req/s
            </span>
          </div>
        </div>
      </div>

      {/* Calculations Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Zap size={14} className="text-indigo-400" />
          Frontend & CDN Metrics Breakdown
        </h2>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">1. Total Static Data / Day (GB)</span>
              <p className="text-[11px] text-zinc-500">DAU × Static_Asset_MB_Per_User / 1024</p>
            </div>
            <Metric name="Static Data" metric={derivations.staticDataGb} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">2. Origin Traffic / Day (GB)</span>
              <p className="text-[11px] text-zinc-500">Static_Data_GB × (1 - CDN_Cache_Hit_Ratio_Pct / 100)</p>
            </div>
            <Metric name="Origin Traffic" metric={derivations.originTrafficGb} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">3. Required CDN Edge Nodes</span>
              <p className="text-[11px] text-zinc-500">CEIL(Peak_RPS / Edge_Node_Capacity_RPS)</p>
            </div>
            <Metric name="Edge Nodes" metric={derivations.edgeNodes} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">4. CDN Peak Bandwidth (Gbps)</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × Static_Asset_MB × 8 / 1024 / 1000</p>
            </div>
            <Metric name="Peak Bandwidth" metric={derivations.cdnBandwidthPeakGbps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">5. Effective Bandwidth after Compression (Gbps)</span>
              <p className="text-[11px] text-zinc-500">CDN_Peak_Gbps × (1 - Compression_Reduction_Pct / 100)</p>
            </div>
            <Metric name="Effective Bandwidth" metric={derivations.cdnEffectiveGbps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">6. Service Worker Absorbed RPS</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × Service_Worker_Hit_Pct / 100</p>
            </div>
            <Metric name="SW Absorbed" metric={derivations.swAbsorbedRps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">7. Origin-Bound Dynamic RPS</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × (1 - CDN_Cache_Hit_Ratio_Pct / 100)</p>
            </div>
            <Metric name="Origin Dynamic RPS" metric={derivations.originBoundDynamicRps} />
          </div>
        </div>
      </div>
    </div>
  );
}