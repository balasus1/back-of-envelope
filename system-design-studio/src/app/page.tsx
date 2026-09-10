'use client';
import { useStore } from '../lib/store';

export default function ControlPanel() {
  const { inputs, scenario, setScenario, updateInput, resetToDefault } = useStore();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Master Control Panel</h1>
          <p className="text-slate-400">Configure inputs for your system design calculations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={scenario}
            onChange={(e) => setScenario(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Normal">Normal</option>
            <option value="Flash Sale">Flash Sale</option>
            <option value="Black Friday">Black Friday</option>
            <option value="Cyber Monday">Cyber Monday</option>
            <option value="DDoS">DDoS</option>
          </select>
          
          <button 
            onClick={resetToDefault}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-white transition-colors"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Block A - User Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Monthly Active Users (MAU)</label>
              <input 
                type="number" 
                value={inputs.MAU}
                onChange={(e) => updateInput('MAU', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">DAU Percentage (%)</label>
              <input 
                type="number" 
                value={inputs.DAU_PCT}
                onChange={(e) => updateInput('DAU_PCT', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                disabled={scenario !== 'Normal'}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Peak Concurrent Percentage (%)</label>
              <input 
                type="number" 
                value={inputs.PEAK_CONCURRENT_PCT}
                onChange={(e) => updateInput('PEAK_CONCURRENT_PCT', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                disabled={scenario !== 'Normal'}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Actions Per Session</label>
              <input 
                type="number" 
                value={inputs.ACTIONS_PER_SESSION}
                onChange={(e) => updateInput('ACTIONS_PER_SESSION', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Peak Duration (Seconds)</label>
              <input 
                type="number" 
                value={inputs.PEAK_DURATION_SEC}
                onChange={(e) => updateInput('PEAK_DURATION_SEC', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Safety Buffer</label>
              <input 
                type="number" 
                value={inputs.SAFETY_BUFFER}
                onChange={(e) => updateInput('SAFETY_BUFFER', Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Spike Multiplier (Scenario-driven)</label>
              <input 
                type="number" 
                value={inputs.SPIKE_MULTIPLIER}
                disabled
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>

          </div>
        </section>
        
        <div className="text-center p-4 text-slate-500 italic">
          Other input blocks (B-L) will go here incrementally.
        </div>
      </div>
    </div>
  );
}
