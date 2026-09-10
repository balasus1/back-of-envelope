'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { Radio, Database, Shield, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function KafkaPage() {
  const { inputs, derivations, updateInput } = useStore();

  const topics = [
    { name: 'order.events', partitions: 24, retention: '7 days', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Order lifecycle events (created, paid, fulfilled)' },
    { name: 'payment.transactions', partitions: 12, retention: '30 days', cleanup: 'compact', rf: inputs.REPLICATION_FACTOR, role: 'Payment ledger (idempotent, financial audit)' },
    { name: 'inventory.updates', partitions: 12, retention: '7 days', cleanup: 'compact', rf: inputs.REPLICATION_FACTOR, role: 'Stock count changes & reservations' },
    { name: 'order.dlq', partitions: 6, retention: '30 days', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Unrecoverable failed events for inspection' },
    { name: 'order.retry.5s', partitions: 6, retention: '1 day', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Retry tier 1 (5s exponential backoff)' },
    { name: 'order.retry.30s', partitions: 6, retention: '1 day', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Retry tier 2 (30s delay topic)' },
    { name: 'order.retry.5m', partitions: 6, retention: '1 day', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Retry tier 3 (5m delay topic)' },
    { name: 'order.reprocess', partitions: 6, retention: '7 days', cleanup: 'delete', rf: inputs.REPLICATION_FACTOR, role: 'Manual reprocess buffer queue' },
  ];

  const sensitivityData = [6, 12, 18, 24, 30, 36, 48, 60].map((p) => ({
    partitions: p,
    producerMb: Number((p * inputs.PRODUCER_PER_PARTITION_MBPS).toFixed(0)),
    consumerMb: Number((p * inputs.CONSUMER_PER_PARTITION_MBPS).toFixed(0)),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 08
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Kafka Event Bus & Messaging Engine</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Throughput sizing, KRaft controller plane quorum, partition balancing, and topic lifecycle architecture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase text-purple-400 block font-mono">Cluster Sizing</span>
            <span className="font-mono text-base font-bold text-purple-200">
              {derivations.kafkaBrokers.value} Brokers ({derivations.kafkaPartitions.value} Partitions)
            </span>
          </div>
        </div>
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Producer Throughput</span>
          <div className="font-mono text-xl font-bold text-white mt-0.5">
            {derivations.kafkaMbs.value.toFixed(2)} MB/s
          </div>
          <span className="text-[10px] text-zinc-400">{inputs.AVG_MSG_SIZE_KB} KB avg msg</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Internal Replication</span>
          <div className="font-mono text-xl font-bold text-purple-300 mt-0.5">
            {derivations.kafkaInternalMbs.value.toFixed(1)} MB/s
          </div>
          <span className="text-[10px] text-zinc-400">{inputs.REPLICATION_FACTOR}x replication</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Monthly Ingress</span>
          <div className="font-mono text-xl font-bold text-indigo-300 mt-0.5">
            {derivations.kafkaMonthlyTb.value.toFixed(1)} TB
          </div>
          <span className="text-[10px] text-zinc-400">{derivations.kafkaCompressedTb.value.toFixed(1)} TB with zstd</span>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-3.5">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">KRaft Quorum</span>
          <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
            3 Controllers
          </div>
          <span className="text-[10px] text-zinc-400">Zero ZooKeeper</span>
        </div>
      </div>

      {/* Sensitivity Line Chart: Throughput vs Partitions */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-400" />
          Partition Sensitivity: Max Producer vs Consumer Throughput Capacity (MB/s)
        </h2>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensitivityData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="partitions" stroke="#6b7280" fontSize={11} label={{ value: 'Partitions', position: 'insideBottomRight', offset: -5, fill: '#9ca3af' }} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0d14',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="producerMb" stroke="#6366f1" strokeWidth={2} name="Producer Cap (10 MB/s/part)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="consumerMb" stroke="#10b981" strokeWidth={2} name="Consumer Cap (5 MB/s/part)" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Architecture Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
            Topic Schema & Partition Configuration
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono">KRaft metadata ops: {derivations.kafkaPartitions.value * 0.1} ops/s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-zinc-400 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Topic Name</th>
                <th className="py-2.5 px-3 font-semibold text-center">Partitions</th>
                <th className="py-2.5 px-3 font-semibold text-center">Retention</th>
                <th className="py-2.5 px-3 font-semibold text-center">Replication</th>
                <th className="py-2.5 px-3 font-semibold text-center">Cleanup Policy</th>
                <th className="py-2.5 px-4 font-semibold">Purpose & Semantics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {topics.map((t) => (
                <tr key={t.name} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono font-medium text-white">{t.name}</td>
                  <td className="py-3 px-3 text-center font-mono text-indigo-300">{t.partitions}</td>
                  <td className="py-3 px-3 text-center font-mono text-zinc-300">{t.retention}</td>
                  <td className="py-3 px-3 text-center font-mono text-purple-300">{t.rf}x</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      t.cleanup === 'compact' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {t.cleanup}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}