'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calculator, HelpCircle, ArrowRight, CheckCircle2, Layers, Cpu, Zap, Shield, Database, Radio, Globe, Copy, Check } from 'lucide-react';
import { Metric } from './Metric';
import { MetricResult } from '../lib/derivations';

export interface ArchitectureNodeDetail {
  id: string;
  name: string;
  category: string;
  icon: string;
  summary: string;
  metrics: {
    label: string;
    metric: MetricResult;
  }[];
  appliedCalculations: {
    name: string;
    formula: string;
    stepByStep: string;
    result: string;
  }[];
  probingQuestions: string[];
  libraryTradeoffs: {
    primary: string;
    alternative: string;
    comparison: string;
    recommendation: string;
  };
}

interface Props {
  node: ArchitectureNodeDetail | null;
  onClose: () => void;
}

export function FlowPipelineModal({ node, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const handleCopy = async () => {
    const text = [
      `=== ${node.name} (${node.category}) ===`,
      node.summary,
      '',
      '--- LIVE COMPUTED METRICS ---',
      ...node.metrics.map(
        (m) =>
          `${m.label}: ${typeof m.metric.value === 'number' ? m.metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : m.metric.value} ${m.metric.unit || ''}`
      ),
      '',
      '--- APPLIED FORMULAS ---',
      ...node.appliedCalculations.map(
        (c) => `${c.name}: ${c.result} | Formula: ${c.formula} | Step: ${c.stepByStep}`
      ),
      '',
      '--- INTERVIEW PROBING QUESTIONS ---',
      ...node.probingQuestions.map((q, i) => `${i + 1}. ${q}`),
      '',
      '--- TRADEOFF ANALYSIS ---',
      `${node.libraryTradeoffs.primary} vs ${node.libraryTradeoffs.alternative}`,
      node.libraryTradeoffs.comparison,
      `Recommendation: ${node.libraryTradeoffs.recommendation}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!node || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div
        className="relative w-[95vw] sm:w-[85vw] md:w-[60vw] max-w-[95vw] md:max-w-[60vw] max-h-[85vh] md:max-h-[46vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0c0d14] text-zinc-100 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.08] bg-[#10121b] flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">{node.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  {node.category}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">{node.name}</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">{node.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                copied
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                  : 'border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Copy entire tier specification"
            >
              {copied ? <Check size={13} className="text-emerald-400 shrink-0" /> : <Copy size={13} className="shrink-0" />}
              <span className="text-[10px] sm:text-[11px]">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
              title="Close modal (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Live Computed Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-indigo-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Live Computed Scale & Capacity
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {node.metrics.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-white/[0.06] bg-[#12141f] p-3">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block truncate mb-1" title={item.label}>
                    {item.label}
                  </span>
                  <Metric name={item.label} metric={item.metric} size="sm" showLabel={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Applied Calculations & Math Substitution */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={15} className="text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Applied Formulas & Mathematical Derivations
              </h3>
            </div>
            <div className="space-y-2.5">
              {node.appliedCalculations.map((calc, idx) => (
                <div key={idx} className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="font-semibold text-emerald-400">{calc.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      = {calc.result}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    <span className="text-zinc-600 mr-2">Formula:</span>
                    <span className="text-indigo-300">{calc.formula}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                    <span className="text-zinc-600 mr-2">Step-by-step:</span>
                    <span className="text-zinc-300">{calc.stepByStep}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Probing Questions & Red Flags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={15} className="text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Key Interview Probing Questions for this Tier
              </h3>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 space-y-2">
              {node.probingQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-200/90">
                  <span className="font-mono text-amber-400 font-bold mt-0.5">{idx + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Source Library & Engine Tradeoffs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers size={15} className="text-purple-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Engine & Open Source Library Tradeoff Comparison
              </h3>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0e1017] p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded border border-purple-500/30">
                  {node.libraryTradeoffs.primary}
                </span>
                <span className="text-zinc-500 font-mono">VS</span>
                <span className="font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-700/50">
                  {node.libraryTradeoffs.alternative}
                </span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{node.libraryTradeoffs.comparison}</p>
              <div className="p-2.5 rounded-md bg-purple-950/20 border border-purple-500/20 text-purple-200 text-xs">
                <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-purple-400 block mb-0.5">
                  Recommendation & Best Fit:
                </span>
                {node.libraryTradeoffs.recommendation}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/[0.08] bg-[#10121b] flex-shrink-0">
          <span className="text-[11px] text-zinc-500 font-mono">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">Esc</kbd> or click outside to dismiss
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
