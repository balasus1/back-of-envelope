'use client';

import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';
import { AlertTriangle, Clock, RefreshCw, Code, ShieldAlert, Zap, ArrowRight } from 'lucide-react';

export default function DLQPage() {
  const { inputs, derivations, updateInput } = useStore();

  const retryTiers = [
    { tier: 'Tier 1', topic: 'order.retry.5s', delay: `${inputs.Retry_Backoff_Base_sec}s`, cum: '5s', action: 'Transient network glitch' },
    { tier: 'Tier 2', topic: 'order.retry.30s', delay: `${inputs.Retry_Backoff_Base_sec * inputs.Retry_Backoff_Multiplier}s`, cum: '15s', action: 'Database connection blip' },
    { tier: 'Tier 3', topic: 'order.retry.5m', delay: `${inputs.Retry_Backoff_Base_sec * Math.pow(inputs.Retry_Backoff_Multiplier, 2)}s`, cum: '35s', action: 'Downstream payment timeout' },
    { tier: 'Tier 4', topic: 'order.retry.40s', delay: `${inputs.Retry_Backoff_Base_sec * Math.pow(inputs.Retry_Backoff_Multiplier, 3)}s`, cum: '75s', action: 'Final automated attempt' },
    { tier: 'Dead-Letter', topic: 'order.dlq', delay: 'Indefinite', cum: '75s+', action: 'Route to DLQ for manual inspection' },
  ];

  const sampleDeadLetterJson = {
    event_id: 'evt_99824bf201',
    topic: 'order.events',
    failed_at: '2026-09-10T14:32:10.451Z',
    error_code: 'PAYMENT_GATEWAY_TIMEOUT',
    retry_count: 4,
    original_payload: {
      order_id: 'ord_1002931',
      user_id: 'usr_882194',
      amount_cents: 8990,
      currency: 'USD',
      idempotency_key: 'idem_9a87f4c2',
    },
    error_stack: 'TimeoutError: Gateway did not respond within 3000ms after 4 retries',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 11
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">DLQ, Retry Topics & Reprocessing Logic</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            4-tier exponential backoff schedule, failure probability modeling, dead-letter storage, and drain throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 text-right font-mono">
            <span className="text-[10px] uppercase text-rose-400 block font-sans">Daily DLQ Messages</span>
            <span className="text-base font-bold text-rose-200">
              {Math.round(derivations.dlqMsgsPerDay.value).toLocaleString()} msgs/day ({derivations.dlqFailureRatePct.value.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Backoff Progression */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Clock size={14} className="text-indigo-400" />
          Exponential Retry Tier Progression
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {retryTiers.map((t, idx) => (
            <div
              key={t.tier}
              className={`rounded-lg border p-3 space-y-1.5 ${
                idx === 4
                  ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                  : 'border-white/[0.08] bg-black/40 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{t.tier}</span>
                <span className="text-[10px] font-mono text-zinc-500">{t.cum}</span>
              </div>
              <div className="font-mono text-sm font-semibold text-indigo-300">{t.delay} delay</div>
              <div className="text-[10px] font-mono text-zinc-400 truncate" title={t.topic}>
                {t.topic}
              </div>
              <p className="text-[10px] text-zinc-500 pt-1 border-t border-white/[0.06]">{t.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drain & Reprocess Math */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <RefreshCw size={14} className="text-emerald-400" />
            Batch Reprocessing Capacity
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Reprocess Batch Size</span>
              <span className="font-mono font-semibold text-white">{inputs.Reprocess_Batch_Size.toLocaleString()} msgs</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Reprocess Workers</span>
              <span className="font-mono font-semibold text-indigo-300">4 Worker Threads</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Throughput Rate</span>
              <span className="font-mono font-semibold text-emerald-400">{Math.round(derivations.reprocessThroughput.value)} msgs/min</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Full 24h Drain Time</span>
              <span className="font-mono font-semibold text-amber-300">{derivations.fullDlqDrainHours.value.toFixed(1)} hours</span>
            </div>
          </div>
        </div>

        {/* Dead Letter Payload Schema */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-2">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Code size={14} className="text-purple-400" />
            Preserved Dead-Letter JSON Envelope
          </h2>
          <pre className="rounded bg-black/60 p-2.5 font-mono text-[11px] text-zinc-300 overflow-x-auto border border-white/[0.06] max-h-40">
            {JSON.stringify(sampleDeadLetterJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}