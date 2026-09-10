'use client';

import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { NumberInput } from '../../components/NumberInput';
import { Cpu, Server, Plus, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function BackendServicesPage() {
  const { inputs, derivations, updateInput } = useStore();

  const services = [
    { name: 'API Gateway', inputKey: 'Gateway_Instances_Sized' as const, instances: derivations.gatewayAzPods.value, cores: 4, ram: 8, cap: inputs.Gateway_RPS_Capacity, notes: 'Rate limiting, JWT auth, TLS, edge routing', isDerived: true },
    { name: 'Order Service', inputKey: 'Order_Svc_Instances' as const, instances: inputs.Order_Svc_Instances, cores: 4, ram: 8, cap: 2000, notes: 'Outbox pattern, order saga, Kafka producer', isDerived: false },
    { name: 'Payment Service', inputKey: 'Payment_Svc_Instances' as const, instances: inputs.Payment_Svc_Instances, cores: 4, ram: 8, cap: 1500, notes: 'Idempotency keys, PCI-DSS scoped zone', isDerived: false },
    { name: 'Inventory Service', inputKey: 'Inventory_Svc_Instances' as const, instances: inputs.Inventory_Svc_Instances, cores: 4, ram: 8, cap: 2500, notes: 'High-throughput stock locks, Redis cache', isDerived: false },
    { name: 'Notification Service', inputKey: 'Notification_Svc_Instances' as const, instances: inputs.Notification_Svc_Instances, cores: 2, ram: 4, cap: 5000, notes: 'Async worker, Kafka consumer, Push/SMS', isDerived: false },
    { name: 'Search Service', inputKey: 'Search_Svc_Instances' as const, instances: inputs.Search_Svc_Instances, cores: 4, ram: 16, cap: 1500, notes: 'OpenSearch query facade & indexing', isDerived: false },
  ];

  const totalInstances = services.reduce((acc, s) => acc + s.instances, 0);
  const totalCores = services.reduce((acc, s) => acc + s.instances * s.cores, 0);
  const totalRamGb = services.reduce((acc, s) => acc + s.instances * s.ram, 0);
  const totalCapacityRps = services.reduce((acc, s) => acc + s.instances * s.cap, 0);
  const headroom = derivations.headroomPct.value;
  const isHealthy = headroom >= 50;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 06
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Backend Microservices Fleet</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Service instance sizing, core/memory allocation, throughput capacity, and cluster headroom buffer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={clsx(
            'rounded-lg border px-3 py-1.5 text-right font-mono',
            isHealthy ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300' : 'border-rose-500/30 bg-rose-950/30 text-rose-300'
          )}>
            <span className="text-[10px] uppercase text-zinc-400 block font-sans">Cluster Headroom</span>
            <span className="text-base font-bold">
              {headroom.toFixed(0)}% {isHealthy ? '— OK' : '— THIN'}
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Cluster Sizing Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Pod Instances</span>
          <div className="font-mono text-xl font-bold text-white mt-0.5">{totalInstances} Pods</div>
          <span className="text-[10px] text-zinc-400">Across 6 services</span>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Compute Cores</span>
          <div className="font-mono text-xl font-bold text-indigo-300 mt-0.5">{totalCores} vCPUs</div>
          <span className="text-[10px] text-zinc-400">Allocated CPU</span>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Cluster Memory</span>
          <div className="font-mono text-xl font-bold text-purple-300 mt-0.5">{totalRamGb} GB RAM</div>
          <span className="text-[10px] text-zinc-400">Working memory</span>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Aggregate RPS Capacity</span>
          <div className="font-mono text-xl font-bold text-emerald-300 mt-0.5">
            {totalCapacityRps.toLocaleString()} req/s
          </div>
          <span className="text-[10px] text-zinc-400">Peak demand: {Math.round(derivations.peakRps.value).toLocaleString()}</span>
        </div>
      </div>

      {/* Microservices Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Server size={14} className="text-indigo-400" />
            Service Deployment Matrix
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono">Adjust instance counts below to observe live headroom changes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Service Name</th>
                <th className="py-2.5 px-3 font-semibold text-center">Instances</th>
                <th className="py-2.5 px-3 font-semibold text-center">Cores / Pod</th>
                <th className="py-2.5 px-3 font-semibold text-center">RAM / Pod</th>
                <th className="py-2.5 px-3 font-semibold text-right">RPS / Pod</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total RPS Cap</th>
                <th className="py-2.5 px-4 font-semibold">Architecture Role & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {services.map((svc) => (
                <tr key={svc.name} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {svc.name}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {svc.isDerived ? (
                      <span className="font-mono text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/30">
                        {svc.instances}
                      </span>
                    ) : (
                      <NumberInput
                        min={1}
                        max={100}
                        value={svc.instances}
                        onChange={(val) => updateInput(svc.inputKey as any, val)}
                        className="w-14 text-center px-1.5 py-0.5"
                      />
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-center text-zinc-400">{svc.cores}</td>
                  <td className="py-3 px-3 font-mono text-center text-zinc-400">{svc.ram} GB</td>
                  <td className="py-3 px-3 font-mono text-right text-zinc-400">{svc.cap.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-right text-emerald-400 font-semibold">
                    {(svc.instances * svc.cap).toLocaleString()} req/s
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[11px] leading-tight">{svc.notes}</td>
                </tr>
              ))}
              <tr className="bg-black/60 font-semibold border-t border-white/[0.1]">
                <td className="py-3 px-4 text-white uppercase font-mono text-[11px]">Fleet Total</td>
                <td className="py-3 px-3 text-center font-mono text-indigo-300">{totalInstances}</td>
                <td className="py-3 px-3 text-center font-mono text-zinc-200">{totalCores} vCPU</td>
                <td className="py-3 px-3 text-center font-mono text-zinc-200">{totalRamGb} GB</td>
                <td className="py-3 px-3 text-right font-mono text-zinc-500">—</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-300 font-bold">
                  {totalCapacityRps.toLocaleString()} req/s
                </td>
                <td className="py-3 px-4 text-zinc-500 text-[11px] font-mono">
                  {headroom.toFixed(0)}% Headroom vs Peak
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}