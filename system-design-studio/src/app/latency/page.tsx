'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Clock, ShieldCheck, AlertOctagon, Zap, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function LatencyPage() {
  const { inputs, derivations, updateInput } = useStore();

  const hops = [
    { name: 'Client -> DNS', latency: inputs.DNS_Lookup_ms, notes: 'Cached in browser/OS after 1st hit' },
    { name: 'DNS -> CDN Edge', latency: inputs.CDN_Edge_ms, notes: 'Anycast routing to nearest PoP' },
    { name: 'CDN -> Origin (Miss)', latency: inputs.CDN_Origin_Miss_ms, notes: 'Only 2% of traffic on cache miss' },
    { name: 'Origin -> LB', latency: inputs.LB_Forward_ms, notes: 'NLB TCP handoff' },
    { name: 'LB -> Gateway', latency: inputs.LB_Forward_ms, notes: 'mTLS proxying in private VPC' },
    { name: 'API Gateway', latency: Number(derivations.gatewayLatencyMs.value.toFixed(1)), notes: 'JWT verify + token bucket + route' },
    { name: 'Gateway -> Service', latency: 1, notes: 'Service mesh sidecar hop (Envoy)' },
    { name: 'Service Processing', latency: inputs.Service_Process_ms, notes: 'Core business logic execution' },
    { name: 'Service -> Redis', latency: inputs.Redis_Query_ms, notes: 'In-memory cache read' },
    { name: 'Service -> Postgres', latency: inputs.DB_Query_ms, notes: 'Indexed primary key / foreign key lookup' },
    { name: 'JSON Serialization', latency: 1, notes: 'DTO serialization' },
    { name: 'Reverse Egress Path', latency: 5, notes: 'TLS encapsulation back to client' },
  ];

  let cumulative = 0;
  const waterfallData = hops.map((h) => {
    cumulative += h.latency;
    return {
      name: h.name,
      hopLatency: h.latency,
      cumulative: Number(cumulative.toFixed(1)),
      notes: h.notes,
    };
  });

  const isPass = derivations.isSlaPass;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 07
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Hop-by-Hop Network Latency Budget</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            End-to-end request latency decomposition, tail latency amplification (P95/P99), and SLA validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`rounded-lg border px-3 py-1.5 text-right font-mono ${
            isPass ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
          }`}>
            <span className="text-[10px] uppercase text-zinc-400 block font-sans">SLA Compliance</span>
            <span className="text-base font-bold flex items-center justify-end gap-1">
              {isPass ? <ShieldCheck size={16} /> : <AlertOctagon size={16} />}
              {isPass ? 'PASS' : 'FAIL'} ({derivations.p95Latency.value.toFixed(1)}ms / {inputs.SLA_P95_ms}ms)
            </span>
          </div>
        </div>
      </div>

      {/* Latency Percentiles Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Uncached P50</span>
          <div className="font-mono text-lg font-bold text-zinc-200 mt-0.5">
            {derivations.uncachedPathP50.value.toFixed(1)} ms
          </div>
          <span className="text-[10px] text-zinc-400">Origin miss + DB</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Cached P50</span>
          <div className="font-mono text-lg font-bold text-emerald-400 mt-0.5">
            {derivations.cachedPathP50.value.toFixed(1)} ms
          </div>
          <span className="text-[10px] text-zinc-400">Fast path (CDN + Redis)</span>
        </div>

        <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3.5">
          <span className="text-[10px] font-mono uppercase text-indigo-400 block">Blended P50</span>
          <div className="font-mono text-lg font-bold text-indigo-300 mt-0.5">
            {derivations.blendedP50.value.toFixed(1)} ms
          </div>
          <span className="text-[10px] text-zinc-400">98% cached / 2% miss</span>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-3.5">
          <span className="text-[10px] font-mono uppercase text-purple-400 block">P95 Tail Latency</span>
          <div className="font-mono text-lg font-bold text-purple-300 mt-0.5">
            {derivations.p95Latency.value.toFixed(1)} ms
          </div>
          <span className="text-[10px] text-zinc-400">1.8x amplification</span>
        </div>

        <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3.5">
          <span className="text-[10px] font-mono uppercase text-rose-400 block">P99 Worst 1%</span>
          <div className="font-mono text-lg font-bold text-rose-300 mt-0.5">
            {derivations.p99Latency.value.toFixed(1)} ms
          </div>
          <span className="text-[10px] text-zinc-400">3.0x amplification</span>
        </div>
      </div>

      {/* Recharts Waterfall Chart */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Clock size={14} className="text-indigo-400" />
          Cumulative Hop Latency Waterfall (ms)
        </h2>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0d14',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(val: any, name: any) => [`${val} ms`, name === 'cumulative' ? 'Cumulative' : 'Hop Delay']}
              />
              <Bar dataKey="cumulative" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === waterfallData.length - 1
                        ? '#ec4899'
                        : index === 7 || index === 2
                        ? '#8b5cf6'
                        : '#6366f1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hop Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
            Hop-by-Hop Breakdown Matrix
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Network Hop</th>
                <th className="py-2.5 px-3 font-semibold text-right">Hop Latency (ms)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Cumulative (ms)</th>
                <th className="py-2.5 px-3 font-semibold text-right">% of Total</th>
                <th className="py-2.5 px-4 font-semibold">Architectural Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {waterfallData.map((h) => {
                const total = waterfallData[waterfallData.length - 1].cumulative;
                const pct = ((h.hopLatency / total) * 100).toFixed(1);
                return (
                  <tr key={h.name} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 font-medium text-white">{h.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-300">{h.hopLatency} ms</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-300">{h.cumulative} ms</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-500">{pct}%</td>
                    <td className="py-2.5 px-4 text-zinc-400 text-[11px]">{h.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}