'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import {
  CheckSquare,
  Square,
  X,
  HelpCircle,
  Calculator,
  Layers,
  Shield,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  ListTodo,
  Radio,
  Database,
  Cpu,
  Globe,
  Activity,
  HardDrive,
  Lock,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

interface RubricItem {
  id: string;
  category: 'Ingress & Routing' | 'Compute & Streaming' | 'Storage & Cache' | 'Resiliency & Security';
  title: string;
  icon: string;
  summary: string;
  checklist: {
    id: string;
    text: string;
    dimension: 'Scalability' | 'Security' | 'Robustness' | 'Architecture';
    hint: string;
  }[];
  probingQuestions: string[];
  sizingFormulas: {
    name: string;
    formula: string;
    ruleOfThumb: string;
  }[];
  tradeoffs: {
    primary: string;
    alternative: string;
    reasoning: string;
  };
}

const rubricData: RubricItem[] = [
  {
    id: 'client',
    category: 'Ingress & Routing',
    title: 'Client & Mobile Ingress',
    icon: '📱',
    summary: 'Native mobile apps (iOS/Android) and Web SPAs generating concurrent user traffic.',
    checklist: [
      { id: 'c1', text: 'State scale assumptions: MAU → DAU → PCU → Peak API RPS with 2x safety buffer', dimension: 'Scalability', hint: '10M MAU × 20% DAU × 20% PCU / 3600s × 2x = 6.6k Peak RPS' },
      { id: 'c2', text: 'Implement client-side Exponential Backoff with full random jitter for retries', dimension: 'Robustness', hint: 'Prevents thundering herd retries during backend recovery' },
      { id: 'c3', text: 'Store short-lived JWT access tokens in memory and refresh tokens in HttpOnly Secure cookies', dimension: 'Security', hint: 'Prevents XSS token exfiltration while supporting silent refresh' },
      { id: 'c4', text: 'Use Service Workers to cache static bundles and offline assets locally', dimension: 'Scalability', hint: 'Eliminates repeat round trips for JS/CSS and icons' },
      { id: 'c5', text: 'Enforce client-side idempotency keys (UUIDv4) on all mutating POST/PUT requests', dimension: 'Robustness', hint: 'Enables safe retries without double charging or duplicate orders' },
      { id: 'c6', text: 'Leverage HTTP/3 (QUIC) to prevent head-of-line blocking on cellular networks', dimension: 'Architecture', hint: 'UDP-based multiplexing with 0-RTT connection resumption' },
    ],
    probingQuestions: [
      'What is the ratio between Mobile vs Web clients, and what are the geographic target regions?',
      'Can dynamic checkout flows be throttled client-side with queuing screens during extreme surges?',
    ],
    sizingFormulas: [
      { name: 'Peak API RPS', formula: '(PCU × Actions_per_Session / Peak_Window_Sec) × Safety_Buffer', ruleOfThumb: 'Always size for 2x to 3x headroom above expected peak' },
      { name: 'Concurrent WebSockets', formula: 'PCU × 5% active live connections', ruleOfThumb: '~64 KB socket buffer RAM per active connection' },
    ],
    tradeoffs: {
      primary: 'Native Swift/Kotlin + React Native',
      alternative: 'Pure PWA / WebViews',
      reasoning: 'Native apps offer native HTTP/3, background synchronization, and offline SQLite caching without JS bridge overhead.',
    },
  },
  {
    id: 'cdn',
    category: 'Ingress & Routing',
    title: 'CDN & DNS Anycast Edge',
    icon: '⚡',
    summary: 'Global Anycast DNS and edge Points of Presence absorbing static assets and GET cacheable APIs.',
    checklist: [
      { id: 'cdn1', text: 'Place CloudFront/Cloudflare Edge PoPs globally to absorb 85%+ read traffic', dimension: 'Scalability', hint: 'Reduces origin server traffic from 6.6k RPS to <1k RPS' },
      { id: 'cdn2', text: 'Configure Route53 Latency-Based Anycast routing across multi-region edge nodes', dimension: 'Architecture', hint: 'Routes DNS lookups to the closest geographic edge in <10ms' },
      { id: 'cdn3', text: 'Enable Brotli / Zstandard compression for JSON and asset payloads', dimension: 'Scalability', hint: 'Saves 30-40% network egress transit bandwidth' },
      { id: 'cdn4', text: 'Deploy Edge WAF with rate limiting rules against Layer 7 volumetric attacks', dimension: 'Security', hint: 'Blocks malicious bot traffic before it reaches origin VPC' },
      { id: 'cdn5', text: 'Configure stale-while-revalidate caching headers on product catalog endpoints', dimension: 'Robustness', hint: 'Serves instantaneous cached responses while refreshing origin in background' },
      { id: 'cdn6', text: 'Implement surrogate cache keys / tag-based instant edge invalidation', dimension: 'Architecture', hint: 'Purges updated catalog items across all global edge PoPs in <150ms' },
    ],
    probingQuestions: [
      'How do we invalidate edge caches when prices or inventory counts update in real-time?',
      'What percentage of GET queries contain user-specific personalization that bypasses CDN?',
    ],
    sizingFormulas: [
      { name: 'Edge Filtered RPS', formula: 'Peak_RPS × (CDN_Cache_Hit% / 100)', ruleOfThumb: 'Target 80-95% cache hit on static catalog data' },
      { name: 'Required Edge PoPs', formula: 'ceil(Peak_RPS / 10,000 RPS per PoP)', ruleOfThumb: 'Modern CDNs provide 300+ edge locations globally' },
    ],
    tradeoffs: {
      primary: 'Cloudflare Enterprise / AWS CloudFront + Fastly VCL',
      alternative: 'Self-hosted Nginx Edge PoPs',
      reasoning: 'Managed CDNs eliminate multi-terabit Anycast DDoS mitigation complexity and provide automated TLS 1.3 termination.',
    },
  },
  {
    id: 'gateway',
    category: 'Ingress & Routing',
    title: 'API Gateway & Edge Security',
    icon: '🚪',
    summary: 'Centralized entry point managing JWT auth, rate limiting token buckets, SSL termination, and gRPC routing.',
    checklist: [
      { id: 'gw1', text: 'Deploy Gateway pods across 3 Availability Zones with N+1 redundancy', dimension: 'Scalability', hint: 'Ensures zero downtime if an entire cloud availability zone fails' },
      { id: 'gw2', text: 'Enforce Redis-backed Sliding Window rate limiting (Anonymous vs Authenticated vs Premium)', dimension: 'Security', hint: 'Prevents brute force, API abuse, and noisy neighbors' },
      { id: 'gw3', text: 'Offload JWT cryptographic signature verification at the Gateway layer', dimension: 'Architecture', hint: 'Internal microservices receive validated user headers, avoiding redundant RSA checks' },
      { id: 'gw4', text: 'Terminate TLS 1.3 at Gateway and use mutual TLS (mTLS) for internal service mesh', dimension: 'Security', hint: 'Provides Zero-Trust encryption between internal microservices' },
      { id: 'gw5', text: 'Implement gRPC-JSON transcoding to bridge external REST and internal gRPC', dimension: 'Architecture', hint: 'External mobile apps use REST/JSON while internal pods communicate over binary Protobuf' },
      { id: 'gw6', text: 'Configure circuit breakers with 50% error threshold and 30s half-open recovery', dimension: 'Robustness', hint: 'Fails fast to protect struggling downstream microservices' },
    ],
    probingQuestions: [
      'How do we prevent Gateway nodes from becoming a single point of failure or CPU bottleneck?',
      'Are rate limits stored locally in memory per pod or centrally in a distributed Redis cluster?',
    ],
    sizingFormulas: [
      { name: 'Gateway Pods (3 AZ)', formula: '(ceil(Origin_RPS / Pod_Capacity_RPS) + 1) × 3', ruleOfThumb: 'Target 60% CPU utilization baseline for burst headroom' },
      { name: 'Rate Limiter Redis Ops', formula: 'Peak_RPS × 2 lookups/sec', ruleOfThumb: 'Token bucket check + counter increment per request' },
    ],
    tradeoffs: {
      primary: 'Envoy Gateway / Kong (OpenResty C++)',
      alternative: 'Spring Cloud Gateway / Zuul (JVM)',
      reasoning: 'Envoy provides sub-millisecond latency, zero GC pauses, non-blocking asynchronous event loops, and native Protobuf support.',
    },
  },
  {
    id: 'lb',
    category: 'Ingress & Routing',
    title: 'Load Balancer & Network Tier',
    icon: '🌐',
    summary: 'Layer 4 (NLB) & Layer 7 (ALB) distributing ingress traffic across pods with health checks.',
    checklist: [
      { id: 'lb1', text: 'Use Layer 4 Network Load Balancer (NLB) for TCP pass-through to Envoy Gateway', dimension: 'Scalability', hint: 'Handles millions of RPS with static Anycast IPs and ultra-low latency' },
      { id: 'lb2', text: 'Configure Layer 7 ALB with Least Outstanding Requests algorithm', dimension: 'Architecture', hint: 'Prevents requests from accumulating on slow or garbage-collecting backend pods' },
      { id: 'lb3', text: 'Set HTTP keep-alive timeouts to 65s (higher than client timeout of 60s)', dimension: 'Robustness', hint: 'Prevents premature connection resets (502 Bad Gateway) during idle pool reuse' },
      { id: 'lb4', text: 'Enable connection draining (deregistration delay = 30s) during rolling deployments', dimension: 'Robustness', hint: 'Allows inflight requests to finish before pod termination' },
      { id: 'lb5', text: 'Configure deep health check endpoints (/healthz/ready vs /healthz/live)', dimension: 'Robustness', hint: 'Liveness restarts hung containers; readiness unregisters pods from traffic during warmup' },
    ],
    probingQuestions: [
      'What health check interval and timeout prevent cascading pod removals during traffic spikes?',
      'Do we need sticky sessions, or are all microservices completely stateless?',
    ],
    sizingFormulas: [
      { name: 'Concurrent TCP Sockets', formula: 'Peak_RPS × 2 concurrent open sockets', ruleOfThumb: 'Each open socket consumes ~4KB kernel memory' },
      { name: 'Peak Bandwidth (Gbps)', formula: '(Peak_RPS × Avg_Payload_KB × 8) / 1,000,000', ruleOfThumb: 'Ensure NIC line rate does not saturate 10Gbps/25Gbps cloud limits' },
    ],
    tradeoffs: {
      primary: 'AWS NLB + ALB / HAProxy',
      alternative: 'Software LVS / Keepalived',
      reasoning: 'Managed cloud load balancers scale dynamically to millions of concurrent flows with multi-AZ automatic failover.',
    },
  },
  {
    id: 'backend',
    category: 'Compute & Streaming',
    title: 'Backend Microservices & K8s',
    icon: '⚙️',
    summary: 'Stateless Kubernetes microservice pods communicating internally over low-latency binary gRPC.',
    checklist: [
      { id: 'be1', text: 'Design microservices to be strictly stateless with session context in JWT/Redis', dimension: 'Scalability', hint: 'Allows Kubernetes HPA to scale pods from 5 to 50 in seconds' },
      { id: 'be2', text: 'Use binary gRPC with HTTP/2 multiplexing for inter-service communication', dimension: 'Architecture', hint: '5x faster serialization and 60% lower payload size than JSON over HTTP/1.1' },
      { id: 'be3', text: 'Implement Saga Pattern (Choreography/Orchestration) for distributed transactions', dimension: 'Robustness', hint: 'Replaces blocking 2-Phase Commit (2PC) with compensating transactions' },
      { id: 'be4', text: 'Configure Kubernetes Horizontal Pod Autoscaler (HPA) targeting 65% CPU utilization', dimension: 'Scalability', hint: 'Leaves 35% burst headroom while new pods initialize and pass readiness checks' },
      { id: 'be5', text: 'Apply Bulkhead isolation to isolate thread pools and connection pools per service', dimension: 'Robustness', hint: 'A slow third-party payment gateway will not exhaust thread pools for product browsing' },
      { id: 'be6', text: 'Use Structured Logging with trace_id and span_id injected in all log outputs', dimension: 'Architecture', hint: 'Enables instant correlation across distributed service logs in OpenSearch' },
    ],
    probingQuestions: [
      'How do we handle distributed transactions across Order and Payment without two-phase locking?',
      'What are our pod startup times, and do we use pre-warmed pod pools for flash sales?',
    ],
    sizingFormulas: [
      { name: 'Microservice Pod Count', formula: 'ceil(Service_RPS / Pod_Capacity_RPS)', ruleOfThumb: 'Standard Go/Java pod serves 1,500 - 2,500 RPS per 4 vCPU' },
      { name: 'Total App RAM', formula: 'Total_Pods × RAM_per_Pod_GB (e.g. 8GB)', ruleOfThumb: 'Reserve 25% RAM for OS buffers and garbage collection spikes' },
    ],
    tradeoffs: {
      primary: 'Go (gRPC) / Java 21 (Quarkus/Spring Boot 3)',
      alternative: 'Node.js / Python FastAPI',
      reasoning: 'Go and compiled JVM provide deterministic CPU scheduling, low thread contention under 10k+ concurrency, and sub-100MB container memory baselines.',
    },
  },
  {
    id: 'kafka',
    category: 'Compute & Streaming',
    title: 'Kafka Event Bus & Pub/Sub',
    icon: '📨',
    summary: 'Distributed event log decoupling synchronous order placement from asynchronous fulfillment.',
    checklist: [
      { id: 'kf1', text: 'Choose partition keys carefully (e.g. hash(userId) or hash(orderId)) to prevent hot partitions', dimension: 'Scalability', hint: 'Ensures strict FIFO message ordering per user while balancing throughput evenly' },
      { id: 'kf2', text: 'Set replication factor to 3 with min.insync.replicas=2 for high durability', dimension: 'Robustness', hint: 'Guarantees zero message loss even if one Kafka broker node crashes' },
      { id: 'kf3', text: 'Enable idempotent producer (enable.idempotence=true) and acks=all', dimension: 'Robustness', hint: 'Eliminates duplicate writes and ensures messages are committed across quorum' },
      { id: 'kf4', text: 'Size partitions based on max(producer_throughput, consumer_throughput)', dimension: 'Scalability', hint: 'Partitions = ceil(Total_MBps / 10 MBps per partition)' },
      { id: 'kf5', text: 'Monitor Consumer Group Lag in Prometheus and trigger alerts on lag spikes', dimension: 'Robustness', hint: 'Prevents backpressure and processing delays during flash sales' },
      { id: 'kf6', text: 'Enable zstd / snappy compression on producer batches to save 60% disk storage', dimension: 'Scalability', hint: 'Reduces broker I/O and network serialization transit overhead' },
    ],
    probingQuestions: [
      'What partition key ensures strict ordering without causing hot broker partitions?',
      'How do we guarantee exactly-once processing across Kafka producers and database consumers?',
    ],
    sizingFormulas: [
      { name: 'Kafka Partitions Required', formula: 'ceil(Ingress_MBps / Producer_Part_Cap_MBps)', ruleOfThumb: 'Rule of thumb: 10 MB/s per partition producer limit' },
      { name: 'Kafka Broker Count', formula: 'max(3, ceil(Partitions / Broker_Multiple) × Replication_Factor)', ruleOfThumb: 'Minimum 3 brokers for HA quorum (KRaft)' },
    ],
    tradeoffs: {
      primary: 'Apache Kafka (KRaft mode) / Redpanda',
      alternative: 'RabbitMQ / AWS SQS',
      reasoning: 'Kafka provides immutable append-only commit logs, consumer group offset replays for debugging, and linear scale with millions of msgs/sec.',
    },
  },
  {
    id: 'stream',
    category: 'Compute & Streaming',
    title: 'Stream Processing & CDC (Debezium)',
    icon: '🌊',
    summary: 'Real-time event stream transformations, change data capture, and analytical indexing.',
    checklist: [
      { id: 'st1', text: 'Use Transactional Outbox Pattern + Debezium CDC to tail PostgreSQL WAL log', dimension: 'Architecture', hint: 'Prevents dual-write inconsistencies between database and Kafka' },
      { id: 'st2', text: 'Deploy Apache Flink / Kafka Streams for stateful real-time sliding window aggregations', dimension: 'Scalability', hint: 'Calculates live metrics (e.g. orders/minute, fraud anomaly detection) with sub-second latency' },
      { id: 'st3', text: 'Configure RocksDB state store on NVMe SSDs with periodic incremental checkpoints', dimension: 'Robustness', hint: 'Enables rapid state recovery without replaying entire Kafka topic from offset 0' },
      { id: 'st4', text: 'Implement dead-letter side outputs for unparseable or corrupted stream payloads', dimension: 'Robustness', hint: 'Prevents stream pipeline halts when encountering malformed JSON schemas' },
    ],
    probingQuestions: [
      'Why not write directly to both PostgreSQL and Kafka in the same API request handler?',
      'How does Flink handle out-of-order events using Watermarks and allowed lateness?',
    ],
    sizingFormulas: [
      { name: 'CDC Event Throughput', formula: 'DB_Write_QPS × 1.2 event amplification', ruleOfThumb: 'Account for INSERT + UPDATE state change records' },
    ],
    tradeoffs: {
      primary: 'Debezium CDC + Apache Flink',
      alternative: 'Batch cron jobs / Polling DB queries',
      reasoning: 'CDC tails database WAL with zero query overhead, avoiding slow polling queries on primary DB tables.',
    },
  },
  {
    id: 'db',
    category: 'Storage & Cache',
    title: 'Relational Database (PostgreSQL / Aurora)',
    icon: '🗄️',
    summary: 'ACID relational database with single primary for serializable writes and read replicas for hot reads.',
    checklist: [
      { id: 'db1', text: 'Deploy 1 Primary for ACID writes + N Read Replicas across multi-AZ for SELECT queries', dimension: 'Scalability', hint: 'Separates write transactions from read traffic to scale read QPS' },
      { id: 'db2', text: 'Use PgBouncer connection pooling in transaction mode to prevent max_connections exhaustion', dimension: 'Scalability', hint: 'Enables 10,000 backend threads to share 200 physical database connections' },
      { id: 'db3', text: 'Create composite B-Tree indexes matching WHERE and ORDER BY query patterns', dimension: 'Scalability', hint: 'Ensures Index Only Scans with sub-5ms query response times' },
      { id: 'db4', text: 'Implement Range Partitioning by month on large append-heavy transaction tables', dimension: 'Scalability', hint: 'Allows instant dropping of old partitions and prevents table bloat' },
      { id: 'db5', text: 'Tune autovacuum settings (vacuum_cost_limit, scale_factor=0.05) to avoid table bloat', dimension: 'Robustness', hint: 'Cleans dead MVCC tuples aggressively without locking active tables' },
      { id: 'db6', text: 'Enforce optimistic concurrency control using version columns for inventory counters', dimension: 'Robustness', hint: 'Prevents lost updates without taking heavy pessimistic row locks' },
    ],
    probingQuestions: [
      'When write QPS exceeds single primary limits (~10k QPS), how do we shard by customer ID?',
      'How do we handle replication lag between primary and read replicas during read-after-write operations?',
    ],
    sizingFormulas: [
      { name: 'Required Read Replicas', formula: 'ceil(Read_QPS / 5,000 QPS per replica)', ruleOfThumb: 'Scale replicas when read QPS exceeds single node capacity' },
      { name: 'Database Storage Growth', formula: 'Daily_Rows × Row_Size_KB × 30 days × 1.5 (index factor) × 2 (WAL/archive)', ruleOfThumb: 'Size SSD disk with 2x IOPS headroom' },
    ],
    tradeoffs: {
      primary: 'Amazon Aurora PostgreSQL / Cloud SQL PG 16',
      alternative: 'MySQL 8 / Vitess',
      reasoning: 'PostgreSQL provides native JSONB indexing, CTEs, rich GiST/GIN indexes, transactional DDL, and mature Debezium CDC.',
    },
  },
  {
    id: 'nosql',
    category: 'Storage & Cache',
    title: 'NoSQL & Distributed Storage',
    icon: '📦',
    summary: 'Distributed wide-column and document stores for high-throughput write-heavy workloads.',
    checklist: [
      { id: 'ns1', text: 'Design partition keys with high cardinality (e.g. hash(device_id)) to distribute data evenly', dimension: 'Scalability', hint: 'Prevents single-node hot spots in Cassandra/DynamoDB cluster' },
      { id: 'ns2', text: 'Configure Tunable Consistency (e.g. Local Quorum = (RF/2)+1) for CAP theorem balance', dimension: 'Architecture', hint: 'Guarantees strong consistency without requiring global cross-region consensus' },
      { id: 'ns3', text: 'Use LSM Tree write path (MemTable + CommitLog + SSTable) for ultra-fast append writes', dimension: 'Scalability', hint: 'Allows 100k+ writes/second with zero random disk I/O head movement' },
      { id: 'ns4', text: 'Set TTL at write time for transient records (session tokens, telemetry points)', dimension: 'Scalability', hint: 'Automatically expires old data without requiring manual background deletion jobs' },
    ],
    probingQuestions: [
      'Why choose Cassandra/DynamoDB over PostgreSQL for time-series telemetry or user activity feeds?',
      'How do we handle schema migrations in NoSQL without query downtime?',
    ],
    sizingFormulas: [
      { name: 'NoSQL Write Throughput', formula: 'Writes_per_sec × Replication_Factor × Storage_Size_KB', ruleOfThumb: 'LSM tree engines sustain 5x higher write throughput than B-Trees' },
    ],
    tradeoffs: {
      primary: 'Apache Cassandra / ScyllaDB / DynamoDB',
      alternative: 'MongoDB / Relational DB',
      reasoning: 'Masterless peer-to-peer ring architecture provides linear horizontal write scaling with zero single point of failure.',
    },
  },
  {
    id: 'cache',
    category: 'Storage & Cache',
    title: 'In-Memory Cache (Redis Cluster)',
    icon: '⚡',
    summary: 'Sub-millisecond distributed cache for session state, catalog SKU lookups, and inventory counters.',
    checklist: [
      { id: 'rc1', text: 'Adopt Cache-Aside pattern with explicit TTL on all cached keys', dimension: 'Scalability', hint: 'Application reads from cache, loads from DB on miss, and writes back with TTL' },
      { id: 'rc2', text: 'Set allkeys-lru (Least Recently Used) eviction policy on Redis cluster', dimension: 'Scalability', hint: 'Automatically evicts stale items when memory limits are reached' },
      { id: 'rc3', text: 'Prevent Cache Stampede (Thundering Herd) using distributed mutex locks or probabilistic early expiry', dimension: 'Robustness', hint: 'Only 1 worker queries DB when a hot key expires; others wait or serve stale data' },
      { id: 'rc4', text: 'Prevent Cache Penetration by caching null values with short 60s TTL or Bloom filters', dimension: 'Security', hint: 'Prevents non-existent IDs from constantly hammering the primary database' },
      { id: 'rc5', text: 'Add random jitter (e.g. TTL = base_ttl + rand(0, 300s)) to avoid simultaneous key expirations', dimension: 'Robustness', hint: 'Prevents mass cache expiry waves during flash sale events' },
      { id: 'rc6', text: 'Deploy Redis Cluster across 3 Master + 3 Replica shards with automatic failover', dimension: 'Architecture', hint: 'Distributes 16,384 hash slots across nodes with sub-millisecond lookups' },
    ],
    probingQuestions: [
      'How do you prevent a cache stampede when a viral product cache key expires during a flash sale?',
      'What is the difference between Cache-Aside, Read-Through, and Write-Through caching?',
    ],
    sizingFormulas: [
      { name: 'Required Cache RAM (GB)', formula: '(Active_Items × Item_Size_KB × 1.3 overhead) / 1,000,000', ruleOfThumb: 'Size RAM for the 20% hot data that generates 80% of traffic' },
      { name: 'Redis Shard Count', formula: 'ceil(Required_RAM / 16GB per shard)', ruleOfThumb: 'Keep individual Redis instances under 25GB for fast RDB snapshots' },
    ],
    tradeoffs: {
      primary: 'Redis Cluster / KeyDB / Dragonfly',
      alternative: 'Memcached',
      reasoning: 'Redis provides rich data structures (Hashes, Sorted Sets for leaderboards, HyperLogLog, Lua atomic scripts, and disk persistence).',
    },
  },
  {
    id: 'queue',
    category: 'Compute & Streaming',
    title: 'Message Queues (RabbitMQ / SQS)',
    icon: '📬',
    summary: 'Point-to-point task queues for background job distribution, emails, and async worker pools.',
    checklist: [
      { id: 'mq1', text: 'Use SQS / RabbitMQ for point-to-point task distribution where messages are consumed once and deleted', dimension: 'Architecture', hint: 'Best fit for email sending, PDF rendering, and background image resizing' },
      { id: 'mq2', text: 'Configure worker prefetch limits (e.g. prefetch=10) to prevent worker buffer starvation', dimension: 'Scalability', hint: 'Distributes tasks fairly across worker pods according to processing speed' },
      { id: 'mq3', text: 'Set message visibility timeout to 3x expected job processing duration', dimension: 'Robustness', hint: 'Prevents another worker from duplicate-processing a long-running batch job' },
      { id: 'mq4', text: 'Enable SQS Dead-Letter Queue redrive policy with maxReceiveCount=5', dimension: 'Robustness', hint: 'Automatically moves poison pill tasks to DLQ after 5 consecutive failed processing attempts' },
    ],
    probingQuestions: [
      'When should we choose RabbitMQ/SQS over Kafka?',
      'How do we scale worker consumer pods dynamically based on queue depth / backlog age?',
    ],
    sizingFormulas: [
      { name: 'Worker Pod Sizing', formula: 'Queue_Ingress_Rate / Processing_Rate_per_Worker', ruleOfThumb: 'Autoscale workers based on SQS ApproximateNumberOfMessagesVisible' },
    ],
    tradeoffs: {
      primary: 'AWS SQS / RabbitMQ',
      alternative: 'Apache Kafka',
      reasoning: 'SQS/RabbitMQ deletes messages after ACK and provides per-message acknowledgement, making it simpler for ad-hoc background tasks.',
    },
  },
  {
    id: 'dlq',
    category: 'Resiliency & Security',
    title: 'Dead Letter Queue (DLQ) & Retries',
    icon: '⚠️',
    summary: '4-tier exponential backoff retry topics and persistent DLQ with alert webhooks for failed transactions.',
    checklist: [
      { id: 'dlq1', text: 'Implement 4-Tier exponential backoff retry topics: order.retry.5s → 10s → 20s → 40s → DLQ', dimension: 'Robustness', hint: 'Gives downstream dependencies time to recover without blocking main partition consumers' },
      { id: 'dlq2', text: 'Store dead-letter messages in PostgreSQL DLQ audit table with error stack trace and payload', dimension: 'Architecture', hint: 'Preserves full transaction context for developer inspection and auditing' },
      { id: 'dlq3', text: 'Provide manual replay admin tool with payload editing for fixing bad schema inputs', dimension: 'Robustness', hint: 'Allows operators to safely re-inject fixed messages into ingestion topic' },
      { id: 'dlq4', text: 'Trigger PagerDuty alerts when DLQ ingestion rate exceeds 0.1% threshold', dimension: 'Robustness', hint: 'Alerts on-call engineers immediately before unrecoverable backlogs accumulate' },
      { id: 'dlq5', text: 'Ensure consumer idempotency keys prevent double execution during DLQ message replay', dimension: 'Robustness', hint: 'Checks database transaction logs before executing replayed payment or order events' },
    ],
    probingQuestions: [
      'How do you safely replay 50,000 accumulated DLQ messages without causing a downstream outage?',
      'What is the difference between transient network errors and permanent poison pill schema bugs?',
    ],
    sizingFormulas: [
      { name: 'DLQ Failure Rate %', formula: '(1 - (0.99)^Max_Retries) × 100', ruleOfThumb: 'Target <0.01% unrecoverable failure rate' },
      { name: 'Full DLQ Drain Time', formula: 'Accumulated_Msgs / (Batch_Size × Worker_Throughput)', ruleOfThumb: 'Drain DLQ in controlled micro-batches of 500-1000 items' },
    ],
    tradeoffs: {
      primary: 'Kafka Delayed Retry Topics + SQS DLQ',
      alternative: 'Synchronous in-memory retry loop',
      reasoning: 'Synchronous retries block threads and cause cascading service failures; async retry topics decouple failure backoffs.',
    },
  },
  {
    id: 'downstream',
    category: 'Resiliency & Security',
    title: 'Downstream Systems & 3rd Parties',
    icon: '🔄',
    summary: 'External payment gateways, fraud APIs, logistics webhooks, and timeout budgets.',
    checklist: [
      { id: 'ds1', text: 'Enforce strict timeout budgets (e.g. 2,000ms max) on all third-party HTTP calls', dimension: 'Robustness', hint: 'Prevents slow external APIs from hanging upstream user checkout threads' },
      { id: 'ds2', text: 'Implement Circuit Breakers (Resilience4j / Go breaker) to fail fast when 3rd party degrades', dimension: 'Robustness', hint: 'Opens circuit after 5 consecutive failures and serves cached or fallback responses' },
      { id: 'ds3', text: 'Verify cryptographic HMAC signatures on all incoming third-party webhooks', dimension: 'Security', hint: 'Guarantees payment status webhooks originate authentically from Stripe/Adyen' },
      { id: 'ds4', text: 'Store raw webhook payloads in an immutable audit log before parsing', dimension: 'Architecture', hint: 'Allows complete historical replay in case of application parsing bugs' },
    ],
    probingQuestions: [
      'If the payment gateway goes down during a flash sale, how do we handle customer orders?',
      'How do we prevent replay attacks on incoming webhook callbacks?',
    ],
    sizingFormulas: [
      { name: 'Timeout Budget Allocation', formula: 'Service_SLA - Gateway_Overhead - Network_RTT - 50ms buffer', ruleOfThumb: 'External calls should never consume >50% of total p99 SLA budget' },
    ],
    tradeoffs: {
      primary: 'Async Webhook Callback Architecture',
      alternative: 'Synchronous HTTP long-polling',
      reasoning: 'Webhooks decouple client transaction confirmation from third-party settlement latency.',
    },
  },
  {
    id: 'observability',
    category: 'Resiliency & Security',
    title: 'Observability, Logs & Tracing',
    icon: '📊',
    summary: 'Prometheus metrics, OpenTelemetry distributed tracing, OpenSearch structured logging, and SLOs.',
    checklist: [
      { id: 'obs1', text: 'Track RED Metrics (Rate, Errors, Duration) for every microservice and gateway route', dimension: 'Architecture', hint: 'Standard golden signals for service health and capacity monitoring' },
      { id: 'obs2', text: 'Implement OpenTelemetry distributed context propagation with W3C TraceContext headers', dimension: 'Architecture', hint: 'Traces a single user request across CDN, Gateway, Microservices, Kafka, and DB' },
      { id: 'obs3', text: 'Sample distributed traces at 1-5% for normal traffic, 100% for 5xx errors', dimension: 'Scalability', hint: 'Captures all incident anomalies without generating petabytes of tracing storage' },
      { id: 'obs4', text: 'Ship JSON structured logs with standardized severity, service_name, and user_id', dimension: 'Architecture', hint: 'Allows instantaneous filtering in OpenSearch / Grafana Loki' },
      { id: 'obs5', text: 'Define strict SLA/SLO alert thresholds (p95 latency < 200ms, error rate < 0.05%)', dimension: 'Robustness', hint: 'Pages engineers based on user-impacting symptoms rather than noisy CPU alerts' },
    ],
    probingQuestions: [
      'How do you trace a slow 2-second request across 6 microservices and a database?',
      'How do you manage observability storage costs at 100k requests per second scale?',
    ],
    sizingFormulas: [
      { name: 'Metrics Data Points / Day', formula: 'Peak_RPS × 100 metrics/req × 86,400', ruleOfThumb: 'Prometheus compresses time-series to ~1.5 bytes per sample' },
      { name: 'Daily Logs Volume (GB)', formula: '(Daily_Requests × 1.5 KB log size) / 1,000,000', ruleOfThumb: 'Compress and archive logs to S3 after 14 days hot retention' },
    ],
    tradeoffs: {
      primary: 'OpenTelemetry + Prometheus + Grafana Loki/Tempo',
      alternative: 'Proprietary Datadog / New Relic',
      reasoning: 'Vendor-neutral open standards allow switching cloud backends without re-instrumenting codebase annotations.',
    },
  },
  {
    id: 'security',
    category: 'Resiliency & Security',
    title: 'Security, Zero Trust & Compliance',
    icon: '🔒',
    summary: 'mTLS service mesh, KMS envelope encryption, IAM least privilege, PII data sanitization.',
    checklist: [
      { id: 'sec1', text: 'Enforce Mutual TLS (mTLS) with automated certificate rotation across service mesh', dimension: 'Security', hint: 'Encrypts all pod-to-pod network traffic and verifies service identities' },
      { id: 'sec2', text: 'Use KMS Envelope Encryption with customer-managed keys for database disks and S3', dimension: 'Security', hint: 'Encrypts data with local DEK (Data Encryption Key) wrapped by master KEK' },
      { id: 'sec3', text: 'Mask PII data (credit cards, passwords, SSN) before writing to application logs', dimension: 'Security', hint: 'Prevents sensitive data leaks in log aggregators and developer dashboards' },
      { id: 'sec4', text: 'Apply IAM Least Privilege with short-lived STS AssumeRole tokens for pod service accounts', dimension: 'Security', hint: 'Pods only receive permissions to specific S3 buckets or database credentials' },
      { id: 'sec5', text: 'Sanitize all input parameters against SQL Injection, XSS, and SSRF attacks', dimension: 'Security', hint: 'Use parameterized prepared statements and strict URL allowlists' },
    ],
    probingQuestions: [
      'How do we securely store database passwords and API keys (HashiCorp Vault vs AWS Secrets Manager)?',
      'What controls prevent internal engineers from viewing plaintext credit card numbers?',
    ],
    sizingFormulas: [
      { name: 'Secrets Manager API Cost', formula: '$0.40 per secret/month + $0.05 per 10k API calls', ruleOfThumb: 'Cache secrets locally with 5-minute TTL to avoid high API charges' },
    ],
    tradeoffs: {
      primary: 'HashiCorp Vault / AWS KMS + Secrets Manager',
      alternative: 'Environment variables / Hardcoded configs',
      reasoning: 'Automated secret rotation, detailed audit logging, and envelope encryption prevent credential leakage.',
    },
  },
  {
    id: 'scalability',
    category: 'Resiliency & Security',
    title: 'Scalability & Disaster Recovery',
    icon: '📈',
    summary: 'Multi-AZ active-active failover, RTO/RPO targets, database sharding, and cost optimization.',
    checklist: [
      { id: 'sc1', text: 'Deploy Multi-AZ Active-Active architecture across at least 3 Availability Zones', dimension: 'Scalability', hint: 'Survives a complete data center power or network outage with zero downtime' },
      { id: 'sc2', text: 'Define clear RTO (Recovery Time Objective < 15 min) and RPO (Recovery Point Objective < 1 min)', dimension: 'Robustness', hint: 'Establishes maximum permissible downtime and data loss during catastrophic disasters' },
      { id: 'sc3', text: 'Prepare database horizontal sharding strategy (e.g. Citus/Vitess by customer_id) for 100k+ QPS', dimension: 'Scalability', hint: 'Partitions relational write traffic across multiple independent primary nodes' },
      { id: 'sc4', text: 'Run automated Chaos Engineering experiments (Chaos Mesh / Litmus) in staging', dimension: 'Robustness', hint: 'Validates that killing random pods or dropping network packets does not crash checkout' },
      { id: 'sc5', text: 'Use AWS Savings Plans / Spot Instances for non-critical async worker fleets to save 60% cost', dimension: 'Scalability', hint: 'Optimizes infrastructure budget while keeping on-demand for core API services' },
    ],
    probingQuestions: [
      'If an entire AWS region goes dark, what is the automated disaster recovery failover workflow?',
      'How do you benchmark maximum system breaking points before Black Friday / Cyber Monday sales?',
    ],
    sizingFormulas: [
      { name: 'Cluster Headroom %', formula: '(Total_Provisioned_RPS / Peak_RPS - 1) × 100', ruleOfThumb: 'Maintain 50% to 100% capacity headroom for flash sales' },
    ],
    tradeoffs: {
      primary: 'Multi-AZ Active-Active with Async Multi-Region DR',
      alternative: 'Multi-Region Active-Active with 2PC',
      reasoning: 'Multi-AZ provides 99.99% availability with <1ms replication latency without cross-region WAN latency penalties.',
    },
  },
];

export default function RubricPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<RubricItem | null>(null);
  const [activeTab, setActiveTab] = useState<'checklist' | 'probing' | 'formulas' | 'tradeoffs'>('checklist');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved checked items from local browser storage
  useEffect(() => {
    const saved = localStorage.getItem('system_design_rubric_checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleCheck = (itemId: string) => {
    const next = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(next);
    localStorage.setItem('system_design_rubric_checklist', JSON.stringify(next));
  };

  const resetAll = () => {
    if (confirm('Reset all checklist progress across all layers?')) {
      setCheckedItems({});
      localStorage.removeItem('system_design_rubric_checklist');
    }
  };

  const [copiedModal, setCopiedModal] = useState(false);

  const handleCopyRubricModal = async () => {
    if (!activeModalItem) return;
    const lines = [
      `=== ${activeModalItem.icon} ${activeModalItem.title} (${activeModalItem.category}) ===`,
      activeModalItem.summary,
      '',
      '--- ARCHITECTURE CHECKLIST ---',
      ...activeModalItem.checklist.map(
        (c, idx) =>
          `[${checkedItems[c.id] ? 'X' : ' '}] ${idx + 1}. [${c.dimension}] ${c.text}\n    Hint: ${c.hint}`
      ),
      '',
      '--- INTERVIEW PROBING QUESTIONS ---',
      ...activeModalItem.probingQuestions.map((q, idx) => `${idx + 1}. ${q}`),
      '',
      '--- SIZING & CAPACITY FORMULAS ---',
      ...activeModalItem.sizingFormulas.map(
        (f) => `${f.name}: ${f.formula}\n    Rule of Thumb: ${f.ruleOfThumb}`
      ),
      '',
      '--- ENGINE & LIBRARY TRADEOFFS ---',
      `Primary: ${activeModalItem.tradeoffs.primary}`,
      `Alternative: ${activeModalItem.tradeoffs.alternative}`,
      `Reasoning: ${activeModalItem.tradeoffs.reasoning}`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedModal(true);
      setTimeout(() => setCopiedModal(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const totalChecklistItems = rubricData.reduce((acc, item) => acc + item.checklist.length, 0);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const overallPercentage = Math.round((totalChecked / totalChecklistItems) * 100);

  const categories = ['All', 'Ingress & Routing', 'Compute & Streaming', 'Storage & Cache', 'Resiliency & Security'];

  const filteredData =
    selectedCategory === 'All'
      ? rubricData
      : rubricData.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans">
      {/* Header Banner */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 20
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              System Design Interview Rubric & Swim Lane Checklist
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete architectural checklist, probing questions, formulas, and library tradeoffs across all 16 layers.
          </p>
        </div>

        {/* Global Progress & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="flex-1 sm:flex-none rounded-lg border border-white/[0.08] bg-[#0e1017] px-3.5 py-2 text-center flex items-center justify-between sm:justify-start gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Mastery Score</span>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {totalChecked} / {totalChecklistItems} ({overallPercentage}%)
              </div>
            </div>
            <div className="w-16 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset all checklist marks"
          >
            <RotateCcw size={13} className="shrink-0" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Filter - Mobile Dropdown (< sm) */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
          Filter Layer Category:
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

      {/* Category Filter Tabs - Desktop (>= sm) */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer',
              selectedCategory === cat
                ? 'border-indigo-500/50 bg-indigo-950/40 text-white shadow-sm ring-1 ring-indigo-500/30'
                : 'border-white/[0.06] bg-[#0c0d14] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Swim Lane Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 pt-2 pl-2">
        {filteredData.map((layer) => {
          const checkedCount = layer.checklist.filter((c) => checkedItems[c.id]).length;
          const pct = Math.round((checkedCount / layer.checklist.length) * 100);

          return (
            <div
              key={layer.id}
              onClick={() => {
                setActiveModalItem(layer);
                setActiveTab('checklist');
              }}
              className="relative group rounded-xl border border-white/[0.08] bg-[#0e1017] p-4 pt-3.5 space-y-3 cursor-pointer transition-all hover:border-indigo-500/40 hover:bg-[#121420] hover:shadow-xl flex flex-col justify-between"
            >
              {/* Gem Clip Icon touching Top-Left Corner */}
              <div
                className="absolute -top-2 -left-2 w-6 h-6 rounded-md bg-[#161826] border border-indigo-500/50 shadow-md flex items-center justify-center text-xs select-none group-hover:scale-110 group-hover:border-indigo-400 group-hover:shadow-indigo-500/20 transition-all z-10"
                title={`${layer.title} icon`}
              >
                {layer.icon}
              </div>

              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06] flex-shrink-0">
                    {layer.category}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors text-center" title={layer.title}>
                    {layer.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed text-center" title={layer.summary}>
                    {layer.summary}
                  </p>
                </div>
              </div>

              {/* Progress & Click Cue */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Checklist</span>
                  <span className={pct === 100 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {checkedCount} / {layer.checklist.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-300',
                      pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 group-hover:text-indigo-300 transition-colors">
                  <span>Open Rubric & Probing</span>
                  <ArrowRight size={12} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Rubric Modal Window with 20% side margins and 30% top/bottom margins - Rendered via Portal */}
      {activeModalItem && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative w-[90vw] md:w-[60vw] max-w-[60vw] max-h-[46vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0c0d14] text-zinc-100 shadow-2xl overflow-hidden font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.08] bg-[#10121b] flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#161826] border border-indigo-500/40 shadow-sm flex items-center justify-center text-sm flex-shrink-0 select-none">
                  {activeModalItem.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                      {activeModalItem.category}
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight truncate">{activeModalItem.title}</h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">{activeModalItem.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button
                  type="button"
                  onClick={handleCopyRubricModal}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer',
                    copiedModal
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                      : 'border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                  )}
                  title="Copy layer checklist and architecture spec"
                >
                  {copiedModal ? (
                    <>
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="shrink-0" />
                      <span className="text-[11px] text-zinc-400 hover:text-white">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="inline-flex items-center justify-center p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X size={18} className="shrink-0" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-2.5 pb-2 border-b border-white/[0.06] bg-[#0e1017] flex-shrink-0 overflow-x-auto">
              {[
                { key: 'checklist', title: `Checklist (${activeModalItem.checklist.length})`, icon: ListTodo },
                { key: 'probing', title: `Probing Questions (${activeModalItem.probingQuestions.length})`, icon: HelpCircle },
                { key: 'formulas', title: `Sizing Formulas`, icon: Calculator },
                { key: 'tradeoffs', title: `Engine Tradeoffs`, icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={clsx(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                    )}
                  >
                    <Icon size={13} className="shrink-0" />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: Checklist */}
              {activeTab === 'checklist' && (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono text-zinc-400 pb-1">
                    Click items to toggle your preparation status (automatically saved):
                  </div>
                  {activeModalItem.checklist.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={clsx(
                          'p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3',
                          isChecked
                            ? 'border-emerald-500/30 bg-emerald-950/15'
                            : 'border-white/[0.06] bg-[#090a0f] hover:border-white/[0.12]'
                        )}
                      >
                        <div className="mt-0.5 flex-shrink-0 flex items-center justify-center">
                          {isChecked ? (
                            <CheckSquare size={16} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Square size={16} className="text-zinc-500 hover:text-zinc-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={clsx(
                                'text-xs font-semibold leading-snug',
                                isChecked ? 'text-zinc-200 line-through opacity-80' : 'text-white'
                              )}
                              title={item.text}
                            >
                              {item.text}
                            </span>
                            <span
                              className={clsx(
                                'inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase flex-shrink-0 font-medium',
                                item.dimension === 'Scalability' && 'border-indigo-500/30 text-indigo-300 bg-indigo-950/30',
                                item.dimension === 'Security' && 'border-rose-500/30 text-rose-300 bg-rose-950/30',
                                item.dimension === 'Robustness' && 'border-amber-500/30 text-amber-300 bg-amber-950/30',
                                item.dimension === 'Architecture' && 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30'
                              )}
                            >
                              {item.dimension}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed italic" title={item.hint}>
                            💡 {item.hint}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Probing Questions */}
              {activeTab === 'probing' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-400 pb-1">
                    Ask these probing questions during the interview to clarify constraints:
                  </div>
                  {activeModalItem.probingQuestions.map((q, idx) => (
                    <div key={idx} className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3.5 space-y-1.5 text-xs">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-indigo-400">
                        <HelpCircle size={13} className="shrink-0" />
                        <span>Probing Question #{idx + 1}</span>
                      </div>
                      <p className="text-zinc-100 font-medium leading-relaxed" title={q}>{q}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Sizing Formulas */}
              {activeTab === 'formulas' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-400 pb-1">
                    Mathematical sizing formulas and back-of-the-envelope rules of thumb:
                  </div>
                  {activeModalItem.sizingFormulas.map((f, idx) => (
                    <div key={idx} className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3.5 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>{f.name}</span>
                      </div>
                      <div className="p-2 rounded bg-black/50 border border-white/[0.04] text-indigo-300">
                        {f.formula}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans italic pt-0.5">
                        📌 Rule of Thumb: {f.ruleOfThumb}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Engine Tradeoffs */}
              {activeTab === 'tradeoffs' && (
                <div className="rounded-lg border border-white/[0.08] bg-[#090a0f] p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center font-semibold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded border border-purple-500/30">
                      {activeModalItem.tradeoffs.primary}
                    </span>
                    <span className="text-zinc-500 font-mono">VS</span>
                    <span className="inline-flex items-center font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-700/50">
                      {activeModalItem.tradeoffs.alternative}
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{activeModalItem.tradeoffs.reasoning}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/[0.08] bg-[#10121b] flex-shrink-0">
              <span className="text-[11px] text-zinc-500 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">Esc</kbd> or click outside to dismiss
              </span>
              <button
                onClick={() => setActiveModalItem(null)}
                className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
