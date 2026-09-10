'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import {
  BookOpen,
  Search,
  Sparkles,
  Calculator,
  ShieldCheck,
  Zap,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Layers,
  Database,
  Radio,
  Cpu,
  Globe,
  Activity,
  HardDrive,
  Lock,
  TrendingUp,
  Info,
  MessageSquareQuote,
} from 'lucide-react';
import clsx from 'clsx';

export interface ConceptItem {
  id: number;
  title: string;
  category: 'Ingress & Networking' | 'Reliability & Theory' | 'Storage & Data' | 'Traffic & Compute' | 'Messaging & Spatial';
  icon: string;
  shortSummary: string;
  formulaName: string;
  formula: string;
  ruleOfThumb: string;
  interviewNumbersToQuote: string[];
  talkTrack: string;
  tradeoffs: {
    primary: string;
    alternative: string;
    verdict: string;
  };
  sampleCalculation: string;
  relatedSheet: { name: string; path: string };
}

export const conceptsData: ConceptItem[] = [
  {
    id: 1,
    title: 'APIs (REST, gRPC, GraphQL)',
    category: 'Ingress & Networking',
    icon: '🔌',
    shortSummary: 'Application programming interface contracts for client-to-server and internal service mesh communication.',
    formulaName: 'Bandwidth & Serialization Overhead',
    formula: 'Network_Gbps = (Peak_RPS * Avg_Payload_KB * 8) / 1,000,000',
    ruleOfThumb: 'Protobuf binaries are 3x–5x smaller than JSON; JSON serialization takes ~10µs CPU vs Protobuf ~0.8µs.',
    interviewNumbersToQuote: [
      'JSON HTTP/1.1 header overhead: ~500–800 bytes per request',
      'Protobuf binary size reduction: 60–75% vs UTF-8 JSON strings',
      'gRPC throughput multiplier: 7x–10x higher RPS per CPU core over HTTP/2 multiplexing',
    ],
    talkTrack: '"For external public mobile clients, we expose standard REST/JSON over HTTP/3. Internally between Kubernetes microservices, we transcode to binary gRPC over HTTP/2 multiplexed streams to save 70% CPU serialization overhead and 40% network transit bandwidth."',
    tradeoffs: {
      primary: 'gRPC (Binary Protobuf / HTTP2)',
      alternative: 'REST (JSON / HTTP 1.1)',
      verdict: 'Use gRPC for high-throughput internal microservices; use REST/JSON with OpenAPI specs for public mobile SDKs.',
    },
    sampleCalculation: '6,600 Peak RPS * 4 KB payload * 8 / 1,000,000 = 0.21 Gbps egress bandwidth',
    relatedSheet: { name: '04 API Gateway', path: '/gateway' },
  },
  {
    id: 2,
    title: 'API Gateways',
    category: 'Ingress & Networking',
    icon: '🚪',
    shortSummary: 'Single ingress entrypoint managing TLS termination, JWT token validation, rate-limiting, and routing.',
    formulaName: 'Gateway Pod Capacity (Multi-AZ)',
    formula: 'Gateway_Pods = (ceil(Origin_Dynamic_RPS / Pod_Capacity_RPS) + 1) * 3 AZs',
    ruleOfThumb: 'Target 60% CPU baseline utilization to leave 40% surge headroom during flash sales.',
    interviewNumbersToQuote: [
      'Gateway added latency budget: 1.5ms–3.0ms per request',
      'Envoy C++ memory footprint: <50 MB RAM baseline per pod',
      'Redis sliding window rate limit checks: 2 ops per request (lookup + incr)',
    ],
    talkTrack: '"We deploy Envoy Gateway across 3 Availability Zones behind an L4 Network Load Balancer. It terminates TLS 1.3, verifies JWT cryptographic signatures in <0.5ms, and enforces Redis sliding-window token bucket rate-limiting before forwarding to internal pods."',
    tradeoffs: {
      primary: 'Envoy Gateway / Kong (C++ / OpenResty)',
      alternative: 'Spring Cloud Gateway / Zuul (JVM)',
      verdict: 'Envoy provides sub-millisecond event loops without JVM garbage collection pauses or thread pool exhaustion.',
    },
    sampleCalculation: 'ceil(1,000 Origin RPS / 250 RPS per pod) = 4 pods + 1 spare = 5 * 3 AZs = 15 total pods',
    relatedSheet: { name: '04 API Gateway', path: '/gateway' },
  },
  {
    id: 3,
    title: 'JWTs (JSON Web Tokens)',
    category: 'Ingress & Networking',
    icon: '🔑',
    shortSummary: 'Stateless, cryptographically signed tokens carrying user claims and permissions across microservices.',
    formulaName: 'JWT Header Bandwidth & Verification Cost',
    formula: 'Daily_JWT_Bandwidth_GB = (Daily_Requests * JWT_Header_Bytes) / 10^9',
    ruleOfThumb: 'Ed25519 signatures verify in ~50µs vs RSA-256 verifying in ~200µs.',
    interviewNumbersToQuote: [
      'Standard JWT payload size: 600–1,200 bytes per request header',
      'Access token lifespan: 10–15 minutes (short-lived in client RAM)',
      'Refresh token lifespan: 7–30 days (stored in HttpOnly Secure cookie)',
    ],
    talkTrack: '"To avoid database session lookups on every API call, we use stateless JWT access tokens signed via asymmetric RS256/Ed25519. The API Gateway validates the signature once at the perimeter and injects sanitized user headers into internal mTLS calls."',
    tradeoffs: {
      primary: 'Stateless Asymmetric JWTs (RS256)',
      alternative: 'Server-side Stateful Session IDs (Redis lookup)',
      verdict: 'JWTs eliminate millions of Redis session lookups/sec; pair with short 15-min TTL and a Redis token blacklist for instant revocation.',
    },
    sampleCalculation: '60,000,000 Daily Requests * 800 bytes = 48 GB/day header transit bandwidth',
    relatedSheet: { name: '04 API Gateway', path: '/gateway' },
  },
  {
    id: 4,
    title: 'Webhooks',
    category: 'Ingress & Networking',
    icon: '🪝',
    shortSummary: 'Asynchronous HTTP callbacks notifying external systems about events (payments, shipment tracking).',
    formulaName: 'Outbound Webhook Worker Pool',
    formula: 'Webhook_Workers = ceil((Event_RPS * Timeout_Budget_Sec) / Worker_Concurrency)',
    ruleOfThumb: 'Never call 3rd-party webhook endpoints synchronously on client checkout threads.',
    interviewNumbersToQuote: [
      'Cryptographic verification: HMAC-SHA256 signature in X-Signature header',
      'Default outbound HTTP timeout: 2,000ms max with exponential backoff',
      'Retry schedule: 5 retries (10s, 1m, 5m, 1h, 24h) before dead-lettering',
    ],
    talkTrack: '"We decouple webhook delivery using an asynchronous Kafka worker pool. When an order completes, we publish an event to Kafka. Dedicated worker pods sign the payload with HMAC-SHA256 and POST to client URLs with exponential jittered retries to protect against slow endpoints."',
    tradeoffs: {
      primary: 'Async Kafka Worker Pool + HMAC-SHA256',
      alternative: 'Synchronous HTTP thread pool',
      verdict: 'Async worker queues prevent slow or hung 3rd-party servers from exhausting application connection pools.',
    },
    sampleCalculation: '(500 Webhook events/sec * 2.0s timeout) / 10 concurrent threads = 100 worker threads required',
    relatedSheet: { name: '11 DLQ & Error Handling', path: '/dlq' },
  },
  {
    id: 5,
    title: 'REST vs GraphQL',
    category: 'Ingress & Networking',
    icon: '📊',
    shortSummary: 'Resource-based REST endpoints vs client-driven declarative GraphQL query graphs.',
    formulaName: 'Mobile Bandwidth Reduction',
    formula: 'Overfetch_Saved_MB = Daily_Requests * (REST_Size_KB - GQL_Size_KB) / 1024',
    ruleOfThumb: 'GraphQL saves 40–60% payload bytes on mobile cellular networks, but increases server AST parse CPU.',
    interviewNumbersToQuote: [
      'AST query complexity depth limit: Maximum 5–6 nested levels',
      'Query execution timeout: 500ms max to prevent malicious deeply-nested queries',
      'DataLoader batching: Eliminates N+1 database queries across graph resolvers',
    ],
    talkTrack: '"We utilize GraphQL for dynamic frontend mobile screens to eliminate over-fetching and combine 6 REST endpoints into 1 round-trip. On the backend, we enforce strict AST complexity limits and use Dataloader batching to prevent N+1 database query degradation."',
    tradeoffs: {
      primary: 'GraphQL (Client-specified fields)',
      alternative: 'REST with sparse fieldsets (?fields=id,name)',
      verdict: 'GraphQL excels for rich mobile SPAs; REST is superior for caching at CDN edge PoPs via URL hashing.',
    },
    sampleCalculation: '10,000,000 requests * (25 KB REST - 8 KB GraphQL) / 1024 = 166 GB/day cellular bandwidth saved',
    relatedSheet: { name: '03 Frontend & CDN', path: '/frontend' },
  },
  {
    id: 6,
    title: 'Load Balancing (L4 vs L7)',
    category: 'Ingress & Networking',
    icon: '⚖️',
    shortSummary: 'Layer 4 TCP pass-through load balancing vs Layer 7 HTTP application-aware routing.',
    formulaName: 'Load Balancer Concurrency & Line Speed',
    formula: 'Concurrent_Sockets = Peak_RPS * Avg_Connection_Hold_Sec',
    ruleOfThumb: 'L4 NLB handles millions of RPS per static Anycast IP; L7 ALB inspects headers and paths at ~25k RPS/node.',
    interviewNumbersToQuote: [
      'L4 NLB latency overhead: <0.1ms (kernel TCP bypass)',
      'L7 ALB latency overhead: 1.0ms–2.5ms (TLS decryption + path matching)',
      'Algorithm fit: Least Outstanding Requests (LOR) outperforms Round Robin by 30% for variable-duration APIs',
    ],
    talkTrack: '"We use an L4 AWS Network Load Balancer for ultra-high throughput Anycast TCP ingress, forwarding to Envoy Gateway pods that perform Layer 7 routing using the Least Outstanding Requests algorithm to balance traffic across Kubernetes services."',
    tradeoffs: {
      primary: 'L4 NLB + Layer 7 Envoy Gateway',
      alternative: 'Direct Layer 7 ALB only',
      verdict: 'Two-tier LB provides static Anycast IPs with millions of RPS capacity while keeping complex path routing in Envoy.',
    },
    sampleCalculation: '6,600 Peak RPS * 1.5s keep-alive duration = 9,900 concurrent TCP sockets open on NLB',
    relatedSheet: { name: '05 Load Balancer', path: '/lb' },
  },
  {
    id: 7,
    title: 'Proxy vs Reverse Proxy',
    category: 'Ingress & Networking',
    icon: '🛡️',
    shortSummary: 'Forward proxy (protects & caches for clients) vs Reverse proxy (protects, balances & caches for servers).',
    formulaName: 'Reverse Proxy SSL & Buffer Offload',
    formula: 'SSL_Handshakes_Sec = Peak_RPS * (1 - TLS_Session_Resumption_Pct / 100)',
    ruleOfThumb: 'A reverse proxy hides backend server IPs, performs gzip/Brotli compression, and buffers slow client uploads.',
    interviewNumbersToQuote: [
      'TLS 1.3 0-RTT resumption rate: 85–95% on repeat client connections',
      'Slowloris attack mitigation: Reverse proxy buffers entire request body before sending to backend app',
      'Brotli compression bandwidth savings: 20–30% smaller than standard Gzip',
    ],
    talkTrack: '"We deploy Nginx/Envoy as a reverse proxy in front of our application tier. It handles SSL/TLS termination, Brotli compression, request buffering, and prevents direct public internet exposure of our internal Kubernetes service IPs."',
    tradeoffs: {
      primary: 'Envoy / NGINX Reverse Proxy',
      alternative: 'Direct application pod exposure',
      verdict: 'Reverse proxies centralize security headers (HSTS, CORS, CSP), rate limiting, and connection multiplexing.',
    },
    sampleCalculation: '6,600 Peak RPS * (1 - 0.90 resumption) = 660 full cryptographic TLS handshakes/sec',
    relatedSheet: { name: '05 Load Balancer', path: '/lb' },
  },
  {
    id: 8,
    title: 'Scalability (Horizontal vs Vertical)',
    category: 'Reliability & Theory',
    icon: '📈',
    shortSummary: 'Scaling up (larger CPU/RAM hardware) vs scaling out (adding more stateless commodity nodes).',
    formulaName: 'Horizontal Pod Autoscaler (HPA)',
    formula: 'Required_Replicas = ceil(Current_RPS / Target_RPS_Per_Pod)',
    ruleOfThumb: 'Vertical scaling hits diminishing returns above 128 vCPUs ($5k+/mo); horizontal scaling provides linear cost elasticity.',
    interviewNumbersToQuote: [
      'Target CPU utilization baseline: 60–70% for automated burst headroom',
      'HPA scale-up cooldown: 15–30 seconds; scale-down cooldown: 300 seconds to prevent thrashing',
      'Stateless scaling speed: Kubernetes pods spin up in <5 seconds',
    ],
    talkTrack: '"We design our application microservices to be 100% stateless, externalizing all state to Redis and PostgreSQL. This enables our Kubernetes Horizontal Pod Autoscaler to dynamically scale from 15 to 100+ pods in seconds based on CPU utilization and request throughput."',
    tradeoffs: {
      primary: 'Horizontal Scaling (Kubernetes HPA)',
      alternative: 'Vertical Scaling (Larger AWS EC2 instances)',
      verdict: 'Horizontal scaling guarantees zero-downtime rolling updates and multi-AZ fault tolerance.',
    },
    sampleCalculation: 'ceil(6,600 Peak RPS / 150 RPS per pod) = 44 stateless microservice pods required',
    relatedSheet: { name: '06 Backend Services', path: '/backend' },
  },
  {
    id: 9,
    title: 'Availability & SLAs (The 9s Rule)',
    category: 'Reliability & Theory',
    icon: '⏱️',
    shortSummary: 'Mathematical measurement of system uptime and allowable annual downtime budgets.',
    formulaName: 'Downtime Budget Calculation',
    formula: 'Max_Allowed_Downtime_Minutes = 525,600 min/yr * (1 - Uptime_Pct / 100)',
    ruleOfThumb: '99.9% (3 nines) = 8.76 hrs/yr; 99.99% (4 nines) = 52.6 min/yr; 99.999% (5 nines) = 5.26 min/yr.',
    interviewNumbersToQuote: [
      '99.9% (Three 9s): 43.8 minutes downtime per month',
      '99.99% (Four 9s): 4.38 minutes downtime per month (Standard enterprise target)',
      '99.999% (Five 9s): 26.3 seconds downtime per month (Requires multi-region active-active)',
    ],
    talkTrack: '"Our SLA commitment is 99.99% availability (Four Nines), allowing a maximum of 52.6 minutes of downtime per year. We achieve this through Multi-AZ active-active deployments, N+1 redundancy, automated circuit breakers, and zero-downtime rolling canary deployments."',
    tradeoffs: {
      primary: 'Multi-AZ Active-Active (99.99% SLA)',
      alternative: 'Multi-Region Active-Active with 2PC (99.999% SLA)',
      verdict: 'Multi-AZ provides 99.99% with <1ms replication latency; Multi-Region Active-Active incurs high cross-region latency penalties.',
    },
    sampleCalculation: '525,600 minutes * (1 - 0.9999) = 52.56 minutes of allowable downtime per calendar year',
    relatedSheet: { name: '13 Observability & SLOs', path: '/observability' },
  },
  {
    id: 10,
    title: 'SPOF (Single Point of Failure)',
    category: 'Reliability & Theory',
    icon: '⚠️',
    shortSummary: 'Identifying and eliminating architectural components whose failure halts the entire system.',
    formulaName: 'System Reliability Product Rule',
    formula: 'System_Availability = Availability_Hop1 * Availability_Hop2 * ... * Availability_HopN',
    ruleOfThumb: 'Every tier must have at least 3 nodes across 3 Availability Zones with automated health-check failover.',
    interviewNumbersToQuote: [
      'Availability Zone independence: Separate power, networking, and flood plains',
      'Primary database automated failover: <30 seconds with AWS RDS Multi-AZ / Patroni',
      'Kafka KRaft quorum minimum: 3 controller nodes (survives 1 failure) or 5 (survives 2 failures)',
    ],
    talkTrack: '"We audit every hop in our architecture to eliminate SPOFs: Anycast DNS has 300+ PoPs, API Gateways run across 3 AZs, PostgreSQL uses synchronous Multi-AZ standby with automated failover, and Kafka uses 3 KRaft controllers with replication factor 3."',
    tradeoffs: {
      primary: '3-AZ Active-Active Redundancy',
      alternative: 'Single-AZ primary with nightly backups',
      verdict: 'Multi-AZ redundancy eliminates human intervention during data center power outages or fiber cuts.',
    },
    sampleCalculation: '0.9999 (CDN) * 0.9999 (Gateway) * 0.9999 (App) * 0.9999 (DB) = 99.96% composite availability',
    relatedSheet: { name: '12 Traffic Spikes & DDoS', path: '/spikes' },
  },
  {
    id: 11,
    title: 'CAP & PACELC Theorem',
    category: 'Reliability & Theory',
    icon: '📐',
    shortSummary: 'Consistency vs Availability vs Partition Tolerance in distributed data storage.',
    formulaName: 'PACELC Tradeoff Model',
    formula: 'If Partition (P) -> Tradeoff (A vs C) | Else (E) -> Tradeoff (Latency L vs Consistency C)',
    ruleOfThumb: 'You cannot choose CA across network partitions; you must choose CP (Spanner, HBase) or AP (Cassandra, DynamoDB).',
    interviewNumbersToQuote: [
      'CP Systems: Guarantee strict linearizability via Paxos/Raft (e.g. Bank Balances, Inventory)',
      'AP Systems: Guarantee 100% write availability with eventual consistency (e.g. Social Feeds, Metrics)',
      'PACELC distinction: Even during normal operation without partitions, systems trade Latency for Strong Consistency',
    ],
    talkTrack: '"Under the CAP/PACELC theorem, our checkout system is CP (Consistency over Availability) for payment and inventory transactions using PostgreSQL ACID. Our product review feed is AP (Availability over Consistency) using DynamoDB with eventual consistency to maintain ultra-fast sub-10ms response times."',
    tradeoffs: {
      primary: 'CP for Financials (Postgres/Spanner)',
      alternative: 'AP for Social Feeds (Cassandra/DynamoDB)',
      verdict: 'Use hybrid polyglot persistence: CP where double-spends are fatal; AP where high write availability matters.',
    },
    sampleCalculation: 'Postgres ACID write (~15ms 2PC sync) vs DynamoDB eventual consistency write (~2ms single node ACK)',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
  {
    id: 12,
    title: 'SQL vs NoSQL',
    category: 'Reliability & Theory',
    icon: '🗄️',
    shortSummary: 'Relational ACID structured databases vs non-relational distributed document/key-value stores.',
    formulaName: 'Database Throughput Sizing',
    formula: 'DB_Nodes = ceil(Total_QPS / Single_Node_QPS_Capacity)',
    ruleOfThumb: 'SQL excels for relational joins, ACID transactions, and complex filtering; NoSQL scales writes horizontally to 100k+ QPS.',
    interviewNumbersToQuote: [
      'Single PostgreSQL node write limit: ~5,000–15,000 write IOPS before sharding',
      'DynamoDB / Cassandra write throughput: Virtually unlimited linear scale ($100k+$ QPS)',
      'B-Tree read cost: $O(\\log N)$ vs Hash/LSM Tree read cost: $O(1)$ amortized',
    ],
    talkTrack: '"We use PostgreSQL for user accounts, checkout orders, and financial ledger data where relational ACID foreign keys are mandatory. For clickstream analytics, user cart sessions, and product reviews, we use DynamoDB/Redis to achieve horizontal scaling and single-digit millisecond latency."',
    tradeoffs: {
      primary: 'PostgreSQL Relational OLTP',
      alternative: 'MongoDB / DynamoDB NoSQL',
      verdict: 'Relational SQL prevents data corruption in transactional core systems; NoSQL excels for denormalized high-velocity data.',
    },
    sampleCalculation: '16,000 Read QPS / 4,000 QPS capacity per replica = 4 PostgreSQL read replicas required',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
  {
    id: 13,
    title: 'ACID Transactions & Isolation Levels',
    category: 'Reliability & Theory',
    icon: '🔒',
    shortSummary: 'Atomicity, Consistency, Isolation, and Durability guarantees across relational databases.',
    formulaName: 'MVCC Lock Contention & Transaction Latency',
    formula: 'Txn_Duration_ms = Lock_Wait_ms + Query_Execution_ms + WAL_Flush_ms',
    ruleOfThumb: 'Read Committed is the default in PostgreSQL; Repeatable Read prevents non-repeatable reads; Serializable prevents phantom anomalies.',
    interviewNumbersToQuote: [
      'PostgreSQL MVCC: Readers never block writers; writers never block readers',
      'WAL (Write-Ahead Log) sync overhead: 1–3ms fsync to NVMe SSD',
      'Transactional Outbox Pattern: Commit business data + outbox table event in a single atomic local ACID transaction',
    ],
    talkTrack: '"To guarantee data integrity during order creation, we execute within a Read Committed ACID transaction. We use the Transactional Outbox Pattern to insert both the `orders` record and the `outbox_events` record in the same local transaction, completely eliminating dual-write inconsistencies."',
    tradeoffs: {
      primary: 'Transactional Outbox Pattern (Local ACID + CDC)',
      alternative: 'Two-Phase Commit (2PC / Distributed XA Transactions)',
      verdict: '2PC blocks coordinator threads across network partitions; Outbox pattern provides local ACID with async eventual consistency.',
    },
    sampleCalculation: 'Local ACID Txn (2.5ms) vs Distributed 2PC over WAN (~45ms latency lock penalty)',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
  {
    id: 14,
    title: 'Database Indexes (B+ Tree Mechanics)',
    category: 'Storage & Data',
    icon: '🔍',
    shortSummary: 'B+ Tree indexing structures accelerating search lookups from $O(N)$ table scans down to $O(\\log N)$.',
    formulaName: 'B+ Tree Height & Index RAM Size',
    formula: 'BTree_Height = ceil(log_Fanout(Total_Rows)) | Index_RAM = Rows * (Key_Bytes + Pointer_Bytes)',
    ruleOfThumb: 'With a fanout of 100, a B+ Tree holds 100M rows in only 4 levels (maximum 4 disk I/O lookups).',
    interviewNumbersToQuote: [
      'B+ Tree Fanout: 100–500 keys per 8KB page',
      'Disk seeks for 10M rows: 3–4 page reads (all top levels cached in RAM)',
      'Index write penalty: Every INSERT/UPDATE requires updating all composite indexes',
    ],
    talkTrack: '"We add composite B+ Tree indexes on `(user_id, created_at DESC)` to support pagination queries in $O(\\log N)$ time without disk sorting. The top 3 levels of the B+ Tree reside entirely in PostgreSQL `shared_buffers` RAM, ensuring index lookups execute in <1ms."',
    tradeoffs: {
      primary: 'Covering Composite B+ Tree Index',
      alternative: 'Sequential Full Table Scan',
      verdict: 'Covering indexes allow index-only scans without accessing underlying heap data pages.',
    },
    sampleCalculation: 'ceil(log_100(10,000,000 rows)) = 4 levels -> 10M rows * 32 bytes = 320 MB index RAM size',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
  {
    id: 15,
    title: 'Database Sharding',
    category: 'Storage & Data',
    icon: '🧩',
    shortSummary: 'Horizontal partitioning of database rows across independent physical database servers.',
    formulaName: 'Required Shard Count',
    formula: 'Shard_Count = max(ceil(Total_Write_QPS / Node_Write_Limit), ceil(Total_Storage_TB / Node_Disk_TB))',
    ruleOfThumb: 'Shard by high-cardinality keys (`customer_id`, `uuid`) to ensure even write and storage distribution.',
    interviewNumbersToQuote: [
      'Shard key cardinality requirement: At least 1,000,000+ distinct values to avoid hotspotting',
      'Scatter-gather query penalty: Querying across 16 shards increases P99 latency by 4x–8x',
      'Resharding strategy: Use Consistent Hashing or Virtual Shards (Vitess/Citus) to add nodes without bulk data migration',
    ],
    talkTrack: '"When write throughput exceeds 15k QPS or database disk exceeds 10 TB, we shard horizontally by `user_id` using consistent hashing. All orders, payments, and profiles for a user reside on the same physical shard, avoiding costly cross-shard joins and distributed transactions."',
    tradeoffs: {
      primary: 'Application-Level / Vitess Sharding by user_id',
      alternative: 'Massive vertical AWS r6i.32xlarge scale-up',
      verdict: 'Sharding provides virtually unlimited write scalability, but requires avoiding cross-shard joins.',
    },
    sampleCalculation: 'max(ceil(30,000 Write QPS / 4,000 QPS), ceil(12 TB / 2 TB)) = 8 physical shards required',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
  {
    id: 16,
    title: 'Consistent Hashing',
    category: 'Storage & Data',
    icon: '⭕',
    shortSummary: 'Circular hash ring distributing keys across servers minimizing data remapping when nodes are added or removed.',
    formulaName: 'Key Remapping Ratio & Virtual Nodes',
    formula: 'Keys_Moved_On_Node_Change = 1 / N_Nodes | Virtual_Nodes_Per_Server = 150 - 250',
    ruleOfThumb: 'Standard modulo hashing ($K \\bmod N$) remaps ~100% of keys on node failure; Consistent Hashing remaps only $1/N$ keys.',
    interviewNumbersToQuote: [
      'Hash space: 32-bit integer ring ($0$ to $2^{32} - 1$ / $4.29\\text{ billion}$ positions)',
      'Virtual nodes per physical server: ~150–250 to achieve <5% standard deviation variance in load distribution',
      'Primary implementations: Amazon DynamoDB, Apache Cassandra, Memcached/Twemproxy rings',
    ],
    talkTrack: '"We use Consistent Hashing with 200 virtual nodes per physical cache server on a $2^{32}-1$ hash ring. When a Redis node crashes or scales up, only $1/N$ of keys are invalidated, completely preventing cache thundering herd storms on our primary PostgreSQL database."',
    tradeoffs: {
      primary: 'Consistent Hashing with Virtual Nodes',
      alternative: 'Modulo Hashing (hash(key) % N)',
      verdict: 'Consistent hashing maintains cache warmness during horizontal auto-scaling events.',
    },
    sampleCalculation: 'Adding 1 node to a 10-node cluster moves only 1/11th (9%) of keys vs 91% with modulo hashing',
    relatedSheet: { name: '10 Cache Design', path: '/cache' },
  },
  {
    id: 17,
    title: 'CDC (Change Data Capture)',
    category: 'Storage & Data',
    icon: '🔄',
    shortSummary: 'Capturing row-level database changes directly from the Write-Ahead Log (WAL) to stream into downstream systems.',
    formulaName: 'CDC Event Streaming Throughput',
    formula: 'CDC_MBps = (DB_Write_IOPS * Avg_Row_Size_KB) / 1024',
    ruleOfThumb: 'CDC reads the database transaction log directly, imposing <2% CPU overhead on the primary database.',
    interviewNumbersToQuote: [
      'Debezium replication lag: Sub-50 milliseconds from PostgreSQL WAL to Kafka topic',
      'Zero dual-write penalty: Application only writes to PostgreSQL; CDC handles Elasticsearch, Cache & Warehouse syncing',
      'Event format: JSON / Apache Avro with schema registry and before/after row snapshots',
    ],
    talkTrack: '"To maintain search indexes in Elasticsearch and invalidate Redis caches without dangerous dual-writes, we use Debezium CDC to tail the PostgreSQL Write-Ahead Log (WAL). Changes are published to Kafka in <50ms with guaranteed ordering by primary key."',
    tradeoffs: {
      primary: 'Debezium CDC via PostgreSQL WAL',
      alternative: 'Application dual-writes (Write to DB then write to Kafka)',
      verdict: 'CDC eliminates split-brain data corruption where database commits but the network drop fails the Kafka publish.',
    },
    sampleCalculation: '2,000 DB Writes/sec * 1.5 KB row size / 1024 = 2.93 MB/s CDC stream into Kafka',
    relatedSheet: { name: '08 Kafka Event Bus', path: '/kafka' },
  },
  {
    id: 18,
    title: 'Caching Architecture & The 80/20 Rule',
    category: 'Storage & Data',
    icon: '⚡',
    shortSummary: 'In-memory caching tiers (Redis/Memcached) storing hot query results to eliminate disk I/O.',
    formulaName: 'Pareto Working Set Sizing',
    formula: 'Hot_Working_Set_RAM_GB = (Total_Catalog_SKUs * 0.20 * SKU_Size_KB * 1.30_Overhead) / 10^6',
    ruleOfThumb: 'Pareto Principle: 20% of catalog items generate 80% of read traffic. Size RAM to hold 100% of that 20% working set.',
    interviewNumbersToQuote: [
      'Redis in-memory read latency: 0.5ms–1.5ms vs NVMe SSD database read: 10ms–30ms',
      'Cache Hit Rate target: 90%–98% for read-heavy e-commerce catalogs',
      'Blended Latency formula: $(Hit\\% \\times Cache\\_Time) + ((1 - Hit\\%) \\times DB\\_Time)$',
    ],
    talkTrack: '"We size our Redis Cluster using the 80/20 rule: 20% of our 500k hot SKUs generate 80% of views. Storing those 100k items in Redis with 1.3x memory overhead requires only 13 GB RAM, while absorbing 95% of database read traffic and dropping P50 latency to 1.2ms."',
    tradeoffs: {
      primary: 'Redis Cluster In-Memory Caching',
      alternative: 'Uncached PostgreSQL Read Queries',
      verdict: 'Redis reduces read replica count from 32 down to 4 nodes, saving thousands in cloud costs.',
    },
    sampleCalculation: '(500,000 SKUs * 0.20 * 20 KB * 1.3) / 1,000,000 = 2.6 GB hot cache RAM required',
    relatedSheet: { name: '10 Cache Design', path: '/cache' },
  },
  {
    id: 19,
    title: 'Caching Strategies',
    category: 'Storage & Data',
    icon: '🗂️',
    shortSummary: 'Cache-Aside, Write-Through, Write-Behind (Write-Back), and Refresh-Ahead data synchronization patterns.',
    formulaName: 'Cache Miss Latency Impact',
    formula: 'Blended_Latency_ms = (Hit_Ratio * Cache_ms) + ((1 - Hit_Ratio) * (Cache_ms + DB_ms + Cache_Write_ms))',
    ruleOfThumb: 'Use Cache-Aside for read-heavy workloads; use Write-Through for strictly consistent user sessions.',
    interviewNumbersToQuote: [
      'Cache-Aside: Lazy loading on miss; resilient to cache crashes but susceptible to initial cache misses',
      'Write-Through: Atomic write to Cache and DB before returning 200 OK; ensures cache never goes stale',
      'Write-Behind: Asynchronous batched writes to DB; saves 80% DB write IOPS but risks data loss on cache node crash',
    ],
    talkTrack: '"We use the Cache-Aside pattern for our product catalog: application queries Redis first; on a miss, it fetches from PostgreSQL and populates Redis with a 24-hour TTL. For critical user permissions, we use Write-Through to ensure immediate consistency upon revocation."',
    tradeoffs: {
      primary: 'Cache-Aside (Lazy Load) with TTL',
      alternative: 'Write-Behind (Write-Back Caching)',
      verdict: 'Cache-Aside is resilient to node restarts without risk of data loss compared to async Write-Behind.',
    },
    sampleCalculation: '(0.95 * 1ms) + (0.05 * (1ms + 15ms + 1ms)) = 0.95ms + 0.85ms = 1.80ms blended response time',
    relatedSheet: { name: '10 Cache Design', path: '/cache' },
  },
  {
    id: 20,
    title: 'Cache Eviction Policies (LRU vs LFU)',
    category: 'Storage & Data',
    icon: '🧹',
    shortSummary: 'Algorithms determining which data to evict when in-memory RAM reaches maxmemory capacity.',
    formulaName: 'Redis Maxmemory Configuration',
    formula: 'Configured_Maxmemory_GB = Total_Host_RAM_GB * 0.75 (Leaves 25% for BGSAVE & replication buffer)',
    ruleOfThumb: 'Use `allkeys-lru` for general web traffic; use `volatile-lru` if only specific temporary keys should expire.',
    interviewNumbersToQuote: [
      'LRU (Least Recently Used): Evicts keys unused for the longest time using doubly-linked list pointers',
      'LFU (Least Frequently Used): Evicts keys with lowest access counters using logarithmic frequency counters',
      'Memory safety reserve: Always cap Redis `maxmemory` at 75% of physical RAM to avoid Linux OOM-killer crashes',
    ],
    talkTrack: '"We configure Redis with `maxmemory-policy allkeys-lru` capped at 75% of container RAM. When flash sales introduce temporary burst SKUs, Redis automatically evicts cold catalog items based on recency, guaranteeing memory stability without Out-Of-Memory container terminations."',
    tradeoffs: {
      primary: 'allkeys-lru (Approximated LRU in Redis)',
      alternative: 'noeviction (Returns OOM error on write)',
      verdict: '`allkeys-lru` maintains system availability by prioritizing current active working set keys.',
    },
    sampleCalculation: '16 GB Physical Server RAM * 0.75 target = 12 GB maxmemory setting in redis.conf',
    relatedSheet: { name: '10 Cache Design', path: '/cache' },
  },
  {
    id: 21,
    title: 'CDN & Anycast Edge Points of Presence',
    category: 'Traffic & Compute',
    icon: '🌐',
    shortSummary: 'Global network of edge edge servers caching static media and accelerating dynamic API handshakes.',
    formulaName: 'CDN Edge Traffic Offload',
    formula: 'Origin_RPS = Total_Client_RPS * (1 - CDN_Cache_Hit_Pct / 100)',
    ruleOfThumb: 'A global CDN absorbs 85%+ of read traffic, protecting the origin API Gateway from volumetric surges.',
    interviewNumbersToQuote: [
      'Edge PoP round-trip time: <15ms DNS resolution via BGP Anycast',
      'Origin bandwidth savings: 85–95% bandwidth offload for static assets and GET catalog endpoints',
      'Stale-while-revalidate: Serves cached edge response in 5ms while background fetching latest price from origin',
    ],
    talkTrack: '"We position Cloudflare/CloudFront Edge PoPs across 300+ global locations. The CDN terminates TLS 1.3 close to the user and serves static assets and cached catalog JSON with an 85% hit rate, reducing 6.6k client RPS down to under 1k RPS reaching our origin API Gateway."',
    tradeoffs: {
      primary: 'Cloudflare / AWS CloudFront Managed CDN',
      alternative: 'Self-hosted Nginx Edge PoPs',
      verdict: 'Managed CDNs eliminate multi-terabit DDoS mitigation complexity and provide global BGP Anycast out of the box.',
    },
    sampleCalculation: '6,600 Peak RPS * (1 - 0.85 CDN Hit) = 990 RPS dynamic origin traffic reaching API Gateway',
    relatedSheet: { name: '03 Frontend & CDN', path: '/frontend' },
  },
  {
    id: 22,
    title: 'Rate Limiting Algorithms',
    category: 'Traffic & Compute',
    icon: '🛑',
    shortSummary: 'Controlling client request frequency to prevent DDoS attacks, brute-forcing, and noisy-neighbor API abuse.',
    formulaName: 'Sliding Window Counter Ops',
    formula: 'Redis_Memory_Per_User = 2_Keys * 64_Bytes | Token_Refill_Rate = Max_Requests / Window_Seconds',
    ruleOfThumb: 'Token Bucket allows brief bursts; Sliding Window Counter provides strict rate enforcement with low memory.',
    interviewNumbersToQuote: [
      'Anonymous Tier: 60 requests/minute per IP address',
      'Authenticated Tier: 1,000 requests/minute per User ID',
      'HTTP Status Code: `429 Too Many Requests` with `Retry-After: 30` header',
    ],
    talkTrack: '"We enforce rate limiting at the API Gateway using a Redis-backed Sliding Window Counter algorithm. Unauthenticated requests are limited to 60 RPM per IP, while authenticated users receive 1,000 RPM. When exceeded, the gateway returns HTTP 429 with a `Retry-After` header."',
    tradeoffs: {
      primary: 'Redis Sliding Window Counter',
      alternative: 'Fixed Window Counter',
      verdict: 'Sliding Window eliminates the 2x burst vulnerability at fixed window reset boundaries.',
    },
    sampleCalculation: '1,000,000 active users * 128 bytes memory = 128 MB RAM in Redis for distributed rate tracking',
    relatedSheet: { name: '04 API Gateway', path: '/gateway' },
  },
  {
    id: 23,
    title: 'Message Queues & Streaming (Kafka vs RabbitMQ)',
    category: 'Messaging & Spatial',
    icon: '📨',
    shortSummary: 'Asynchronous event streaming and message queuing decoupling microservices and buffering load spikes.',
    formulaName: 'Kafka Partition & Broker Sizing',
    formula: 'Partitions = ceil(Ingress_MBps / 10_MBps_Producer_Cap) | Brokers = max(3, ceil(Partitions / 24))',
    ruleOfThumb: 'RabbitMQ is a push-based transient message broker; Kafka is an append-only distributed commit log.',
    interviewNumbersToQuote: [
      'Kafka partition throughput: ~10 MB/s per partition producer write limit',
      'Zero-copy DMA: Kafka uses OS kernel `sendfile` to stream disk pages directly to NIC network buffers',
      'Message retention: 7–14 days persistent storage on NVMe SSD for consumer replayability',
    ],
    talkTrack: '"We use Apache Kafka for event-driven pub/sub. When an order is created, we publish to `order.events` with `acks=all` and replication factor 3. Multiple downstream consumers (Inventory, Notifications, Analytics) read independently via their own consumer group offsets at their own pace."',
    tradeoffs: {
      primary: 'Apache Kafka (Distributed Commit Log)',
      alternative: 'RabbitMQ (Push-based Message Broker)',
      verdict: 'Kafka scales to millions of events/sec with immutable disk retention; RabbitMQ degrades when queues grow large.',
    },
    sampleCalculation: '(6,600 RPS * 0.5 KB msg) / 1024 = 3.22 MB/s -> ceil(3.22 / 10) = 1 partition -> 3 Brokers for HA',
    relatedSheet: { name: '08 Kafka Event Bus', path: '/kafka' },
  },
  {
    id: 24,
    title: 'Bloom Filters',
    category: 'Traffic & Compute',
    icon: '🌸',
    shortSummary: 'Space-efficient probabilistic data structure testing whether an element is definitely not in a set or possibly in a set.',
    formulaName: 'Bloom Filter Bit Array & Optimal Hashes',
    formula: 'Bits_m = -(n * ln(p)) / (ln(2))^2 | Hashes_k = (m / n) * ln(2)',
    ruleOfThumb: 'A Bloom filter uses only ~9.6 bits per item for a 1% false positive error rate ($p=0.01$).',
    interviewNumbersToQuote: [
      'Memory efficiency: 10,000,000 elements at 1% error requires only ~12 MB of RAM (vs 1 GB in Redis Hash)',
      'False Negative guarantee: Zero false negatives (If Bloom filter returns False, the item definitely does not exist)',
      'Primary use cases: Username availability checks, Google Bigtable SSTable disk lookup bypass, web crawler URL deduplication',
    ],
    talkTrack: '"To prevent costly database queries for non-existent usernames, we maintain a Bloom Filter in Redis. If the Bloom filter returns false, we instantly return 404 in <1ms without touching PostgreSQL. Only if it returns true do we query the database to verify."',
    tradeoffs: {
      primary: 'Redis Bloom Filter (Scalable Module)',
      alternative: 'Full Hash Set in RAM / Direct DB Query',
      verdict: 'Bloom filters save 98% of RAM while preventing expensive disk I/O on missing keys.',
    },
    sampleCalculation: '-(10,000,000 * ln(0.01)) / (0.6931)^2 = 95,850,583 bits = 11.42 MB RAM for 10M keys',
    relatedSheet: { name: '10 Cache Design', path: '/cache' },
  },
  {
    id: 25,
    title: 'Idempotency & Deduplication',
    category: 'Traffic & Compute',
    icon: '🔁',
    shortSummary: 'Ensuring an operation produces identical results regardless of how many times it is executed or retried.',
    formulaName: 'Idempotency Key Cache Footprint',
    formula: 'Idem_Cache_RAM = Daily_Mutations * (UUID_Bytes + Status_Bytes + Response_JSON_Bytes)',
    ruleOfThumb: 'Clients must pass a unique `Idempotency-Key: UUIDv4` header on all mutating POST and PUT requests.',
    interviewNumbersToQuote: [
      'Distributed lock timeout: 5 seconds with automatic renewal to prevent deadlocks',
      'Database unique index: `UNIQUE INDEX (idempotency_key)` on transactions table',
      'HTTP Status: Returns cached original `200 OK` response with `X-Cache-Lookup: HIT` on duplicate execution',
    ],
    talkTrack: '"To prevent double-charging during mobile network timeouts, the client generates a unique UUIDv4 idempotency key. The payment service acquires a 5-second Redis lock on `idempotency:key`. If already processed, it returns the cached receipt immediately without charging the payment gateway again."',
    tradeoffs: {
      primary: 'Redis Distributed Lock + DB Unique Constraint',
      alternative: 'Client-side button disabling only',
      verdict: 'Server-side idempotency guarantees safety even when users refresh browsers or network drops duplicate packets.',
    },
    sampleCalculation: '2,000,000 daily checkouts * (36 bytes UUID + 200 bytes JSON) = 472 MB Redis storage with 24h TTL',
    relatedSheet: { name: '06 Backend Services', path: '/backend' },
  },
  {
    id: 26,
    title: 'Concurrency vs Parallelism (Little’s Law)',
    category: 'Messaging & Spatial',
    icon: '⚡',
    shortSummary: 'Concurrency (dealing with lots of things at once) vs Parallelism (executing multiple things simultaneously).',
    formulaName: 'Little’s Law (Inflight Request Concurrency)',
    formula: 'Concurrent_Requests_L = Throughput_lambda (RPS) * Latency_W (seconds)',
    ruleOfThumb: 'If your API handles 6,600 RPS with an average latency of 50ms (0.05s), there are exactly 330 concurrent requests inflight.',
    interviewNumbersToQuote: [
      'Go goroutine memory overhead: ~2–4 KB stack (handles 100,000+ concurrent connections per pod)',
      'JVM OS thread memory overhead: ~1 MB stack (requires connection pooling to prevent thread exhaustion)',
      'Node.js / Envoy async event loop: Non-blocking epoll/kqueue multiplexing on single CPU thread',
    ],
    talkTrack: '"Using Little’s Law ($L = \\lambda \\times W$), at 6,600 Peak RPS with 50ms average backend latency, our application holds 330 concurrent requests inflight at any millisecond. We use non-blocking Go goroutines / Envoy event loops so this consumes under 2 MB of memory across our cluster."',
    tradeoffs: {
      primary: 'Non-blocking I/O Event Loops (Go/Envoy/Node)',
      alternative: 'Thread-per-request blocking model (Java Servlets)',
      verdict: 'Non-blocking concurrency models prevent thread-pool starvation when downstream databases experience latency spikes.',
    },
    sampleCalculation: '6,600 RPS * 0.050 seconds latency = 330 concurrent active inflight requests',
    relatedSheet: { name: '06 Backend Services', path: '/backend' },
  },
  {
    id: 27,
    title: 'Long Polling vs WebSockets vs Server-Sent Events (SSE)',
    category: 'Messaging & Spatial',
    icon: '📡',
    shortSummary: 'Protocols for real-time bi-directional and uni-directional server-to-client communication.',
    formulaName: 'Concurrent WebSocket Memory Buffer',
    formula: 'WebSocket_RAM_GB = (Concurrent_Sockets * TCP_Socket_Buffer_KB) / 10^6',
    ruleOfThumb: 'Use WebSockets for bi-directional real-time chat/gaming; use SSE for uni-directional live feeds/stocks.',
    interviewNumbersToQuote: [
      'Short polling overhead: Generates 90%+ empty HTTP headers and crushes origin servers at scale',
      'WebSocket connection memory: ~64 KB RAM per open socket (kernel TCP send/receive buffer)',
      'SSE efficiency: Operates over standard HTTP/2 multiplexed streams without custom framing protocols',
    ],
    talkTrack: '"For real-time driver GPS tracking in our delivery app, we use persistent WebSockets over TLS with a 60-second ping/pong heartbeat. For order status updates, we use Server-Sent Events (SSE) since updates are strictly uni-directional from server to client."',
    tradeoffs: {
      primary: 'WebSockets (Bi-directional) & SSE (Uni-directional)',
      alternative: 'Client Short Polling every 2 seconds',
      verdict: 'WebSockets and SSE eliminate millions of wasted HTTP request headers and reduce origin CPU load by 80%.',
    },
    sampleCalculation: '100,000 concurrent driver sockets * 64 KB kernel buffer = 6.4 GB server RAM for connection tier',
    relatedSheet: { name: '04 API Gateway', path: '/gateway' },
  },
  {
    id: 28,
    title: 'Stateful vs Stateless Architecture',
    category: 'Messaging & Spatial',
    icon: '🏢',
    shortSummary: 'Decoupling application compute from persistent session state to enable rapid auto-scaling and failover.',
    formulaName: 'Session Externalization Throughput',
    formula: 'Session_Store_Ops = Peak_RPS * (1_Read_Per_Req + Auth_Write_Ratio)',
    ruleOfThumb: 'Stateless pods can be terminated, updated, or autoscaled at any second without dropping user sessions.',
    interviewNumbersToQuote: [
      'Kubernetes pod rolling deployment speed: Zero dropped connections with 30s termination grace period',
      'Sticky sessions anti-pattern: Leads to hotspot servers when popular users connect to the same pod',
      'Shared state tier: Redis Cluster with multi-AZ replication provides sub-millisecond session access',
    ],
    talkTrack: '"We enforce strict statelessness across all backend microservices. User sessions, shopping carts, and rate limit counters are stored in an external Redis Cluster. This allows any Kubernetes pod to serve any request and enables instantaneous horizontal auto-scaling without sticky session routing."',
    tradeoffs: {
      primary: 'Stateless Pods + External Redis State',
      alternative: 'In-Memory Stateful Sticky Sessions (ALB affinity)',
      verdict: 'Stateless architecture enables zero-downtime rolling deploys and automatic pod replacement on crash.',
    },
    sampleCalculation: '6,600 Peak RPS * 1 session check = 6,600 ops/sec handled by Redis Cluster across 3 shards',
    relatedSheet: { name: '06 Backend Services', path: '/backend' },
  },
  {
    id: 29,
    title: 'Batch vs Stream Processing (Lambda vs Kappa)',
    category: 'Messaging & Spatial',
    icon: '🌊',
    shortSummary: 'Real-time event-by-event stream processing (Flink/Kafka Streams) vs bounded batch processing (Spark/Snowflake).',
    formulaName: 'Streaming Event Lag & Windowing',
    formula: 'Max_Event_Lag_Sec = (Queued_Messages / Consumer_Throughput_Per_Sec) + Processing_Window_Sec',
    ruleOfThumb: 'Kappa Architecture uses a single streaming pipeline (Kafka + Flink) for both real-time and historical analytics.',
    interviewNumbersToQuote: [
      'Stream processing latency: <100 milliseconds (Apache Flink tumbling/sliding event windows)',
      'Batch processing latency: 15 minutes to 24 hours (Apache Spark / Snowflake columnar jobs)',
      'Watermarking: Handles out-of-order events arriving late due to mobile network reconnects',
    ],
    talkTrack: '"We implement the Kappa Architecture using Apache Flink consuming from Kafka event streams. Flink calculates real-time 5-minute sliding window fraud detection in <100ms. For cold historical reporting, we sink raw Kafka events into S3/Parquet for querying with Athena/Snowflake."',
    tradeoffs: {
      primary: 'Kappa Architecture (Kafka + Flink Streaming)',
      alternative: 'Lambda Architecture (Dual Batch + Streaming codebases)',
      verdict: 'Kappa architecture avoids maintaining two separate codebases for batch and streaming pipelines.',
    },
    sampleCalculation: '100,000 message lag / 10,000 msgs/sec consumer rate = 10.0 seconds to drain backlog',
    relatedSheet: { name: '08 Kafka Event Bus', path: '/kafka' },
  },
  {
    id: 30,
    title: 'Geohashing & Spatial Proximity Indexing',
    category: 'Messaging & Spatial',
    icon: '📍',
    shortSummary: 'Hierarchical spatial indexing encoding latitude and longitude coordinates into short alphanumeric strings.',
    formulaName: 'Geohash Precision & Bounding Box Area',
    formula: 'Geohash_Length_6 = ~1.2 km * 0.6 km area | Neighbor_Search = 8_Surrounding_Boxes + Center',
    ruleOfThumb: 'Geohashing converts 2D (lat, lng) spatial queries into a 1D string prefix search indexed by standard B+ Trees.',
    interviewNumbersToQuote: [
      'Geohash Precision 5: ~4.9 km x 4.9 km bounding box (City district level)',
      'Geohash Precision 6: ~1.2 km x 0.61 km (Neighborhood / Uber driver search radius)',
      'Geohash Precision 7: ~152 meters x 152 meters (Street / Building level)',
    ],
    talkTrack: '"To locate nearby drivers within 2km, we convert driver GPS coordinates into a 6-character Geohash string (e.g. `dr5ru7`). We query our database for the driver’s current geohash plus the 8 adjacent bounding box neighbors using a fast B+ Tree prefix range query."',
    tradeoffs: {
      primary: 'Geohash Base32 Prefix Indexing (or Google S2)',
      alternative: 'Raw SQL PostGIS `ST_Distance(lat, lng)` scan',
      verdict: 'Geohash prefix matches execute in $O(\\log N)$ B-Tree range scans vs expensive trigonometric math on every row.',
    },
    sampleCalculation: 'Radius 1.5 km -> Query center geohash + 8 neighbors (9 string range scans in Redis Sorted Set)',
    relatedSheet: { name: '09 Database Design', path: '/db' },
  },
];

export default function ConceptsPage() {
  const { inputs, derivations } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<ConceptItem | null>(null);
  const [activeTalkTrackItem, setActiveTalkTrackItem] = useState<ConceptItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedTalkTrack, setCopiedTalkTrack] = useState(false);

  const categories = [
    'All',
    'Ingress & Networking',
    'Reliability & Theory',
    'Storage & Data',
    'Traffic & Compute',
    'Messaging & Spatial',
  ];

  const filteredConcepts = conceptsData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.shortSummary.toLowerCase().includes(q) ||
      item.formulaName.toLowerCase().includes(q) ||
      item.talkTrack.toLowerCase().includes(q) ||
      item.interviewNumbersToQuote.some((n) => n.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (item: ConceptItem) => {
    const text = `=== [Concept #${item.id}] ${item.title} (${item.category}) ===\n` +
      `Summary: ${item.shortSummary}\n\n` +
      `--- QUANTITATIVE FORMULA ---\n` +
      `Formula: ${item.formula}\n` +
      `Rule of Thumb: ${item.ruleOfThumb}\n\n` +
      `--- NUMBERS TO QUOTE IN INTERVIEWS ---\n` +
      item.interviewNumbersToQuote.map((n, i) => `• ${n}`).join('\n') + `\n\n` +
      `--- WHITEBOARD TALK-TRACK ---\n` +
      `${item.talkTrack}\n\n` +
      `--- ENGINE FIT & TRADEOFFS ---\n` +
      `Primary: ${item.tradeoffs.primary}\n` +
      `Alternative: ${item.tradeoffs.alternative}\n` +
      `Verdict: ${item.tradeoffs.verdict}\n\n` +
      `Sample Calculation: ${item.sampleCalculation}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
              Sheet 22
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              30 Core System Design Concepts & Mathematical Primer
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Quantitative formulas, numbers to quote, trade-offs, and whiteboard talk-tracks for every essential system design topic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-white/[0.08] bg-black/40 px-3.5 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-zinc-500 block font-sans">Curated Concepts</span>
            <span className="text-sm sm:text-base font-bold text-indigo-400">
              30 Applied Topics
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Mobile Dropdown (< sm) */}
        <div className="block sm:hidden w-full">
          <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Category Filter:
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0c0d14] border border-indigo-500/30 text-white text-xs rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0c0d14] text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Desktop Category Buttons (>= sm) */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-white/[0.06] bg-[#0c0d14] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search 30 concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0c0d14] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
      </div>

      {/* 30 Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-4 space-y-3 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg group relative"
            >
              <div className="space-y-2.5">
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold block">
                        Concept #{String(item.id).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Talk Icon Button (Hover popover on desktop + Click to open small modal on mobile/desktop) */}
                    <div className="relative group/talk">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTalkTrackItem(item);
                        }}
                        className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/50 hover:border-purple-400 text-purple-300 hover:text-white transition-all cursor-pointer shadow-sm flex items-center justify-center group-hover/talk:border-purple-400"
                        title="Word-For-Word Interview Response (Click or Hover)"
                        aria-label="Word-For-Word Interview Response"
                      >
                        <MessageSquareQuote size={14} className="group-hover/talk:scale-110 transition-transform" />
                      </button>

                      {/* Desktop Hover Popover (hidden on touch/mobile) */}
                      <div className="hidden sm:group-hover/talk:block absolute right-0 top-full mt-2 w-80 p-3.5 rounded-xl border border-purple-500/40 bg-[#0c0d14]/98 backdrop-blur-md shadow-2xl z-50 text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-[10px] font-mono uppercase font-bold text-purple-300 tracking-wider mb-1.5 flex items-center gap-1">
                          <Sparkles size={11} /> WORD-FOR-WORD INTERVIEW RESPONSE
                        </div>
                        <p className="text-xs text-zinc-100 italic leading-relaxed font-normal">
                          &ldquo;{item.talkTrack}&rdquo;
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-400 shrink-0">
                      {item.category.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                  {item.shortSummary}
                </p>

                {/* Quantitative Formula Box */}
                <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 space-y-1 font-mono text-[10.5px]">
                  <div className="text-indigo-300 font-semibold text-[10px] uppercase flex items-center gap-1">
                    <Calculator size={11} /> {item.formulaName}:
                  </div>
                  <div className="text-zinc-300 break-words font-medium">
                    {item.formula}
                  </div>
                  <div className="text-zinc-500 text-[9.5px]">
                    Rule: {item.ruleOfThumb}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalItem(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span>Inspect Calculations</span>
                  <ArrowRight size={12} />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTalkTrackItem(item)}
                    className="p-1.5 rounded border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                    title="Word-For-Word Interview Response"
                  >
                    <MessageSquareQuote size={13} />
                    <span className="hidden xs:inline">Response</span>
                  </button>
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy full formula & talk-track"
                  >
                    {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Concept Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="rounded-2xl border border-indigo-500/40 bg-[#0c0d14] w-[95vw] sm:w-[85vw] md:w-[60vw] max-w-[95vw] md:max-w-[60vw] max-h-[85vh] md:max-h-[80vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0f111a] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-2xl sm:text-3xl">{activeModalItem.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                      Concept #{String(activeModalItem.id).padStart(2, '0')} • {activeModalItem.category}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                    {activeModalItem.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeModalItem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {copiedId === activeModalItem.id ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Cheat Sheet</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Summary */}
              <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                {activeModalItem.shortSummary}
              </p>

              {/* Quantitative Formula Card */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-indigo-300 font-mono font-bold text-xs uppercase">
                  <span className="flex items-center gap-1.5">
                    <Calculator size={14} /> {activeModalItem.formulaName}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-black/50 border border-white/[0.06] font-mono text-xs text-white break-words">
                  <code>{activeModalItem.formula}</code>
                </div>
                <div className="text-[11px] text-indigo-200">
                  <span className="font-semibold text-indigo-400">Rule of Thumb: </span>
                  {activeModalItem.ruleOfThumb}
                </div>
                <div className="text-[11px] text-zinc-400 pt-1 border-t border-white/[0.06]">
                  <span className="text-emerald-400 font-mono font-semibold">Sample Proof: </span>
                  <span className="font-mono text-zinc-300">{activeModalItem.sampleCalculation}</span>
                </div>
              </div>

              {/* Numbers to Quote in Interview */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp size={13} /> Numbers to Quote in the Interview:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeModalItem.interviewNumbersToQuote.map((num, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 flex items-start gap-2 text-zinc-200"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-mono text-[11px]">{num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Whiteboard Talk-Track (Word-for-Word Script) */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sparkles size={13} /> Whiteboard Talk-Track (Say This Confidently):
                </h4>
                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed italic bg-black/40 p-3 rounded-lg border border-white/[0.06]">
                  {activeModalItem.talkTrack}
                </p>
              </div>

              {/* Engine Tradeoffs */}
              <div className="rounded-xl border border-white/[0.08] bg-[#090a0f] p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} /> Architectural Trade-Off Analysis:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded border border-emerald-500/20 bg-emerald-950/10 p-2.5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Primary Pick</span>
                    <p className="font-semibold text-white text-xs">{activeModalItem.tradeoffs.primary}</p>
                  </div>
                  <div className="rounded border border-rose-500/20 bg-rose-950/10 p-2.5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">Alternative</span>
                    <p className="font-semibold text-zinc-300 text-xs">{activeModalItem.tradeoffs.alternative}</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                  <span className="text-zinc-200 font-semibold">Verdict: </span>
                  {activeModalItem.tradeoffs.verdict}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Small Modal: ONLY WORD-FOR-WORD INTERVIEW RESPONSE */}
      {activeTalkTrackItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
          onClick={() => setActiveTalkTrackItem(null)}
        >
          <div
            className="rounded-2xl border border-purple-500/40 bg-[#0c0d14] w-[95vw] sm:w-[500px] max-w-[95vw] sm:max-w-[500px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-[#0f111a] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{activeTalkTrackItem.icon}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} /> WORD-FOR-WORD INTERVIEW RESPONSE
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight truncate mt-0.5">
                    Concept #{String(activeTalkTrackItem.id).padStart(2, '0')}: {activeTalkTrackItem.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeTalkTrackItem.talkTrack);
                    setCopiedTalkTrack(true);
                    setTimeout(() => setCopiedTalkTrack(false), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy full response"
                >
                  {copiedTalkTrack ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTalkTrackItem(null)}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Modal Body: ONLY WORD-FOR-WORD INTERVIEW RESPONSE */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto max-h-[75vh]">
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/25 p-4 sm:p-5">
                <p className="text-zinc-100 text-xs sm:text-sm leading-relaxed italic font-normal selection:bg-purple-500/30">
                  &ldquo;{activeTalkTrackItem.talkTrack}&rdquo;
                </p>
              </div>

              {/* Footer action */}
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const item = activeTalkTrackItem;
                    setActiveTalkTrackItem(null);
                    setActiveModalItem(item);
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Inspect Calculations & Tradeoffs</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
