'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../lib/store';
import { Network, GitPullRequest, RotateCcw, Copy, Check, Eye } from 'lucide-react';
import mermaid from 'mermaid';

export default function ArchitectureDiagramPage() {
  const { inputs, derivations, scenario } = useStore();
  const [activeTab, setActiveTab] = useState<'flowchart' | 'sequence' | 'state'>('flowchart');
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const peakRpsStr = Math.round(derivations.peakRps.value).toLocaleString();
  const originRpsStr = Math.round(derivations.originBoundDynamicRps.value).toLocaleString();
  const gwLatencyStr = derivations.gatewayLatencyMs.value.toFixed(1);
  const dbQpsStr = Math.round(derivations.actualDbQps.value).toLocaleString();
  const kafkaMbStr = derivations.kafkaMbs.value.toFixed(1);
  const redisShardsStr = derivations.cacheNodes.value;

  const flowchartDefinition = `
flowchart TD
    %% Modern Linear Theme Styling
    classDef client fill:#1e1b4b,stroke:#6366f1,stroke-width:1px,color:#e0e7ff;
    classDef edge fill:#14532d,stroke:#22c55e,stroke-width:1px,color:#dcfce7;
    classDef gateway fill:#3b0764,stroke:#a855f7,stroke-width:1px,color:#f3e8ff;
    classDef service fill:#172554,stroke:#3b82f6,stroke-width:1px,color:#dbeafe;
    classDef queue fill:#701a75,stroke:#d946ef,stroke-width:1px,color:#fae8ff;
    classDef db fill:#082f49,stroke:#0ea5e9,stroke-width:1px,color:#e0f2fe;
    classDef cache fill:#713f12,stroke:#eab308,stroke-width:1px,color:#fef08a;
    classDef dlq fill:#4c0519,stroke:#f43f5e,stroke-width:1px,color:#ffe4e6;

    Client["📱 Client App / Web (${inputs.MAU / 1000000}M MAU)"]:::client
    DNS["🌐 Route53 DNS Anycast (${inputs.DNS_Lookup_ms}ms)"]:::edge
    CDN["⚡ CloudFront CDN (${inputs.CDN_Cache_Hit_Ratio_Pct}% Hit, ${derivations.edgeNodes.value} PoPs)"]:::edge
    NLB["🛡️ NLB / ALB Layer (${inputs.LB_Forward_ms}ms)"]:::gateway
    GW["🚪 API Gateway (${derivations.gatewayAzPods.value} Pods, +${gwLatencyStr}ms)"]:::gateway

    OrderSvc["📦 Order Service (${inputs.Order_Svc_Instances} Pods)"]:::service
    PaySvc["💳 Payment Service (${inputs.Payment_Svc_Instances} Pods, Idempotent)"]:::service
    InvSvc["🏷️ Inventory Service (${inputs.Inventory_Svc_Instances} Pods)"]:::service
    NotifSvc["🔔 Notification Service (${inputs.Notification_Svc_Instances} Pods)"]:::service

    Kafka["📨 Kafka Event Bus (${derivations.kafkaBrokers.value} Brokers, ${derivations.kafkaPartitions.value} Parts, ${kafkaMbStr}MB/s)"]:::queue
    PG["🗄️ PostgreSQL Primary + ${derivations.dbReplicas.value} Replicas (${dbQpsStr} QPS)"]:::db
    Redis["⚡ Redis Cluster (${redisShardsStr} Shards, ${derivations.cacheTotalClusterGb.value}GB RAM)"]:::cache
    DLQ["⚠️ Dead-Letter Queue (${Math.round(derivations.dlqMsgsPerDay.value)} msgs/day)"]:::dlq

    Client -->|Peak ${peakRpsStr} RPS| DNS
    DNS --> CDN
    CDN -->|Dynamic: ${originRpsStr} RPS| NLB
    NLB --> GW
    GW -->|gRPC / HTTP2| OrderSvc
    GW -->|gRPC / HTTP2| InvSvc

    OrderSvc -->|Idempotent REST| PaySvc
    OrderSvc -->|Transactional Outbox| Kafka
    OrderSvc -->|ACID Write| PG
    InvSvc -->|Sub-ms Lookup| Redis

    Kafka -->|order.events| NotifSvc
    Kafka -->|order.retry 4 tiers| DLQ
`;

  const sequenceDefinition = `
sequenceDiagram
    autonumber
    actor User as 📱 Customer
    participant CDN as ⚡ CloudFront
    participant GW as 🚪 API Gateway
    participant Order as 📦 Order Svc
    participant Pay as 💳 Payment Svc
    participant PG as 🗄️ PostgreSQL
    participant Kafka as 📨 Kafka Bus

    User->>CDN: POST /checkout (Bearer JWT, IdemKey)
    CDN->>GW: Forward Dynamic API (+${gwLatencyStr}ms)
    GW->>GW: Verify JWT + Token Bucket Rate Limit
    GW->>Order: RPC createOrder(payload)
    Order->>Pay: chargeCard(amount, idemKey)
    Pay-->>Order: 200 OK (txn_id)
    Order->>PG: Transactional Outbox (orders + outbox tables)
    Order->>Kafka: Publish order.events (acks=all)
    Order-->>GW: OrderConfirmed (order_id)
    GW-->>User: 201 Created (~${derivations.uncachedPathP50.value.toFixed(0)}ms)
`;

  const stateDefinition = `
stateDiagram-v2
    [*] --> EventIngested : Transaction Started
    EventIngested --> ProcessAttempt : Worker Consumer Poll
    ProcessAttempt --> Success : ACK 200 OK
    Success --> [*]

    ProcessAttempt --> Tier1_Retry : Transient Failure (Error)
    Tier1_Retry --> ProcessAttempt : 5s delay (order.retry.5s)
    
    Tier1_Retry --> Tier2_Retry : Failure #2
    Tier2_Retry --> ProcessAttempt : 10s delay (order.retry.30s)

    Tier2_Retry --> Tier3_Retry : Failure #3
    Tier3_Retry --> ProcessAttempt : 20s delay (order.retry.5m)

    Tier3_Retry --> Tier4_Retry : Failure #4
    Tier4_Retry --> ProcessAttempt : 40s delay (order.retry.40s)

    Tier4_Retry --> DLQ_Queue : Max Retries Exceeded
    DLQ_Queue --> ManualReprocess : Batch Drain (${inputs.Reprocess_Batch_Size} msgs/batch)
    ManualReprocess --> ProcessAttempt : Replayed to Ingest
    DLQ_Queue --> Discarded : Poison Pill Dismissed
`;

  const currentDefinition =
    activeTab === 'flowchart'
      ? flowchartDefinition
      : activeTab === 'sequence'
      ? sequenceDefinition
      : stateDefinition;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0e1017',
        primaryColor: '#312e81',
        primaryTextColor: '#e0e7ff',
        primaryBorderColor: '#6366f1',
        lineColor: '#6366f1',
        secondaryColor: '#14532d',
        tertiaryColor: '#0f172a',
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, monospace',
    });

    const renderChart = async () => {
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          const id = `mermaid-svg-${Date.now()}`;
          const { svg } = await mermaid.render(id, currentDefinition);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err);
        }
      }
    };

    renderChart();
  }, [currentDefinition, peakRpsStr, originRpsStr, activeTab, scenario]);

  const copyDefinition = () => {
    navigator.clipboard.writeText(currentDefinition);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 19
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Reactive Architecture Diagrams (Mermaid.js)</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Auto-generated architecture, checkout sequence, and DLQ state diagrams with live interpolated edge metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Tab Dropdown (< sm) */}
          <div className="block sm:hidden relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-[#0c0d14] border border-indigo-500/30 text-white text-xs rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium pr-7"
            >
              <option value="flowchart" className="bg-[#0c0d14] text-zinc-200">Full Request Path</option>
              <option value="sequence" className="bg-[#0c0d14] text-zinc-200">Checkout Sequence</option>
              <option value="state" className="bg-[#0c0d14] text-zinc-200">DLQ Retry State</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Desktop Tab Selector (>= sm) */}
          <div className="hidden sm:flex items-center bg-black/40 border border-white/[0.08] rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'flowchart' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Full Request Path
            </button>
            <button
              onClick={() => setActiveTab('sequence')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'sequence' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Checkout Sequence
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'state' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DLQ Retry State
            </button>
          </div>

          <button
            onClick={copyDefinition}
            title="Copy Mermaid source definition"
            className="flex items-center gap-1 px-3 py-1.5 sm:py-1 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs text-zinc-300 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>Source</span>
          </button>
        </div>
      </div>

      {/* Live Diagram Viewer */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-6 shadow-2xl overflow-x-auto min-h-[480px] flex items-center justify-center">
        <div ref={containerRef} className="w-full flex justify-center text-zinc-100 font-mono text-xs" />
      </div>
    </div>
  );
}