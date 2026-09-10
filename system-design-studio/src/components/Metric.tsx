'use client';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { MetricResult } from '../lib/derivations';
import clsx from 'clsx';

interface MetricProps {
  name: string;
  metric: MetricResult;
  className?: string;
}

export function Metric({ name, metric, className }: MetricProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx("relative inline-block", className)}>
      <div 
        className="flex items-center gap-1.5 cursor-pointer bg-white border border-[#ccc] rounded px-2 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#f0f0f0] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-600 text-[11px] font-semibold tracking-wide uppercase font-sans">{name}</span>
        <span className="text-gray-900 text-[13px] font-bold">{metric.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {metric.unit}</span>
        <Info size={12} className="text-gray-400" />
      </div>
      
      {open && (
        <div className="absolute z-10 top-full mt-1 left-0 w-72 bg-[#fdfdfd] border border-[#bbb] rounded shadow-lg p-3 font-sans text-left">
          <h4 className="font-bold text-gray-900 text-[13px] mb-1">{name}</h4>
          <p className="text-[11px] text-gray-700 mb-2 leading-tight">{metric.humanExplanation}</p>
          
          <div className="bg-[#f0f0f0] border border-[#ddd] rounded p-2 mb-2">
            <code className="text-[10px] text-gray-800 font-mono block mb-1 font-semibold">{metric.formulaText}</code>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">Depends on: {metric.dependsOn.join(', ')}</div>
          </div>
          
          <button 
            className="text-[10px] bg-gray-200 border border-[#ccc] hover:bg-gray-300 text-gray-800 px-2 py-1 rounded w-full transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation();
              // In the future this could trigger a dependency trace highlight
            }}
          >
            Highlight Dependencies
          </button>
        </div>
      )}
    </div>
  );
}
