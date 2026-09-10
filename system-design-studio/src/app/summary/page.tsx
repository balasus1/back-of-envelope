'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { FileText, Printer, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { MetricResult } from '../../lib/derivations';

export default function FinalSummaryPage() {
  const { inputs, derivations, scenario } = useStore();

  const handlePrint = () => {
    window.print();
  };

  const headlineMetrics: { layer: string; name: string; metric: MetricResult }[] = [
    { layer: 'Users', name: 'Monthly Active (MAU)', metric: { value: inputs.MAU, unit: 'users', formulaText: 'Master Input', humanExplanation: 'Monthly registered active users', dependsOn: [] } },
    { layer: 'Users', name: 'Daily Active (DAU)', metric: derivations.dau },
    { layer: 'Users', name: 'Peak Concurrent (PCU)', metric: derivations.pcu },
    { layer: 'Users', name: 'Raw API RPS', metric: derivations.rawRps },
    { layer: 'Users', name: 'Peak API RPS (Anchor)', metric: derivations.peakRps },
    { layer: 'Users', name: 'Daily API Requests', metric: derivations.dailyReqs },

    { layer: 'Edge & CDN', name: 'Static Data / Day', metric: derivations.staticDataGb },
    { layer: 'Edge & CDN', name: 'CDN Cache Hit Ratio', metric: { value: inputs.CDN_Cache_Hit_Ratio_Pct, unit: '%', formulaText: 'CDN Hit Rate', humanExplanation: 'Percentage of requests absorbed by CDN', dependsOn: [] } },
    { layer: 'Edge & CDN', name: 'Origin Dynamic RPS', metric: derivations.originBoundDynamicRps },
    { layer: 'Edge & CDN', name: 'Global Edge PoPs', metric: derivations.edgeNodes },

    { layer: 'Gateway', name: 'Effective RPS / Pod', metric: derivations.effGatewayRps },
    { layer: 'Gateway', name: 'Total Gateway Pods (3 AZ)', metric: derivations.gatewayAzPods },
    { layer: 'Gateway', name: 'Gateway Added Latency', metric: derivations.gatewayLatencyMs },
    { layer: 'Gateway', name: 'WebSocket Sockets', metric: derivations.wsConcurrent },

    { layer: 'Backend Fleet', name: 'Total App Pods', metric: derivations.totalAppInstances },
    { layer: 'Backend Fleet', name: 'Aggregate Capacity', metric: derivations.totalAppCapacityRps },
    { layer: 'Backend Fleet', name: 'Cluster Headroom', metric: derivations.headroomPct },

    { layer: 'Latency', name: 'Uncached Path P50', metric: derivations.uncachedPathP50 },
    { layer: 'Latency', name: 'Blended P50 (98% Hit)', metric: derivations.blendedP50 },
    { layer: 'Latency', name: 'Tail P95 Latency', metric: derivations.p95Latency },

    { layer: 'Kafka Bus', name: 'Producer Throughput', metric: derivations.kafkaMbs },
    { layer: 'Kafka Bus', name: 'Internal Replication', metric: derivations.kafkaInternalMbs },
    { layer: 'Kafka Bus', name: 'Broker Count', metric: derivations.kafkaBrokers },
    { layer: 'Kafka Bus', name: 'Total Partitions', metric: derivations.kafkaPartitions },

    { layer: 'Database', name: 'Logical DB QPS', metric: derivations.dbQps },
    { layer: 'Database', name: 'Actual Storage QPS', metric: derivations.actualDbQps },
    { layer: 'Database', name: 'Recommended IOPS (2x)', metric: derivations.dbIopsHeadroom },
    { layer: 'Database', name: 'Max Connections', metric: derivations.maxConnections },
    { layer: 'Database', name: 'Read Replicas', metric: derivations.dbReplicas },

    { layer: 'Cache', name: 'Redis Cluster Memory', metric: derivations.cacheTotalClusterGb },
    { layer: 'Cache', name: 'Redis Master Shards', metric: derivations.cacheNodes },

    { layer: 'Economics', name: 'Total Monthly Spend', metric: derivations.totalMonthlyCost },
    { layer: 'Economics', name: 'Cost per 1,000 DAU', metric: derivations.costPer1000Dau },
  ];

  const whiteboardScript = `"${(inputs.MAU / 1000000).toFixed(0)}M MAU → ${(derivations.dau.value / 1000000).toFixed(1)}M DAU → ${(derivations.pcu.value / 1000).toFixed(0)}k concurrent → ~${Math.round(derivations.rawRps.value).toLocaleString()} raw RPS → ~${Math.round(derivations.peakRps.value).toLocaleString()} Peak RPS with a ${inputs.SAFETY_BUFFER}x safety buffer. CDN absorbs ${inputs.CDN_Cache_Hit_Ratio_Pct}% of traffic. Gateway: ${derivations.gatewayAzPods.value} pods across 3 AZs with ${derivations.gatewayLatencyMs.value.toFixed(1)}ms overhead. Backend: ${derivations.totalAppInstances.value} pods across 5 microservices plus gateway. Kafka: ${derivations.kafkaBrokers.value} brokers, ${derivations.kafkaPartitions.value} partitions, ~${derivations.kafkaMbs.value.toFixed(2)} MB/s producer throughput. Postgres: ${derivations.dbDiskSizeGb.value} GB disk, ~${Math.round(derivations.actualDbQps.value).toLocaleString()} QPS after a ${inputs.CACHE_HIT_PCT}% cache hit rate, plus ${derivations.dbReplicas.value} read replicas. Redis: ${derivations.cacheNodes.value} shards, ${derivations.cacheTotalClusterGb.value} GB RAM. DLQ with 4-tier exponential backoff. Multi-AZ end-to-end. Total monthly infra: ~$${Math.round(derivations.totalMonthlyCost.value).toLocaleString()} ($${derivations.costPer1000Dau.value.toFixed(2)} per 1k DAU)."`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 17
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Final Executive Summary Cheatsheet</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Dense, high-yield one-page whiteboard reference sheet for FAANG system design interviews.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
        >
          <Printer size={14} />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* The Whiteboard Script (Memorize This) */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-purple-950/30 p-5 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <MessageSquare size={16} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
            The 60-Second Whiteboard Talk-Track (Auto-Interpolated Live)
          </h2>
        </div>
        <p className="text-sm font-medium leading-relaxed text-zinc-100 font-sans italic bg-black/40 p-4 rounded-lg border border-white/[0.08]">
          {whiteboardScript}
        </p>
        <div className="text-[11px] text-indigo-300/80 font-mono">
          ✓ Say this exact chain first in your interview to establish instant credibility before sketching architecture boxes.
        </div>
      </div>

      {/* Dense 30-Headline Metric Matrix */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden p-5 space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Zap size={14} className="text-amber-400" />
          Headline Architectural Numbers ({scenario} Scenario)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {headlineMetrics.map((m, idx) => (
            <div key={idx} className="rounded border border-white/[0.06] bg-black/40 p-2.5 sm:p-3 space-y-1">
              <span className="text-[9px] font-mono uppercase text-zinc-500 block truncate" title={m.layer}>{m.layer}</span>
              <Metric name={m.name} metric={m.metric} size="sm" showLabel={true} className="w-full justify-between" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}