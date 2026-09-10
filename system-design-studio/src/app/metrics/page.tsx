'use client';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';

export default function MetricsPage() {
  const { inputs, derivations } = useStore();

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 border-b-2 border-gray-300 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight">User Metrics Funnel</h1>
        <p className="text-xs text-gray-600 font-sans">MAU &rarr; DAU &rarr; PCU &rarr; RPS Funnel and calculated results.</p>
      </div>

      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-4 mb-6 flex flex-col items-center">
        
        <div className="flex flex-col items-center w-full max-w-sm">
          <div className="w-full bg-[#f0f0f0] border border-[#ccc] rounded-t py-2 text-center shadow-inner">
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Monthly Active Users (MAU)</div>
            <div className="text-base font-bold text-gray-900 font-serif">{inputs.MAU.toLocaleString()} users</div>
          </div>
          
          <div className="w-2 h-3 border-l border-r border-[#ccc] bg-[#fafafa]"></div>
          
          <div className="w-11/12 bg-[#ebebeb] border border-[#ccc] py-2 text-center shadow-inner">
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Daily Active Users (DAU)</div>
            <Metric name="DAU" metric={derivations.dau} />
          </div>
          
          <div className="w-2 h-3 border-l border-r border-[#ccc] bg-[#fafafa]"></div>
          
          <div className="w-5/6 bg-[#e6e6e6] border border-[#bbb] py-2 text-center shadow-inner">
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Peak Concurrent Users (PCU)</div>
            <Metric name="PCU" metric={derivations.pcu} />
          </div>
          
          <div className="w-2 h-3 border-l border-r border-[#ccc] bg-[#fafafa]"></div>
          
          <div className="w-2/3 bg-[#e0e0e0] border border-[#aaa] py-2 text-center shadow-inner">
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Raw RPS</div>
            <Metric name="Raw_RPS" metric={derivations.rawRps} />
          </div>
          
          <div className="w-2 h-3 border-l border-r border-[#ccc] bg-[#fafafa]"></div>
          
          <div className="w-1/2 bg-[#d4d4d4] border-2 border-gray-400 rounded-b py-3 text-center shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div className="text-[10px] text-gray-700 font-bold uppercase tracking-wider mb-1">Peak API RPS</div>
            <Metric name="Peak_RPS" metric={derivations.peakRps} className="scale-110" />
            <div className="text-[9px] text-gray-600 mt-1 italic">Includes Safety Buffer</div>
          </div>
        </div>

      </div>

      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm overflow-hidden font-sans">
        <table className="w-full text-left text-[13px] text-gray-800">
          <thead className="bg-[#efefef] text-gray-600 border-b border-[#ccc]">
            <tr>
              <th className="px-4 py-2 font-semibold uppercase tracking-wider text-[11px]">Metric</th>
              <th className="px-4 py-2 font-semibold uppercase tracking-wider text-[11px]">Value</th>
              <th className="px-4 py-2 font-semibold uppercase tracking-wider text-[11px]">Formula</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            <tr className="hover:bg-[#f5f5f5]">
              <td className="px-4 py-2 font-bold text-gray-900">DAU</td>
              <td className="px-4 py-2">{derivations.dau.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.dau.unit}</td>
              <td className="px-4 py-2 font-mono text-[11px] text-gray-600 bg-[#f9f9f9] rounded m-1 border border-[#eee] inline-block">{derivations.dau.formulaText}</td>
            </tr>
            <tr className="hover:bg-[#f5f5f5]">
              <td className="px-4 py-2 font-bold text-gray-900">PCU</td>
              <td className="px-4 py-2">{derivations.pcu.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.pcu.unit}</td>
              <td className="px-4 py-2 font-mono text-[11px] text-gray-600 bg-[#f9f9f9] rounded m-1 border border-[#eee] inline-block">{derivations.pcu.formulaText}</td>
            </tr>
            <tr className="hover:bg-[#f5f5f5]">
              <td className="px-4 py-2 font-bold text-gray-900">Raw_RPS</td>
              <td className="px-4 py-2">{derivations.rawRps.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.rawRps.unit}</td>
              <td className="px-4 py-2 font-mono text-[11px] text-gray-600 bg-[#f9f9f9] rounded m-1 border border-[#eee] inline-block">{derivations.rawRps.formulaText}</td>
            </tr>
            <tr className="hover:bg-[#f5f5f5]">
              <td className="px-4 py-2 font-bold text-gray-900">Peak_RPS</td>
              <td className="px-4 py-2 font-bold text-black bg-[#e0e0e0] px-2 rounded-sm">{derivations.peakRps.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {derivations.peakRps.unit}</td>
              <td className="px-4 py-2 font-mono text-[11px] text-gray-600 bg-[#f9f9f9] rounded m-1 border border-[#eee] inline-block">{derivations.peakRps.formulaText}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
