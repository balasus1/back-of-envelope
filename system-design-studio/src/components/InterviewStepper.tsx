'use client';

import { useState } from 'react';
import { useStore, Scenario } from '../lib/store';
import { Metric } from './Metric';
import { NumberInput } from './NumberInput';
import {
  HelpCircle,
  ArrowRight,
  Database,
  Radio,
  Layers,
  Cpu,
  Shield,
  Zap,
  Clock,
  HardDrive,
  FileCode,
  Network,
  Scale,
  Sparkles,
  ArrowDownUp,
  Activity,
} from 'lucide-react';
import clsx from 'clsx';

export function InterviewStepper() {
  const { inputs, updateInput, derivations, scenario, setScenario } = useStore();
  const [activeStep, setActiveStep] = useState(0);

  // Stepper Question 1 Paradigm state
  const [paradigm, setParadigm] = useState<'hybrid' | 'realtime' | 'event' | 'etl'>('hybrid');

  // Helper for bidirectional DAU/MAU conversion
  const handleDauChange = (newDau: number) => {
    const validDau = Math.max(0, newDau);
    const activePct = Math.max(1, inputs.DAU_PCT);
    const calculatedMau = Math.round(validDau / (activePct / 100));
    updateInput('MAU', calculatedMau);
  };

  const handleMauChange = (newMau: number) => {
    updateInput('MAU', Math.max(0, newMau));
  };

  const questions = [
    {
      id: 1,
      title: 'Processing Paradigm & Ingestion Mode',
      question: 'Is the data to be processed real-time, event-based, or ETL? Can it be hybrid?',
      interviewerGoal: 'Clarifies whether synchronous ACID transactions (OLTP), asynchronous pub/sub event streams, or offline analytical pipelines (OLAP) are required.',
      dialoguePrompt: '"Should checkout confirm inventory synchronously with ACID guarantees, or can order fulfillment publish events to an asynchronous event bus?"',
    },
    {
      id: 2,
      title: 'User Scale (DAU & MAU Conversion)',
      question: 'What is your Daily Active Users (DAU) & Monthly Active Users (MAU)?',
      interviewerGoal: 'Establishes baseline user volume and the active ratio (DAU/MAU) to size user traffic and database tenancy.',
      dialoguePrompt: '"For 10M Monthly Active Users, what percentage use the app daily, and what is our peak concurrency during rush hours?"',
    },
    {
      id: 3,
      title: 'Inbound + Outbound Requests (Total Traffic Hits)',
      question: 'How many inbound requests does this application process, and what is the outbound fan-out to get total request hits?',
      interviewerGoal: 'Derives the fundamental anchor: Inbound RPS + Outbound Calls = Total Platform Throughput Hits.',
      dialoguePrompt: '"How many actions does an active user trigger in a session, and how many downstream calls/events are spawned per inbound request?"',
    },
    {
      id: 4,
      title: 'Payload Sizing & Data Storage Volume',
      question: 'What is the request & response payload size (KB/MB) and monthly storage accumulation?',
      interviewerGoal: 'Sizes network bandwidth (Gbps), ingress/egress transit costs, and long-term disk storage expansion.',
      dialoguePrompt: '"What is the average payload size for request bodies and response JSON? How much storage do we accumulate per month?"',
    },
    {
      id: 5,
      title: 'Reliability, Failures & Dual Channels',
      question: 'What if requests fail? Should we use dual communication channels (API + Kafka Outbox) and retry jobs?',
      interviewerGoal: 'Designs fault tolerance, DLQ tiers, idempotent retry backoffs, and guarantees zero message loss.',
      dialoguePrompt: '"If downstream payment or notification fails, do we reject the request, or commit locally and enqueue via a Transactional Outbox to Kafka?"',
    },
    {
      id: 6,
      title: 'Workload Characteristics (Read/Write Ratio)',
      question: 'What is the read-to-write ratio of incoming operations?',
      interviewerGoal: 'Determines whether the system is read-heavy (caching + read replicas) or write-heavy (LSM trees, Cassandra, sharded databases).',
      dialoguePrompt: '"Is the workload 90:10 read-heavy like product browsing, or write-heavy like telemetry ingestion?"',
    },
    {
      id: 7,
      title: 'Latency SLAs & Tail Budget (p90, p95, p99)',
      question: 'What is your expected response time across p90, p95, and p99 latency percentiles?',
      interviewerGoal: 'Allocates latency across DNS, CDN, API Gateway, microservice execution, and database/cache lookups.',
      dialoguePrompt: '"What are our p90, p95, and p99 latency SLAs? How do we allocate budget to network hops vs DB queries?"',
    },
    {
      id: 8,
      title: 'Cache Sizing, TTL & Retention',
      question: 'How many records can be stored in the cache server for a day and for how many hours?',
      interviewerGoal: 'Sizes Redis RAM, determines TTL cache eviction policies (LRU/LFU), and calculates cache hit ratio offload.',
      dialoguePrompt: '"What percentage of hot keys can fit in memory for 24-hour TTL, and how much RAM is required to hit an 85% cache hit rate?"',
    },
  ];

  // Inbound & Outbound calculations for Step 3
  const inboundRps = derivations.peakRps.value;
  const outboundFanout = inputs.QUERIES_PER_API_CALL + 1; // 1 response + downstream queries/events
  const outboundRps = Math.round(inboundRps * outboundFanout);
  const totalRequestHits = Math.round(inboundRps + outboundRps);

  const scenarios: { id: Scenario; label: string; color: string; desc: string; multiplier: string }[] = [
    { id: 'Normal', label: 'Normal (1x)', color: 'text-zinc-200 border-zinc-700 bg-zinc-800/60', desc: '10M MAU standard baseline', multiplier: '1x' },
    { id: 'Flash Sale', label: 'Flash Sale (5x)', color: 'text-amber-300 border-amber-500/50 bg-amber-950/40', desc: '30% DAU, 5x spike multiplier', multiplier: '5x' },
    { id: 'Black Friday', label: 'Black Friday (10x)', color: 'text-rose-300 border-rose-500/50 bg-rose-950/40', desc: '50% DAU, 10x surge spike', multiplier: '10x' },
    { id: 'Cyber Monday', label: 'Cyber Monday (15x)', color: 'text-purple-300 border-purple-500/50 bg-purple-950/40', desc: '60% DAU, 15x peak traffic', multiplier: '15x' },
    { id: 'DDoS', label: 'DDoS (100x)', color: 'text-red-400 border-red-500/60 bg-red-950/50', desc: 'Volumetric flood simulation', multiplier: '100x' },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-3.5 sm:p-5 shadow-2xl space-y-4 font-sans">
      {/* Header - Stacked Vertically in Clean Rows */}
      <div className="pb-3 border-b border-white/[0.06] space-y-2">
        {/* Row 1: Framework Badge */}
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
            System Interview Framework
          </span>
        </div>

        {/* Row 2: Title */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Sparkles size={15} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Ask Interviewer These Questions First
          </h2>
        </div>

        {/* Row 3: Subtitle / Description */}
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
          Interactive probing questions with typable fields, automated conversions, mathematical proofs, and engine tradeoffs.
        </p>

        {/* Row 4: Step Counter & Progress Indicator */}
        <div className="flex items-center justify-between sm:justify-start gap-3 pt-1">
          <span className="text-xs font-mono font-medium text-indigo-300 shrink-0">
            Step {activeStep + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={clsx(
                  'h-2 rounded-full transition-all cursor-pointer',
                  activeStep === i
                    ? 'bg-indigo-500 ring-2 ring-indigo-500/30 w-5'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                )}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Scenario Presets for Probing Questions */}
      <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <Activity size={13} className="text-amber-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Traffic Scenario Testing (Probing Presets)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Stress-test probing values under surge events:
          </span>
        </div>

        {/* Mobile Dropdown (< sm) */}
        <div className="block sm:hidden">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as Scenario)}
            className="w-full rounded-md border border-white/[0.12] bg-[#0c0d14] px-3 py-2 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id} className="bg-[#0c0d14] text-white">
                {sc.label} — {sc.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Scenario Buttons (sm+) */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-2">
          {scenarios.map((sc) => {
            const isActive = scenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                title={sc.desc}
                className={clsx(
                  'flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer group',
                  isActive
                    ? `${sc.color} ring-1 ring-white/[0.15] shadow-lg font-bold scale-[1.02]`
                    : 'border-white/[0.06] bg-[#0c0d14] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.12] hover:bg-white/[0.03]'
                )}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold">{sc.label.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-zinc-400 font-normal">({sc.multiplier})</span>
                </div>
                <span className="text-[9.5px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 max-w-full">
                  {sc.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Column 1 = Probing Questions List | Column 2 = Corresponding Calculation Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-start">
        {/* Column 1 (Left): Probing Questions List */}
        <div className="lg:col-span-5 space-y-2 overflow-y-auto pr-1 max-h-[320px] lg:max-h-[580px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              Column 1: Probing Questions
            </span>
            <span className="text-[9.5px] font-mono text-indigo-400">8 Steps</span>
          </div>

          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={q.id}
                  onClick={() => setActiveStep(idx)}
                  className={clsx(
                    'group p-3 rounded-lg border transition-all cursor-pointer text-left',
                    isActive
                      ? 'border-indigo-500/50 bg-indigo-950/30 shadow-md ring-1 ring-indigo-500/30'
                      : 'border-white/[0.04] bg-[#090a0f] hover:border-white/[0.1] hover:bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={clsx(
                        'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-colors mt-0.5',
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                      )}
                    >
                      {q.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          title={q.title}
                          className={clsx(
                            'text-xs font-semibold truncate',
                            isActive ? 'text-indigo-200' : 'text-zinc-300 group-hover:text-white'
                          )}
                        >
                          {q.title}
                        </span>
                        {isActive && <ArrowRight size={13} className="text-indigo-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed" title={q.question}>
                        {q.question}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2 (Right): Corresponding Calculation Area & Derivation Notes */}
        <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#090a0f] p-3.5 sm:p-5 flex flex-col justify-between space-y-4">
          {/* Active Question Guidance & Dialogue */}
          <div className="space-y-2 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                Column 2: Calculation Notes & Derivations
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold shrink-0">
                Step {activeStep + 1} of 8
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {questions[activeStep].question}
            </h3>
            <div className="rounded-md bg-indigo-950/20 border border-indigo-500/20 p-2.5 text-xs text-indigo-200 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold font-mono text-[10px] uppercase">
                <HelpCircle size={12} className="shrink-0" />
                <span>Interviewer Dialogue & Probing Target:</span>
              </div>
              <p className="italic text-zinc-300 text-[11px] sm:text-xs">{questions[activeStep].dialoguePrompt}</p>
            </div>
          </div>

          {/* Dynamic Content by Active Step */}
          <div className="flex-1 space-y-4">
            {/* STEP 1: Processing Paradigm & Ingestion */}
            {activeStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Choose Primary Ingestion & Architecture Paradigm:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'hybrid', title: '🔀 Hybrid (ACID + Kafka + ClickHouse)', desc: 'Synchronous writes to OLTP, asynchronous Outbox CDC stream to Kafka and OLAP.' },
                      { key: 'realtime', title: '⚡ Real-time ACID (PostgreSQL / Spanner)', desc: 'Immediate consistency with 2PC or distributed consensus (Raft/Paxos).' },
                      { key: 'event', title: '📨 Event-Driven Pub/Sub (Apache Kafka)', desc: 'High-throughput event sourcing with consumer group log offsets.' },
                      { key: 'etl', title: '📊 Micro-Batch ETL (Flink / Spark)', desc: 'Analytical ingestion every 60s into columnar data warehouse.' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setParadigm(item.key as any)}
                        className={clsx(
                          'p-2.5 rounded-lg border text-left transition-all text-xs cursor-pointer',
                          paradigm === item.key
                            ? 'border-indigo-500/50 bg-indigo-950/30 text-white ring-1 ring-indigo-500/30'
                            : 'border-white/[0.06] bg-[#0c0d14] text-zinc-400 hover:text-zinc-200'
                        )}
                      >
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 leading-tight">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine Comparison Card */}
                <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-300 font-mono text-[11px] flex-wrap gap-1">
                    <span className="font-semibold text-emerald-400">Library & Engine Fit:</span>
                    <span className="text-zinc-500">Debezium CDC + Kafka + PostgreSQL</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    <strong>Why Hybrid is standard:</strong> Direct dual-writes to DB + Kafka risk partial failures (database commits but network drops before Kafka message sends). We solve this with the <strong>Transactional Outbox Pattern</strong> using Debezium CDC to tail the PostgreSQL WAL log into Kafka topics.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: Scale & User Base with Bidirectional DAU <-> MAU Conversion */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/10 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
                      <ArrowDownUp size={14} className="shrink-0" /> Bidirectional User Conversion
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      DAU = MAU × {inputs.DAU_PCT}% | MAU = DAU ÷ {inputs.DAU_PCT}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-md border border-white/[0.08] bg-[#0c0d14] p-2.5 space-y-1">
                      <label className="text-[11px] font-medium text-emerald-300 block">
                        Type Daily Active Users (DAU)
                      </label>
                      <NumberInput
                        value={Math.round(derivations.dau.value)}
                        onChange={(val) => handleDauChange(val)}
                        className="border-emerald-500/30 text-emerald-300 focus:border-emerald-500 font-bold"
                      />
                      <span className="text-[10px] text-zinc-500 block truncate">
                        Typing DAU auto-calculates MAU
                      </span>
                    </div>

                    <div className="rounded-md border border-white/[0.08] bg-[#0c0d14] p-2.5 space-y-1">
                      <label className="text-[11px] font-medium text-indigo-300 block">
                        Type Monthly Active Users (MAU)
                      </label>
                      <NumberInput
                        value={inputs.MAU}
                        onChange={(val) => handleMauChange(val)}
                        className="border-indigo-500/30 text-indigo-300 focus:border-indigo-500 font-bold"
                      />
                      <span className="text-[10px] text-zinc-500 block truncate">
                        Typing MAU auto-calculates DAU
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2 space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>DAU / MAU Ratio:</span>
                        <span className="font-mono text-white font-bold">{inputs.DAU_PCT}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={inputs.DAU_PCT}
                        onChange={(e) => updateInput('DAU_PCT', Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2 space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>Peak Concurrency:</span>
                        <span className="font-mono text-white font-bold">{inputs.PEAK_CONCURRENT_PCT}% of DAU</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={inputs.PEAK_CONCURRENT_PCT}
                        onChange={(e) => updateInput('PEAK_CONCURRENT_PCT', Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-0.5">Derived DAU</span>
                    <Metric name="DAU" metric={derivations.dau} size="sm" showLabel={false} />
                  </div>
                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-indigo-300 block mb-0.5">Derived MAU</span>
                    <Metric
                      name="MAU"
                      metric={{
                        value: inputs.MAU,
                        unit: 'users/mo',
                        formulaText: 'MAU = DAU / (DAU_PCT / 100)',
                        substitutions: `${Math.round(derivations.dau.value).toLocaleString()} / (${inputs.DAU_PCT} / 100) = ${inputs.MAU.toLocaleString()} users`,
                        humanExplanation: 'Total monthly active user cohort derived dynamically from active daily user volume and engagement ratio.',
                        dependsOn: ['MAU', 'DAU_PCT'],
                      }}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                  <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-purple-300 block mb-0.5">Peak Concurrency (PCU)</span>
                    <Metric name="PCU" metric={derivations.pcu} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Inbound + Outbound Requests (Total Request Hits) */}
            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Actions / User Session</label>
                    <NumberInput
                      value={inputs.ACTIONS_PER_SESSION}
                      onChange={(val) => updateInput('ACTIONS_PER_SESSION', val)}
                    />
                    <span className="text-[10px] text-zinc-500">e.g. 30 requests</span>
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Outbound Fan-Out Factor</label>
                    <NumberInput
                      value={inputs.QUERIES_PER_API_CALL}
                      onChange={(val) => updateInput('QUERIES_PER_API_CALL', val)}
                    />
                    <span className="text-[10px] text-zinc-500">DB + events per call</span>
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Safety Buffer Multiplier</label>
                    <NumberInput
                      step={0.1}
                      value={inputs.SAFETY_BUFFER}
                      onChange={(val) => updateInput('SAFETY_BUFFER', val)}
                    />
                    <span className="text-[10px] text-zinc-500">e.g. 2.0x headroom</span>
                  </div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-1">
                    <span className="text-zinc-400">Total Request Hits Equation:</span>
                    <span className="text-indigo-400 font-bold">Inbound RPS + Outbound Calls = Total Hits</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="rounded border border-white/[0.06] bg-black/40 p-2 text-center">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block mb-0.5">1. Inbound Peak RPS</span>
                      <Metric name="Inbound Peak RPS" metric={derivations.peakRps} size="sm" showLabel={false} />
                    </div>
                    <div className="rounded border border-white/[0.06] bg-black/40 p-2 text-center">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block mb-0.5">2. Outbound Fan-Out RPS</span>
                      <Metric
                        name="Outbound Fan-Out RPS"
                        metric={{
                          value: outboundRps,
                          unit: 'calls/s',
                          formulaText: 'Peak_Inbound_RPS × (Queries_Per_Call + 1)',
                          substitutions: `${Math.round(inboundRps).toLocaleString()} × ${outboundFanout} = ${outboundRps.toLocaleString()} calls/s`,
                          humanExplanation: 'Downstream microservice RPCs, Redis cache lookups, database queries, and Kafka event dispatches spawned by incoming user requests.',
                          dependsOn: ['ACTIONS_PER_SESSION', 'QUERIES_PER_API_CALL'],
                        }}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                    <div className="rounded border border-indigo-500/30 bg-indigo-950/30 p-2 text-center">
                      <span className="text-[9px] uppercase font-mono text-indigo-300 font-bold block mb-0.5">Total Platform Hits</span>
                      <Metric
                        name="Total Platform Hits"
                        metric={{
                          value: totalRequestHits,
                          unit: 'hits/s',
                          formulaText: 'Inbound_Peak_RPS + Outbound_Fanout_RPS',
                          substitutions: `${Math.round(inboundRps).toLocaleString()} + ${outboundRps.toLocaleString()} = ${totalRequestHits.toLocaleString()} hits/s`,
                          humanExplanation: 'Combined aggregated throughput load processed across the entire edge, gateway, compute mesh, and data tiers.',
                          dependsOn: ['ACTIONS_PER_SESSION', 'QUERIES_PER_API_CALL', 'SAFETY_BUFFER'],
                        }}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Payload Sizing & Storage */}
            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Request Body (KB)</label>
                    <NumberInput
                      value={inputs.AVG_REQUEST_SIZE_KB}
                      onChange={(val) => updateInput('AVG_REQUEST_SIZE_KB', val)}
                    />
                    <span className="text-[10px] text-zinc-500">e.g. 2 KB</span>
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Response Body (KB)</label>
                    <NumberInput
                      value={inputs.AVG_RESPONSE_SIZE_KB}
                      onChange={(val) => updateInput('AVG_RESPONSE_SIZE_KB', val)}
                    />
                    <span className="text-[10px] text-zinc-500">e.g. 50 KB</span>
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">DB Row Size (KB)</label>
                    <NumberInput
                      value={inputs.DB_ROW_SIZE_KB}
                      onChange={(val) => updateInput('DB_ROW_SIZE_KB', val)}
                    />
                    <span className="text-[10px] text-zinc-500">e.g. 1 KB</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-2 text-center">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-0.5">Peak Bandwidth</span>
                    <Metric name="Bandwidth" metric={derivations.peakBandwidthGbps} size="sm" showLabel={false} />
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-2 text-center">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-0.5">Daily Egress</span>
                    <Metric name="Daily Egress" metric={derivations.dailyEgressGb} size="sm" showLabel={false} />
                  </div>
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-2 text-center">
                    <span className="text-[10px] uppercase font-mono text-indigo-400 block mb-0.5">Monthly Storage</span>
                    <Metric name="Monthly Storage" metric={derivations.dbTotalStorageGb} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Failure Handling & DLQ */}
            {activeStep === 4 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Max Retries</label>
                    <NumberInput
                      value={inputs.Max_Retries}
                      onChange={(val) => updateInput('Max_Retries', val)}
                    />
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Base Backoff (sec)</label>
                    <NumberInput
                      value={inputs.Retry_Backoff_Base_sec}
                      onChange={(val) => updateInput('Retry_Backoff_Base_sec', val)}
                    />
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Backoff Multiplier</label>
                    <NumberInput
                      value={inputs.Retry_Backoff_Multiplier}
                      onChange={(val) => updateInput('Retry_Backoff_Multiplier', val)}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-rose-500/20 bg-rose-950/10 p-3 space-y-2 text-xs text-rose-200">
                  <div className="font-semibold text-rose-300 font-mono text-[11px] flex items-center gap-1.5">
                    <Shield size={13} className="shrink-0" /> Dual Communication Channel Architecture:
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    1. <strong>Synchronous gRPC:</strong> Instant client response with idempotency key.<br />
                    2. <strong>Outbox CDC:</strong> Asynchronous Kafka retry topic with 4 exponential backoff stages: <code className="text-rose-300 font-mono">5s → 10s → 20s → 40s → DLQ</code>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-rose-500/20">
                    <div className="rounded border border-white/[0.06] bg-[#0c0d14] p-1.5 text-center">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block mb-0.5">Total Retry Span</span>
                      <Metric name="Total Retry Duration" metric={derivations.totalRetryTime} size="sm" showLabel={false} />
                    </div>
                    <div className="rounded border border-white/[0.06] bg-[#0c0d14] p-1.5 text-center">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block mb-0.5">DLQ Failure Rate</span>
                      <Metric name="DLQ Failure %" metric={derivations.dlqFailureRatePct} size="sm" showLabel={false} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Read / Write Ratio */}
            {activeStep === 5 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Read Split: <strong>{inputs.READ_WRITE_SPLIT_READ_PCT}%</strong></span>
                    <span>Write Split: <strong>{100 - inputs.READ_WRITE_SPLIT_READ_PCT}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={99}
                    value={inputs.READ_WRITE_SPLIT_READ_PCT}
                    onChange={(e) => updateInput('READ_WRITE_SPLIT_READ_PCT', Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  {/* Row 1: READ QPS */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-white/[0.06] bg-[#0c0d14] px-3.5 py-2.5 hover:border-white/[0.12] transition-colors">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-semibold text-zinc-400 block tracking-wider">
                        READ QPS
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Logical SELECT queries ({inputs.READ_WRITE_SPLIT_READ_PCT}% of DB demand)
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <Metric name="Read QPS" metric={derivations.dbReadQps} size="sm" showLabel={false} />
                    </div>
                  </div>

                  {/* Row 2: WRITE QPS */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-white/[0.06] bg-[#0c0d14] px-3.5 py-2.5 hover:border-white/[0.12] transition-colors">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-semibold text-zinc-400 block tracking-wider">
                        WRITE QPS
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Primary ACID writes ({100 - inputs.READ_WRITE_SPLIT_READ_PCT}% of DB demand)
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <Metric name="Write QPS" metric={derivations.dbWriteQps} size="sm" showLabel={false} />
                    </div>
                  </div>

                  {/* Row 3: DB REPLICAS */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-white/[0.06] bg-[#0c0d14] px-3.5 py-2.5 hover:border-white/[0.12] transition-colors">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-semibold text-blue-400 block tracking-wider">
                        DB REPLICAS
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Multi-AZ read replicas sized for replica cap ({inputs.DB_READ_REPLICA_QPS} QPS/node)
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <Metric name="DB Replicas" metric={derivations.dbReplicas} size="sm" showLabel={false} />
                    </div>
                  </div>

                  {/* Row 4: CACHE HIT % */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/10 px-3.5 py-2.5 hover:border-emerald-500/30 transition-colors">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-semibold text-emerald-400 block tracking-wider">
                        CACHE HIT %
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Read requests absorbed in Redis memory before touching DB
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <Metric
                        name="Cache Hit %"
                        metric={{
                          value: inputs.CACHE_HIT_PCT,
                          unit: '%',
                          formulaText: 'In-Memory Redis Cache Hit Ratio',
                          substitutions: `${inputs.CACHE_HIT_PCT}% of read queries absorbed by Redis`,
                          humanExplanation: 'Percentage of read requests satisfied directly by Redis in-memory cache without hitting database storage or read replicas.',
                          dependsOn: ['CACHE_HIT_PCT'],
                        }}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Latency SLA & Budget Percentiles (p90, p95, p99) */}
            {activeStep === 6 && (
              <div className="space-y-3">
                {/* Typable SLA Percentile Thresholds */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-indigo-300">p90 Target (ms)</label>
                      <span className="text-[9px] font-mono text-zinc-500">90th %</span>
                    </div>
                    <NumberInput
                      value={inputs.SLA_P90_ms}
                      onChange={(val) => updateInput('SLA_P90_ms', val)}
                      className="border-indigo-500/30"
                    />
                  </div>

                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-purple-300">p95 Target (ms)</label>
                      <span className="text-[9px] font-mono text-zinc-500">95th %</span>
                    </div>
                    <NumberInput
                      value={inputs.SLA_P95_ms}
                      onChange={(val) => updateInput('SLA_P95_ms', val)}
                      className="border-purple-500/30"
                    />
                  </div>

                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-pink-300">p99 Target (ms)</label>
                      <span className="text-[9px] font-mono text-zinc-500">99th %</span>
                    </div>
                    <NumberInput
                      value={inputs.SLA_P99_ms}
                      onChange={(val) => updateInput('SLA_P99_ms', val)}
                      className="border-pink-500/30"
                    />
                  </div>
                </div>

                {/* Percentile Explanations with Metric Modals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-2.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-mono text-indigo-300 font-bold block">p90 Latency</span>
                    <Metric
                      name="p90 Latency SLA"
                      metric={{
                        value: inputs.SLA_P90_ms,
                        unit: 'ms',
                        formulaText: 'Target_p90_Threshold_ms',
                        substitutions: `p90 = ${inputs.SLA_P90_ms} ms (90% of requests finish within this time)`,
                        humanExplanation: 'p90 (90th Percentile): Represents standard, uninterrupted user request execution over normal network paths and warm cache hits. In interviews, p90 is used to establish baseline product responsiveness.',
                        dependsOn: ['SLA_P90_ms'],
                      }}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-2.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">p95 Latency</span>
                    <Metric
                      name="p95 Latency SLA"
                      metric={{
                        value: inputs.SLA_P95_ms,
                        unit: 'ms',
                        formulaText: 'Target_p95_Threshold_ms',
                        substitutions: `p95 = ${inputs.SLA_P95_ms} ms (95% of requests finish within this time)`,
                        humanExplanation: 'p95 (95th Percentile): Standard operational Service Level Objective (SLO). Captures occasional cache misses and database secondary index lookups.',
                        dependsOn: ['SLA_P95_ms'],
                      }}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  <div className="rounded-lg border border-pink-500/20 bg-pink-950/20 p-2.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-mono text-pink-300 font-bold block">p99 Tail Latency</span>
                    <Metric
                      name="p99 Tail Latency SLA"
                      metric={{
                        value: inputs.SLA_P99_ms,
                        unit: 'ms',
                        formulaText: 'Target_p99_Tail_Threshold_ms',
                        substitutions: `p99 = ${inputs.SLA_P99_ms} ms (1 in 100 requests hits this upper bound)`,
                        humanExplanation: 'p99 (99th Percentile - Tail Latency): Captures worst-case execution delays caused by garbage collection pauses, DB row lock contention, TCP retransmissions, and cold starts. Sizing for p99 prevents catastrophic cascading queue timeouts.',
                        dependsOn: ['SLA_P99_ms'],
                      }}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                </div>

                {/* Micro-Hops Latency Waterfall */}
                <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/[0.04] flex-wrap gap-1">
                    <span>1. Edge Network (DNS + TLS 1.3 + CDN):</span>
                    <span className="text-zinc-200">{inputs.DNS_Lookup_ms + inputs.SSL_Handshake_ms + inputs.CDN_Edge_ms} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/[0.04] flex-wrap gap-1">
                    <span>2. Gateway Overhead + Auth:</span>
                    <span className="text-zinc-200">{derivations.gatewayLatencyMs.value} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/[0.04] flex-wrap gap-1">
                    <span>3. App Execution + Redis Cache Hit:</span>
                    <span className="text-zinc-200">{inputs.Service_Process_ms + inputs.Redis_Query_ms} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-indigo-400 font-bold pt-0.5 flex-wrap gap-1">
                    <span>Overall Measured P95 Latency:</span>
                    <Metric name="Calculated P95 Latency" metric={derivations.p95Latency} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Cache Sizing & Retention */}
            {activeStep === 7 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Catalog SKUs</label>
                    <NumberInput
                      value={inputs.CATALOG_SKUS}
                      onChange={(val) => updateInput('CATALOG_SKUS', val)}
                    />
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Hot SKU Count</label>
                    <NumberInput
                      value={inputs.HOT_SKU_COUNT}
                      onChange={(val) => updateInput('HOT_SKU_COUNT', val)}
                    />
                  </div>
                  <div className="rounded-md border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                    <label className="text-[10px] font-medium text-zinc-400">Overhead Factor</label>
                    <NumberInput
                      step={0.1}
                      value={inputs.CACHE_OVERHEAD_FACTOR}
                      onChange={(val) => updateInput('CACHE_OVERHEAD_FACTOR', val)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-amber-300 block mb-0.5">Required Cache RAM</span>
                    <Metric name="Cache RAM" metric={derivations.cacheWithOverheadGb} size="sm" showLabel={false} />
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-0.5">Redis Shards</span>
                    <Metric name="Redis Shards" metric={derivations.cacheNodes} size="sm" showLabel={false} />
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-[#0c0d14] p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-0.5">Cache Operations</span>
                    <Metric name="Cache Ops" metric={derivations.cacheOps} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous Question
            </button>

            <span className="text-[11px] font-mono text-zinc-500">
              {activeStep + 1} / {questions.length} Probing Topics
            </span>

            <button
              onClick={() => setActiveStep((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={activeStep === questions.length - 1}
              className="px-3.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/30 text-xs font-medium text-indigo-200 hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              Next Question
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
