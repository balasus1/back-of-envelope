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
        className="flex items-center gap-2 cursor-pointer bg-slate-800 rounded px-3 py-2 hover:bg-slate-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-white font-bold">{metric.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {metric.unit}</span>
        <Info size={16} className="text-slate-400" />
      </div>
      
      {open && (
        <div className="absolute z-10 top-full mt-2 left-0 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4">
          <h4 className="font-bold text-white mb-2">{name}</h4>
          <p className="text-sm text-slate-300 mb-3">{metric.humanExplanation}</p>
          
          <div className="bg-black/50 rounded p-2 mb-3">
            <code className="text-xs text-green-400 block mb-1">{metric.formulaText}</code>
            <div className="text-xs text-slate-400">Depends on: {metric.dependsOn.join(', ')}</div>
          </div>
          
          <button 
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded w-full"
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
