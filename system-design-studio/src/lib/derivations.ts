export interface Inputs {
  // BLOCK A - USER METRICS
  MAU: number;
  DAU_PCT: number;
  PEAK_CONCURRENT_PCT: number;
  ACTIONS_PER_SESSION: number;
  PEAK_DURATION_SEC: number;
  SAFETY_BUFFER: number;

  // BLOCK B - TRAFFIC SHAPE
  READ_WRITE_SPLIT_READ_PCT: number;
  CACHE_HIT_PCT: number;
  QUERIES_PER_API_CALL: number;
  AVG_RESPONSE_SIZE_KB: number;
  AVG_REQUEST_SIZE_KB: number;

  // BLOCK C - KAFKA
  AVG_MSG_SIZE_KB: number;
  REPLICATION_FACTOR: number;
  PRODUCER_PER_PARTITION_MBPS: number;
  CONSUMER_PER_PARTITION_MBPS: number;
  BROKER_CAPACITY_MBPS: number;
  MIN_BROKERS_HA: number;
  BROKER_MULTIPLE: number;
  TOPIC_RETENTION_DAYS: number;

  // BLOCK D - DATABASE
  DB_ROW_SIZE_KB: number;
  DB_HOT_RETENTION_DAYS: number;
  DB_CONN_MULTIPLIER: number;
  DB_CONN_OVERHEAD: number;
  DB_READ_REPLICA_QPS: number;
  DB_SSD_IOPS_PER_GB: number;
  DB_IOPS_PER_QUERY: number;

  // BLOCK E - CACHE
  SESSION_SIZE_KB: number;
  CATALOG_SKUS: number;
  CATALOG_ENTRY_KB: number;
  HOT_SKU_COUNT: number;
  HOT_SKU_ENTRY_KB: number;
  CACHE_OVERHEAD_FACTOR: number;
  REDIS_SHARDS: number;
  REDIS_HEADROOM: number;
  REDIS_OPS_PER_NODE: number;

  // BLOCK F - APP SERVERS
  Cores_Per_App_Instance: number;
  RAM_Per_App_Instance_GB: number;
  Order_Svc_Instances: number;
  Payment_Svc_Instances: number;
  Inventory_Svc_Instances: number;
  Notification_Svc_Instances: number;
  Search_Svc_Instances: number;
  Gateway_Instances: number;
  RPS_Per_App_Instance: number;

  // BLOCK G - API GATEWAY
  Gateway_RPS_Capacity: number;
  Gateway_CPU_Util_Target: number;
  Gateway_Overhead_ms: number;
  SSL_Handshake_ms: number;
  SSL_Rate_Pct: number;
  WAF_Rules: number;
  Rate_Limit_Anonymous_RPM: number;
  Rate_Limit_User_RPM: number;
  Rate_Limit_Premium_RPM: number;

  // BLOCK H - NETWORK/LATENCY
  DNS_Lookup_ms: number;
  CDN_Edge_ms: number;
  CDN_Origin_Miss_ms: number;
  LB_Forward_ms: number;
  Service_Process_ms: number;
  DB_Query_ms: number;
  Redis_Query_ms: number;
  SLA_P90_ms: number;
  SLA_P95_ms: number;
  SLA_P99_ms: number;

  // BLOCK I - DLQ/RETRY
  Max_Retries: number;
  Retry_Backoff_Base_sec: number;
  Retry_Backoff_Multiplier: number;
  DLQ_Retention_Days: number;
  Reprocess_Batch_Size: number;
  Reprocess_Interval_min: number;

  // BLOCK J - SPIKE/DDOS
  Spike_Multiplier: number;
  DDoS_Peak_RPS: number;
  Auto_Scale_Trigger_CPU: number;
  Auto_Scale_Cooldown_sec: number;
  Load_Shed_Threshold_Pct: number;

  // BLOCK K - OBSERVABILITY
  Metrics_Retention_Days: number;
  Log_Retention_Days: number;
  Trace_Sample_Rate_Pct: number;
  Log_Size_Per_Request_KB: number;

  // BLOCK L - COST (AWS us-east-1 on-demand USD)
  Cost_Broker_hr: number;
  Cost_App_hr: number;
  Cost_DB_hr: number;
  Cost_Redis_hr: number;
  Cost_Gateway_hr: number;
  Cost_NLB_hr: number;
  Cost_Hours_Month: number;
  Cost_Egress_Per_GB: number;
  Cost_S3_Per_TB: number;
  Cost_CDN_Per_GB: number;

  // ASSUMPTIONS FROM SPEC
  Static_Asset_MB_Per_User: number;
  CDN_Cache_Hit_Ratio_Pct: number;
  Edge_Node_Capacity_RPS: number;
  Compression_Reduction_Pct: number;
  Service_Worker_Hit_Pct: number;
  Gateway_AZs: number;
}

export const defaultInputs: Inputs = {
  MAU: 10000000,
  DAU_PCT: 20,
  PEAK_CONCURRENT_PCT: 20,
  ACTIONS_PER_SESSION: 30,
  PEAK_DURATION_SEC: 3600,
  SAFETY_BUFFER: 2,

  READ_WRITE_SPLIT_READ_PCT: 80,
  CACHE_HIT_PCT: 95,
  QUERIES_PER_API_CALL: 3,
  AVG_RESPONSE_SIZE_KB: 50,
  AVG_REQUEST_SIZE_KB: 2,

  AVG_MSG_SIZE_KB: 1,
  REPLICATION_FACTOR: 3,
  PRODUCER_PER_PARTITION_MBPS: 10,
  CONSUMER_PER_PARTITION_MBPS: 5,
  BROKER_CAPACITY_MBPS: 500,
  MIN_BROKERS_HA: 3,
  BROKER_MULTIPLE: 6,
  TOPIC_RETENTION_DAYS: 7,

  DB_ROW_SIZE_KB: 2,
  DB_HOT_RETENTION_DAYS: 30,
  DB_CONN_MULTIPLIER: 2,
  DB_CONN_OVERHEAD: 1,
  DB_READ_REPLICA_QPS: 5000,
  DB_SSD_IOPS_PER_GB: 50,
  DB_IOPS_PER_QUERY: 1.2,

  SESSION_SIZE_KB: 1.5,
  CATALOG_SKUS: 500000,
  CATALOG_ENTRY_KB: 3,
  HOT_SKU_COUNT: 100000,
  HOT_SKU_ENTRY_KB: 1,
  CACHE_OVERHEAD_FACTOR: 1.3,
  REDIS_SHARDS: 3,
  REDIS_HEADROOM: 1.5,
  REDIS_OPS_PER_NODE: 100000,

  Cores_Per_App_Instance: 4,
  RAM_Per_App_Instance_GB: 8,
  Order_Svc_Instances: 6,
  Payment_Svc_Instances: 4,
  Inventory_Svc_Instances: 4,
  Notification_Svc_Instances: 3,
  Search_Svc_Instances: 3,
  Gateway_Instances: 3,
  RPS_Per_App_Instance: 2000,

  Gateway_RPS_Capacity: 3000,
  Gateway_CPU_Util_Target: 60,
  Gateway_Overhead_ms: 3,
  SSL_Handshake_ms: 5,
  SSL_Rate_Pct: 10,
  WAF_Rules: 20,
  Rate_Limit_Anonymous_RPM: 10,
  Rate_Limit_User_RPM: 100,
  Rate_Limit_Premium_RPM: 500,

  DNS_Lookup_ms: 5,
  CDN_Edge_ms: 10,
  CDN_Origin_Miss_ms: 30,
  LB_Forward_ms: 2,
  Service_Process_ms: 20,
  DB_Query_ms: 5,
  Redis_Query_ms: 1,
  SLA_P90_ms: 80,
  SLA_P95_ms: 150,
  SLA_P99_ms: 300,

  Max_Retries: 3,
  Retry_Backoff_Base_sec: 5,
  Retry_Backoff_Multiplier: 2,
  DLQ_Retention_Days: 30,
  Reprocess_Batch_Size: 1000,
  Reprocess_Interval_min: 15,

  Spike_Multiplier: 1,
  DDoS_Peak_RPS: 1000000,
  Auto_Scale_Trigger_CPU: 70,
  Auto_Scale_Cooldown_sec: 60,
  Load_Shed_Threshold_Pct: 90,

  Metrics_Retention_Days: 15,
  Log_Retention_Days: 30,
  Trace_Sample_Rate_Pct: 1,
  Log_Size_Per_Request_KB: 2,

  Cost_Broker_hr: 0.384,
  Cost_App_hr: 0.17,
  Cost_DB_hr: 0.504,
  Cost_Redis_hr: 0.226,
  Cost_Gateway_hr: 0.17,
  Cost_NLB_hr: 0.0225,
  Cost_Hours_Month: 730,
  Cost_Egress_Per_GB: 0.09,
  Cost_S3_Per_TB: 23,
  Cost_CDN_Per_GB: 0.085,

  Static_Asset_MB_Per_User: 2,
  CDN_Cache_Hit_Ratio_Pct: 98,
  Edge_Node_Capacity_RPS: 5000,
  Compression_Reduction_Pct: 70,
  Service_Worker_Hit_Pct: 40,
  Gateway_AZs: 3,
};

export interface MetricResult {
  value: number;
  unit: string;
  formulaText: string;
  humanExplanation: string;
  dependsOn: string[];
  substitutions?: string;
}

export function safeDiv(num: number, denom: number, fallback = 0): number {
  if (!denom || denom === 0 || !Number.isFinite(denom) || Number.isNaN(denom)) {
    return fallback;
  }
  const res = num / denom;
  return Number.isFinite(res) && !Number.isNaN(res) ? res : fallback;
}

export function safeNum(val: any, fallback = 0): number {
  if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) {
    return fallback;
  }
  return val;
}

function createMetric(
  value: number,
  unit: string,
  formulaText: string,
  humanExplanation: string,
  dependsOn: string[],
  substitutions?: string
): MetricResult {
  const safeVal = safeNum(value, 0);
  const roundedValue = !Number.isInteger(safeVal)
    ? Math.round(safeVal * 100) / 100
    : safeVal;

  return {
    value: roundedValue,
    unit,
    formulaText,
    humanExplanation,
    dependsOn,
    substitutions: substitutions || formulaText,
  };
}

export function getDerivations(inputs: Inputs) {
  // 1. USER METRICS
  const dauVal = inputs.MAU * (inputs.DAU_PCT / 100);
  const dau = createMetric(
    dauVal,
    'users',
    'MAU × (DAU% / 100)',
    'Daily Active Users estimated from Monthly Active Users.',
    ['MAU', 'DAU_PCT'],
    `${inputs.MAU.toLocaleString()} × (${inputs.DAU_PCT}% / 100) = ${dauVal.toLocaleString()}`
  );

  const pcuVal = dauVal * (inputs.PEAK_CONCURRENT_PCT / 100);
  const pcu = createMetric(
    pcuVal,
    'users',
    'DAU × (Peak_Concurrent% / 100)',
    'Simultaneously active users on the platform during peak hours.',
    ['DAU', 'PEAK_CONCURRENT_PCT'],
    `${dauVal.toLocaleString()} × (${inputs.PEAK_CONCURRENT_PCT}% / 100) = ${pcuVal.toLocaleString()}`
  );

  const rawRpsVal = (pcuVal * inputs.ACTIONS_PER_SESSION) / inputs.PEAK_DURATION_SEC;
  const rawRps = createMetric(
    rawRpsVal,
    'req/s',
    '(PCU × Actions/Session) / Peak_Duration_sec',
    'Raw request rate without safety headroom.',
    ['PCU', 'ACTIONS_PER_SESSION', 'PEAK_DURATION_SEC'],
    `(${pcuVal.toLocaleString()} × ${inputs.ACTIONS_PER_SESSION}) / ${inputs.PEAK_DURATION_SEC}s = ${rawRpsVal.toFixed(1)} req/s`
  );

  const peakRpsVal = rawRpsVal * inputs.SAFETY_BUFFER * inputs.Spike_Multiplier;
  const peakRps = createMetric(
    peakRpsVal,
    'req/s',
    'Raw_RPS × Safety_Buffer × Spike_Multiplier',
    'The core anchor metric for all downstream compute, network, database, and cache sizing.',
    ['Raw_RPS', 'SAFETY_BUFFER', 'Spike_Multiplier'],
    `${rawRpsVal.toFixed(1)} × ${inputs.SAFETY_BUFFER} × ${inputs.Spike_Multiplier} = ${peakRpsVal.toFixed(1)} req/s`
  );

  const dailyReqsVal = dauVal * inputs.ACTIONS_PER_SESSION;
  const dailyReqs = createMetric(
    dailyReqsVal,
    'reqs/day',
    'DAU × Actions/Session',
    'Total API requests processed per 24-hour day.',
    ['DAU', 'ACTIONS_PER_SESSION'],
    `${dauVal.toLocaleString()} × ${inputs.ACTIONS_PER_SESSION} = ${dailyReqsVal.toLocaleString()}`
  );

  const monthlyReqsVal = dailyReqsVal * 30;
  const monthlyReqs = createMetric(
    monthlyReqsVal,
    'reqs/month',
    'Daily_Requests × 30',
    'Monthly aggregate API transactions.',
    ['Daily_Requests'],
    `${dailyReqsVal.toLocaleString()} × 30 = ${monthlyReqsVal.toLocaleString()}`
  );

  const peakBandwidthMBpsVal = (peakRpsVal * (inputs.AVG_RESPONSE_SIZE_KB + inputs.AVG_REQUEST_SIZE_KB)) / 1024;
  const peakBandwidthMBps = createMetric(
    peakBandwidthMBpsVal,
    'MB/s',
    'Peak_RPS × (Response_KB + Request_KB) / 1024',
    'Peak combined ingress & egress network throughput.',
    ['Peak_RPS', 'AVG_RESPONSE_SIZE_KB', 'AVG_REQUEST_SIZE_KB'],
    `${peakRpsVal.toFixed(1)} × ${inputs.AVG_RESPONSE_SIZE_KB + inputs.AVG_REQUEST_SIZE_KB}KB / 1024 = ${peakBandwidthMBpsVal.toFixed(1)} MB/s`
  );

  const peakBandwidthGbpsVal = (peakBandwidthMBpsVal * 8) / 1000;
  const peakBandwidthGbps = createMetric(
    peakBandwidthGbpsVal,
    'Gbps',
    'Peak_MBps × 8 / 1000',
    'Peak network interface line speed requirement in Gigabit.',
    ['Peak_Bandwidth_MBps'],
    `${peakBandwidthMBpsVal.toFixed(1)} × 8 / 1000 = ${peakBandwidthGbpsVal.toFixed(2)} Gbps`
  );

  const dailyEgressGbVal = (dailyReqsVal * inputs.AVG_RESPONSE_SIZE_KB) / (1024 * 1024);
  const dailyEgressGb = createMetric(
    dailyEgressGbVal,
    'GB/day',
    'Daily_Requests × AVG_RESPONSE_SIZE_KB / 1024²',
    'Outbound bandwidth payload generated per day.',
    ['Daily_Requests', 'AVG_RESPONSE_SIZE_KB'],
    `${dailyReqsVal.toLocaleString()} × ${inputs.AVG_RESPONSE_SIZE_KB}KB / 1024² = ${dailyEgressGbVal.toFixed(1)} GB`
  );

  const monthlyEgressTbVal = (dailyEgressGbVal * 30) / 1024;
  const monthlyEgressTb = createMetric(
    monthlyEgressTbVal,
    'TB/month',
    'Daily_Egress_GB × 30 / 1024',
    'Monthly egress volume for cloud billing.',
    ['Daily_Egress_GB'],
    `${dailyEgressGbVal.toFixed(1)} × 30 / 1024 = ${monthlyEgressTbVal.toFixed(1)} TB`
  );

  // 2. FRONTEND & CDN
  const staticDataGbVal = (dauVal * inputs.Static_Asset_MB_Per_User) / 1024;
  const staticDataGb = createMetric(
    staticDataGbVal,
    'GB/day',
    'DAU × Static_Asset_MB_Per_User / 1024',
    'Total static assets requested daily.',
    ['DAU', 'Static_Asset_MB_Per_User']
  );

  const originTrafficGbVal = staticDataGbVal * (1 - inputs.CDN_Cache_Hit_Ratio_Pct / 100);
  const originTrafficGb = createMetric(
    originTrafficGbVal,
    'GB/day',
    'Static_Data_GB × (1 - CDN_Hit%)',
    'Static asset traffic penetrating CDN edge to origin.',
    ['Static_Data_GB', 'CDN_Cache_Hit_Ratio_Pct']
  );

  const edgeNodesVal = Math.ceil(peakRpsVal / inputs.Edge_Node_Capacity_RPS);
  const edgeNodes = createMetric(
    edgeNodesVal,
    'nodes',
    'CEIL(Peak_RPS / Edge_Node_Capacity_RPS)',
    'Global CDN Points of Presence (PoPs) needed.',
    ['Peak_RPS', 'Edge_Node_Capacity_RPS']
  );

  const cdnBandwidthPeakGbpsVal = (peakRpsVal * inputs.Static_Asset_MB_Per_User * 8) / (1024 * 1000);
  const cdnBandwidthPeakGbps = createMetric(
    cdnBandwidthPeakGbpsVal,
    'Gbps',
    'Peak_RPS × Static_Asset_MB × 8 / 1024 / 1000',
    'Raw peak edge bandwidth before compression.',
    ['Peak_RPS', 'Static_Asset_MB_Per_User']
  );

  const cdnEffectiveGbpsVal = cdnBandwidthPeakGbpsVal * (1 - inputs.Compression_Reduction_Pct / 100);
  const cdnEffectiveGbps = createMetric(
    cdnEffectiveGbpsVal,
    'Gbps',
    'CDN_Peak_Gbps × (1 - Compression_Reduction%)',
    'Effective bandwidth after Brotli/zstd compression.',
    ['CDN_Peak_Gbps', 'Compression_Reduction_Pct']
  );

  const swAbsorbedRpsVal = (peakRpsVal * inputs.Service_Worker_Hit_Pct) / 100;
  const swAbsorbedRps = createMetric(
    swAbsorbedRpsVal,
    'req/s',
    'Peak_RPS × Service_Worker_Hit_Pct / 100',
    'Requests satisfied on client by Service Worker cache.',
    ['Peak_RPS', 'Service_Worker_Hit_Pct']
  );

  const originBoundDynamicRpsVal = peakRpsVal * (1 - inputs.CDN_Cache_Hit_Ratio_Pct / 100);
  const originBoundDynamicRps = createMetric(
    originBoundDynamicRpsVal,
    'req/s',
    'Peak_RPS × (1 - CDN_Cache_Hit_Ratio_Pct / 100)',
    'Dynamic API calls hitting origin API Gateway.',
    ['Peak_RPS', 'CDN_Cache_Hit_Ratio_Pct']
  );

  // 3. API GATEWAY
  const effGatewayRpsVal = inputs.Gateway_RPS_Capacity * (inputs.Gateway_CPU_Util_Target / 100);
  const effGatewayRps = createMetric(
    effGatewayRpsVal,
    'req/s/pod',
    'Gateway_Capacity × CPU_Target%',
    'Safe RPS throughput per gateway pod maintaining CPU buffer.',
    ['Gateway_RPS_Capacity', 'Gateway_CPU_Util_Target']
  );

  const rawGatewayPodsVal = Math.ceil(peakRpsVal / effGatewayRpsVal);
  const rawGatewayPods = createMetric(
    rawGatewayPodsVal,
    'pods',
    'CEIL(Peak_RPS / Eff_Gateway_RPS)',
    'Minimum baseline pods required.',
    ['Peak_RPS', 'Eff_Gateway_RPS']
  );

  const gatewayAzPodsVal = (Math.ceil(rawGatewayPodsVal / inputs.Gateway_AZs) + 1) * inputs.Gateway_AZs;
  const gatewayAzPods = createMetric(
    gatewayAzPodsVal,
    'pods',
    '(CEIL(Raw_Pods / AZs) + 1) × AZs',
    'N+1 pod sizing across 3 Availability Zones.',
    ['Raw_Pods', 'Gateway_AZs']
  );

  const gatewayLatencyMsVal = inputs.Gateway_Overhead_ms + (inputs.SSL_Handshake_ms * inputs.SSL_Rate_Pct) / 100;
  const gatewayLatencyMs = createMetric(
    gatewayLatencyMsVal,
    'ms',
    'Gateway_Overhead_ms + (SSL_Handshake_ms × SSL_Rate%)',
    'Average latency added by API gateway tier.',
    ['Gateway_Overhead_ms', 'SSL_Handshake_ms', 'SSL_Rate_Pct']
  );

  const gatewayCpuCoresVal = gatewayAzPodsVal * inputs.Cores_Per_App_Instance;
  const gatewayCpuCores = createMetric(
    gatewayCpuCoresVal,
    'cores',
    'Gateway_Pods × Cores_Per_App_Instance',
    'Total compute allocation for API gateway pods.',
    ['Gateway_Pods', 'Cores_Per_App_Instance']
  );

  const rlOpsVal = peakRpsVal * 2;
  const rlOps = createMetric(
    rlOpsVal,
    'ops/s',
    'Peak_RPS × 2',
    'Redis token bucket rate limiter lookups.',
    ['Peak_RPS']
  );

  const rlMemoryMbVal = (dauVal * 200) / (1024 * 1024);
  const rlMemoryMb = createMetric(
    rlMemoryMbVal,
    'MB',
    'DAU × 200 bytes / 1024²',
    'Redis RAM for rate limiting counters.',
    ['DAU']
  );

  const jwtOpsVal = peakRpsVal;
  const jwtOps = createMetric(
    jwtOpsVal,
    'ops/s',
    'Peak_RPS',
    'JWT signature verification ops per second.',
    ['Peak_RPS']
  );

  const jwtCoresVal = (peakRpsVal * 0.5) / 1000;
  const jwtCores = createMetric(
    jwtCoresVal,
    'cores',
    'Peak_RPS × 0.5ms / 1000',
    'CPU core allocation dedicated to JWT verification.',
    ['Peak_RPS']
  );

  const wsConcurrentVal = pcuVal * 0.05;
  const wsConcurrent = createMetric(
    wsConcurrentVal,
    'conns',
    'PCU × 5%',
    'Active persistent WebSocket connections.',
    ['PCU']
  );

  const sseConcurrentVal = pcuVal * 0.1;
  const sseConcurrent = createMetric(
    sseConcurrentVal,
    'conns',
    'PCU × 10%',
    'Active Server-Sent Events streams.',
    ['PCU']
  );

  const wsMemoryMbVal = (wsConcurrentVal * 64) / 1024;
  const wsMemoryMb = createMetric(
    wsMemoryMbVal,
    'MB',
    'WS_Conns × 64 KB / 1024',
    'Socket buffer memory for live WebSockets.',
    ['WS_Conns']
  );

  // 4. LOAD BALANCER
  const lbConcurrentConnsVal = peakRpsVal * 2;
  const lbConcurrentConns = createMetric(
    lbConcurrentConnsVal,
    'conns',
    'Peak_RPS × 2',
    'Concurrent open TCP sockets across load balancers.',
    ['Peak_RPS']
  );

  const lbTlsHandshakesVal = (peakRpsVal * inputs.SSL_Rate_Pct) / 100;
  const lbTlsHandshakes = createMetric(
    lbTlsHandshakesVal,
    'handshakes/s',
    'Peak_RPS × SSL_Rate%',
    'New TLS handshakes per second.',
    ['Peak_RPS', 'SSL_Rate_Pct']
  );

  // 5. BACKEND SERVICES
  const totalAppInstancesVal =
    inputs.Order_Svc_Instances +
    inputs.Payment_Svc_Instances +
    inputs.Inventory_Svc_Instances +
    inputs.Notification_Svc_Instances +
    inputs.Search_Svc_Instances +
    gatewayAzPodsVal;

  const totalAppCapacityRpsVal =
    inputs.Order_Svc_Instances * 2000 +
    inputs.Payment_Svc_Instances * 1500 +
    inputs.Inventory_Svc_Instances * 2500 +
    inputs.Notification_Svc_Instances * 5000 +
    inputs.Search_Svc_Instances * 1500 +
    gatewayAzPodsVal * inputs.Gateway_RPS_Capacity;

  const headroomPctVal = peakRpsVal > 0 ? (totalAppCapacityRpsVal / peakRpsVal - 1) * 100 : 100;
  const headroomPct = createMetric(
    headroomPctVal,
    '%',
    '(Total_RPS_Capacity / Peak_RPS - 1) × 100',
    'Cluster headroom surplus above peak demand.',
    ['Total_Capacity', 'Peak_RPS']
  );

  // 6. NETWORK LATENCY
  const uncachedPathP50Val =
    inputs.DNS_Lookup_ms +
    inputs.CDN_Edge_ms +
    inputs.CDN_Origin_Miss_ms +
    inputs.LB_Forward_ms +
    inputs.LB_Forward_ms +
    gatewayLatencyMsVal +
    1 +
    inputs.Service_Process_ms +
    inputs.Redis_Query_ms +
    inputs.DB_Query_ms +
    1 +
    5;

  const uncachedPathP50 = createMetric(
    uncachedPathP50Val,
    'ms',
    'SUM(all 12 hop latencies)',
    'Round trip P50 latency on cache miss.',
    ['Hops']
  );

  const cachedPathP50Val = uncachedPathP50Val - inputs.CDN_Origin_Miss_ms - inputs.DB_Query_ms;
  const cachedPathP50 = createMetric(
    cachedPathP50Val,
    'ms',
    'Uncached_P50 - CDN_Origin_Miss - DB_Query',
    'Fast-path P50 round trip latency via CDN & Redis.',
    ['Uncached_P50']
  );

  const blendedP50Val = cachedPathP50Val * 0.98 + uncachedPathP50Val * 0.02;
  const blendedP50 = createMetric(
    blendedP50Val,
    'ms',
    'Cached_P50 × 98% + Uncached_P50 × 2%',
    'Weighted median latency reflecting 98% cache hit distribution.',
    ['Cached_P50', 'Uncached_P50']
  );

  const p95LatencyVal = blendedP50Val * 1.8;
  const p95Latency = createMetric(
    p95LatencyVal,
    'ms',
    'Blended_P50 × 1.8',
    'P95 tail latency with queueing amplification.',
    ['Blended_P50']
  );

  const p99LatencyVal = blendedP50Val * 3.0;
  const p99Latency = createMetric(
    p99LatencyVal,
    'ms',
    'Blended_P50 × 3.0',
    'P99 worst 1% tail latency.',
    ['Blended_P50']
  );

  const isSlaPass = p95LatencyVal <= inputs.SLA_P95_ms;

  // 7. KAFKA DESIGN
  const kafkaMbsVal = (peakRpsVal * inputs.AVG_MSG_SIZE_KB) / 1024;
  const kafkaMbs = createMetric(
    kafkaMbsVal,
    'MB/s',
    'Peak_RPS × AVG_MSG_SIZE_KB / 1024',
    'Producer throughput into primary event streams.',
    ['Peak_RPS', 'AVG_MSG_SIZE_KB']
  );

  const kafkaInternalMbsVal = kafkaMbsVal * inputs.REPLICATION_FACTOR;
  const kafkaInternalMbs = createMetric(
    kafkaInternalMbsVal,
    'MB/s',
    'Kafka_MBps × Replication_Factor',
    'Total bus throughput including inter-broker replication.',
    ['Kafka_MBps', 'REPLICATION_FACTOR']
  );

  const kafkaDailyGbVal = (kafkaMbsVal * 86400) / 1024;
  const kafkaDailyGb = createMetric(
    kafkaDailyGbVal,
    'GB/day',
    'Kafka_MBps × 86,400 / 1024',
    'Raw message log volume written daily.',
    ['Kafka_MBps']
  );

  const kafkaMonthlyTbVal = (kafkaDailyGbVal * 30) / 1024;
  const kafkaMonthlyTb = createMetric(
    kafkaMonthlyTbVal,
    'TB/month',
    'Daily_GB × 30 / 1024',
    'Monthly Kafka storage ingress.',
    ['Daily_GB']
  );

  const kafkaCompressedTbVal = kafkaMonthlyTbVal / 3;
  const kafkaCompressedTb = createMetric(
    kafkaCompressedTbVal,
    'TB/month',
    'Monthly_TB / 3 (zstd ~3x ratio)',
    'Retained disk storage with zstd compression.',
    ['Monthly_TB']
  );

  const prodCap = Math.max(0.1, inputs.PRODUCER_PER_PARTITION_MBPS || 1);
  const consCap = Math.max(0.1, inputs.CONSUMER_PER_PARTITION_MBPS || 1);
  const brokerMultiple = Math.max(1, inputs.BROKER_MULTIPLE || 1);
  const brokerCap = Math.max(1, inputs.BROKER_CAPACITY_MBPS || 1);
  const minBrokers = Math.max(1, inputs.MIN_BROKERS_HA || 1);

  const partitionsProdVal = Math.ceil(safeDiv(kafkaMbsVal, prodCap, 1));
  const partitionsConsVal = Math.ceil(safeDiv(kafkaMbsVal, consCap, 1));
  const rawPartitionsVal = Math.max(partitionsProdVal, partitionsConsVal, minBrokers);
  const kafkaPartitionsVal = Math.ceil(safeDiv(rawPartitionsVal, brokerMultiple, 1)) * brokerMultiple;
  const kafkaPartitions = createMetric(
    kafkaPartitionsVal,
    'partitions',
    'CEIL(MAX(prod, cons, minHA) / Broker_Multiple) × Broker_Multiple',
    'Balanced partition count across brokers.',
    ['Throughput', 'Broker_Multiple']
  );

  const kafkaBrokersVal = Math.max(
    minBrokers,
    Math.ceil(safeDiv(kafkaInternalMbsVal, brokerCap, 1))
  );
  const kafkaBrokers = createMetric(
    kafkaBrokersVal,
    'brokers',
    'MAX(Min_HA, CEIL(Internal_MBps / Broker_Capacity))',
    'Kafka broker nodes for throughput & HA quorum.',
    ['Internal_MBps', 'Broker_Capacity']
  );

  // 8. DATABASE DESIGN (PostgreSQL)
  const dbQpsVal = peakRpsVal * inputs.QUERIES_PER_API_CALL;
  const dbQps = createMetric(
    dbQpsVal,
    'qps',
    'Peak_RPS × QUERIES_PER_API_CALL',
    'Logical query demand from backend services.',
    ['Peak_RPS', 'QUERIES_PER_API_CALL']
  );

  const dbReadQpsVal = (dbQpsVal * inputs.READ_WRITE_SPLIT_READ_PCT) / 100;
  const dbReadQps = createMetric(
    dbReadQpsVal,
    'qps',
    'DB_QPS × Read_Split%',
    'Logical SELECT queries generated.',
    ['DB_QPS', 'READ_WRITE_SPLIT_READ_PCT']
  );

  const dbWriteQpsVal = dbQpsVal - dbReadQpsVal;
  const dbWriteQps = createMetric(
    dbWriteQpsVal,
    'qps',
    'DB_QPS - Read_QPS',
    'INSERT, UPDATE, DELETE queries on primary DB.',
    ['DB_QPS', 'Read_QPS']
  );

  const dbCacheHitReadsVal = (dbReadQpsVal * inputs.CACHE_HIT_PCT) / 100;
  const dbCacheMissReadsVal = dbReadQpsVal - dbCacheHitReadsVal;
  const actualDbQpsVal = dbCacheMissReadsVal + dbWriteQpsVal;
  const actualDbQps = createMetric(
    actualDbQpsVal,
    'qps',
    'Cache_Miss_Reads + Write_QPS',
    'Physical query load hitting database storage engine after cache.',
    ['Cache_Miss_Reads', 'Write_QPS']
  );

  const dbIopsVal = actualDbQpsVal * inputs.DB_IOPS_PER_QUERY;
  const dbIops = createMetric(
    dbIopsVal,
    'iops',
    'Actual_DB_QPS × DB_IOPS_PER_QUERY',
    'Sustained disk random I/O operations per second.',
    ['Actual_DB_QPS', 'DB_IOPS_PER_QUERY']
  );

  const dbIopsHeadroomVal = dbIopsVal * 2;
  const dbIopsHeadroom = createMetric(
    dbIopsHeadroomVal,
    'iops',
    'IOPS_Required × 2',
    'Recommended disk provisioned IOPS with headroom.',
    ['IOPS_Required']
  );

  const dbDiskSizeGbVal = Math.ceil(dbIopsHeadroomVal / inputs.DB_SSD_IOPS_PER_GB);
  const dbDiskSizeGb = createMetric(
    dbDiskSizeGbVal,
    'GB',
    'CEIL(IOPS_Headroom / IOPS_Per_GB)',
    'Minimum gp3/io2 EBS volume size needed for IOPS.',
    ['IOPS_Headroom', 'DB_SSD_IOPS_PER_GB']
  );

  const connPerAppInstanceVal = inputs.Cores_Per_App_Instance * inputs.DB_CONN_MULTIPLIER + inputs.DB_CONN_OVERHEAD;
  const totalDbConnectionsVal = totalAppInstancesVal * connPerAppInstanceVal;
  const maxConnectionsVal = Math.ceil(totalDbConnectionsVal * 1.5);
  const maxConnections = createMetric(
    maxConnectionsVal,
    'connections',
    'CEIL(Total_App_Instances × (Cores × 2 + 1) × 1.5)',
    'postgresql.conf max_connections parameter sizing.',
    ['App_Instances', 'Cores_Per_App_Instance']
  );

  const dbDailyWritesVal = dbWriteQpsVal * 86400;
  const dbHotRowsVal = dbDailyWritesVal * inputs.DB_HOT_RETENTION_DAYS;
  const dbHotDataGbVal = (dbHotRowsVal * inputs.DB_ROW_SIZE_KB) / (1024 * 1024);
  const dbHotDataGb = createMetric(
    dbHotDataGbVal,
    'GB',
    'Hot_Rows × Row_Size_KB / 1024²',
    'Primary hot data table volume for 30 days.',
    ['Write_QPS', 'DB_HOT_RETENTION_DAYS', 'DB_ROW_SIZE_KB']
  );

  const dbWithIndexesGbVal = dbHotDataGbVal * 1.5;
  const dbWithIndexesGb = createMetric(
    dbWithIndexesGbVal,
    'GB',
    'Hot_Data_GB × 1.5 (B-Tree index factor)',
    'Table data plus primary key & secondary B-Tree indexes.',
    ['Hot_Data_GB']
  );

  const dbTotalStorageGbVal = dbWithIndexesGbVal * 2;
  const dbTotalStorageGb = createMetric(
    dbTotalStorageGbVal,
    'GB',
    'Data_With_Indexes × 2 (WAL + archive buffer)',
    'Total allocated primary disk including WAL and vacuum overhead.',
    ['Data_With_Indexes']
  );

  const dbReplicasVal = Math.ceil(dbReadQpsVal / inputs.DB_READ_REPLICA_QPS);
  const dbReplicas = createMetric(
    dbReplicasVal,
    'replicas',
    'CEIL(Read_QPS / Replica_Capacity_QPS)',
    'Read replica nodes required.',
    ['Read_QPS', 'DB_READ_REPLICA_QPS']
  );

  // 9. CACHE (Redis)
  const sessionMemGbVal = (dauVal * inputs.SESSION_SIZE_KB) / (1024 * 1024);
  const sessionMemGb = createMetric(
    sessionMemGbVal,
    'GB',
    'DAU × Session_Size_KB / 1024²',
    'Active user session context RAM.',
    ['DAU', 'SESSION_SIZE_KB']
  );

  const catalogMemGbVal = (inputs.CATALOG_SKUS * inputs.CATALOG_ENTRY_KB) / (1024 * 1024);
  const hotSkuMemGbVal = (inputs.HOT_SKU_COUNT * inputs.HOT_SKU_ENTRY_KB) / (1024 * 1024);
  const cacheSubtotalGbVal = sessionMemGbVal + catalogMemGbVal + hotSkuMemGbVal;
  const cacheWithOverheadGbVal = cacheSubtotalGbVal * inputs.CACHE_OVERHEAD_FACTOR;
  const cacheWithOverheadGb = createMetric(
    cacheWithOverheadGbVal,
    'GB',
    '(Sessions + Catalog + HotSKU) × Overhead_Factor',
    'Total Redis in-memory dataset with overhead.',
    ['Sessions', 'Catalog', 'HotSKU', 'CACHE_OVERHEAD_FACTOR']
  );

  const cacheShardGbVal = Math.ceil((cacheWithOverheadGbVal / inputs.REDIS_SHARDS) * inputs.REDIS_HEADROOM);
  const cacheTotalClusterGbVal = cacheShardGbVal * inputs.REDIS_SHARDS;
  const cacheTotalClusterGb = createMetric(
    cacheTotalClusterGbVal,
    'GB',
    'Shard_GB × Redis_Shards',
    'Provisioned Redis Cluster RAM across master shards.',
    ['Redis_Shards', 'REDIS_HEADROOM']
  );

  const cacheOpsVal = dbQpsVal;
  const cacheOps = createMetric(
    cacheOpsVal,
    'ops/s',
    'Peak_RPS × QUERIES_PER_API_CALL',
    'Redis GET & SET ops per second.',
    ['Peak_RPS', 'QUERIES_PER_API_CALL']
  );

  const cacheNodesVal = Math.max(3, Math.ceil(cacheOpsVal / inputs.REDIS_OPS_PER_NODE));
  const cacheNodes = createMetric(
    cacheNodesVal,
    'shards',
    'MAX(3, CEIL(Ops / Ops_Per_Node))',
    'Redis cluster master shards.',
    ['Cache_Ops', 'REDIS_OPS_PER_NODE']
  );

  // 10. DLQ & ERROR HANDLING
  const retryTier1Val = inputs.Retry_Backoff_Base_sec;
  const retryTier2Val = inputs.Retry_Backoff_Base_sec * inputs.Retry_Backoff_Multiplier;
  const retryTier3Val = inputs.Retry_Backoff_Base_sec * Math.pow(inputs.Retry_Backoff_Multiplier, 2);
  const retryTier4Val = inputs.Retry_Backoff_Base_sec * Math.pow(inputs.Retry_Backoff_Multiplier, 3);
  const totalRetryTimeVal = retryTier1Val + retryTier2Val + retryTier3Val + retryTier4Val;
  const totalRetryTime = createMetric(
    totalRetryTimeVal,
    's',
    'Tier1(5s) + Tier2(10s) + Tier3(20s) + Tier4(40s)',
    'Total retry duration across 4 exponential backoff tiers.',
    ['Retry_Backoff_Base_sec', 'Retry_Backoff_Multiplier']
  );

  const dlqFailureRatePctVal = (1 - Math.pow(0.99, inputs.Max_Retries)) * 100;
  const dlqFailureRatePct = createMetric(
    dlqFailureRatePctVal,
    '%',
    '(1 - (0.99)^Max_Retries) × 100',
    'Percentage of transactions failing retries and reaching DLQ.',
    ['Max_Retries']
  );

  const dlqMsgsPerDayVal = (dailyReqsVal * dlqFailureRatePctVal) / 100;
  const dlqMsgsPerDay = createMetric(
    dlqMsgsPerDayVal,
    'msgs/day',
    'Daily_Requests × Failure_Rate%',
    'Estimated unrecoverable messages queued in dead-letter topic daily.',
    ['Daily_Requests', 'Failure_Rate%']
  );

  const reprocessThroughputVal = (inputs.Reprocess_Batch_Size * 4) / inputs.Reprocess_Interval_min;
  const reprocessThroughput = createMetric(
    reprocessThroughputVal,
    'msgs/min',
    'Batch_Size × Workers / Interval_min',
    'Reprocessing throughput rate for draining DLQ.',
    ['Reprocess_Batch_Size', 'Reprocess_Interval_min']
  );

  const fullDlqDrainHoursVal = dlqMsgsPerDayVal / reprocessThroughputVal / 60;
  const fullDlqDrainHours = createMetric(
    fullDlqDrainHoursVal,
    'hours',
    'DLQ_Msgs / (Reprocess_Throughput × 60)',
    'Time required to safely drain 24h accumulated DLQ events.',
    ['DLQ_Msgs', 'Reprocess_Throughput']
  );

  // 11. TRAFFIC SPIKES & DDOS
  const spikeTargetPodsVal = Math.ceil(peakRpsVal / inputs.RPS_Per_App_Instance);
  const spikeTargetPods = createMetric(
    spikeTargetPodsVal,
    'pods',
    'CEIL(Spike_Peak_RPS / RPS_Per_App_Instance)',
    'Auto-scaling target instance count for scenario spike.',
    ['Peak_RPS', 'RPS_Per_App_Instance']
  );

  const scaleUpTimeSecVal = inputs.Auto_Scale_Cooldown_sec + 90 + 30;
  const scaleUpTimeSec = createMetric(
    scaleUpTimeSecVal,
    's',
    'Cooldown(60s) + EC2_Provision(90s) + Pod_Warmup(30s)',
    'Latency required from metric breach to new pods serving live traffic.',
    ['Auto_Scale_Cooldown_sec']
  );

  const shedThresholdRpsVal = (totalAppCapacityRpsVal * inputs.Load_Shed_Threshold_Pct) / 100;
  const shedThresholdRps = createMetric(
    shedThresholdRpsVal,
    'req/s',
    'Total_RPS_Capacity × Shed_Threshold%',
    'Threshold where edge begins shedding P5 & P4 traffic to protect checkout.',
    ['Total_Capacity', 'Load_Shed_Threshold_Pct']
  );

  // 12. OBSERVABILITY
  const metricsDataPointsDayVal = peakRpsVal * 100 * 86400;
  const metricsDataPointsDay = createMetric(
    metricsDataPointsDayVal,
    'points/day',
    'Peak_RPS × 100 metrics/req × 86,400',
    'Prometheus metrics data points recorded daily.',
    ['Peak_RPS']
  );

  const metricsStorageGbVal = (metricsDataPointsDayVal * 8) / Math.pow(1024, 3);
  const metricsStorageGb = createMetric(
    metricsStorageGbVal,
    'GB',
    'Data_Points × 8 bytes / 1024³',
    'Time-series metrics storage consumed per day.',
    ['Data_Points']
  );

  const logsGbDayVal = (dailyReqsVal * inputs.Log_Size_Per_Request_KB) / (1024 * 1024);
  const logsGbDay = createMetric(
    logsGbDayVal,
    'GB/day',
    'Daily_Requests × Log_Size_KB / 1024²',
    'Aggregated application logs generated daily.',
    ['Daily_Requests', 'Log_Size_Per_Request_KB']
  );

  const logsStorageMonthGbVal = logsGbDayVal * inputs.Log_Retention_Days;
  const logsStorageMonthGb = createMetric(
    logsStorageMonthGbVal,
    'GB/month',
    'Logs_GB_Day × 30 days retention',
    'OpenSearch storage required for 30-day searchable logs.',
    ['Logs_GB_Day', 'Log_Retention_Days']
  );

  const tracesGbDayVal = ((dailyReqsVal * (inputs.Trace_Sample_Rate_Pct / 100) * 5) / (1024 * 1024));
  const tracesGbDay = createMetric(
    tracesGbDayVal,
    'GB/day',
    'Daily_Requests × Sample% × 5KB / 1024²',
    'Distributed OpenTelemetry trace spans collected daily.',
    ['Daily_Requests', 'Trace_Sample_Rate_Pct']
  );

  // 13. COST ESTIMATOR (AWS us-east-1 USD)
  const costBrokers = kafkaBrokersVal * inputs.Cost_Broker_hr * inputs.Cost_Hours_Month;
  const costControllers = 3 * 0.096 * inputs.Cost_Hours_Month;
  const costApp = (totalAppInstancesVal - gatewayAzPodsVal) * inputs.Cost_App_hr * inputs.Cost_Hours_Month;
  const costGateway = gatewayAzPodsVal * inputs.Cost_Gateway_hr * inputs.Cost_Hours_Month;
  const costNLB = 2 * inputs.Cost_NLB_hr * inputs.Cost_Hours_Month;
  const costDbPrimary = 1 * inputs.Cost_DB_hr * inputs.Cost_Hours_Month;
  const costDbReplicas = dbReplicasVal * inputs.Cost_DB_hr * inputs.Cost_Hours_Month;
  const costRedis = inputs.REDIS_SHARDS * inputs.Cost_Redis_hr * inputs.Cost_Hours_Month;
  const costNAT = 2 * 0.045 * inputs.Cost_Hours_Month;
  const costS3 = (dbTotalStorageGbVal / 1024) * inputs.Cost_S3_Per_TB;
  const costCDN = monthlyEgressTbVal * 1024 * inputs.Cost_CDN_Per_GB;
  const costMonitoring = 500;
  const costSecrets = 20 * 0.4;
  const costRoute53 = 5 * 0.5 + 50;
  const costLoadTesting = 200;

  const totalMonthlyCostVal =
    costBrokers +
    costControllers +
    costApp +
    costGateway +
    costNLB +
    costDbPrimary +
    costDbReplicas +
    costRedis +
    costNAT +
    costS3 +
    costCDN +
    costMonitoring +
    costSecrets +
    costRoute53 +
    costLoadTesting;

  const totalMonthlyCost = createMetric(
    totalMonthlyCostVal,
    'USD/mo',
    'SUM(Compute + Database + Storage + Network + Observability)',
    'Total monthly on-demand infrastructure investment across all AWS tiers.',
    ['Compute', 'Storage', 'Network', 'DB', 'Cache']
  );

  const totalAnnualCostVal = totalMonthlyCostVal * 12;
  const totalAnnualCost = createMetric(
    totalAnnualCostVal,
    'USD/yr',
    'Monthly_Cost × 12',
    'Annualized cloud infrastructure operational expenditure.',
    ['Monthly_Cost']
  );

  const costPer1000DauVal = dauVal > 0 ? totalMonthlyCostVal / (dauVal / 1000) : 0;
  const costPer1000Dau = createMetric(
    costPer1000DauVal,
    'USD/1k DAU',
    'Total_Monthly_Cost / (DAU / 1,000)',
    'Unit economics north-star metric measuring cost efficiency per 1,000 daily active users.',
    ['Total_Monthly_Cost', 'DAU']
  );

  return {
    // User Metrics
    dau,
    pcu,
    rawRps,
    peakRps,
    dailyReqs,
    monthlyReqs,
    peakBandwidthMBps,
    peakBandwidthGbps,
    dailyEgressGb,
    monthlyEgressTb,

    // Frontend & CDN
    staticDataGb,
    originTrafficGb,
    edgeNodes,
    cdnBandwidthPeakGbps,
    cdnEffectiveGbps,
    swAbsorbedRps,
    originBoundDynamicRps,

    // API Gateway
    effGatewayRps,
    rawGatewayPods,
    gatewayAzPods,
    gatewayLatencyMs,
    gatewayCpuCores,
    rlOps,
    rlMemoryMb,
    jwtOps,
    jwtCores,
    wsConcurrent,
    sseConcurrent,
    wsMemoryMb,

    // LB
    lbConcurrentConns,
    lbTlsHandshakes,

    // Backend
    totalAppInstances: createMetric(totalAppInstancesVal, 'instances', 'SUM(App_Services + Gateway)', 'Total running pods across all services', ['Instances']),
    totalAppCapacityRps: createMetric(totalAppCapacityRpsVal, 'req/s', 'SUM(Instances × RPS_Per_Instance)', 'Cluster aggregate request processing capacity', ['Instances']),
    headroomPct,

    // Network Latency
    uncachedPathP50,
    cachedPathP50,
    blendedP50,
    p95Latency,
    p99Latency,
    isSlaPass,

    // Kafka
    kafkaMbs,
    kafkaInternalMbs,
    kafkaDailyGb,
    kafkaMonthlyTb,
    kafkaCompressedTb,
    kafkaPartitions,
    kafkaBrokers,

    // Database
    dbQps,
    dbReadQps,
    dbWriteQps,
    actualDbQps,
    dbIops,
    dbIopsHeadroom,
    dbDiskSizeGb,
    maxConnections,
    dbHotDataGb,
    dbWithIndexesGb,
    dbTotalStorageGb,
    dbReplicas,

    // Cache
    sessionMemGb,
    cacheWithOverheadGb,
    cacheTotalClusterGb,
    cacheOps,
    cacheNodes,

    // DLQ
    totalRetryTime,
    dlqFailureRatePct,
    dlqMsgsPerDay,
    reprocessThroughput,
    fullDlqDrainHours,

    // Spikes & DDoS
    spikeTargetPods,
    scaleUpTimeSec,
    shedThresholdRps,

    // Observability
    metricsDataPointsDay,
    metricsStorageGb,
    logsGbDay,
    logsStorageMonthGb,
    tracesGbDay,

    // Cost
    totalMonthlyCost,
    totalAnnualCost,
    costPer1000Dau,
    costBreakdown: {
      compute: costApp + costGateway + costBrokers + costControllers,
      database: costDbPrimary + costDbReplicas + costRedis,
      network: costCDN + costNLB + costNAT + costRoute53,
      storage: costS3,
      observability: costMonitoring + costSecrets + costLoadTesting,
    }
  };
}

export type Derivations = ReturnType<typeof getDerivations>;
