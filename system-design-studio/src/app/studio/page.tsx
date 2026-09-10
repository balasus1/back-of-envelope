'use client';

import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { InterviewStepper } from '../../components/InterviewStepper';
import { FlowPipelineModal, ArchitectureNodeDetail } from '../../components/FlowPipelineModal';
import { NumberInput } from '../../components/NumberInput';
import {
  Users,
  Radio,
  Database,
  Layers,
  Cpu,
  Shield,
  Clock,
  DollarSign,
  Globe,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

export default function ControlPanel() {
  const { inputs, updateInput, derivations, scenario } = useStore();
  const [selectedNode, setSelectedNode] = useState<ArchitectureNodeDetail | null>(null);

  // Node details for the interactive flow pipeline modal
  const flowNodes: Record<string, ArchitectureNodeDetail> = {
    client: {
      id: 'client',
      name: 'Client Applications & User Base',
      category: 'Ingress Tier',
      icon: '📱',
      summary: 'Mobile apps (iOS/Android) and Web SPAs generating concurrent user traffic.',
      metrics: [
        { label: 'Monthly Active (MAU)', metric: { value: inputs.MAU, unit: 'users', formulaText: 'Master Input', humanExplanation: 'Monthly registered active users', dependsOn: [] } },
        { label: 'Daily Active (DAU)', metric: derivations.dau },
        { label: 'Peak Concurrency (PCU)', metric: derivations.pcu },
        { label: 'Peak API RPS', metric: derivations.peakRps },
      ],
      appliedCalculations: [
        { name: 'Daily Active Users (DAU)', formula: 'MAU * (DAU_PCT / 100)', stepByStep: `${inputs.MAU.toLocaleString()} * (${inputs.DAU_PCT} / 100)`, result: `${Math.round(derivations.dau.value).toLocaleString()} users` },
        { name: 'Peak Concurrent Users (PCU)', formula: 'DAU * (PEAK_CONCURRENT_PCT / 100)', stepByStep: `${Math.round(derivations.dau.value).toLocaleString()} * (${inputs.PEAK_CONCURRENT_PCT} / 100)`, result: `${Math.round(derivations.pcu.value).toLocaleString()} users` },
        { name: 'Peak API RPS (Anchor)', formula: '(PCU * Actions / Peak_Sec) * Safety_Buffer', stepByStep: `(${Math.round(derivations.pcu.value).toLocaleString()} * ${inputs.ACTIONS_PER_SESSION} / ${inputs.PEAK_DURATION_SEC}) * ${inputs.SAFETY_BUFFER}`, result: `${Math.round(derivations.peakRps.value).toLocaleString()} req/s` },
      ],
      probingQuestions: [
        'What is the geographic distribution of clients (US, EU, APAC)?',
        'Do clients use WebSockets for real-time push or HTTP/2 & HTTP/3 multiplexing?',
        'What is the token expiration and refresh token strategy to avoid login thundering herds?',
      ],
      libraryTradeoffs: {
        primary: 'Native Mobile (Swift/Kotlin) + React Native / Flutter',
        alternative: 'Pure PWA / WebViews',
        comparison: 'Native mobile client gives full background fetch, offline SQLite caching, and zero JS bridge overhead during network reconnection bursts.',
        recommendation: 'Use Native HTTP/3 client with certificate pinning and Exponential Backoff Jitter for connection retries.',
      },
    },
    cdn: {
      id: 'cdn',
      name: 'Edge CDN (CloudFront / Cloudflare)',
      category: 'Edge Tier',
      icon: '⚡',
      summary: 'Globally distributed edge PoPs absorbing static assets, image transforms, and cacheable API GET queries.',
      metrics: [
        { label: 'Cache Hit %', metric: { value: inputs.CACHE_HIT_PCT, unit: '%', formulaText: 'Edge Hit Rate', humanExplanation: 'Percentage of read traffic absorbed by edge CDN', dependsOn: [] } },
        { label: 'Edge PoPs Needed', metric: derivations.edgeNodes },
        { label: 'Origin Dynamic RPS', metric: derivations.originBoundDynamicRps },
        { label: 'Effective Bandwidth', metric: derivations.cdnEffectiveGbps },
      ],
      appliedCalculations: [
        { name: 'Edge Filtered RPS', formula: 'Peak_RPS * (1 - CDN_Cache_Hit_Pct / 100)', stepByStep: `${Math.round(derivations.peakRps.value)} * (1 - ${inputs.CDN_Cache_Hit_Ratio_Pct} / 100)`, result: `${Math.round(derivations.originBoundDynamicRps.value).toLocaleString()} origin RPS` },
        { name: 'Edge CDN PoPs', formula: 'ceil(Peak_RPS / Edge_Node_Capacity)', stepByStep: `ceil(${Math.round(derivations.peakRps.value)} / ${inputs.Edge_Node_Capacity_RPS})`, result: `${derivations.edgeNodes.value} PoP nodes` },
      ],
      probingQuestions: [
        'How do we handle CDN cache invalidation on product price/inventory updates (stale-while-revalidate vs surrogate keys)?',
        'Are dynamic user-personalized requests bypass-routed directly to the API Gateway?',
      ],
      libraryTradeoffs: {
        primary: 'Cloudflare / AWS CloudFront + Fastly VCL',
        alternative: 'Self-hosted NGINX Edge Clusters',
        comparison: 'Managed Edge CDN eliminates global BGP anycast complexity, provides automated DDoS Layer 7 mitigation, and 300+ edge PoPs.',
        recommendation: 'Managed CloudFront / Cloudflare Enterprise with edge compute (Workers/CloudFront Functions) for JWT validation.',
      },
    },
    gateway: {
      id: 'gateway',
      name: 'API Gateway (Envoy / Kong / APISIX)',
      category: 'Gateway Tier',
      icon: '🚪',
      summary: 'Centralized entry point managing JWT auth, rate limiting token buckets, SSL termination, and gRPC routing.',
      metrics: [
        { label: 'Origin RPS Handled', metric: derivations.originBoundDynamicRps },
        { label: 'Gateway Pods (3 AZ)', metric: derivations.gatewayAzPods },
        { label: 'Gateway CPU Cores', metric: derivations.gatewayCpuCores },
        { label: 'Anonymous Rate Limit', metric: { value: inputs.Rate_Limit_Anonymous_RPM, unit: 'rpm', formulaText: 'Anon Bucket', humanExplanation: 'Max unauthenticated requests per minute per IP', dependsOn: [] } },
      ],
      appliedCalculations: [
        { name: 'Effective RPS / Pod', formula: 'Gateway_RPS_Capacity * (Gateway_CPU_Util_Target / 100)', stepByStep: `${inputs.Gateway_RPS_Capacity} * (${inputs.Gateway_CPU_Util_Target} / 100)`, result: `${derivations.effGatewayRps.value} req/s/pod` },
        { name: 'Required Gateway Pods (3 AZ)', formula: '(ceil(Raw_Pods / 3) + 1) * 3', stepByStep: `(ceil(${derivations.rawGatewayPods.value} / 3) + 1) * 3`, result: `${derivations.gatewayAzPods.value} pods` },
      ],
      probingQuestions: [
        'How is rate limiting coordinated across distributed gateway nodes (Local token bucket vs Redis sliding window)?',
        'Do we terminate TLS 1.3 at the Gateway and use mTLS into the internal Kubernetes service mesh?',
      ],
      libraryTradeoffs: {
        primary: 'Envoy Gateway / Kong (OpenResty/Lua)',
        alternative: 'Spring Cloud Gateway / Zuul',
        comparison: 'Envoy (C++) provides sub-millisecond memory footprint, non-blocking asynchronous event loops, and native gRPC-JSON transcoding with zero GC pauses.',
        recommendation: 'Envoy Gateway with Redis-backed Sliding Window rate limiting for user tiering and IP protection.',
      },
    },
    lb: {
      id: 'lb',
      name: 'Load Balancer & Network Tier',
      category: 'Routing Tier',
      icon: '🌐',
      summary: 'Layer 4 (NLB) & Layer 7 (ALB) load balancers distributing ingress TCP/HTTP traffic across multi-AZ pods.',
      metrics: [
        { label: 'Peak Line Speed', metric: derivations.peakBandwidthGbps },
        { label: 'Daily Outbound Egress', metric: derivations.dailyEgressGb },
        { label: 'Concurrent Sockets', metric: derivations.lbConcurrentConns },
        { label: 'SSL Handshake Rate', metric: derivations.lbTlsHandshakes },
      ],
      appliedCalculations: [
        { name: 'Peak Bandwidth (Gbps)', formula: '(Peak_MBps * 8) / 1000', stepByStep: `(${derivations.peakBandwidthMBps.value.toFixed(2)} * 8) / 1000`, result: `${derivations.peakBandwidthGbps.value} Gbps` },
        { name: 'Daily Egress', formula: 'Daily_Requests * Avg_Response_KB / 1024^2', stepByStep: `${Math.round(derivations.dailyReqs.value).toLocaleString()} * ${inputs.AVG_RESPONSE_SIZE_KB} KB / 1024^2`, result: `${derivations.dailyEgressGb.value} GB/day` },
      ],
      probingQuestions: [
        'What health check interval and timeout prevent cascading pod removals during traffic spikes?',
        'Do we use Round Robin, Least Connections, or Consistent Hashing at Layer 7?',
      ],
      libraryTradeoffs: {
        primary: 'AWS NLB + ALB / HAProxy',
        alternative: 'Software LVS / Keepalived',
        comparison: 'AWS NLB scales to millions of RPS with ultra-low Layer 4 latency and static Anycast Elastic IPs.',
        recommendation: 'NLB for TCP ingress terminating on Envoy Gateway, using Least Outstanding Requests load balancing algorithm.',
      },
    },
    backend: {
      id: 'backend',
      name: 'Backend Microservices (Order / Payment)',
      category: 'Compute Tier',
      icon: '⚙️',
      summary: 'Stateless Kubernetes microservice pods communicating internally over low-latency binary gRPC.',
      metrics: [
        { label: 'Order Svc Pods', metric: { value: inputs.Order_Svc_Instances, unit: 'pods', formulaText: 'Order Pods', humanExplanation: 'Kubernetes pods for checkout & order workflow', dependsOn: [] } },
        { label: 'Payment Svc Pods', metric: { value: inputs.Payment_Svc_Instances, unit: 'pods', formulaText: 'Payment Pods', humanExplanation: 'Pods for payment gateway idempotency', dependsOn: [] } },
        { label: 'Inventory Pods', metric: { value: inputs.Inventory_Svc_Instances, unit: 'pods', formulaText: 'Inventory Pods', humanExplanation: 'Pods for stock allocation & reservations', dependsOn: [] } },
        { label: 'Cluster Headroom', metric: derivations.headroomPct },
      ],
      appliedCalculations: [
        { name: 'Total Microservice Pods', formula: 'Order + Payment + Inventory + Notification + Search', stepByStep: `${inputs.Order_Svc_Instances} + ${inputs.Payment_Svc_Instances} + ${inputs.Inventory_Svc_Instances} + ${inputs.Notification_Svc_Instances} + ${inputs.Search_Svc_Instances}`, result: `${inputs.Order_Svc_Instances + inputs.Payment_Svc_Instances + inputs.Inventory_Svc_Instances + inputs.Notification_Svc_Instances + inputs.Search_Svc_Instances} pods` },
        { name: 'Cluster Surplus Headroom', formula: '(Total_Capacity / Peak_RPS - 1) * 100', stepByStep: `Headroom above peak demand`, result: `${derivations.headroomPct.value}% surplus` },
      ],
      probingQuestions: [
        'Are services completely stateless with JWT sessions stored client-side or in Redis?',
        'How do we handle distributed transactions across Order and Payment (Saga Pattern vs 2PC)?',
      ],
      libraryTradeoffs: {
        primary: 'Go (gRPC) / Java (Quarkus/Spring Boot 3) on Kubernetes',
        alternative: 'Node.js / Python FastAPI',
        comparison: 'Go and compiled Java give deterministic CPU scheduling, low thread contention under high concurrency, and sub-100MB container memory baselines.',
        recommendation: 'Go microservices with gRPC protocol buffers, Istio sidecars for mTLS, and Horizontal Pod Autoscaler (HPA) targeting 65% CPU.',
      },
    },
    kafka: {
      id: 'kafka',
      name: 'Kafka Event Bus (Order Streaming)',
      category: 'Event Tier',
      icon: '📨',
      summary: 'Distributed event log decoupling synchronous order placement from asynchronous payment, inventory, and notifications.',
      metrics: [
        { label: 'Producer Ingress MB/s', metric: derivations.kafkaMbs },
        { label: 'Total Replicated MB/s', metric: derivations.kafkaInternalMbs },
        { label: 'Kafka Partitions', metric: derivations.kafkaPartitions },
        { label: 'Kafka Broker Count', metric: derivations.kafkaBrokers },
      ],
      appliedCalculations: [
        { name: 'Kafka Ingress MB/s', formula: '(Peak_RPS * Avg_Msg_KB) / 1024', stepByStep: `(${Math.round(derivations.peakRps.value)} * ${inputs.AVG_MSG_SIZE_KB}) / 1024`, result: `${derivations.kafkaMbs.value} MB/s` },
        { name: 'Required Partitions', formula: 'ceil(Ingress_MB / Partition_Cap_MB)', stepByStep: `ceil(${derivations.kafkaMbs.value} / ${inputs.PRODUCER_PER_PARTITION_MBPS})`, result: `${derivations.kafkaPartitions.value} partitions` },
        { name: 'Required Brokers', formula: 'max(Min_HA, ceil(Internal_MBps / Broker_Capacity))', stepByStep: `max(${inputs.MIN_BROKERS_HA}, ceil(${derivations.kafkaInternalMbs.value} / ${inputs.BROKER_CAPACITY_MBPS}))`, result: `${derivations.kafkaBrokers.value} brokers` },
      ],
      probingQuestions: [
        'What partition key ensures strict FIFO ordering per customer without creating hot partitions (e.g. hash(userId) vs hash(orderId))?',
        'Do producers use acks=all with idempotence enabled (enable.idempotence=true) for exactly-once delivery semantics?',
      ],
      libraryTradeoffs: {
        primary: 'Apache Kafka / Redpanda',
        alternative: 'RabbitMQ / AWS SQS',
        comparison: 'Kafka provides append-only immutable commit logs, consumer group offset replays for debugging, and linear scale with millions of msgs/sec.',
        recommendation: 'Apache Kafka (KRaft mode) or Redpanda with 3x replication factor and 7-day log retention.',
      },
    },
    db: {
      id: 'db',
      name: 'PostgreSQL Primary & Read Replicas',
      category: 'Persistence Tier',
      icon: '🗄️',
      summary: 'ACID relational database with single primary for serializable writes and multi-AZ read replicas for hot reads.',
      metrics: [
        { label: 'Write QPS', metric: derivations.dbWriteQps },
        { label: 'Read QPS', metric: derivations.dbReadQps },
        { label: 'Read Replicas', metric: derivations.dbReplicas },
        { label: 'SSD IOPS Needed', metric: derivations.dbIops },
      ],
      appliedCalculations: [
        { name: 'Write QPS', formula: 'DB_QPS - Read_QPS', stepByStep: `${Math.round(derivations.dbQps.value)} - ${Math.round(derivations.dbReadQps.value)}`, result: `${Math.round(derivations.dbWriteQps.value)} QPS` },
        { name: 'Required Read Replicas', formula: 'ceil(Read_QPS / Replica_QPS_Cap)', stepByStep: `ceil(${Math.round(derivations.dbReadQps.value)} / ${inputs.DB_READ_REPLICA_QPS})`, result: `${derivations.dbReplicas.value} replicas` },
        { name: 'Database 30-Day Hot Data', formula: 'Hot_Rows * Row_Size_KB / 1024^2', stepByStep: `${Math.round(derivations.dbWriteQps.value * 86400 * inputs.DB_HOT_RETENTION_DAYS).toLocaleString()} * ${inputs.DB_ROW_SIZE_KB} KB / 1024^2`, result: `${derivations.dbHotDataGb.value} GB` },
      ],
      probingQuestions: [
        'When write QPS exceeds single primary limits (~10k QPS), do we shard by customer ID using Citus/Vitess or migrate to ScyllaDB?',
        'How do we handle connection pooling to avoid max_connections limits (PgBouncer with transaction pooling)?',
      ],
      libraryTradeoffs: {
        primary: 'PostgreSQL 16 + PgBouncer / Aurora PostgreSQL',
        alternative: 'MySQL / DynamoDB / ScyllaDB',
        comparison: 'PostgreSQL provides JSONB indexing, CTEs, transactional DDL, row-level security, and mature CDC integration with Debezium.',
        recommendation: 'Amazon Aurora PostgreSQL with 1 Primary + 3 Read Replicas and PgBouncer connection pooling.',
      },
    },
    cache: {
      id: 'cache',
      name: 'Redis In-Memory Cluster',
      category: 'Caching Tier',
      icon: '⚡',
      summary: 'Sub-millisecond distributed cache for session state, catalog SKU lookups, and inventory counters.',
      metrics: [
        { label: 'Cache Hit %', metric: { value: inputs.CACHE_HIT_PCT, unit: '%', formulaText: 'Hit Ratio', humanExplanation: 'Requests satisfied from in-memory cache', dependsOn: [] } },
        { label: 'Required RAM', metric: derivations.cacheWithOverheadGb },
        { label: 'Redis Nodes', metric: derivations.cacheNodes },
        { label: 'Cache Ops / sec', metric: derivations.cacheOps },
      ],
      appliedCalculations: [
        { name: 'Required Cache RAM', formula: '(Sessions + Catalog + HotSKU) * Overhead_Factor', stepByStep: `(${derivations.sessionMemGb.value.toFixed(2)}GB + Catalog) * ${inputs.CACHE_OVERHEAD_FACTOR}`, result: `${derivations.cacheWithOverheadGb.value} GB` },
        { name: 'Required Redis Shards', formula: 'max(3, ceil(Cache_Ops / Ops_Per_Node))', stepByStep: `max(3, ceil(${Math.round(derivations.cacheOps.value)} / ${inputs.REDIS_OPS_PER_NODE}))`, result: `${derivations.cacheNodes.value} shards` },
      ],
      probingQuestions: [
        'What cache invalidation pattern is used: Cache-Aside, Read-Through, or Write-Through?',
        'How do we prevent Cache Stampede (Thundering Herd) when a hot SKU cache key expires (Mutex locking / Probabilistic Early Expiration)?',
      ],
      libraryTradeoffs: {
        primary: 'Redis Cluster / KeyDB / Dragonfly',
        alternative: 'Memcached',
        comparison: 'Redis provides rich data structures (Hashes, Sorted Sets for leaderboards, HyperLogLog for unique visitors, Lua scripts for atomic locks).',
        recommendation: 'Redis Cluster with allkeys-lru eviction policy and client-side caching (RESP3).',
      },
    },
    dlq: {
      id: 'dlq',
      name: 'Dead Letter Queue & Retry Tiers',
      category: 'Resilience Tier',
      icon: '⚠️',
      summary: '4-tier exponential backoff retry topics and persistent DLQ with alert webhooks for failed transactions.',
      metrics: [
        { label: 'Max Retries', metric: { value: inputs.Max_Retries, unit: 'tries', formulaText: 'Retry Budget', humanExplanation: 'Maximum attempts before routing to permanent DLQ', dependsOn: [] } },
        { label: 'Base Backoff', metric: { value: inputs.Retry_Backoff_Base_sec, unit: 'sec', formulaText: 'Initial Delay', humanExplanation: 'Delay for first retry stage', dependsOn: [] } },
        { label: 'Total Retry Span', metric: derivations.totalRetryTime },
        { label: 'DLQ Failure Rate %', metric: derivations.dlqFailureRatePct },
      ],
      appliedCalculations: [
        { name: 'Total Retry Time Span', formula: 'Tier1(5s) + Tier2(10s) + Tier3(20s) + Tier4(40s)', stepByStep: `5s + 10s + 20s + 40s`, result: `${derivations.totalRetryTime.value} seconds` },
        { name: 'DLQ Failure Rate', formula: '(1 - (0.99)^Max_Retries) * 100', stepByStep: `(1 - (0.99)^${inputs.Max_Retries}) * 100`, result: `${derivations.dlqFailureRatePct.value}%` },
      ],
      probingQuestions: [
        'How do we inspect, replay, and purge poisoned messages in the DLQ without blocking healthy traffic?',
        'Are consumers idempotent (using idempotency keys in Redis/DB) so replayed DLQ messages do not double-charge customers?',
      ],
      libraryTradeoffs: {
        primary: 'Kafka Delayed Retry Topics + PostgreSQL DLQ Audit Table',
        alternative: 'RabbitMQ Dead Letter Exchange (DLX)',
        comparison: 'Kafka retry topics allow dedicated consumer groups to process backoffs asynchronously without halting the main partition consumer.',
        recommendation: '4-Tier Kafka Retry Topics with PagerDuty alert webhooks and an internal admin UI for manual payload replay.',
      },
    },
  };

  const pipelineCards = [
    { key: 'client', title: 'Clients', sub: '10M MAU', icon: '📱', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20' },
    { key: 'cdn', title: 'Edge CDN', sub: `${inputs.CACHE_HIT_PCT}% Hit`, icon: '⚡', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
    { key: 'gateway', title: 'API Gateway', sub: `${derivations.gatewayAzPods.value} Pods`, icon: '🚪', color: 'border-purple-500/40 text-purple-400 bg-purple-950/20' },
    { key: 'lb', title: 'Load Balancer', sub: `${derivations.peakBandwidthGbps.value} Gbps`, icon: '🌐', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' },
    { key: 'backend', title: 'Microservices', sub: `${inputs.Order_Svc_Instances + inputs.Payment_Svc_Instances} Pods`, icon: '⚙️', color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { key: 'kafka', title: 'Kafka Bus', sub: `${derivations.kafkaBrokers.value} Brokers`, icon: '📨', color: 'border-pink-500/40 text-pink-400 bg-pink-950/20' },
    { key: 'db', title: 'PostgreSQL', sub: `${derivations.dbReplicas.value} Replicas`, icon: '🗄️', color: 'border-sky-500/40 text-sky-400 bg-sky-950/20' },
    { key: 'cache', title: 'Redis Cache', sub: `${derivations.cacheWithOverheadGb.value} GB RAM`, icon: '⚡', color: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
    { key: 'dlq', title: 'DLQ Queue', sub: '4 Tiers', icon: '⚠️', color: 'border-rose-500/40 text-rose-400 bg-rose-950/20' },
  ];

  const renderInput = (
    label: string,
    key: keyof typeof inputs,
    min: number = 0,
    max: number = 100000000,
    step: number = 1,
    unit: string = '',
    disabled: boolean = false
  ) => {
    const val = inputs[key];

    return (
      <div className="flex flex-col gap-1 rounded-md border border-white/[0.06] bg-[#0b0c13] p-2.5 transition-colors hover:border-white/[0.12]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-zinc-300 truncate" title={`${label} (${key})`}>
            {label}
          </label>
          {unit && <span className="text-[10px] font-mono text-zinc-500">{unit}</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <NumberInput
            min={min}
            max={max}
            step={step}
            value={val}
            disabled={disabled}
            onChange={(newVal) => updateInput(key, newVal)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      {/* SECTION 1: Top Stepper - Ask Interviewer These Questions First */}
      <InterviewStepper />

      {/* SECTION 2: Connected Architecture Flow Pipeline with Dotted Lines */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-3.5 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Interactive Pipeline
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Connected System Flow Topology
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">
            Click any node to view exact applied math & library tradeoffs
          </span>
        </div>

        {/* Pipeline Cards Connected with Dotted Lines */}
        <div className="overflow-x-auto pb-2 pt-2 -mx-1 px-1">
          <div className="flex items-center gap-2 min-w-max">
            {pipelineCards.map((card, idx) => (
              <div key={card.key} className="flex items-center">
                <button
                  onClick={() => setSelectedNode(flowNodes[card.key])}
                  className={clsx(
                    'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer min-w-[105px] hover:scale-105 hover:shadow-lg',
                    card.color
                  )}
                >
                  <span className="text-xl mb-1">{card.icon}</span>
                  <span className="text-xs font-bold text-white tracking-tight">{card.title}</span>
                  <span className="text-[10px] font-mono text-zinc-400 mt-0.5">{card.sub}</span>
                </button>

                {/* Dotted Arrow Connector */}
                {idx < pipelineCards.length - 1 && (
                  <div className="flex items-center px-1 text-zinc-500">
                    <span className="border-b border-dashed border-zinc-500 w-4 h-0 inline-block" />
                    <ArrowRight size={12} className="text-zinc-500 -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: System Architecture Sizing (Split into Two Halves: Derived on Left, How We Derived on Right) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/[0.06] gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              System Architecture Subsystem Sizing & Tradeoffs
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              Two-column view: Left shows real-time derived capacity; Right shows mathematical proofs, probing questions, and library comparisons.
            </p>
          </div>
        </div>

        {/* TIER 1: User Metrics & Traffic Ingestion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-xl border border-white/[0.08] bg-[#0e1017] p-3.5 sm:p-5 shadow-lg">
          {/* Left Half: Derived Metrics & Inputs (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Tier 1 — User Ingress & Concurrency
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                Anchor Metric
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {renderInput('Monthly Active (MAU)', 'MAU', 1000, 1000000000, 1000000, 'users')}
              {renderInput('DAU % of MAU', 'DAU_PCT', 1, 100, 1, '%')}
              {renderInput('Peak Concurrent %', 'PEAK_CONCURRENT_PCT', 1, 100, 1, '%')}
              {renderInput('Actions / Session', 'ACTIONS_PER_SESSION', 1, 500, 1, 'acts')}
              {renderInput('Peak Duration', 'PEAK_DURATION_SEC', 60, 86400, 60, 'sec')}
              {renderInput('Safety Headroom', 'SAFETY_BUFFER', 1, 10, 0.5, 'x')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Derived DAU</span>
                <Metric name="DAU" metric={derivations.dau} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Peak PCU</span>
                <Metric name="PCU" metric={derivations.pcu} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-indigo-300 font-bold block">Peak API RPS</span>
                <Metric name="Peak RPS" metric={derivations.peakRps} size="sm" showLabel={false} />
              </div>
            </div>
          </div>

          {/* Right Half: How We Derived & Open Source Library Tradeoffs (6 Cols) */}
          <div className="lg:col-span-6 rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 sm:p-4 flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px] font-semibold uppercase">
                <Info size={13} /> How We Derived the Anchor RPS:
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] font-mono text-[11px] space-y-1 text-zinc-300 overflow-x-auto">
                <div className="whitespace-normal break-words">1. <span className="text-zinc-500">DAU =</span> {inputs.MAU.toLocaleString()} * {inputs.DAU_PCT}% = <strong>{Math.round(derivations.dau.value).toLocaleString()}</strong> users</div>
                <div className="whitespace-normal break-words">2. <span className="text-zinc-500">PCU =</span> {Math.round(derivations.dau.value).toLocaleString()} * {inputs.PEAK_CONCURRENT_PCT}% = <strong>{Math.round(derivations.pcu.value).toLocaleString()}</strong> concurrent</div>
                <div className="whitespace-normal break-words">3. <span className="text-zinc-500">Peak RPS =</span> ({Math.round(derivations.pcu.value).toLocaleString()} * {inputs.ACTIONS_PER_SESSION} / {inputs.PEAK_DURATION_SEC}) * {inputs.SAFETY_BUFFER}x = <strong className="text-indigo-300">{Math.round(derivations.peakRps.value).toLocaleString()} req/s</strong></div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-zinc-300 font-mono text-[11px]">
                <span className="font-semibold text-purple-300">Library Tradeoff: Cloudflare vs CloudFront</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Cloudflare Workers execute V8 isolates in 0ms cold starts for edge rate-limiting, whereas AWS CloudFront integrates natively with AWS WAF and Private Origin VPC links.
              </p>
            </div>
          </div>
        </div>

        {/* TIER 2: Kafka Streaming & Event Bus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-xl border border-white/[0.08] bg-[#0e1017] p-3.5 sm:p-5 shadow-lg">
          {/* Left Half: Derived Metrics & Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Tier 2 — Kafka Event Bus & Partitions
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                Pub/Sub Streaming
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {renderInput('Avg Message Size', 'AVG_MSG_SIZE_KB', 0.1, 1024, 0.1, 'KB')}
              {renderInput('Replication Factor', 'REPLICATION_FACTOR', 1, 5, 1, 'x')}
              {renderInput('Producer/Part Cap', 'PRODUCER_PER_PARTITION_MBPS', 1, 100, 1, 'MB/s')}
              {renderInput('Broker Capacity', 'BROKER_CAPACITY_MBPS', 50, 2000, 50, 'MB/s')}
              {renderInput('Broker Multiple', 'BROKER_MULTIPLE', 2, 24, 1, 'parts')}
              {renderInput('Max DLQ Retries', 'Max_Retries', 1, 10, 1, 'tries')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Ingress MB/s</span>
                <Metric name="MB/s" metric={derivations.kafkaMbs} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Partitions</span>
                <Metric name="Partitions" metric={derivations.kafkaPartitions} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">Brokers</span>
                <Metric name="Brokers" metric={derivations.kafkaBrokers} size="sm" showLabel={false} />
              </div>
            </div>
          </div>

          {/* Right Half: How We Derived & Open Source Library Tradeoffs */}
          <div className="lg:col-span-6 rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 sm:p-4 flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[11px] font-semibold uppercase">
                <Info size={13} /> Kafka Partition & Broker Derivations:
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] font-mono text-[11px] space-y-1 text-zinc-300 overflow-x-auto">
                <div className="whitespace-normal break-words">1. <span className="text-zinc-500">Ingress MB/s =</span> ({Math.round(derivations.peakRps.value)} RPS * {inputs.AVG_MSG_SIZE_KB} KB) / 1024 = <strong>{derivations.kafkaMbs.value} MB/s</strong></div>
                <div className="whitespace-normal break-words">2. <span className="text-zinc-500">Partitions =</span> ceil({derivations.kafkaMbs.value} / {inputs.PRODUCER_PER_PARTITION_MBPS} MB/s) = <strong>{derivations.kafkaPartitions.value}</strong></div>
                <div className="whitespace-normal break-words">3. <span className="text-zinc-500">Brokers =</span> max({inputs.MIN_BROKERS_HA}, ceil({derivations.kafkaInternalMbs.value} / {inputs.BROKER_CAPACITY_MBPS})) = <strong className="text-purple-300">{derivations.kafkaBrokers.value} nodes</strong></div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-zinc-300 font-mono text-[11px]">
                <span className="font-semibold text-emerald-400">Library Tradeoff: Apache Kafka vs RabbitMQ</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                RabbitMQ provides complex routing keys and per-message ACKs but degrades under millions of queued items; Kafka uses append-only disk segments with zero-copy DMA (<code className="font-mono text-zinc-300">sendfile</code>) for 10x higher throughput.
              </p>
            </div>
          </div>
        </div>

        {/* TIER 3: Database & In-Memory Caching */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-xl border border-white/[0.08] bg-[#0e1017] p-3.5 sm:p-5 shadow-lg">
          {/* Left Half: Derived Metrics & Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Tier 3 — Database & Redis Cache
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                ACID & Caching
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {renderInput('Read % Split', 'READ_WRITE_SPLIT_READ_PCT', 10, 99, 1, '%')}
              {renderInput('Cache Hit %', 'CACHE_HIT_PCT', 10, 99.9, 0.5, '%')}
              {renderInput('Replica QPS Cap', 'DB_READ_REPLICA_QPS', 500, 50000, 500, 'qps')}
              {renderInput('Hot SKU Count', 'HOT_SKU_COUNT', 100, 5000000, 10000, 'items')}
              {renderInput('Catalog Entry Size', 'CATALOG_ENTRY_KB', 0.5, 64, 0.5, 'KB')}
              {renderInput('Hot Retention Days', 'DB_HOT_RETENTION_DAYS', 1, 365, 1, 'days')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">DB Replicas</span>
                <Metric name="Replicas" metric={derivations.dbReplicas} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Cache RAM</span>
                <Metric name="RAM" metric={derivations.cacheWithOverheadGb} size="sm" showLabel={false} />
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-blue-300 font-bold block">Monthly Storage</span>
                <Metric name="Storage" metric={derivations.dbTotalStorageGb} size="sm" showLabel={false} />
              </div>
            </div>
          </div>

          {/* Right Half: How We Derived & Open Source Library Tradeoffs */}
          <div className="lg:col-span-6 rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 sm:p-4 flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px] font-semibold uppercase">
                <Info size={13} /> Database Replica & Cache Derivations:
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] font-mono text-[11px] space-y-1 text-zinc-300 overflow-x-auto">
                <div className="whitespace-normal break-words">1. <span className="text-zinc-500">Read QPS =</span> {Math.round(derivations.dbQps.value)} * {inputs.READ_WRITE_SPLIT_READ_PCT}% = <strong>{Math.round(derivations.dbReadQps.value)} QPS</strong></div>
                <div className="whitespace-normal break-words">2. <span className="text-zinc-500">DB Replicas =</span> ceil({Math.round(derivations.dbReadQps.value)} / {inputs.DB_READ_REPLICA_QPS}) = <strong>{derivations.dbReplicas.value} nodes</strong></div>
                <div className="whitespace-normal break-words">3. <span className="text-zinc-500">Cache RAM =</span> ({inputs.HOT_SKU_COUNT.toLocaleString()} * {inputs.CATALOG_ENTRY_KB} KB * 1.3x) / 1000 = <strong className="text-blue-300">{derivations.cacheWithOverheadGb.value} GB</strong></div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-zinc-300 font-mono text-[11px]">
                <span className="font-semibold text-amber-400">Library Tradeoff: Redis vs Memcached</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Memcached is multi-threaded for pure key-value caching, but Redis Cluster provides persistence snapshots (AOF/RDB), atomic increment counters for flash-sale inventory, and pub/sub cache invalidation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Derivation Modal */}
      <FlowPipelineModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
