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

      <div className="space-y-4">
        <section className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4">
          <div className="flex justify-between items-center border-b border-[#e0e0e0] pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide font-sans">Block A - User Metrics</h2>
            <span className="text-[10px] text-gray-500 italic">Adjusts the top of the funnel</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
            
            <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Monthly Active Users (MAU)</label>
              <input 
                type="number" 
                value={inputs.MAU}
                onChange={(e) => updateInput('MAU', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner"
              />
              <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Base user count before any percentage slices.</span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">DAU Percentage (%)</label>
              <input 
                type="number" 
                value={inputs.DAU_PCT}
                onChange={(e) => updateInput('DAU_PCT', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner disabled:bg-[#f0f0f0] disabled:text-gray-500"
                disabled={scenario !== 'Normal'}
              />
            </div>
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Peak Concurrent (%)</label>
              <input 
                type="number" 
                value={inputs.PEAK_CONCURRENT_PCT}
                onChange={(e) => updateInput('PEAK_CONCURRENT_PCT', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner disabled:bg-[#f0f0f0] disabled:text-gray-500"
                disabled={scenario !== 'Normal'}
              />
            </div>
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Actions / Session</label>
              <input 
                type="number" 
                value={inputs.ACTIONS_PER_SESSION}
                onChange={(e) => updateInput('ACTIONS_PER_SESSION', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner"
              />
              <span className="text-[9px] text-gray-500 leading-tight mt-0.5">API requests per user flow.</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Peak Duration (s)</label>
              <input 
                type="number" 
                value={inputs.PEAK_DURATION_SEC}
                onChange={(e) => updateInput('PEAK_DURATION_SEC', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Safety Buffer</label>
              <input 
                type="number" 
                value={inputs.SAFETY_BUFFER}
                onChange={(e) => updateInput('SAFETY_BUFFER', Number(e.target.value))}
                className="bg-white border border-[#ccc] rounded px-2 py-1 text-[13px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans shadow-inner"
              />
              <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Multiplier for capacity headroom.</span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-gray-700 font-sans tracking-tight">Spike Multiplier</label>
              <input 
                type="number" 
                value={inputs.SPIKE_MULTIPLIER}
                disabled
                className="bg-[#f0f0f0] border border-[#d4d4d4] rounded px-2 py-1 text-[13px] text-gray-500 cursor-not-allowed font-sans shadow-inner"
              />
              <span className="text-[9px] text-gray-500 leading-tight mt-0.5 italic">Managed by Scenario.</span>
            </div>

          </div>
        </section>
        
        <div className="text-center p-3 text-[11px] text-gray-500 italic border border-dashed border-[#ccc] rounded">
          Further input blocks (B-L) will go here incrementally.
        </div>
      </div>
    </div>
  );
}
