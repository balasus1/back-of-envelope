'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Database, HardDrive, Cpu, Shield, Zap, ArrowDown } from 'lucide-react';

export default function DatabasePage() {
  const { inputs, derivations, updateInput } = useStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 09
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Database Design (PostgreSQL OLTP)</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            QPS cascade, IOPS provisioned storage, connection pooling math, 30-day retention forecast, and replica sizing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 px-3 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-blue-400 block font-sans">Actual Disk QPS</span>
            <span className="text-base font-bold text-blue-200">
              {Math.round(derivations.actualDbQps.value).toLocaleString()} QPS (95% Cached)
            </span>
          </div>
        </div>
      </div>

      {/* QPS Cascade Flow */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Zap size={14} className="text-indigo-400" />
          Query Demand & Cache Absorption Cascade
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Logical Query Demand</span>
            <div className="font-mono text-lg font-bold text-white">
              {Math.round(derivations.dbQps.value).toLocaleString()} QPS
            </div>
            <span className="text-[10px] text-zinc-400">Peak RPS × 3 queries</span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Read / Write Split</span>
            <div className="font-mono text-lg font-bold text-indigo-300">
              {Math.round(derivations.dbReadQps.value).toLocaleString()} R / {Math.round(derivations.dbWriteQps.value).toLocaleString()} W
            </div>
            <span className="text-[10px] text-zinc-400">80% Read / 20% Write</span>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block">Cache Absorbed Reads</span>
            <div className="font-mono text-lg font-bold text-emerald-300">
              {Math.round(derivations.dbReadQps.value * (inputs.CACHE_HIT_PCT / 100)).toLocaleString()} QPS
            </div>
            <span className="text-[10px] text-emerald-400/80">95% Redis hit rate</span>
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-400 block">Actual Disk QPS</span>
            <div className="font-mono text-lg font-bold text-blue-200">
              {Math.round(derivations.actualDbQps.value).toLocaleString()} QPS
            </div>
            <span className="text-[10px] text-blue-400/80">Hits PostgreSQL engine</span>
          </div>
        </div>
      </div>

      {/* Sizing Matrix: IOPS, Connections, Storage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* IOPS & Storage */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <HardDrive size={14} className="text-indigo-400" />
            IOPS & SSD Allocation
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Required Sustained IOPS</span>
              <span className="font-mono font-semibold text-white">{Math.round(derivations.dbIops.value).toLocaleString()} IOPS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Recommended (2x Headroom)</span>
              <span className="font-mono font-semibold text-emerald-400">{Math.round(derivations.dbIopsHeadroom.value).toLocaleString()} IOPS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">EBS Volume Provisioned</span>
              <span className="font-mono font-semibold text-indigo-300">{derivations.dbDiskSizeGb.value} GB (gp3 / io2)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">IOPS / Query Factor</span>
              <span className="font-mono font-semibold text-zinc-300">{inputs.DB_IOPS_PER_QUERY} iops / query</span>
            </div>
          </div>
        </div>

        {/* Connections & PgBouncer */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Cpu size={14} className="text-purple-400" />
            Connection Pool Sizing
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Conn / App Pod (Cores × 2 + 1)</span>
              <span className="font-mono font-semibold text-white">{inputs.Cores_Per_App_Instance * 2 + 1} conns</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Active App Pods</span>
              <span className="font-mono font-semibold text-indigo-300">{derivations.totalAppInstances.value} pods</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Max Connections (postgresql.conf)</span>
              <span className="font-mono font-semibold text-purple-300">{derivations.maxConnections.value} connections</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Connection Pooling</span>
              <span className="font-mono font-semibold text-emerald-400">PgBouncer (Transaction Mode)</span>
            </div>
          </div>
        </div>

        {/* Data Retention & Storage */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Database size={14} className="text-cyan-400" />
            30-Day Storage Projection
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Daily Writes</span>
              <span className="font-mono font-semibold text-white">{(derivations.dbWriteQps.value * 86400 / 1000000).toFixed(1)}M writes/day</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">30d Hot Table Data</span>
              <span className="font-mono font-semibold text-cyan-300">{(derivations.dbHotDataGb.value / 1024).toFixed(1)} TB</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">With Indexes & WAL (2x)</span>
              <span className="font-mono font-semibold text-amber-300">{(derivations.dbTotalStorageGb.value / 1024).toFixed(1)} TB</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Read Replicas Sized</span>
              <span className="font-mono font-semibold text-emerald-400">{derivations.dbReplicas.value} Nodes (r6i.xlarge)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculations Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Zap size={14} className="text-indigo-400" />
          Database Formulas & Derivations
        </h2>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">1. Total Logical DB QPS</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × QUERIES_PER_API_CALL</p>
            </div>
            <Metric name="Total DB QPS" metric={derivations.dbQps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">2. Physical Storage QPS (post-cache)</span>
              <p className="text-[11px] text-zinc-500">Cache_Miss_Reads + Write_QPS</p>
            </div>
            <Metric name="Actual DB QPS" metric={derivations.actualDbQps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">3. Recommended IOPS (2x Headroom)</span>
              <p className="text-[11px] text-zinc-500">Actual_DB_QPS × DB_IOPS_PER_QUERY × 2</p>
            </div>
            <Metric name="IOPS Headroom" metric={derivations.dbIopsHeadroom} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">4. Max Connections (postgresql.conf)</span>
              <p className="text-[11px] text-zinc-500">CEIL(Total_App_Instances × (Cores × 2 + 1) × 1.5)</p>
            </div>
            <Metric name="Max Connections" metric={derivations.maxConnections} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">5. Read Replicas Required</span>
              <p className="text-[11px] text-zinc-500">CEIL(Read_QPS / DB_READ_REPLICA_QPS)</p>
            </div>
            <Metric name="Read Replicas" metric={derivations.dbReplicas} />
          </div>
        </div>
      </div>
    </div>
  );
}