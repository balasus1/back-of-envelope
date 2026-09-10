'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Layers, HardDrive, Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function CachePage() {
  const { inputs, derivations, updateInput } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 10
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Cache Architecture (Redis Cluster)</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            In-memory working set sizing: active user sessions, full catalog entries, hot SKUs, and shard allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-3 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-amber-400 block font-sans">Cluster Memory</span>
            <span className="text-base font-bold text-amber-200">
              {derivations.cacheTotalClusterGb.value} GB ({derivations.cacheNodes.value} Shards)
            </span>
          </div>
        </div>
      </div>

      {/* Cache Memory Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Session Tokens RAM</span>
          <div className="font-mono text-xl font-bold text-white mt-0.5">
            {derivations.sessionMemGb.value.toFixed(2)} GB
          </div>
          <span className="text-[10px] text-zinc-400">2M DAU × 1.5 KB</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Catalog Metadata</span>
          <div className="font-mono text-xl font-bold text-indigo-300 mt-0.5">
            {((inputs.CATALOG_SKUS * inputs.CATALOG_ENTRY_KB) / (1024 * 1024)).toFixed(2)} GB
          </div>
          <span className="text-[10px] text-zinc-400">500k SKUs × 3 KB</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Hot SKUs Cache</span>
          <div className="font-mono text-xl font-bold text-purple-300 mt-0.5">
            {((inputs.HOT_SKU_COUNT * inputs.HOT_SKU_ENTRY_KB) / (1024 * 1024)).toFixed(2)} GB
          </div>
          <span className="text-[10px] text-zinc-400">100k hot items × 1 KB</span>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3.5">
          <span className="text-[10px] font-mono uppercase text-amber-400 block">With 1.3x Overhead</span>
          <div className="font-mono text-xl font-bold text-amber-300 mt-0.5">
            {derivations.cacheWithOverheadGb.value.toFixed(2)} GB
          </div>
          <span className="text-[10px] text-zinc-400">jemalloc + dict overhead</span>
        </div>
      </div>

      {/* Cluster Sharding Matrix */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Zap size={14} className="text-indigo-400" />
          Redis Cluster Sizing & Throughput Math
        </h2>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">1. Peak Cache Operations / sec</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × QUERIES_PER_API_CALL</p>
            </div>
            <Metric name="Cache Ops" metric={derivations.cacheOps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">2. Cache Hit Operations</span>
              <p className="text-[11px] text-zinc-500">Cache_Ops × (CACHE_HIT_PCT / 100)</p>
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              {Math.round(derivations.cacheOps.value * (inputs.CACHE_HIT_PCT / 100)).toLocaleString()} ops/s (95%)
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">3. Primary Master Shards</span>
              <p className="text-[11px] text-zinc-500">MAX(3, CEIL(Ops / 100k_per_node))</p>
            </div>
            <Metric name="Redis Shards" metric={derivations.cacheNodes} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">4. Eviction Policy</span>
              <p className="text-[11px] text-zinc-500">volatile-lru with explicit TTLs on session tokens</p>
            </div>
            <span className="font-mono text-xs text-zinc-300">volatile-lru</span>
          </div>
        </div>
      </div>
    </div>
  );
}