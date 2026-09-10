'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Activity, HardDrive, BarChart3, Clock, Zap, ShieldCheck } from 'lucide-react';

export default function ObservabilityPage() {
  const { inputs, derivations } = useStore();

  const slos = [
    { target: 'Availability', slo: '99.95% (Three and a half 9s)', monthlyBudget: '21.9 minutes outage / mo', metrics: 'HTTP 5xx error rate from Gateway' },
    { target: 'P95 Latency', slo: '< 200 ms (Order checkout)', monthlyBudget: '5% of requests may exceed 200ms', metrics: 'Envoy service mesh timer histograms' },
    { target: 'Kafka Ingestion Lag', slo: '< 1000 messages / partition', monthlyBudget: 'Max lag duration < 60 seconds', metrics: 'kafka_consumergroup_lag exporter' },
    { target: 'Payment Success Rate', slo: '99.99% (Four 9s)', monthlyBudget: '0.01% unrecoverable failure allowed', metrics: 'Dead-letter queue topic counter' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 13
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Observability & Telemetry Sizing</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Metrics ingestion volume, log retention disk storage, distributed OpenTelemetry trace spans, and SLO error budgets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-purple-400 block font-sans">Daily Log Volume</span>
            <span className="text-base font-bold text-purple-200">
              {derivations.logsGbDay.value.toFixed(1)} GB/day (30d: {derivations.logsStorageMonthGb.value.toFixed(0)} GB)
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Ingestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-4 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <BarChart3 size={15} />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Prometheus Metrics</span>
          </div>
          <div className="font-mono text-xl font-bold text-white">
            {(derivations.metricsDataPointsDay.value / 1000000000).toFixed(1)}B pts/day
          </div>
          <p className="text-[11px] text-zinc-400">
            {derivations.metricsStorageGb.value.toFixed(1)} GB/day storage (100 metrics/req)
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <HardDrive size={15} />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">OpenSearch Logs</span>
          </div>
          <div className="font-mono text-xl font-bold text-white">
            {derivations.logsGbDay.value.toFixed(1)} GB/day
          </div>
          <p className="text-[11px] text-zinc-400">
            {(derivations.logsStorageMonthGb.value / 1024).toFixed(1)} TB across 30-day retention
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity size={15} />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">OpenTelemetry Traces</span>
          </div>
          <div className="font-mono text-xl font-bold text-white">
            {derivations.tracesGbDay.value.toFixed(2)} GB/day
          </div>
          <p className="text-[11px] text-zinc-400">
            {inputs.Trace_Sample_Rate_Pct}% sampling rate (5 KB / span)
          </p>
        </div>
      </div>

      {/* SLO and Error Budget Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden space-y-2 p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <ShieldCheck size={14} className="text-emerald-400" />
          Service Level Objectives (SLOs) & Error Budget Allocation
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-semibold">SLO Category</th>
                <th className="py-2.5 px-3 font-semibold">Target Objective</th>
                <th className="py-2.5 px-3 font-semibold">Monthly Error Budget</th>
                <th className="py-2.5 px-4 font-semibold">Telemetry Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {slos.map((s) => (
                <tr key={s.target} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 font-medium text-white">{s.target}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-300 font-semibold">{s.slo}</td>
                  <td className="py-2.5 px-3 font-mono text-amber-300">{s.monthlyBudget}</td>
                  <td className="py-2.5 px-4 text-zinc-400 text-[11px]">{s.metrics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}