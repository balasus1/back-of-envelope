import os

derivations_ts = """export interface Inputs {
  MAU: number; DAU_PCT: number; PEAK_CONCURRENT_PCT: number; ACTIONS_PER_SESSION: number; PEAK_DURATION_SEC: number; SAFETY_BUFFER: number;
  READ_WRITE_SPLIT_READ_PCT: number; CACHE_HIT_PCT: number; QUERIES_PER_API_CALL: number; AVG_RESPONSE_SIZE_KB: number; AVG_REQUEST_SIZE_KB: number;
  AVG_MSG_SIZE_KB: number; REPLICATION_FACTOR: number; PRODUCER_PER_PARTITION_MBPS: number; CONSUMER_PER_PARTITION_MBPS: number; BROKER_CAPACITY_MBPS: number; MIN_BROKERS_HA: number; BROKER_MULTIPLE: number; TOPIC_RETENTION_DAYS: number;
  DB_ROW_SIZE_KB: number; DB_HOT_RETENTION_DAYS: number; DB_CONN_MULTIPLIER: number; DB_CONN_OVERHEAD: number; DB_READ_REPLICA_QPS: number; DB_SSD_IOPS_PER_GB: number; DB_IOPS_PER_QUERY: number;
  SESSION_SIZE_KB: number; CATALOG_SKUS: number; CATALOG_ENTRY_KB: number; HOT_SKU_COUNT: number; HOT_SKU_ENTRY_KB: number; CACHE_OVERHEAD_FACTOR: number; REDIS_SHARDS: number; REDIS_HEADROOM: number; REDIS_OPS_PER_NODE: number;
  Cores_Per_App_Instance: number; RAM_Per_App_Instance_GB: number; Order_Svc_Instances: number; Payment_Svc_Instances: number; Inventory_Svc_Instances: number; Notification_Svc_Instances: number; Search_Svc_Instances: number; Gateway_Instances: number; RPS_Per_App_Instance: number;
  Gateway_RPS_Capacity: number; Gateway_CPU_Util_Target: number; Gateway_Overhead_ms: number; SSL_Handshake_ms: number; SSL_Rate_Pct: number; WAF_Rules: number; Rate_Limit_Anonymous_RPM: number; Rate_Limit_User_RPM: number; Rate_Limit_Premium_RPM: number;
  DNS_Lookup_ms: number; CDN_Edge_ms: number; CDN_Origin_Miss_ms: number; LB_Forward_ms: number; Service_Process_ms: number; DB_Query_ms: number; Redis_Query_ms: number; SLA_P95_ms: number;
  Max_Retries: number; Retry_Backoff_Base_sec: number; Retry_Backoff_Multiplier: number; DLQ_Retention_Days: number; Reprocess_Batch_Size: number; Reprocess_Interval_min: number;
  Spike_Multiplier: number; DDoS_Peak_RPS: number; Auto_Scale_Trigger_CPU: number; Auto_Scale_Cooldown_sec: number; Load_Shed_Threshold_Pct: number;
  Metrics_Retention_Days: number; Log_Retention_Days: number; Trace_Sample_Rate_Pct: number; Log_Size_Per_Request_KB: number;
  Cost_Broker_hr: number; Cost_App_hr: number; Cost_DB_hr: number; Cost_Redis_hr: number; Cost_Gateway_hr: number; Cost_NLB_hr: number; Cost_Hours_Month: number; Cost_Egress_Per_GB: number; Cost_S3_Per_TB: number; Cost_CDN_Per_GB: number;
}

export const defaultInputs: Inputs = {
  MAU: 10000000, DAU_PCT: 20, PEAK_CONCURRENT_PCT: 20, ACTIONS_PER_SESSION: 30, PEAK_DURATION_SEC: 3600, SAFETY_BUFFER: 2,
  READ_WRITE_SPLIT_READ_PCT: 80, CACHE_HIT_PCT: 95, QUERIES_PER_API_CALL: 3, AVG_RESPONSE_SIZE_KB: 50, AVG_REQUEST_SIZE_KB: 2,
  AVG_MSG_SIZE_KB: 1, REPLICATION_FACTOR: 3, PRODUCER_PER_PARTITION_MBPS: 10, CONSUMER_PER_PARTITION_MBPS: 5, BROKER_CAPACITY_MBPS: 500, MIN_BROKERS_HA: 3, BROKER_MULTIPLE: 6, TOPIC_RETENTION_DAYS: 7,
  DB_ROW_SIZE_KB: 2, DB_HOT_RETENTION_DAYS: 30, DB_CONN_MULTIPLIER: 2, DB_CONN_OVERHEAD: 1, DB_READ_REPLICA_QPS: 5000, DB_SSD_IOPS_PER_GB: 50, DB_IOPS_PER_QUERY: 1.2,
  SESSION_SIZE_KB: 1.5, CATALOG_SKUS: 500000, CATALOG_ENTRY_KB: 3, HOT_SKU_COUNT: 100000, HOT_SKU_ENTRY_KB: 1, CACHE_OVERHEAD_FACTOR: 1.3, REDIS_SHARDS: 3, REDIS_HEADROOM: 1.5, REDIS_OPS_PER_NODE: 100000,
  Cores_Per_App_Instance: 4, RAM_Per_App_Instance_GB: 8, Order_Svc_Instances: 6, Payment_Svc_Instances: 4, Inventory_Svc_Instances: 4, Notification_Svc_Instances: 3, Search_Svc_Instances: 3, Gateway_Instances: 3, RPS_Per_App_Instance: 2000,
  Gateway_RPS_Capacity: 3000, Gateway_CPU_Util_Target: 60, Gateway_Overhead_ms: 3, SSL_Handshake_ms: 5, SSL_Rate_Pct: 10, WAF_Rules: 20, Rate_Limit_Anonymous_RPM: 10, Rate_Limit_User_RPM: 100, Rate_Limit_Premium_RPM: 500,
  DNS_Lookup_ms: 5, CDN_Edge_ms: 10, CDN_Origin_Miss_ms: 30, LB_Forward_ms: 2, Service_Process_ms: 20, DB_Query_ms: 5, Redis_Query_ms: 1, SLA_P95_ms: 200,
  Max_Retries: 3, Retry_Backoff_Base_sec: 5, Retry_Backoff_Multiplier: 2, DLQ_Retention_Days: 30, Reprocess_Batch_Size: 1000, Reprocess_Interval_min: 15,
  Spike_Multiplier: 1, DDoS_Peak_RPS: 1000000, Auto_Scale_Trigger_CPU: 70, Auto_Scale_Cooldown_sec: 60, Load_Shed_Threshold_Pct: 90,
  Metrics_Retention_Days: 15, Log_Retention_Days: 30, Trace_Sample_Rate_Pct: 1, Log_Size_Per_Request_KB: 2,
  Cost_Broker_hr: 0.384, Cost_App_hr: 0.17, Cost_DB_hr: 0.504, Cost_Redis_hr: 0.226, Cost_Gateway_hr: 0.17, Cost_NLB_hr: 0.0225, Cost_Hours_Month: 730, Cost_Egress_Per_GB: 0.09, Cost_S3_Per_TB: 23, Cost_CDN_Per_GB: 0.085
};

export interface MetricResult { value: number; unit: string; formulaText: string; humanExplanation: string; dependsOn: string[]; }

function m(value: number, unit: string, formulaText: string, humanExplanation: string, dependsOn: string[]): MetricResult {
  return { value, unit, formulaText, humanExplanation, dependsOn };
}

export function getDerivations(inputs: Inputs) {
  // USER METRICS
  const dau = m(inputs.MAU * (inputs.DAU_PCT / 100), 'users', 'MAU * DAU_PCT/100', '', ['MAU', 'DAU_PCT']);
  const pcu = m(dau.value * (inputs.PEAK_CONCURRENT_PCT / 100), 'users', 'DAU * PEAK_CONCURRENT_PCT/100', '', ['DAU', 'PEAK_CONCURRENT_PCT']);
  const rawRps = m((pcu.value * inputs.ACTIONS_PER_SESSION) / inputs.PEAK_DURATION_SEC, 'req/s', '(PCU * ACTIONS_PER_SESSION) / PEAK_DURATION_SEC', '', ['PCU', 'ACTIONS_PER_SESSION', 'PEAK_DURATION_SEC']);
  const peakRps = m(rawRps.value * inputs.SAFETY_BUFFER * inputs.Spike_Multiplier, 'req/s', 'Raw_RPS * SAFETY_BUFFER * Spike_Multiplier', '', ['Raw_RPS', 'SAFETY_BUFFER', 'Spike_Multiplier']);
  const dailyReqs = m(dau.value * inputs.ACTIONS_PER_SESSION, 'reqs/day', 'DAU * ACTIONS_PER_SESSION', '', ['DAU', 'ACTIONS_PER_SESSION']);
  
  // FRONTEND & CDN
  const dailyEgressGb = m(dailyReqs.value * inputs.AVG_RESPONSE_SIZE_KB / 1024 / 1024, 'GB/day', 'DailyReqs * AVG_RESPONSE_SIZE_KB / 1024^2', '', ['DailyReqs', 'AVG_RESPONSE_SIZE_KB']);
  const originTraffic = m(dailyEgressGb.value * (1 - (inputs.CACHE_HIT_PCT / 100)), 'GB/day', 'DailyEgressGB * (1 - CACHE_HIT_PCT/100)', '', ['DailyEgressGB', 'CACHE_HIT_PCT']);
  const edgeNodes = m(Math.ceil(peakRps.value / 5000), 'nodes', 'CEIL(Peak_RPS / 5000)', '', ['Peak_RPS']);
  const cdnBwGbps = m(peakRps.value * inputs.AVG_RESPONSE_SIZE_KB * 8 / 1024 / 1000, 'Gbps', 'Peak_RPS * AVG_RESPONSE_SIZE_KB * 8 / 1024 / 1000', '', ['Peak_RPS', 'AVG_RESPONSE_SIZE_KB']);

  // GATEWAY
  const effRps = m(inputs.Gateway_RPS_Capacity * (inputs.Gateway_CPU_Util_Target / 100), 'req/s', 'Capacity * CPU_Target%', '', ['Gateway_RPS_Capacity', 'Gateway_CPU_Util_Target']);
  const gatewayPods = m(Math.ceil(peakRps.value / effRps.value), 'pods', 'CEIL(Peak_RPS / Eff_RPS)', '', ['Peak_RPS', 'Eff_RPS']);
  const gatewayAzPods = m((Math.ceil(gatewayPods.value / 3) + 1) * 3, 'pods', '(CEIL(Pods/3) + 1) * 3', 'N+1 across 3 AZs', ['Pods']);

  // LB
  const concurrentConns = m(peakRps.value * 2, 'conns', 'Peak_RPS * 2', '', ['Peak_RPS']);

  // KAFKA
  const kafkaMbs = m(peakRps.value * inputs.AVG_MSG_SIZE_KB / 1024, 'MB/s', 'Peak_RPS * AVG_MSG_SIZE_KB / 1024', '', ['Peak_RPS', 'AVG_MSG_SIZE_KB']);
  const kafkaInternalMbs = m(kafkaMbs.value * inputs.REPLICATION_FACTOR, 'MB/s', 'MB/s * RF', '', ['MB/s', 'REPLICATION_FACTOR']);
  const partitionsProd = Math.ceil(kafkaMbs.value / inputs.PRODUCER_PER_PARTITION_MBPS);
  const partitionsCons = Math.ceil(kafkaMbs.value / inputs.CONSUMER_PER_PARTITION_MBPS);
  const rawPartitions = Math.max(partitionsProd, partitionsCons, inputs.MIN_BROKERS_HA);
  const kafkaPartitions = m(Math.ceil(rawPartitions / inputs.BROKER_MULTIPLE) * inputs.BROKER_MULTIPLE, 'parts', 'CEIL(Raw / Multiple) * Multiple', '', ['RawPartitions']);
  const kafkaBrokers = m(Math.max(inputs.MIN_BROKERS_HA, Math.ceil(kafkaInternalMbs.value / inputs.BROKER_CAPACITY_MBPS)), 'brokers', 'MAX(Min_HA, CEIL(Internal_MB/s / Capacity))', '', ['Internal_MB/s']);

  // DATABASE
  const dbQps = m(peakRps.value * inputs.QUERIES_PER_API_CALL, 'qps', 'Peak_RPS * QUERIES_PER_API_CALL', '', ['Peak_RPS', 'QUERIES_PER_API_CALL']);
  const readQps = m(dbQps.value * (inputs.READ_WRITE_SPLIT_READ_PCT / 100), 'qps', 'DB_QPS * Split%', '', ['DB_QPS', 'Split%']);
  const writeQps = m(dbQps.value - readQps.value, 'qps', 'DB_QPS - Read_QPS', '', ['DB_QPS', 'Read_QPS']);
  const actualDbQps = m((readQps.value * (1 - (inputs.CACHE_HIT_PCT / 100))) + writeQps.value, 'qps', 'Cache_Miss_Reads + Write_QPS', '', ['Read_QPS', 'Write_QPS', 'CACHE_HIT_PCT']);
  const dbIops = m(actualDbQps.value * inputs.DB_IOPS_PER_QUERY, 'iops', 'Actual_DB_QPS * DB_IOPS_PER_QUERY', '', ['Actual_DB_QPS', 'DB_IOPS_PER_QUERY']);
  
  const dailyWrites = writeQps.value * 86400;
  const hotRows = dailyWrites * inputs.DB_HOT_RETENTION_DAYS;
  const hotDataGb = m(hotRows * inputs.DB_ROW_SIZE_KB / 1024 / 1024, 'GB', 'Hot_Rows * DB_ROW_SIZE_KB / 1024^2', '', ['Write_QPS', 'DB_HOT_RETENTION_DAYS', 'DB_ROW_SIZE_KB']);
  const totalDbStorage = m(hotDataGb.value * 1.5 * 2, 'GB', 'Hot_Data * 1.5(idx) * 2(WAL)', '', ['Hot_Data_GB']);
  const dbReplicas = m(Math.ceil(readQps.value / inputs.DB_READ_REPLICA_QPS), 'nodes', 'CEIL(Read_QPS / Replica_Cap)', '', ['Read_QPS', 'DB_READ_REPLICA_QPS']);

  // CACHE
  const sessionGb = inputs.MAU * (inputs.DAU_PCT/100) * inputs.SESSION_SIZE_KB / 1024 / 1024;
  const catalogGb = inputs.CATALOG_SKUS * inputs.CATALOG_ENTRY_KB / 1024 / 1024;
  const hotSkuGb = inputs.HOT_SKU_COUNT * inputs.HOT_SKU_ENTRY_KB / 1024 / 1024;
  const cacheTotalGb = m((sessionGb + catalogGb + hotSkuGb) * inputs.CACHE_OVERHEAD_FACTOR, 'GB', '(Session + Catalog + HotSKU) * Overhead', '', ['MAU', 'DAU_PCT', 'SESSION_SIZE_KB', 'CATALOG_SKUS', 'HOT_SKU_COUNT']);
  const cacheOps = m(dbQps.value, 'ops/s', 'Same as DB QPS', '', ['DB_QPS']);
  const cacheNodes = m(Math.max(3, Math.ceil(cacheOps.value / inputs.REDIS_OPS_PER_NODE)), 'nodes', 'MAX(3, CEIL(Ops / Node_Cap))', '', ['Cache_Ops']);

  // DLQ
  const dlqMsgs = m(dailyReqs.value * 0.000001, 'msgs/day', 'Assuming 99% success ^ 3', '', ['DailyReqs']);
  const retryTime = m(inputs.Retry_Backoff_Base_sec * (1 + inputs.Retry_Backoff_Multiplier + inputs.Retry_Backoff_Multiplier**2), 's', 'Sum of backoffs', '', ['Base', 'Multiplier']);

  // SPIKES
  const targetPods = m(Math.ceil(peakRps.value / inputs.RPS_Per_App_Instance), 'pods', 'CEIL(Spike_RPS / Pod_Cap)', '', ['Peak_RPS', 'RPS_Per_App_Instance']);
  const shedThreshold = m(targetPods.value * inputs.RPS_Per_App_Instance * (inputs.Load_Shed_Threshold_Pct/100), 'req/s', 'Total_Cap * Shed%', '', ['Target_Pods', 'Load_Shed_Threshold_Pct']);

  // OBSERVABILITY
  const logsGbDay = m(dailyReqs.value * inputs.Log_Size_Per_Request_KB / 1024 / 1024, 'GB/day', 'DailyReqs * Log_Size / 1024^2', '', ['DailyReqs', 'Log_Size_Per_Request_KB']);
  const traceGbDay = m(dailyReqs.value * (inputs.Trace_Sample_Rate_Pct/100) * 5 / 1024 / 1024, 'GB/day', 'DailyReqs * Sample% * 5KB', '', ['DailyReqs', 'Trace_Sample_Rate_Pct']);

  // COST
  const costBrokers = kafkaBrokers.value * inputs.Cost_Broker_hr * inputs.Cost_Hours_Month;
  const costApp = (inputs.Order_Svc_Instances + inputs.Payment_Svc_Instances + inputs.Inventory_Svc_Instances + inputs.Notification_Svc_Instances + inputs.Search_Svc_Instances) * inputs.Cost_App_hr * inputs.Cost_Hours_Month;
  const costGateway = gatewayAzPods.value * inputs.Cost_Gateway_hr * inputs.Cost_Hours_Month;
  const costDb = (1 + dbReplicas.value) * inputs.Cost_DB_hr * inputs.Cost_Hours_Month;
  const costCache = inputs.REDIS_SHARDS * inputs.Cost_Redis_hr * inputs.Cost_Hours_Month;
  const totalCost = m(costBrokers + costApp + costGateway + costDb + costCache, 'USD/mo', 'SUM(Brokers, App, Gateway, DB, Cache)', '', ['Instances', 'Hourly_Costs']);

  return {
    dau, pcu, rawRps, peakRps, dailyReqs, dailyEgressGb, originTraffic, edgeNodes, cdnBwGbps,
    effRps, gatewayPods, gatewayAzPods, concurrentConns,
    kafkaMbs, kafkaInternalMbs, kafkaPartitions, kafkaBrokers,
    dbQps, readQps, writeQps, actualDbQps, dbIops, hotDataGb, totalDbStorage, dbReplicas,
    cacheTotalGb, cacheOps, cacheNodes,
    dlqMsgs, retryTime, targetPods, shedThreshold, logsGbDay, traceGbDay, totalCost
  };
}
"""

with open("src/lib/derivations.ts", "w") as f:
    f.write(derivations_ts)

store_ts = """import { create } from 'zustand';
import { Inputs, defaultInputs, getDerivations } from './derivations';

type Scenario = 'Normal' | 'Flash Sale' | 'Black Friday' | 'Cyber Monday' | 'DDoS';

interface StoreState {
  inputs: Inputs; scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  updateInput: (key: keyof Inputs, value: number) => void;
  resetToDefault: () => void;
  derivations: ReturnType<typeof getDerivations>;
}

const scenarioOverrides: Record<Scenario, Partial<Inputs>> = {
  'Normal': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 20, Spike_Multiplier: 1 },
  'Flash Sale': { DAU_PCT: 30, PEAK_CONCURRENT_PCT: 30, Spike_Multiplier: 5 },
  'Black Friday': { DAU_PCT: 50, PEAK_CONCURRENT_PCT: 50, Spike_Multiplier: 10 },
  'Cyber Monday': { DAU_PCT: 60, PEAK_CONCURRENT_PCT: 60, Spike_Multiplier: 15 },
  'DDoS': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 100, Spike_Multiplier: 100 },
};

export const useStore = create<StoreState>((set) => ({
  inputs: defaultInputs, scenario: 'Normal', derivations: getDerivations(defaultInputs),
  setScenario: (scenario) => set((state) => {
    const overrides = scenarioOverrides[scenario];
    const newInputs = { ...state.inputs, ...overrides };
    return { scenario, inputs: newInputs, derivations: getDerivations(newInputs) };
  }),
  updateInput: (key, value) => set((state) => {
    const newInputs = { ...state.inputs, [key]: value };
    return { inputs: newInputs, derivations: getDerivations(newInputs) };
  }),
  resetToDefault: () => set(() => ({ inputs: defaultInputs, scenario: 'Normal', derivations: getDerivations(defaultInputs) })),
}));
"""

with open("src/lib/store.ts", "w") as f:
    f.write(store_ts)

def page_template(title, description, metrics_html):
    return f"""'use client';
import {{ useStore }} from '../../lib/store';
import {{ Metric }} from '../../components/Metric';

export default function Page() {{
  const {{ derivations }} = useStore();
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 border-b-2 border-gray-300 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight capitalize">{title}</h1>
        <p className="text-xs text-gray-600 font-sans">{description}</p>
      </div>
      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-6 space-y-4 font-sans">
        {metrics_html}
      </div>
    </div>
  );
}}"""

def metric_row(label, key):
    return f"""<div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">{label}</span>
          <Metric name="{label}" metric={{derivations.{key}}} />
        </div>"""

pages = {
    "frontend": ("Frontend & CDN", "Client-side, asset sizing, CDN edge caching.", 
                 metric_row("Daily Egress GB", "dailyEgressGb") + metric_row("Origin Traffic GB", "originTraffic") + metric_row("CDN Edge Nodes", "edgeNodes") + metric_row("CDN Bandwidth (Gbps)", "cdnBwGbps")),
    "gateway": ("API Gateway", "Gateway, rate limiting, auth sizing.",
                 metric_row("Effective RPS / Pod", "effRps") + metric_row("Gateway Pods (Raw)", "gatewayPods") + metric_row("Gateway Pods (N+1 AZ)", "gatewayAzPods")),
    "lb": ("Load Balancer", "L4/L7 LB connection math.",
           metric_row("Concurrent Connections", "concurrentConns")),
    "kafka": ("Kafka Design", "Brokers, partitions, KRaft sizing.",
              metric_row("Kafka Throughput (MB/s)", "kafkaMbs") + metric_row("Internal Replication (MB/s)", "kafkaInternalMbs") + metric_row("Total Partitions", "kafkaPartitions") + metric_row("Total Brokers", "kafkaBrokers")),
    "db": ("Database Design", "PostgreSQL QPS, IOPS, and storage.",
           metric_row("Raw DB QPS", "dbQps") + metric_row("Actual Disk QPS (post-cache)", "actualDbQps") + metric_row("IOPS Required", "dbIops") + metric_row("Hot Data Storage (GB)", "hotDataGb") + metric_row("Total Storage w/ Indexes & WAL", "totalDbStorage") + metric_row("Read Replicas", "dbReplicas")),
    "cache": ("Cache (Redis)", "Redis cluster sizing.",
              metric_row("Total Cache Size (GB)", "cacheTotalGb") + metric_row("Cache Ops/sec", "cacheOps") + metric_row("Redis Shards", "cacheNodes")),
    "dlq": ("DLQ & Error Handling", "Retry backoff and reprocessing logic.",
            metric_row("Total Retry Time (s)", "retryTime") + metric_row("Daily Messages to DLQ", "dlqMsgs")),
    "spikes": ("Traffic Spikes & DDoS", "Auto-scaling and load shedding thresholds.",
               metric_row("Target App Pods", "targetPods") + metric_row("Shed Threshold (RPS)", "shedThreshold")),
    "observability": ("Observability", "Metrics, logs, traces volume.",
                      metric_row("Daily Logs Volume (GB)", "logsGbDay") + metric_row("Daily Traces Volume (GB)", "traceGbDay")),
    "cost": ("Cost Estimator", "Monthly infrastructure cost breakdown.",
             metric_row("Grand Total Infra Cost", "totalCost"))
}

for route, (title, desc, m_html) in pages.items():
    with open(f"src/app/{route}/page.tsx", "w") as f:
        f.write(page_template(title, desc, m_html))

print("All components generated.")
