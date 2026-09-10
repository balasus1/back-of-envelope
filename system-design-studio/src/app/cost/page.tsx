'use client';

import { useState } from 'react';
import { useStore, Scenario } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { DollarSign, PieChart as PieIcon, TrendingUp, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CostEstimatorPage() {
  const { inputs, derivations, getDerivationsForScenario, scenario } = useStore();
  const [compareScenario, setCompareScenario] = useState<Scenario>('Black Friday');

  const normalDerivations = getDerivationsForScenario('Normal');
  const compareDerivations = getDerivationsForScenario(compareScenario);

  const costLines = [
    { name: 'Kafka Brokers', count: derivations.kafkaBrokers.value, rate: inputs.Cost_Broker_hr, monthly: derivations.kafkaBrokers.value * inputs.Cost_Broker_hr * inputs.Cost_Hours_Month, cat: 'Compute' },
    { name: 'KRaft Controllers', count: 3, rate: 0.096, monthly: 3 * 0.096 * inputs.Cost_Hours_Month, cat: 'Compute' },
    { name: 'App Servers (5 Services)', count: derivations.totalAppInstances.value - derivations.gatewayAzPods.value, rate: inputs.Cost_App_hr, monthly: (derivations.totalAppInstances.value - derivations.gatewayAzPods.value) * inputs.Cost_App_hr * inputs.Cost_Hours_Month, cat: 'Compute' },
    { name: 'API Gateway (Multi-AZ)', count: derivations.gatewayAzPods.value, rate: inputs.Cost_Gateway_hr, monthly: derivations.gatewayAzPods.value * inputs.Cost_Gateway_hr * inputs.Cost_Hours_Month, cat: 'Compute' },
    { name: 'NLB / ALB Balancers', count: 2, rate: inputs.Cost_NLB_hr, monthly: 2 * inputs.Cost_NLB_hr * inputs.Cost_Hours_Month, cat: 'Network' },
    { name: 'PostgreSQL Primary (r6i.2xlarge)', count: 1, rate: inputs.Cost_DB_hr, monthly: 1 * inputs.Cost_DB_hr * inputs.Cost_Hours_Month, cat: 'Database' },
    { name: 'PostgreSQL Replicas', count: derivations.dbReplicas.value, rate: inputs.Cost_DB_hr, monthly: derivations.dbReplicas.value * inputs.Cost_DB_hr * inputs.Cost_Hours_Month, cat: 'Database' },
    { name: 'Redis Cluster Shards', count: inputs.REDIS_SHARDS, rate: inputs.Cost_Redis_hr, monthly: inputs.REDIS_SHARDS * inputs.Cost_Redis_hr * inputs.Cost_Hours_Month, cat: 'Database' },
    { name: 'NAT Gateways (Multi-AZ)', count: 2, rate: 0.045, monthly: 2 * 0.045 * inputs.Cost_Hours_Month, cat: 'Network' },
    { name: 'S3 (Backups + Assets)', count: 1, rate: 0, monthly: (derivations.dbTotalStorageGb.value / 1024) * inputs.Cost_S3_Per_TB, cat: 'Storage' },
    { name: 'CloudFront CDN Egress', count: 1, rate: 0, monthly: derivations.monthlyEgressTb.value * 1024 * inputs.Cost_CDN_Per_GB, cat: 'Network' },
    { name: 'Datadog / CloudWatch Telemetry', count: 1, rate: 0, monthly: 500, cat: 'Observability' },
    { name: 'AWS Secrets Manager (20 secrets)', count: 20, rate: 0, monthly: 20 * 0.4, cat: 'Observability' },
    { name: 'Route53 DNS & Health Checks', count: 5, rate: 0, monthly: 5 * 0.5 + 50, cat: 'Network' },
    { name: 'Periodic Load Testing (Spot)', count: 1, rate: 0, monthly: 200, cat: 'Observability' },
  ];

  const pieData = [
    { name: 'Compute (App, GW, Kafka)', value: Math.round(derivations.costBreakdown.compute), color: '#6366f1' },
    { name: 'Database & Cache (PG, Redis)', value: Math.round(derivations.costBreakdown.database), color: '#3b82f6' },
    { name: 'Network & CDN Egress', value: Math.round(derivations.costBreakdown.network), color: '#10b981' },
    { name: 'S3 Storage & Backups', value: Math.round(derivations.costBreakdown.storage), color: '#f59e0b' },
    { name: 'Observability & Monitoring', value: Math.round(derivations.costBreakdown.observability), color: '#ec4899' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 16
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Cloud Infrastructure Cost Estimator</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete line-item monthly & annual cloud cost estimation, categorized breakdown, and unit cost per 1,000 DAU.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-emerald-400 block font-sans">Total Monthly Cost</span>
            <span className="text-lg font-bold text-emerald-300">
              ${Math.round(derivations.totalMonthlyCost.value).toLocaleString()} / mo
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency North Star & Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-indigo-400 block">Unit Economics North Star</span>
          <div className="font-mono text-xl font-bold text-white">
            ${derivations.costPer1000Dau.value.toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-400">Cost per 1,000 Daily Active Users / month</p>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Annualized Spend</span>
          <div className="font-mono text-xl font-bold text-zinc-200">
            ${Math.round(derivations.totalAnnualCost.value).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Monthly spend × 12 months</p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 block">Compare Scenario</span>
            <select
              value={compareScenario}
              onChange={(e) => setCompareScenario(e.target.value as Scenario)}
              className="bg-black/50 border border-white/[0.1] rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
            >
              <option value="Normal">Normal</option>
              <option value="Flash Sale">Flash Sale</option>
              <option value="Black Friday">Black Friday</option>
              <option value="Cyber Monday">Cyber Monday</option>
              <option value="DDoS">DDoS</option>
            </select>
          </div>
          <div className="font-mono text-xl font-bold text-amber-300">
            ${Math.round(compareDerivations.totalMonthlyCost.value).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">
            {scenario} (${Math.round(derivations.totalMonthlyCost.value).toLocaleString()}) vs {compareScenario}
          </p>
        </div>
      </div>

      {/* Chart and Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Donut Chart */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <PieIcon size={14} className="text-indigo-400" />
            Category Allocation
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0d14',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}/mo`, 'Cost']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-[11px]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-mono text-zinc-200 font-semibold">${p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Cost Table */}
        <div className="md:col-span-2 rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Detailed Line-Item Cost Schedule
            </h2>
            <span className="text-[11px] text-zinc-500 font-mono">AWS us-east-1 on-demand</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                  <th className="py-2.5 px-4 font-semibold">Resource Description</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Count</th>
                  <th className="py-2.5 px-3 font-semibold text-right">$/hr</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Monthly (USD)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Annual (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {costLines.map((row) => (
                  <tr key={row.name} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-4 font-medium text-white">{row.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-zinc-400">{row.count}</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-400">{row.rate > 0 ? `$${row.rate.toFixed(4)}` : '—'}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-400 font-medium">
                      ${Math.round(row.monthly).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-zinc-400">
                      ${Math.round(row.monthly * 12).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-black/60 font-semibold border-t border-white/[0.1]">
                  <td className="py-3 px-4 text-white uppercase font-mono text-[11px]">Grand Total</td>
                  <td className="py-3 px-3 text-center font-mono text-zinc-500">—</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-500">—</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-300 font-bold text-sm">
                    ${Math.round(derivations.totalMonthlyCost.value).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-zinc-200 font-bold">
                    ${Math.round(derivations.totalAnnualCost.value).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Optimization Playbook */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Sparkles size={14} className="text-amber-400" />
          Cloud Cost Optimization Playbook (Save 30–50%)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="rounded border border-white/[0.06] bg-black/40 p-3 space-y-1">
            <strong className="text-indigo-300 font-mono block">1. 1-Year Reserved Instances</strong>
            <p className="text-zinc-400 text-[11px]">Save 35–42% on steady-state Kafka brokers and PostgreSQL primary nodes.</p>
          </div>
          <div className="rounded border border-white/[0.06] bg-black/40 p-3 space-y-1">
            <strong className="text-emerald-300 font-mono block">2. Spot Instances for App Tier</strong>
            <p className="text-zinc-400 text-[11px]">Save 60–70% on stateless worker pods using Kubernetes PodDisruptionBudgets.</p>
          </div>
          <div className="rounded border border-white/[0.06] bg-black/40 p-3 space-y-1">
            <strong className="text-purple-300 font-mono block">3. S3 Intelligent-Tiering</strong>
            <p className="text-zinc-400 text-[11px]">Automatically transition 30+ day database backups and logs to Glacier archive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}