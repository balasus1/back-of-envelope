'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Shield, Key, Lock, Radio, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function GatewayPage() {
  const { inputs, derivations, updateInput } = useStore();

  const rateLimitTiers = [
    { tier: 'Anonymous', limit: `${inputs.Rate_Limit_Anonymous_RPM} RPM`, window: '60s sliding', burst: '15 req', target: 'Public catalog browsing' },
    { tier: 'Authenticated User', limit: `${inputs.Rate_Limit_User_RPM} RPM`, window: '60s sliding', burst: '150 req', target: 'Order checkout, account' },
    { tier: 'Premium / API Partner', limit: `${inputs.Rate_Limit_Premium_RPM} RPM`, window: '60s sliding', burst: '1000 req', target: 'Merchant inventory sync' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 04
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">API Gateway & Edge Layer</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Edge routing, rate limiting token bucket, JWT auth verification, and WebSocket / SSE connection sizing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase text-indigo-400 block font-mono">Sized Gateway Pods</span>
            <span className="font-mono text-base font-bold text-indigo-200">
              {derivations.gatewayAzPods.value} Pods (N+1 in 3 AZs)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Gateway Subsystems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sizing & Multi-AZ */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Cpu size={14} className="text-indigo-400" />
            Pod Sizing & Capacity
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Peak RPS Target</span>
              <span className="font-mono font-semibold text-white">{Math.round(derivations.peakRps.value).toLocaleString()} req/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Effective RPS / Pod (60% CPU)</span>
              <span className="font-mono font-semibold text-indigo-300">{derivations.effGatewayRps.value} req/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Raw Pods Needed</span>
              <span className="font-mono font-semibold text-white">{derivations.rawGatewayPods.value} pods</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Multi-AZ Allocation (3 AZs)</span>
              <span className="font-mono font-semibold text-emerald-400">{derivations.gatewayAzPods.value} pods</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Total Gateway vCPUs</span>
              <span className="font-mono font-semibold text-purple-300">{derivations.gatewayCpuCores.value} cores</span>
            </div>
          </div>
        </div>

        {/* Auth & Cryptography */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Lock size={14} className="text-purple-400" />
            JWT & Cryptography
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">JWT Verifications</span>
              <span className="font-mono font-semibold text-white">{Math.round(derivations.jwtOps.value).toLocaleString()} ops/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Crypto Verification CPU</span>
              <span className="font-mono font-semibold text-indigo-300">{derivations.jwtCores.value.toFixed(1)} dedicated cores</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">JWKS Public Key Cache</span>
              <span className="font-mono font-semibold text-emerald-300">1 KB in RAM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Gateway Overhead Added</span>
              <span className="font-mono font-semibold text-amber-300">{derivations.gatewayLatencyMs.value.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">WAF Rules Evaluated</span>
              <span className="font-mono font-semibold text-zinc-300">{inputs.WAF_Rules} rules / req</span>
            </div>
          </div>
        </div>

        {/* Real-time Streams */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Radio size={14} className="text-cyan-400" />
            WebSocket & SSE Sizing
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">WebSocket Sockets (5% PCU)</span>
              <span className="font-mono font-semibold text-cyan-300">{derivations.wsConcurrent.value.toLocaleString()} conns</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">SSE Streams (10% PCU)</span>
              <span className="font-mono font-semibold text-indigo-300">{derivations.sseConcurrent.value.toLocaleString()} streams</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">WS Socket Buffer RAM</span>
              <span className="font-mono font-semibold text-amber-300">{derivations.wsMemoryMb.value.toFixed(0)} MB</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Rate Limit Redis Ops</span>
              <span className="font-mono font-semibold text-white">{Math.round(derivations.rlOps.value).toLocaleString()} ops/s</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Sliding Window RAM</span>
              <span className="font-mono font-semibold text-zinc-300">{derivations.rlMemoryMb.value.toFixed(1)} MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limiter Tiers Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Shield size={14} className="text-emerald-400" />
          Multi-Tier Token Bucket Rate Limit Policy
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-zinc-400 font-mono text-[11px]">
                <th className="py-2 px-3 font-semibold">Tier</th>
                <th className="py-2 px-3 font-semibold">Rate Limit</th>
                <th className="py-2 px-3 font-semibold">Window Strategy</th>
                <th className="py-2 px-3 font-semibold">Burst Headroom</th>
                <th className="py-2 px-3 font-semibold">Target Workload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {rateLimitTiers.map((r) => (
                <tr key={r.tier} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-medium text-white">{r.tier}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">{r.limit}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{r.window}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-300">{r.burst}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{r.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Derivation Metric Rows */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Zap size={14} className="text-indigo-400" />
          API Gateway Formulas & Derivations
        </h2>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">1. Effective RPS / Instance</span>
              <p className="text-[11px] text-zinc-500">Gateway_RPS_Capacity × (Gateway_CPU_Util_Target / 100)</p>
            </div>
            <Metric name="Effective RPS" metric={derivations.effGatewayRps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">2. Raw Gateway Instances</span>
              <p className="text-[11px] text-zinc-500">CEIL(Peak_RPS / Gateway_Effective_RPS)</p>
            </div>
            <Metric name="Raw Pods" metric={derivations.rawGatewayPods} />
          </div>

          <div className="py-2.5 flex items-center justify-between bg-indigo-950/20 px-2 rounded">
            <div>
              <span className="text-xs font-semibold text-indigo-200">3. Total Sized Pods (N+1 Multi-AZ)</span>
              <p className="text-[11px] text-indigo-400/80">(CEIL(Raw_Pods / 3) + 1) × 3 AZs</p>
            </div>
            <Metric name="Total AZ Pods" metric={derivations.gatewayAzPods} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">4. Gateway Latency Added (ms)</span>
              <p className="text-[11px] text-zinc-500">Gateway_Overhead_ms + (SSL_Handshake_ms × SSL_Rate_Pct / 100)</p>
            </div>
            <Metric name="Gateway Latency" metric={derivations.gatewayLatencyMs} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">5. Rate Limiter Redis Ops/s</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × 2 (Token bucket lookup + increment)</p>
            </div>
            <Metric name="Rate Limit Ops" metric={derivations.rlOps} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">6. JWT Verification CPU Cost (cores)</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × 0.5ms / 1000</p>
            </div>
            <Metric name="JWT CPU Cost" metric={derivations.jwtCores} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">7. WebSocket Socket Buffer RAM (MB)</span>
              <p className="text-[11px] text-zinc-500">WS_Concurrent × 64 KB / 1024</p>
            </div>
            <Metric name="WS Socket Memory" metric={derivations.wsMemoryMb} />
          </div>
        </div>
      </div>
    </div>
  );
}