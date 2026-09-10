import json

blocks = {
    "Block B - Traffic Shape": ["READ_WRITE_SPLIT_READ_PCT", "CACHE_HIT_PCT", "QUERIES_PER_API_CALL", "AVG_RESPONSE_SIZE_KB", "AVG_REQUEST_SIZE_KB"],
    "Block C - Kafka / Messaging": ["AVG_MSG_SIZE_KB", "REPLICATION_FACTOR", "PRODUCER_PER_PARTITION_MBPS", "CONSUMER_PER_PARTITION_MBPS", "BROKER_CAPACITY_MBPS", "MIN_BROKERS_HA", "BROKER_MULTIPLE", "TOPIC_RETENTION_DAYS"],
    "Block D - Database": ["DB_ROW_SIZE_KB", "DB_HOT_RETENTION_DAYS", "DB_CONN_MULTIPLIER", "DB_CONN_OVERHEAD", "DB_READ_REPLICA_QPS", "DB_SSD_IOPS_PER_GB", "DB_IOPS_PER_QUERY"],
    "Block E - Cache": ["SESSION_SIZE_KB", "CATALOG_SKUS", "CATALOG_ENTRY_KB", "HOT_SKU_COUNT", "HOT_SKU_ENTRY_KB", "CACHE_OVERHEAD_FACTOR", "REDIS_SHARDS", "REDIS_HEADROOM", "REDIS_OPS_PER_NODE"],
    "Block F - Application Servers": ["Cores_Per_App_Instance", "RAM_Per_App_Instance_GB", "Order_Svc_Instances", "Payment_Svc_Instances", "Inventory_Svc_Instances", "Notification_Svc_Instances", "Search_Svc_Instances", "Gateway_Instances", "RPS_Per_App_Instance"],
    "Block G - API Gateway / Edge": ["Gateway_RPS_Capacity", "Gateway_CPU_Util_Target", "Gateway_Overhead_ms", "SSL_Handshake_ms", "SSL_Rate_Pct", "WAF_Rules", "Rate_Limit_Anonymous_RPM", "Rate_Limit_User_RPM", "Rate_Limit_Premium_RPM"],
    "Block H - Network / Latency": ["DNS_Lookup_ms", "CDN_Edge_ms", "CDN_Origin_Miss_ms", "LB_Forward_ms", "Service_Process_ms", "DB_Query_ms", "Redis_Query_ms", "SLA_P95_ms"],
    "Block I - DLQ / Retry": ["Max_Retries", "Retry_Backoff_Base_sec", "Retry_Backoff_Multiplier", "DLQ_Retention_Days", "Reprocess_Batch_Size", "Reprocess_Interval_min"],
    "Block J - Traffic Spike / DDoS": ["Spike_Multiplier", "DDoS_Peak_RPS", "Auto_Scale_Trigger_CPU", "Auto_Scale_Cooldown_sec", "Load_Shed_Threshold_Pct"],
    "Block K - Observability": ["Metrics_Retention_Days", "Log_Retention_Days", "Trace_Sample_Rate_Pct", "Log_Size_Per_Request_KB"],
    "Block L - Cost": ["Cost_Broker_hr", "Cost_App_hr", "Cost_DB_hr", "Cost_Redis_hr", "Cost_Gateway_hr", "Cost_NLB_hr", "Cost_Hours_Month", "Cost_Egress_Per_GB", "Cost_S3_Per_TB", "Cost_CDN_Per_GB"]
}

html = """'use client';
import { useStore } from '../lib/store';

export default function ControlPanel() {
  const { inputs, scenario, setScenario, updateInput, resetToDefault } = useStore();

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight">Master Control Panel</h1>
          <p className="text-xs text-gray-600 font-sans">Configure base inputs. Changes propagate instantly to all derivations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase text-gray-500 font-semibold mb-0.5 tracking-wider">Scenario Override</label>
            <select 
              value={scenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="bg-white border border-[#ccc] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-gray-500 shadow-sm font-sans"
            >
              <option value="Normal">Normal</option>
              <option value="Flash Sale">Flash Sale</option>
              <option value="Black Friday">Black Friday</option>
              <option value="Cyber Monday">Cyber Monday</option>
              <option value="DDoS">DDoS</option>
            </select>
          </div>
          
          <button 
            onClick={resetToDefault}
            className="mt-4 bg-[#e0e0e0] border border-[#bbb] hover:bg-[#d0d0d0] px-3 py-1 rounded text-xs text-gray-800 transition-colors shadow-sm font-medium"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="space-y-4 font-sans">
        {/* Block A is customized */}
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="flex justify-between items-center border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide font-sans">Block A - User Metrics</h2>
            <span className="text-[10px] text-gray-500 italic">Adjusts the top of the funnel</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">MAU</label>
              <input type="number" value={inputs.MAU} onChange={(e) => updateInput('MAU', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">DAU %</label>
              <input type="number" value={inputs.DAU_PCT} disabled={scenario !== 'Normal'} onChange={(e) => updateInput('DAU_PCT', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner disabled:bg-[#f0f0f0]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Peak Concurrent %</label>
              <input type="number" value={inputs.PEAK_CONCURRENT_PCT} disabled={scenario !== 'Normal'} onChange={(e) => updateInput('PEAK_CONCURRENT_PCT', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner disabled:bg-[#f0f0f0]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Actions/Session</label>
              <input type="number" value={inputs.ACTIONS_PER_SESSION} onChange={(e) => updateInput('ACTIONS_PER_SESSION', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Peak Duration (s)</label>
              <input type="number" value={inputs.PEAK_DURATION_SEC} onChange={(e) => updateInput('PEAK_DURATION_SEC', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Safety Buffer</label>
              <input type="number" value={inputs.SAFETY_BUFFER} onChange={(e) => updateInput('SAFETY_BUFFER', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Spike Multiplier</label>
              <input type="number" value={inputs.Spike_Multiplier} disabled className="bg-[#f0f0f0] border border-[#d4d4d4] rounded px-2 py-1 text-[13px] text-gray-500 cursor-not-allowed shadow-inner" />
            </div>
          </div>
        </section>
"""

for title, keys in blocks.items():
    html += f"""
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">"""
    
    for key in keys:
        disabled_str = "disabled" if key == "Spike_Multiplier" else ""
        class_str = "disabled:bg-[#f0f0f0]" if disabled_str else ""
        html += f"""
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="{key}">{key}</label>
              <input type="number" step="any" value={{inputs.{key}}} onChange={{(e) => updateInput('{key}', Number(e.target.value))}} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner {class_str}" {disabled_str}/>
            </div>"""
    
    html += """
          </div>
        </section>"""

html += """
      </div>
    </div>
  );
}
"""

with open("src/app/page.tsx", "w") as f:
    f.write(html)
