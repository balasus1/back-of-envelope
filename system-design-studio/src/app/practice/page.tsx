'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Play, Pause, RotateCcw, Check, ChevronDown, ChevronUp, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function InterviewPracticePage() {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3600); // 60 minutes
  const [activeStep, setActiveStep] = useState(0);

  const interviewPacing = [
    { time: '0:00 - 5:00', title: '1. Requirements & Clarifications', desc: 'Scope functional vs non-functional, DAU, read/write ratio, latency SLA.' },
    { time: '5:00 - 15:00', title: '2. Back-of-the-Envelope Math', desc: 'State 10M MAU → 2M DAU → 400k PCU → 6.6k Peak RPS anchor chain.' },
    { time: '15:00 - 30:00', title: '3. High-Level Architecture', desc: 'Draw Client → CDN → NLB/ALB → Gateway → Microservices → Kafka → DB/Cache.' },
    { time: '30:00 - 50:00', title: '4. Deep Dives & Bottlenecks', desc: 'Idempotency keys, saga outbox, partition keys, DB connection limits, cache invalidation.' },
    { time: '50:00 - 60:00', title: '5. Failure Modes & Economics', desc: 'DDoS defense, load shedding priority ladder, DLQ retry, cost estimation.' },
  ];

  const flashcards = [
    {
      q: '1. Design an e-commerce checkout flow at 10M DAU',
      answer: 'Walk client → CDN → gateway → order svc → payment svc (idempotent) → Kafka outbox → inventory → confirmation. Anchor everything on Peak_RPS (6.6k+).',
      sheets: '02_User_Metrics, 06_Backend_Services, 07_Network_Latency',
      redFlags: 'Jumping straight into microservice diagrams without stating scale numbers and latency budget first.',
      bonus: 'Mention Saga pattern with transactional outbox for dual-write avoidance and exactly-once publish.',
    },
    {
      q: '2. Add real-time order tracking & delivery updates',
      answer: 'WebSocket connections for live driver GPS push (5% PCU), SSE for price updates. Size concurrent open sockets and kernel buffer RAM (64KB/conn).',
      sheets: '04_API_Gateway Section E (WS/SSE sizing)',
      redFlags: 'Suggesting client polling every 2 seconds instead of push at 400k concurrent scale.',
      bonus: 'Fan-out via Redis Pub/Sub channels or dedicated push worker cluster behind L4 NLB.',
    },
    {
      q: '3. Handle a Black Friday 10x traffic surge without crashing',
      answer: 'Pre-scale HPA ahead of scheduled rush (min 60 pods), enable 5-tier priority load shedding (drop P5 analytics, protect P1 payments), absorb edge with CDN.',
      sheets: '12_Traffic_Spikes_DDoS',
      redFlags: 'Relying purely on reactive autoscaling with 3-minute cooldowns (leads to thundering herd collapse).',
      bonus: 'Conduct synthetic Chaos Engineering game days (broker kill, network partition) prior to the event.',
    },
    {
      q: '4. Prevent double-charging during payment network retries',
      answer: 'Idempotency key passed from client stored in Redis/DB with unique index, transactional producer with acks=all on payment.transactions Kafka topic.',
      sheets: '08_Kafka_Design Section E, 09_Database_Design',
      redFlags: 'Relying on client-side deduplication alone or vulnerable dual-write without an outbox table.',
      bonus: 'Database outbox table with Debezium CDC streaming events to Kafka to eliminate distributed 2PC.',
    },
    {
      q: '5. Diagnose a sudden Kafka consumer lag spike of 100k messages',
      answer: 'Check partition count vs active consumer thread count, investigate downstream database locks or GC pauses, inspect consumer rebalance storms.',
      sheets: '08_Kafka_Design, 13_Observability SLO table',
      redFlags: 'Blaming Kafka broker capacity before verifying consumer-side thread starvation or slow RPCs.',
      bonus: 'Configure CooperativeStickyAssignor to prevent stop-the-world partition rebalances during rolling deployments.',
    },
    {
      q: '6. Design a Dead-Letter Queue (DLQ) & replay mechanism for bad deploys',
      answer: '4-tier exponential backoff topics (5s → 30s → 5m → DLQ). Dead-letter schema preserves original headers, payload, stack trace, and offset. Batch reprocess worker.',
      sheets: '11_DLQ_Error_Handling',
      redFlags: 'No poison-pill detection causing infinite crash-loops across active worker consumers.',
      bonus: 'Shadow replay tool that replays DLQ events against a canary service instance before triggering production drain.',
    },
    {
      q: '7. Scale database storage when primary disk exceeds 20 TB',
      answer: 'Partition hot tables by date (30-day active partition on NVMe SSD), offload cold history to S3/Parquet with Athena, split read traffic to replicas.',
      sheets: '09_Database_Design Section D',
      redFlags: 'Keeping multi-year unindexed tables on primary OLTP SSD without cold archive archiving.',
      bonus: 'Horizontal sharding by user_id using consistent hashing with Vitess or Citus.',
    },
    {
      q: '8. Reduce P95 latency from 500ms down to 150ms',
      answer: 'Walk hop-by-hop latency waterfall. The primary culprit is uncached database lookups (80ms). Increase Redis cache hit rate to 95%+ and add read replicas.',
      sheets: '07_Network_Latency',
      redFlags: 'Blindly optimizing application code before profiling the hop-by-hop latency breakdown.',
      bonus: 'Implement choice-of-2-random-choices load balancing algorithm to avoid hot microservice tail latency.',
    },
    {
      q: '9. Cut cloud infrastructure costs by 40% without SLA risk',
      answer: '1-Year Reserved Instances on steady baseline (Kafka, DB), Spot instances for stateless app tier with PDBs, S3 Intelligent-Tiering for logs.',
      sheets: '16_Cost_Estimator',
      redFlags: 'Cutting redundancy (removing multi-AZ, dropping replication factor to 1) to save budget.',
      bonus: 'Use Cost per 1,000 DAU ($8.46) as the engineering KPI north star.',
    },
    {
      q: '10. Migrate from Apache ZooKeeper to KRaft with zero downtime',
      answer: 'Deploy KRaft controllers in dual-write metadata mode, migrate broker metadata quorum iteratively, validate replication state, switch controller quorum.',
      sheets: '08_Kafka_Design Section D',
      redFlags: 'Big-bang cluster shutdown and cutover without rollback capability.',
      bonus: 'Knowledge of Apache Kafka KIP-866 metadata migration protocol.',
    },
  ];

  useEffect(() => {
    let interval: any;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 18
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">FAANG Mock Interview Prep & Timer Mode</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            10 high-yield system design interview scenarios with expected answers, red flags, bonus points, and a 60-minute mock timer.
          </p>
        </div>

        {/* 60-Minute Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 px-3.5 py-1.5 flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase text-indigo-400 block font-mono">Mock Interview Timer</span>
              <span className="font-mono text-xl font-bold text-white">{formatTime(secondsLeft)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="p-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200"
              >
                {timerActive ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setSecondsLeft(3600);
                }}
                className="p-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 60-Minute Interview Pacing Guide */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-5 space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <BookOpen size={14} className="text-indigo-400" />
          60-Minute Interview Stage Progression & Time Budgets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {interviewPacing.map((p, idx) => (
            <div key={p.title} className="rounded border border-white/[0.06] bg-black/40 p-3 space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 block">{p.time}</span>
              <span className="text-xs font-semibold text-white block">{p.title}</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Scenario Flashcards */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <HelpCircle size={14} className="text-purple-400" />
          10 Master FAANG Scenario Flashcards
        </h2>

        <div className="space-y-3">
          {flashcards.map((card, idx) => {
            const isRevealed = revealedIndex === idx;
            return (
              <div
                key={card.q}
                className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden transition-all"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setRevealedIndex(isRevealed ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20">
                      Scenario #{idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{card.q}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                      {isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer'}
                    </span>
                    {isRevealed ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                  </div>
                </div>

                {isRevealed && (
                  <div className="p-4 pt-0 border-t border-white/[0.06] space-y-3 bg-black/20 text-xs font-sans">
                    <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">
                        Expected Answer (Whiteboard Talk-Track):
                      </span>
                      <p className="text-zinc-200 text-xs leading-relaxed">{card.answer}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="rounded border border-white/[0.06] bg-[#0c0d14] p-2.5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                          Referenced Sheets
                        </span>
                        <p className="font-mono text-indigo-300 text-[11px]">{card.sheets}</p>
                      </div>

                      <div className="rounded border border-rose-500/20 bg-rose-950/20 p-2.5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle size={12} /> Red Flags to Avoid
                        </span>
                        <p className="text-rose-200/90 text-[11px] leading-relaxed">{card.redFlags}</p>
                      </div>

                      <div className="rounded border border-emerald-500/20 bg-emerald-950/20 p-2.5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1">
                          <Sparkles size={12} /> Bonus Points (Staff+)
                        </span>
                        <p className="text-emerald-200/90 text-[11px] leading-relaxed">{card.bonus}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}