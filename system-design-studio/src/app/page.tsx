'use client';
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

        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block B - Traffic Shape</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="READ_WRITE_SPLIT_READ_PCT">READ_WRITE_SPLIT_READ_PCT</label>
              <input type="number" step="any" value={inputs.READ_WRITE_SPLIT_READ_PCT} onChange={(e) => updateInput('READ_WRITE_SPLIT_READ_PCT', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CACHE_HIT_PCT">CACHE_HIT_PCT</label>
              <input type="number" step="any" value={inputs.CACHE_HIT_PCT} onChange={(e) => updateInput('CACHE_HIT_PCT', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="QUERIES_PER_API_CALL">QUERIES_PER_API_CALL</label>
              <input type="number" step="any" value={inputs.QUERIES_PER_API_CALL} onChange={(e) => updateInput('QUERIES_PER_API_CALL', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="AVG_RESPONSE_SIZE_KB">AVG_RESPONSE_SIZE_KB</label>
              <input type="number" step="any" value={inputs.AVG_RESPONSE_SIZE_KB} onChange={(e) => updateInput('AVG_RESPONSE_SIZE_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="AVG_REQUEST_SIZE_KB">AVG_REQUEST_SIZE_KB</label>
              <input type="number" step="any" value={inputs.AVG_REQUEST_SIZE_KB} onChange={(e) => updateInput('AVG_REQUEST_SIZE_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block C - Kafka / Messaging</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="AVG_MSG_SIZE_KB">AVG_MSG_SIZE_KB</label>
              <input type="number" step="any" value={inputs.AVG_MSG_SIZE_KB} onChange={(e) => updateInput('AVG_MSG_SIZE_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="REPLICATION_FACTOR">REPLICATION_FACTOR</label>
              <input type="number" step="any" value={inputs.REPLICATION_FACTOR} onChange={(e) => updateInput('REPLICATION_FACTOR', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="PRODUCER_PER_PARTITION_MBPS">PRODUCER_PER_PARTITION_MBPS</label>
              <input type="number" step="any" value={inputs.PRODUCER_PER_PARTITION_MBPS} onChange={(e) => updateInput('PRODUCER_PER_PARTITION_MBPS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CONSUMER_PER_PARTITION_MBPS">CONSUMER_PER_PARTITION_MBPS</label>
              <input type="number" step="any" value={inputs.CONSUMER_PER_PARTITION_MBPS} onChange={(e) => updateInput('CONSUMER_PER_PARTITION_MBPS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="BROKER_CAPACITY_MBPS">BROKER_CAPACITY_MBPS</label>
              <input type="number" step="any" value={inputs.BROKER_CAPACITY_MBPS} onChange={(e) => updateInput('BROKER_CAPACITY_MBPS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="MIN_BROKERS_HA">MIN_BROKERS_HA</label>
              <input type="number" step="any" value={inputs.MIN_BROKERS_HA} onChange={(e) => updateInput('MIN_BROKERS_HA', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="BROKER_MULTIPLE">BROKER_MULTIPLE</label>
              <input type="number" step="any" value={inputs.BROKER_MULTIPLE} onChange={(e) => updateInput('BROKER_MULTIPLE', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="TOPIC_RETENTION_DAYS">TOPIC_RETENTION_DAYS</label>
              <input type="number" step="any" value={inputs.TOPIC_RETENTION_DAYS} onChange={(e) => updateInput('TOPIC_RETENTION_DAYS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block D - Database</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_ROW_SIZE_KB">DB_ROW_SIZE_KB</label>
              <input type="number" step="any" value={inputs.DB_ROW_SIZE_KB} onChange={(e) => updateInput('DB_ROW_SIZE_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_HOT_RETENTION_DAYS">DB_HOT_RETENTION_DAYS</label>
              <input type="number" step="any" value={inputs.DB_HOT_RETENTION_DAYS} onChange={(e) => updateInput('DB_HOT_RETENTION_DAYS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_CONN_MULTIPLIER">DB_CONN_MULTIPLIER</label>
              <input type="number" step="any" value={inputs.DB_CONN_MULTIPLIER} onChange={(e) => updateInput('DB_CONN_MULTIPLIER', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_CONN_OVERHEAD">DB_CONN_OVERHEAD</label>
              <input type="number" step="any" value={inputs.DB_CONN_OVERHEAD} onChange={(e) => updateInput('DB_CONN_OVERHEAD', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_READ_REPLICA_QPS">DB_READ_REPLICA_QPS</label>
              <input type="number" step="any" value={inputs.DB_READ_REPLICA_QPS} onChange={(e) => updateInput('DB_READ_REPLICA_QPS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_SSD_IOPS_PER_GB">DB_SSD_IOPS_PER_GB</label>
              <input type="number" step="any" value={inputs.DB_SSD_IOPS_PER_GB} onChange={(e) => updateInput('DB_SSD_IOPS_PER_GB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_IOPS_PER_QUERY">DB_IOPS_PER_QUERY</label>
              <input type="number" step="any" value={inputs.DB_IOPS_PER_QUERY} onChange={(e) => updateInput('DB_IOPS_PER_QUERY', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block E - Cache</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="SESSION_SIZE_KB">SESSION_SIZE_KB</label>
              <input type="number" step="any" value={inputs.SESSION_SIZE_KB} onChange={(e) => updateInput('SESSION_SIZE_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CATALOG_SKUS">CATALOG_SKUS</label>
              <input type="number" step="any" value={inputs.CATALOG_SKUS} onChange={(e) => updateInput('CATALOG_SKUS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CATALOG_ENTRY_KB">CATALOG_ENTRY_KB</label>
              <input type="number" step="any" value={inputs.CATALOG_ENTRY_KB} onChange={(e) => updateInput('CATALOG_ENTRY_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="HOT_SKU_COUNT">HOT_SKU_COUNT</label>
              <input type="number" step="any" value={inputs.HOT_SKU_COUNT} onChange={(e) => updateInput('HOT_SKU_COUNT', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="HOT_SKU_ENTRY_KB">HOT_SKU_ENTRY_KB</label>
              <input type="number" step="any" value={inputs.HOT_SKU_ENTRY_KB} onChange={(e) => updateInput('HOT_SKU_ENTRY_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CACHE_OVERHEAD_FACTOR">CACHE_OVERHEAD_FACTOR</label>
              <input type="number" step="any" value={inputs.CACHE_OVERHEAD_FACTOR} onChange={(e) => updateInput('CACHE_OVERHEAD_FACTOR', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="REDIS_SHARDS">REDIS_SHARDS</label>
              <input type="number" step="any" value={inputs.REDIS_SHARDS} onChange={(e) => updateInput('REDIS_SHARDS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="REDIS_HEADROOM">REDIS_HEADROOM</label>
              <input type="number" step="any" value={inputs.REDIS_HEADROOM} onChange={(e) => updateInput('REDIS_HEADROOM', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="REDIS_OPS_PER_NODE">REDIS_OPS_PER_NODE</label>
              <input type="number" step="any" value={inputs.REDIS_OPS_PER_NODE} onChange={(e) => updateInput('REDIS_OPS_PER_NODE', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block F - Application Servers</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cores_Per_App_Instance">Cores_Per_App_Instance</label>
              <input type="number" step="any" value={inputs.Cores_Per_App_Instance} onChange={(e) => updateInput('Cores_Per_App_Instance', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="RAM_Per_App_Instance_GB">RAM_Per_App_Instance_GB</label>
              <input type="number" step="any" value={inputs.RAM_Per_App_Instance_GB} onChange={(e) => updateInput('RAM_Per_App_Instance_GB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Order_Svc_Instances">Order_Svc_Instances</label>
              <input type="number" step="any" value={inputs.Order_Svc_Instances} onChange={(e) => updateInput('Order_Svc_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Payment_Svc_Instances">Payment_Svc_Instances</label>
              <input type="number" step="any" value={inputs.Payment_Svc_Instances} onChange={(e) => updateInput('Payment_Svc_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Inventory_Svc_Instances">Inventory_Svc_Instances</label>
              <input type="number" step="any" value={inputs.Inventory_Svc_Instances} onChange={(e) => updateInput('Inventory_Svc_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Notification_Svc_Instances">Notification_Svc_Instances</label>
              <input type="number" step="any" value={inputs.Notification_Svc_Instances} onChange={(e) => updateInput('Notification_Svc_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Search_Svc_Instances">Search_Svc_Instances</label>
              <input type="number" step="any" value={inputs.Search_Svc_Instances} onChange={(e) => updateInput('Search_Svc_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Gateway_Instances">Gateway_Instances</label>
              <input type="number" step="any" value={inputs.Gateway_Instances} onChange={(e) => updateInput('Gateway_Instances', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="RPS_Per_App_Instance">RPS_Per_App_Instance</label>
              <input type="number" step="any" value={inputs.RPS_Per_App_Instance} onChange={(e) => updateInput('RPS_Per_App_Instance', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block G - API Gateway / Edge</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Gateway_RPS_Capacity">Gateway_RPS_Capacity</label>
              <input type="number" step="any" value={inputs.Gateway_RPS_Capacity} onChange={(e) => updateInput('Gateway_RPS_Capacity', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Gateway_CPU_Util_Target">Gateway_CPU_Util_Target</label>
              <input type="number" step="any" value={inputs.Gateway_CPU_Util_Target} onChange={(e) => updateInput('Gateway_CPU_Util_Target', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Gateway_Overhead_ms">Gateway_Overhead_ms</label>
              <input type="number" step="any" value={inputs.Gateway_Overhead_ms} onChange={(e) => updateInput('Gateway_Overhead_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="SSL_Handshake_ms">SSL_Handshake_ms</label>
              <input type="number" step="any" value={inputs.SSL_Handshake_ms} onChange={(e) => updateInput('SSL_Handshake_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="SSL_Rate_Pct">SSL_Rate_Pct</label>
              <input type="number" step="any" value={inputs.SSL_Rate_Pct} onChange={(e) => updateInput('SSL_Rate_Pct', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="WAF_Rules">WAF_Rules</label>
              <input type="number" step="any" value={inputs.WAF_Rules} onChange={(e) => updateInput('WAF_Rules', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Rate_Limit_Anonymous_RPM">Rate_Limit_Anonymous_RPM</label>
              <input type="number" step="any" value={inputs.Rate_Limit_Anonymous_RPM} onChange={(e) => updateInput('Rate_Limit_Anonymous_RPM', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Rate_Limit_User_RPM">Rate_Limit_User_RPM</label>
              <input type="number" step="any" value={inputs.Rate_Limit_User_RPM} onChange={(e) => updateInput('Rate_Limit_User_RPM', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Rate_Limit_Premium_RPM">Rate_Limit_Premium_RPM</label>
              <input type="number" step="any" value={inputs.Rate_Limit_Premium_RPM} onChange={(e) => updateInput('Rate_Limit_Premium_RPM', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block H - Network / Latency</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DNS_Lookup_ms">DNS_Lookup_ms</label>
              <input type="number" step="any" value={inputs.DNS_Lookup_ms} onChange={(e) => updateInput('DNS_Lookup_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CDN_Edge_ms">CDN_Edge_ms</label>
              <input type="number" step="any" value={inputs.CDN_Edge_ms} onChange={(e) => updateInput('CDN_Edge_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="CDN_Origin_Miss_ms">CDN_Origin_Miss_ms</label>
              <input type="number" step="any" value={inputs.CDN_Origin_Miss_ms} onChange={(e) => updateInput('CDN_Origin_Miss_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="LB_Forward_ms">LB_Forward_ms</label>
              <input type="number" step="any" value={inputs.LB_Forward_ms} onChange={(e) => updateInput('LB_Forward_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Service_Process_ms">Service_Process_ms</label>
              <input type="number" step="any" value={inputs.Service_Process_ms} onChange={(e) => updateInput('Service_Process_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DB_Query_ms">DB_Query_ms</label>
              <input type="number" step="any" value={inputs.DB_Query_ms} onChange={(e) => updateInput('DB_Query_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Redis_Query_ms">Redis_Query_ms</label>
              <input type="number" step="any" value={inputs.Redis_Query_ms} onChange={(e) => updateInput('Redis_Query_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="SLA_P95_ms">SLA_P95_ms</label>
              <input type="number" step="any" value={inputs.SLA_P95_ms} onChange={(e) => updateInput('SLA_P95_ms', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block I - DLQ / Retry</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Max_Retries">Max_Retries</label>
              <input type="number" step="any" value={inputs.Max_Retries} onChange={(e) => updateInput('Max_Retries', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Retry_Backoff_Base_sec">Retry_Backoff_Base_sec</label>
              <input type="number" step="any" value={inputs.Retry_Backoff_Base_sec} onChange={(e) => updateInput('Retry_Backoff_Base_sec', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Retry_Backoff_Multiplier">Retry_Backoff_Multiplier</label>
              <input type="number" step="any" value={inputs.Retry_Backoff_Multiplier} onChange={(e) => updateInput('Retry_Backoff_Multiplier', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DLQ_Retention_Days">DLQ_Retention_Days</label>
              <input type="number" step="any" value={inputs.DLQ_Retention_Days} onChange={(e) => updateInput('DLQ_Retention_Days', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Reprocess_Batch_Size">Reprocess_Batch_Size</label>
              <input type="number" step="any" value={inputs.Reprocess_Batch_Size} onChange={(e) => updateInput('Reprocess_Batch_Size', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Reprocess_Interval_min">Reprocess_Interval_min</label>
              <input type="number" step="any" value={inputs.Reprocess_Interval_min} onChange={(e) => updateInput('Reprocess_Interval_min', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block J - Traffic Spike / DDoS</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Spike_Multiplier">Spike_Multiplier</label>
              <input type="number" step="any" value={inputs.Spike_Multiplier} onChange={(e) => updateInput('Spike_Multiplier', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner disabled:bg-[#f0f0f0]" disabled/>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="DDoS_Peak_RPS">DDoS_Peak_RPS</label>
              <input type="number" step="any" value={inputs.DDoS_Peak_RPS} onChange={(e) => updateInput('DDoS_Peak_RPS', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Auto_Scale_Trigger_CPU">Auto_Scale_Trigger_CPU</label>
              <input type="number" step="any" value={inputs.Auto_Scale_Trigger_CPU} onChange={(e) => updateInput('Auto_Scale_Trigger_CPU', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Auto_Scale_Cooldown_sec">Auto_Scale_Cooldown_sec</label>
              <input type="number" step="any" value={inputs.Auto_Scale_Cooldown_sec} onChange={(e) => updateInput('Auto_Scale_Cooldown_sec', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Load_Shed_Threshold_Pct">Load_Shed_Threshold_Pct</label>
              <input type="number" step="any" value={inputs.Load_Shed_Threshold_Pct} onChange={(e) => updateInput('Load_Shed_Threshold_Pct', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block K - Observability</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Metrics_Retention_Days">Metrics_Retention_Days</label>
              <input type="number" step="any" value={inputs.Metrics_Retention_Days} onChange={(e) => updateInput('Metrics_Retention_Days', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Log_Retention_Days">Log_Retention_Days</label>
              <input type="number" step="any" value={inputs.Log_Retention_Days} onChange={(e) => updateInput('Log_Retention_Days', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Trace_Sample_Rate_Pct">Trace_Sample_Rate_Pct</label>
              <input type="number" step="any" value={inputs.Trace_Sample_Rate_Pct} onChange={(e) => updateInput('Trace_Sample_Rate_Pct', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Log_Size_Per_Request_KB">Log_Size_Per_Request_KB</label>
              <input type="number" step="any" value={inputs.Log_Size_Per_Request_KB} onChange={(e) => updateInput('Log_Size_Per_Request_KB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Block L - Cost</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_Broker_hr">Cost_Broker_hr</label>
              <input type="number" step="any" value={inputs.Cost_Broker_hr} onChange={(e) => updateInput('Cost_Broker_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_App_hr">Cost_App_hr</label>
              <input type="number" step="any" value={inputs.Cost_App_hr} onChange={(e) => updateInput('Cost_App_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_DB_hr">Cost_DB_hr</label>
              <input type="number" step="any" value={inputs.Cost_DB_hr} onChange={(e) => updateInput('Cost_DB_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_Redis_hr">Cost_Redis_hr</label>
              <input type="number" step="any" value={inputs.Cost_Redis_hr} onChange={(e) => updateInput('Cost_Redis_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_Gateway_hr">Cost_Gateway_hr</label>
              <input type="number" step="any" value={inputs.Cost_Gateway_hr} onChange={(e) => updateInput('Cost_Gateway_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_NLB_hr">Cost_NLB_hr</label>
              <input type="number" step="any" value={inputs.Cost_NLB_hr} onChange={(e) => updateInput('Cost_NLB_hr', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_Hours_Month">Cost_Hours_Month</label>
              <input type="number" step="any" value={inputs.Cost_Hours_Month} onChange={(e) => updateInput('Cost_Hours_Month', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_Egress_Per_GB">Cost_Egress_Per_GB</label>
              <input type="number" step="any" value={inputs.Cost_Egress_Per_GB} onChange={(e) => updateInput('Cost_Egress_Per_GB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_S3_Per_TB">Cost_S3_Per_TB</label>
              <input type="number" step="any" value={inputs.Cost_S3_Per_TB} onChange={(e) => updateInput('Cost_S3_Per_TB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold text-gray-700 tracking-tight truncate" title="Cost_CDN_Per_GB">Cost_CDN_Per_GB</label>
              <input type="number" step="any" value={inputs.Cost_CDN_Per_GB} onChange={(e) => updateInput('Cost_CDN_Per_GB', Number(e.target.value))} className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 shadow-inner " />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
