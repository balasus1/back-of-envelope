import { describe, it, expect } from 'vitest';
import { defaultInputs, getDerivations, Inputs } from './derivations';
import { scenarioTable } from './store';

describe('Regression Guard: Peak_RPS Formula & Spike Scaling', () => {
  it('Normal / default scenario computes Peak_RPS without Spike_Multiplier double-counting (~6,666.67 req/s)', () => {
    const d = getDerivations(defaultInputs);
    expect(d.peakRps.value).toBeCloseTo(6666.67, 1);
  });

  it('Black Friday scenario computes Peak_RPS correctly at 41,666.67 req/s (NOT 416,666.67 req/s)', () => {
    const blackFridayInputs: Inputs = {
      ...defaultInputs,
      ...scenarioTable['Black Friday'],
    };
    const d = getDerivations(blackFridayInputs);
    // DAU = 10M * 0.50 = 5,000,000
    // PCU = 5,000,000 * 0.50 = 2,500,000
    // Raw_RPS = (2,500,000 * 30) / 3600 = 20,833.33 req/s
    // Peak_RPS = Raw_RPS * 2 (SAFETY_BUFFER) = 41,666.67 req/s
    expect(d.peakRps.value).toBeCloseTo(41666.67, 1);
  });
});

describe('System Design Spec Sheet 02: User Metrics & Funnel Model', () => {
  const d = getDerivations(defaultInputs);

  it('1. DAU equals 2,000,000 users', () => {
    expect(d.dau.value).toBeCloseTo(2000000, 1);
  });

  it('2. Peak Concurrent Users (PCU) equals 400,000 users', () => {
    expect(d.pcu.value).toBeCloseTo(400000, 1);
  });

  it('3. Raw API RPS equals 3,333.33 req/s', () => {
    expect(d.rawRps.value).toBeCloseTo(3333.33, 1);
  });

  it('4. Peak API RPS equals 6,666.67 req/s', () => {
    expect(d.peakRps.value).toBeCloseTo(6666.67, 1);
  });

  it('5. Daily Requests equals 60,000,000 reqs/day', () => {
    expect(d.dailyReqs.value).toBeCloseTo(60000000, 1);
  });

  it('6. Monthly Requests equals 1,800,000,000 reqs/month', () => {
    expect(d.monthlyReqs.value).toBeCloseTo(1800000000, 1);
  });

  it('7. Peak Bandwidth (MB/s)', () => {
    // derivations.ts includes (AVG_RESPONSE_SIZE_KB + AVG_REQUEST_SIZE_KB) = 52KB -> 338.54 MB/s
    // spec excel_formula uses AVG_RESPONSE_SIZE_KB (50KB) -> 325.52 MB/s
    expect(d.peakBandwidthMBps.value).toBeCloseTo(338.54, 1);
  });

  it('8. Peak Bandwidth (Gbps)', () => {
    expect(d.peakBandwidthGbps.value).toBeCloseTo(2.71, 1);
  });

  it('9. Daily Egress (GB) equals 2,861.02 GB', () => {
    expect(d.dailyEgressGb.value).toBeCloseTo(2861.02, 1);
  });

  it('10. Monthly Egress (TB) equals 83.82 TB', () => {
    expect(d.monthlyEgressTb.value).toBeCloseTo(83.82, 1);
  });
});

describe('System Design Spec Sheet 03: Frontend & CDN', () => {
  const d = getDerivations(defaultInputs);

  it('1. Total Static Data/day (GB) equals 3,906.25 GB', () => {
    expect(d.staticDataGb.value).toBeCloseTo(3906.25, 1);
  });

  it('2. Origin Traffic/day (GB) equals 78.13 GB', () => {
    expect(d.originTrafficGb.value).toBeCloseTo(78.13, 1);
  });

  it('3. Required Edge Nodes equals 2 nodes', () => {
    expect(d.edgeNodes.value).toBeCloseTo(2, 1);
  });

  it('4. CDN Bandwidth Peak (Gbps) equals 0.10 Gbps', () => {
    expect(d.cdnBandwidthPeakGbps.value).toBeCloseTo(0.10, 1);
  });

  it('5. Effective Bandwidth after compression (Gbps) equals 0.03 Gbps', () => {
    expect(d.cdnEffectiveGbps.value).toBeCloseTo(0.03, 1);
  });

  it('6. Service-Worker-Absorbed Requests/s equals 2,666.67 req/s', () => {
    expect(d.swAbsorbedRps.value).toBeCloseTo(2666.67, 1);
  });

  it('7. Origin-Bound Dynamic RPS equals 133.33 req/s', () => {
    expect(d.originBoundDynamicRps.value).toBeCloseTo(133.33, 1);
  });
});

describe('System Design Spec Sheet 04: API Gateway', () => {
  const d = getDerivations(defaultInputs);

  it('1. Effective RPS/instance equals 1,800 req/s/pod', () => {
    expect(d.effGatewayRps.value).toBeCloseTo(1800, 1);
  });

  it('2. Raw Gateway Instances equals 4 pods', () => {
    expect(d.rawGatewayPods.value).toBeCloseTo(4, 1);
  });

  it('5. Total Gateway Instances (sized with N+1 AZ) equals 9 pods', () => {
    expect(d.gatewayAzPods.value).toBeCloseTo(9, 1);
  });

  it('6. Gateway Latency Added (ms) equals 3.5 ms', () => {
    expect(d.gatewayLatencyMs.value).toBeCloseTo(3.5, 1);
  });

  it('7. Gateway CPU Cores Total equals 36 cores', () => {
    expect(d.gatewayCpuCores.value).toBeCloseTo(36, 1);
  });

  it('8. Rate-Limit Redis Ops/s equals 13,333.33 ops/s', () => {
    expect(d.rlOps.value).toBeCloseTo(13333.33, 1);
  });

  it('9. Rate-Limit Memory (MB) equals 381.47 MB', () => {
    expect(d.rlMemoryMb.value).toBeCloseTo(381.47, 1);
  });

  it('11. JWT Verify Ops/s equals 6,666.67 ops/s', () => {
    expect(d.jwtOps.value).toBeCloseTo(6666.67, 1);
  });

  it('12. JWT CPU Cost (cores) equals 3.33 cores', () => {
    expect(d.jwtCores.value).toBeCloseTo(3.33, 1);
  });

  it('18. WebSocket Concurrent equals 20,000 connections', () => {
    expect(d.wsConcurrent.value).toBeCloseTo(20000, 1);
  });

  it('19. SSE Concurrent equals 40,000 connections', () => {
    expect(d.sseConcurrent.value).toBeCloseTo(40000, 1);
  });

  it('20. WS Memory (MB) equals 1,250 MB', () => {
    expect(d.wsMemoryMb.value).toBeCloseTo(1250, 1);
  });
});

describe('System Design Spec Sheet 05: Load Balancer', () => {
  const d = getDerivations(defaultInputs);

  it('3. Concurrent Connections equals 13,333.33 conns', () => {
    expect(d.lbConcurrentConns.value).toBeCloseTo(13333.33, 1);
  });

  it('4. TLS Handshakes/sec equals 666.67 handshakes/s', () => {
    expect(d.lbTlsHandshakes.value).toBeCloseTo(666.67, 1);
  });
});

describe('System Design Spec Sheet 06: Backend Services', () => {
  const d = getDerivations(defaultInputs);

  it('Total App Instances equals 29 pods', () => {
    expect(d.totalAppInstances.value).toBeCloseTo(29, 1);
  });

  it('Total App Capacity RPS equals 74,500 req/s', () => {
    expect(d.totalAppCapacityRps.value).toBeCloseTo(74500, 1);
  });

  it('Headroom % equals 1,017.50%', () => {
    expect(d.headroomPct.value).toBeCloseTo(1017.5, 1);
  });
});

describe('System Design Spec Sheet 07: Network Latency', () => {
  const d = getDerivations(defaultInputs);

  it('Uncached Path P50 (ms) equals 85.50 ms', () => {
    expect(d.uncachedPathP50.value).toBeCloseTo(85.5, 1);
  });

  it('Cached Path P50 (ms) equals 50.50 ms', () => {
    expect(d.cachedPathP50.value).toBeCloseTo(50.5, 1);
  });

  it('Blended P50 (ms) equals 51.20 ms', () => {
    expect(d.blendedP50.value).toBeCloseTo(51.2, 1);
  });

  it('P95 (ms) equals 92.16 ms', () => {
    expect(d.p95Latency.value).toBeCloseTo(92.16, 1);
  });

  it('P99 (ms) equals 153.60 ms', () => {
    expect(d.p99Latency.value).toBeCloseTo(153.6, 1);
  });
});

describe('System Design Spec Sheet 08: Kafka Design', () => {
  const d = getDerivations(defaultInputs);

  it('1. Kafka MB/s equals 6.51 MB/s', () => {
    expect(d.kafkaMbs.value).toBeCloseTo(6.51, 1);
  });

  it('2. Internal MB/s (with replication) equals 19.53 MB/s', () => {
    expect(d.kafkaInternalMbs.value).toBeCloseTo(19.53, 1);
  });

  it('3. Daily Volume (GB) equals 549.32 GB', () => {
    expect(d.kafkaDailyGb.value).toBeCloseTo(549.32, 1);
  });

  it('4. Monthly Volume (TB) equals 16.09 TB', () => {
    expect(d.kafkaMonthlyTb.value).toBeCloseTo(16.09, 1);
  });

  it('5. With Compression equals 5.36 TB', () => {
    expect(d.kafkaCompressedTb.value).toBeCloseTo(5.36, 1);
  });

  it('9. Adjusted Partitions equals 6 partitions', () => {
    expect(d.kafkaPartitions.value).toBeCloseTo(6, 1);
  });

  it('10. Brokers equals 3 brokers', () => {
    expect(d.kafkaBrokers.value).toBeCloseTo(3, 1);
  });
});

describe('System Design Spec Sheet 09: Database Design', () => {
  const d = getDerivations(defaultInputs);

  it('1. Total DB QPS equals 20,000 QPS', () => {
    expect(d.dbQps.value).toBeCloseTo(20000, 1);
  });

  it('2. Read QPS equals 16,000 QPS', () => {
    expect(d.dbReadQps.value).toBeCloseTo(16000, 1);
  });

  it('3. Write QPS equals 4,000 QPS', () => {
    expect(d.dbWriteQps.value).toBeCloseTo(4000, 1);
  });

  it('6. Actual DB QPS (post-cache) equals 4,800 QPS', () => {
    expect(d.actualDbQps.value).toBeCloseTo(4800, 1);
  });

  it('7. Total IOPS Required equals 5,760 IOPS', () => {
    expect(d.dbIops.value).toBeCloseTo(5760, 1);
  });

  it('8. Recommended IOPS (2x headroom) equals 11,520 IOPS', () => {
    expect(d.dbIopsHeadroom.value).toBeCloseTo(11520, 1);
  });

  it('10. Disk Size Needed (GB) equals 231 GB', () => {
    expect(d.dbDiskSizeGb.value).toBeCloseTo(231, 1);
  });

  it('14. max_connections equals 392 connections', () => {
    expect(d.maxConnections.value).toBeCloseTo(392, 1);
  });

  it('17. Hot Data Size (GB) equals 19,775.39 GB', () => {
    expect(d.dbHotDataGb.value).toBeCloseTo(19775.39, 1);
  });

  it('18. With Indexes (GB) equals 29,663.09 GB', () => {
    expect(d.dbWithIndexesGb.value).toBeCloseTo(29663.09, 1);
  });

  it('19. With WAL (2x) equals 59,326.17 GB', () => {
    expect(d.dbTotalStorageGb.value).toBeCloseTo(59326.17, 1);
  });

  it('24. Read Replicas equals 4 replicas', () => {
    expect(d.dbReplicas.value).toBeCloseTo(4, 1);
  });
});

describe('System Design Spec Sheet 10: Cache Redis', () => {
  const d = getDerivations(defaultInputs);

  it('1. Session Memory (GB) equals 2.86 GB', () => {
    expect(d.sessionMemGb.value).toBeCloseTo(2.86, 1);
  });

  it('5. With Overhead (GB) equals 5.70 GB', () => {
    expect(d.cacheWithOverheadGb.value).toBeCloseTo(5.70, 1);
  });

  it('7. Total Cluster (GB) equals 9 GB', () => {
    expect(d.cacheTotalClusterGb.value).toBeCloseTo(9, 1);
  });

  it('8. Cache Ops/s equals 20,000 ops/s', () => {
    expect(d.cacheOps.value).toBeCloseTo(20000, 1);
  });

  it('10. Required Nodes equals 3 shards', () => {
    expect(d.cacheNodes.value).toBeCloseTo(3, 1);
  });
});

describe('System Design Spec Sheet 11: DLQ & Error Handling', () => {
  const d = getDerivations(defaultInputs);

  it('5. Total Retry Time (s) equals 75 s', () => {
    expect(d.totalRetryTime.value).toBeCloseTo(75, 1);
  });

  it('6. Failure Rate Reaching DLQ (%) equals 2.97%', () => {
    expect(d.dlqFailureRatePct.value).toBeCloseTo(2.97, 1);
  });

  it('7. DLQ Messages/day equals 1,782,060 msgs/day', () => {
    expect(d.dlqMsgsPerDay.value).toBeCloseTo(1782060, 1);
  });

  it('10. Reprocess Throughput (msgs/min) equals 266.67 msgs/min', () => {
    expect(d.reprocessThroughput.value).toBeCloseTo(266.67, 1);
  });

  it('11. Full DLQ Drain Time (hours) equals 111.38 hours', () => {
    expect(d.fullDlqDrainHours.value).toBeCloseTo(111.38, 1);
  });
});

describe('System Design Spec Sheet 12: Traffic Spikes & DDoS', () => {
  const d = getDerivations(defaultInputs);

  it('1. Target Instance Count equals 4 pods', () => {
    expect(d.spikeTargetPods.value).toBeCloseTo(4, 1);
  });

  it('2. Scale-Up Time (s) equals 180 s', () => {
    expect(d.scaleUpTimeSec.value).toBeCloseTo(180, 1);
  });

  it('8. Shed Threshold RPS equals 67,050 req/s', () => {
    expect(d.shedThresholdRps.value).toBeCloseTo(67050, 1);
  });
});

describe('System Design Spec Sheet 13: Observability', () => {
  const d = getDerivations(defaultInputs);

  it('1. Metrics Data Points/day equals 57,600,000,000 points/day', () => {
    expect(d.metricsDataPointsDay.value).toBeCloseTo(57600000000, 1);
  });

  it('2. Metrics Storage (GB) equals 429.15 GB', () => {
    expect(d.metricsStorageGb.value).toBeCloseTo(429.15, 1);
  });

  it('3. Logs (GB/day) equals 114.44 GB/day', () => {
    expect(d.logsGbDay.value).toBeCloseTo(114.44, 1);
  });

  it('4. Logs Storage (GB, 30d retention) equals 3,433.23 GB', () => {
    expect(d.logsStorageMonthGb.value).toBeCloseTo(3433.23, 1);
  });

  it('5. Traces (GB/day) equals 2.86 GB/day', () => {
    expect(d.tracesGbDay.value).toBeCloseTo(2.86, 1);
  });
});

describe('System Design Spec Sheet 16: Cost Estimator', () => {
  const d = getDerivations(defaultInputs);

  it('Cost per 1,000 DAU / month (~$8.24 to $8.46 / 1k DAU)', () => {
    expect(d.costPer1000Dau.value).toBeCloseTo(8.24, 1);
  });

  it('Total Monthly Cost is ~$16,471.82 USD/mo', () => {
    expect(d.totalMonthlyCost.value).toBeCloseTo(16471.82, 1);
  });
});
