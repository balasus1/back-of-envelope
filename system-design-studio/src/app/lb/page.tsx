'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { GitBranch, Shield, Zap, Server, CheckCircle2 } from 'lucide-react';

export default function LoadBalancerPage() {
  const { inputs, derivations } = useStore();

  const lbComparison = [
    { tier: 'Layer 4 (NLB)', protocol: 'TCP / UDP / TLS Passthrough', throughput: 'Millions of conns/sec', latency: '< 0.5 ms', role: 'Absorbs SYN floods, Anycast VIP, TLS offload', icon: Shield },
    { tier: 'Layer 7 (ALB)', protocol: 'HTTP/1.1, HTTP/2, gRPC, WebSocket', throughput: '100k+ RPS / unit', latency: '~1.5 ms', role: 'Path-based routing, header rewrite, cookie stickiness', icon: Server },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 05
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Load Balancer Architecture</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Two-tier load balancing strategy: L4 Network Load Balancer (NLB) + L7 Application Load Balancer (ALB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase text-cyan-400 block font-mono">Open Sockets</span>
            <span className="font-mono text-base font-bold text-cyan-200">
              {Math.round(derivations.lbConcurrentConns.value).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Tier LB Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lbComparison.map((lb) => {
          const Icon = lb.icon;
          return (
            <div key={lb.tier} className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-indigo-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">{lb.tier}</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                  {lb.protocol}
                </span>
              </div>
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Latency Added</span>
                  <span className="font-mono text-emerald-400">{lb.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Throughput</span>
                  <span className="font-mono text-indigo-300">{lb.throughput}</span>
                </div>
                <div className="pt-1 text-[11px] text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                  <strong>Primary Role:</strong> {lb.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Math & Derivations */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Zap size={14} className="text-indigo-400" />
          Load Balancer Connection & Protocol Math
        </h2>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">1. Concurrent TCP Sockets</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × 2 (2s average connection hold duration)</p>
            </div>
            <Metric name="Concurrent Conns" metric={derivations.lbConcurrentConns} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">2. TLS Handshakes / sec</span>
              <p className="text-[11px] text-zinc-500">Peak_RPS × SSL_Rate% (10% new connection negotiation)</p>
            </div>
            <Metric name="TLS Handshakes" metric={derivations.lbTlsHandshakes} />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">3. LB Forwarding Latency Added</span>
              <p className="text-[11px] text-zinc-500">Fixed NLB + ALB routing hop</p>
            </div>
            <span className="font-mono text-xs text-white font-semibold">{inputs.LB_Forward_ms} ms</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">4. Health Check Probe Interval</span>
              <p className="text-[11px] text-zinc-500">TCP & HTTP /health endpoint check periodicity</p>
            </div>
            <span className="font-mono text-xs text-zinc-300">5 seconds</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">5. Connection Draining Window</span>
              <p className="text-[11px] text-zinc-500">Grace period for in-flight requests during rolling updates</p>
            </div>
            <span className="font-mono text-xs text-zinc-300">30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}