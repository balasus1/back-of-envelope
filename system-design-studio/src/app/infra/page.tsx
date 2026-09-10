'use client';

import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Server, Search, DollarSign, Cpu, HardDrive } from 'lucide-react';

export default function InfraPickerPage() {
  const { inputs, derivations } = useStore();
  const [search, setSearch] = useState('');

  const instances = [
    { workload: 'Kafka Broker', aws: 'm6i.2xlarge', vcpu: 8, ram: 32, rate: 0.384, countKey: derivations.kafkaBrokers.value, gcp: 'n2-standard-8', azure: 'Standard_D8s_v5', use: 'Steady high-throughput I/O' },
    { workload: 'Kafka Broker XL', aws: 'm6i.4xlarge', vcpu: 16, ram: 64, rate: 0.768, countKey: derivations.kafkaBrokers.value, gcp: 'n2-standard-16', azure: 'Standard_D16s_v5', use: 'Ultra high-throughput burst' },
    { workload: 'API Gateway', aws: 'c6i.xlarge', vcpu: 4, ram: 8, rate: 0.170, countKey: derivations.gatewayAzPods.value, gcp: 'c2-standard-4', azure: 'Standard_F4s_v2', use: 'CPU-bound TLS & rate limiting' },
    { workload: 'App Microservice', aws: 'c6i.xlarge', vcpu: 4, ram: 8, rate: 0.170, countKey: derivations.totalAppInstances.value - derivations.gatewayAzPods.value, gcp: 'c2-standard-4', azure: 'Standard_F4s_v2', use: 'Compute-optimized services' },
    { workload: 'App Service (High Mem)', aws: 'r6i.xlarge', vcpu: 4, ram: 32, rate: 0.252, countKey: inputs.Search_Svc_Instances, gcp: 'n2-highmem-4', azure: 'Standard_E4s_v5', use: 'Search & cache-heavy microservices' },
    { workload: 'Postgres Primary', aws: 'r6i.2xlarge', vcpu: 8, ram: 64, rate: 0.504, countKey: 1, gcp: 'n2-highmem-8', azure: 'Standard_E8s_v5', use: 'Memory-optimized primary ACID OLTP' },
    { workload: 'Postgres Read Replica', aws: 'r6i.xlarge', vcpu: 4, ram: 32, rate: 0.252, countKey: derivations.dbReplicas.value, gcp: 'n2-highmem-4', azure: 'Standard_E4s_v5', use: 'Read-scale query offload' },
    { workload: 'Redis Cluster Shard', aws: 'cache.r6g.xlarge', vcpu: 4, ram: 26, rate: 0.226, countKey: inputs.REDIS_SHARDS, gcp: 'Memorystore Std', azure: 'Azure Cache P2', use: 'Managed Redis in-memory storage' },
    { workload: 'OpenSearch Search Node', aws: 'r6g.2xlarge', vcpu: 8, ram: 64, rate: 0.476, countKey: 2, gcp: 'n2-highmem-8', azure: 'Standard_E8s_v5', use: 'Full-text search indexing' },
    { workload: 'Bastion Host', aws: 't3.micro', vcpu: 2, ram: 1, rate: 0.0104, countKey: 1, gcp: 'e2-micro', azure: 'Standard_B1s', use: 'SSH jumping / ops management' },
  ];

  const filteredInstances = instances.filter(
    (i) =>
      i.workload.toLowerCase().includes(search.toLowerCase()) ||
      i.aws.toLowerCase().includes(search.toLowerCase()) ||
      i.use.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 15
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Cloud Infra Instance Catalog & Math</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Standard cloud instance families, vCPU / RAM specifications, hourly rates, and live monthly costs for active cluster sizes.
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search instance types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-black/40 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
      </div>

      {/* Instance Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/50 text-zinc-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Workload Role</th>
                <th className="py-3 px-3 font-semibold text-amber-300">AWS Instance</th>
                <th className="py-3 px-3 font-semibold text-center">vCPU</th>
                <th className="py-3 px-3 font-semibold text-center">RAM</th>
                <th className="py-3 px-3 font-semibold text-right">Rate ($/hr)</th>
                <th className="py-3 px-3 font-semibold text-center">Active Count</th>
                <th className="py-3 px-3 font-semibold text-right text-emerald-400">Monthly Est.</th>
                <th className="py-3 px-4 font-semibold">Best Architectural Fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {filteredInstances.map((i) => {
                const monthly = i.countKey * i.rate * inputs.Cost_Hours_Month;
                return (
                  <tr key={i.workload} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-medium text-white">{i.workload}</td>
                    <td className="py-3 px-3 font-mono font-medium text-amber-300">{i.aws}</td>
                    <td className="py-3 px-3 text-center font-mono text-zinc-400">{i.vcpu}</td>
                    <td className="py-3 px-3 text-center font-mono text-zinc-400">{i.ram} GB</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-300">${i.rate.toFixed(4)}</td>
                    <td className="py-3 px-3 text-center font-mono text-indigo-300 font-semibold">{i.countKey}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      ${Math.round(monthly).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">{i.use}</td>
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