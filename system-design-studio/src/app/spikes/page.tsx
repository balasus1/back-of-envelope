'use client';

import { useStore, Scenario } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Flame, ShieldAlert, Cpu, Layers, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SpikesPage() {
  const { inputs, derivations, getDerivationsForScenario, setScenario, scenario } = useStore();

  const scenarios: { name: Scenario; multiplier: number; dur: string; trigger: string }[] = [
    { name: 'Normal', multiplier: 1, dur: '24 hours', trigger: 'Steady-state baseline' },
    { name: 'Flash Sale', multiplier: 5, dur: '1 hour', trigger: 'Scheduled lightning promotion' },
    { name: 'Black Friday', multiplier: 10, dur: '6 hours', trigger: 'Annual global holiday peak' },
    { name: 'Cyber Monday', multiplier: 15, dur: '8 hours', trigger: 'Annual digital discount rush' },
    { name: 'DDoS', multiplier: 100, dur: 'Burst', trigger: 'Malicious botnet volumetric flood' },
  ];

  const priorities = [
    { level: 'P1 (NEVER shed)', shedAt: 'Never (100% Guaranteed)', services: 'Payment processing, Order placement, Auth verification', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' },
    { level: 'P2 (Shed last)', shedAt: '95% Cluster Capacity', services: 'Cart modifications, Checkout reviews, Inventory reserve', color: 'text-blue-400 border-blue-500/30 bg-blue-950/20' },
    { level: 'P3 (Standard)', shedAt: '80% Cluster Capacity', services: 'Search auto-complete, Recommendations, Related items', color: 'text-amber-400 border-amber-500/30 bg-amber-950/20' },
    { level: 'P4 (Non-critical)', shedAt: '70% Cluster Capacity', services: 'Customer reviews, Q&A sections, Image high-res zoom', color: 'text-orange-400 border-orange-500/30 bg-orange-950/20' },
    { level: 'P5 (Shed first)', shedAt: '60% Cluster Capacity', services: 'Real-time analytics, Personalized banners, Audit tracking', color: 'text-rose-400 border-rose-500/30 bg-rose-950/20' },
  ];

  const ddosLayers = [
    { layer: 'L1: Edge Scrubbing', role: 'CloudFront & Cloudflare Anycast DDoS absorption (100+ Tbps capacity)' },
    { layer: 'L2: AWS WAF', role: 'Rate-based rules (e.g. 2000 req/5min per IP), SQLi/XSS managed rule sets' },
    { layer: 'L3: L4 Network LB', role: 'SYN flood absorption, connection limits, TLS termination offload' },
    { layer: 'L4: API Gateway', role: 'Redis token bucket rate limiter (10/100/500 RPM tiers)' },
    { layer: 'L5: Service Mesh', role: 'Envoy circuit breakers per backend service with outlier detection' },
    { layer: 'L6: Bulkheads', role: 'Max concurrent thread pools isolating Payment from Search traffic' },
    { layer: 'L7: DB Connection Pools', role: 'PgBouncer strict max client bounds to fail fast instead of queueing' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 12
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Traffic Spikes, Autoscaling & DDoS</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Side-by-side scenario modeling, auto-scaling cooldown math, and priority load-shedding hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-rose-400 block font-sans">Load Shed Threshold</span>
            <span className="text-base font-bold text-rose-200">
              {Math.round(derivations.shedThresholdRps.value).toLocaleString()} req/s (90% Cap)
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Scenario Comparison Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden space-y-2 p-5">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Flame size={14} className="text-rose-400" />
            Side-by-Side Scenario Comparison Matrix
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono">Computed live across all 5 models</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Metric</th>
                {scenarios.map((s) => (
                  <th
                    key={s.name}
                    className={`py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white ${
                      scenario === s.name ? 'text-indigo-400 font-bold bg-indigo-950/30' : ''
                    }`}
                    onClick={() => setScenario(s.name)}
                  >
                    {s.name} {scenario === s.name && '✓'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Spike Multiplier</td>
                {scenarios.map((s) => (
                  <td key={s.name} className="py-2.5 px-3 text-right font-mono text-zinc-400">
                    {s.multiplier}x
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Peak API RPS</td>
                {scenarios.map((s) => {
                  const normalPeakRps = getDerivationsForScenario('Normal').peakRps.value;
                  const spikeRps = normalPeakRps * s.multiplier;
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono font-semibold text-amber-300">
                      {Math.round(spikeRps).toLocaleString()}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Gateway Pods (N+1 AZ)</td>
                {scenarios.map((s) => {
                  const d = getDerivationsForScenario(s.name);
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono text-indigo-300">
                      {d.gatewayAzPods.value} pods
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Total App Fleet Pods</td>
                {scenarios.map((s) => {
                  const d = getDerivationsForScenario(s.name);
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono text-white font-bold">
                      {d.totalAppInstances.value} pods
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Kafka Brokers</td>
                {scenarios.map((s) => {
                  const d = getDerivationsForScenario(s.name);
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono text-purple-300">
                      {d.kafkaBrokers.value} nodes
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Actual Database QPS</td>
                {scenarios.map((s) => {
                  const d = getDerivationsForScenario(s.name);
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono text-blue-300">
                      {Math.round(d.actualDbQps.value).toLocaleString()} QPS
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-white">Monthly Infra Cost</td>
                {scenarios.map((s) => {
                  const d = getDerivationsForScenario(s.name);
                  return (
                    <td key={s.name} className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      ${Math.round(d.totalMonthlyCost.value).toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Load Shedding Priority Ladder */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-400" />
          Graceful Degradation: 5-Tier Priority Load Shedding Ladder
        </h2>

        <div className="space-y-2">
          {priorities.map((p) => (
            <div key={p.level} className={`rounded-lg border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${p.color}`}>
              <div className="space-y-0.5">
                <span className="font-mono font-bold uppercase">{p.level}</span>
                <p className="text-zinc-300 text-[11px]">{p.services}</p>
              </div>
              <div className="font-mono text-right font-semibold">
                Sheds at: {p.shedAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DDoS Defense Matrix */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Layers size={14} className="text-purple-400" />
          7-Layer Deep DDoS Defense Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {ddosLayers.map((l) => (
            <div key={l.layer} className="rounded border border-white/[0.06] bg-black/40 p-2.5 space-y-1">
              <span className="font-mono font-bold text-indigo-300 block">{l.layer}</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{l.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}