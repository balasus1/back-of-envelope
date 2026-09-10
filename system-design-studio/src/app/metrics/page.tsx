'use client';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';

export default function MetricsPage() {
  const { inputs, derivations } = useStore();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Metrics Funnel</h1>
        <p className="text-slate-400">MAU &rarr; DAU &rarr; PCU &rarr; RPS Funnel and calculated results.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 flex flex-col items-center">
        
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <div className="w-full bg-blue-900/30 border border-blue-500/50 rounded-t-lg py-4 text-center">
            <div className="text-sm text-blue-300 font-medium mb-1">Monthly Active Users (MAU)</div>
            <div className="text-2xl font-bold text-white">{inputs.MAU.toLocaleString()} users</div>
          </div>
          
          <div className="w-4 h-6 border-l-2 border-r-2 border-slate-700"></div>
          
          <div className="w-11/12 bg-indigo-900/30 border border-indigo-500/50 py-4 text-center">
            <div className="text-sm text-indigo-300 font-medium mb-1">Daily Active Users (DAU)</div>
            <Metric name="DAU" metric={derivations.dau} className="scale-110" />
          </div>
          
          <div className="w-4 h-6 border-l-2 border-r-2 border-slate-700"></div>
          
          <div className="w-5/6 bg-purple-900/30 border border-purple-500/50 py-4 text-center">
            <div className="text-sm text-purple-300 font-medium mb-1">Peak Concurrent Users (PCU)</div>
            <Metric name="PCU" metric={derivations.pcu} className="scale-110" />
          </div>
          
          <div className="w-4 h-6 border-l-2 border-r-2 border-slate-700"></div>
          
          <div className="w-2/3 bg-pink-900/30 border border-pink-500/50 py-4 text-center">
            <div className="text-sm text-pink-300 font-medium mb-1">Raw RPS</div>
            <Metric name="Raw_RPS" metric={derivations.rawRps} className="scale-110" />
          </div>
          
          <div className="w-4 h-6 border-l-2 border-r-2 border-slate-700"></div>
          
          <div className="w-1/2 bg-rose-900/50 border border-rose-500/80 rounded-b-lg py-6 text-center shadow-[0_0_30px_rgba(225,29,72,0.3)]">
            <div className="text-sm text-rose-300 font-medium mb-1">Peak API RPS</div>
            <Metric name="Peak_RPS" metric={derivations.peakRps} className="scale-125" />
          </div>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Metric</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Formula</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white">DAU</td>
              <td className="px-6 py-4">{derivations.dau.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.dau.unit}</td>
              <td className="px-6 py-4 font-mono text-xs text-green-400">{derivations.dau.formulaText}</td>
            </tr>
            <tr className="hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white">PCU</td>
              <td className="px-6 py-4">{derivations.pcu.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.pcu.unit}</td>
              <td className="px-6 py-4 font-mono text-xs text-green-400">{derivations.pcu.formulaText}</td>
            </tr>
            <tr className="hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white">Raw_RPS</td>
              <td className="px-6 py-4">{derivations.rawRps.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.rawRps.unit}</td>
              <td className="px-6 py-4 font-mono text-xs text-green-400">{derivations.rawRps.formulaText}</td>
            </tr>
            <tr className="hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white">Peak_RPS</td>
              <td className="px-6 py-4 font-bold text-rose-400">{derivations.peakRps.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.peakRps.unit}</td>
              <td className="px-6 py-4 font-mono text-xs text-green-400">{derivations.peakRps.formulaText}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
