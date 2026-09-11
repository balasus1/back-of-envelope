'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  Radio,
  Layers,
  AlertTriangle,
  Flame,
  Activity,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  Clock,
  BookOpen,
  Sliders,
  Network,
  Users,
  Check,
  ChevronDown,
  Globe,
  ChevronUp,
} from 'lucide-react';
import clsx from 'clsx';

export default function LandingPage() {
  // Live teaser interactive state
  const [teaserMau, setTeaserMau] = useState<number>(10000000);
  const [teaserDauPct, setTeaserDauPct] = useState<number>(20);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick live math for the teaser card
  const derivedDau = Math.round(teaserMau * (teaserDauPct / 100));
  const derivedPcu = Math.round(derivedDau * 0.2);
  const derivedPeakRps = Math.round(((derivedPcu * 30) / 3600) * 2);
  const derivedKafkaBrokers = Math.max(3, Math.ceil((derivedPeakRps * 0.5) / 100));
  const derivedDbStorageGb = Math.round((derivedDau * 30 * 2.5) / 10000);
  const derivedMonthlyCost = Math.round((derivedDau / 1000) * 8.46);

  const features = [
    {
      icon: Calculator,
      title: 'Back-of-the-Envelope Math Engine',
      desc: 'Automatic derivation from MAU down to Peak API RPS, Kafka ingress throughput, database replicas, and Redis cache sizing with step-by-step arithmetic proofs.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: HelpCircle,
      title: '8-Step Probing Question Framework',
      desc: 'Never make blind assumptions. Learn the exact clarifying questions to ask interviewers regarding ingestion paradigms, DAU/MAU ratios, payload sizes, and SLA budgets.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: ShieldCheck,
      title: '16-Layer Architectural Rubric',
      desc: 'A comprehensive grading rubric across Ingress, Compute, Storage, and Resiliency tiers. Includes open-source library tradeoffs (e.g. Envoy vs Kong, Kafka vs RabbitMQ).',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Flame,
      title: 'Dynamic Surge & Stress Testing',
      desc: 'Instantly simulate Flash Sales (5x), Black Friday surges (10x), and volumetric DDoS attacks (20x) to evaluate cluster headroom and load-shedding survival.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: Clock,
      title: 'Hop-by-Hop Latency Waterfall',
      desc: 'Pinpoint bottlenecks with a full P50/P95/P99 latency decomposition across DNS, Anycast CDN, API Gateway, microservices, and database query executions.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: DollarSign,
      title: 'AWS Line-Item Cost Estimator',
      desc: 'Calculate precise monthly and annual infrastructure expenditure across EC2, RDS, ElastiCache, S3, and egress transit with unit economics ($/1k DAU).',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  const scenarios = [
    {
      num: '01',
      title: 'E-Commerce Flash Sale Checkout',
      tag: 'Idempotency & Sagas',
      summary: 'Scale 10M DAU checkout with transactional outbox, Kafka event bus, and distributed inventory reservations.',
    },
    {
      num: '02',
      title: 'Real-Time Driver GPS Tracking',
      tag: 'WebSockets & Fan-out',
      summary: 'Size concurrent open socket connections, kernel memory buffers (64KB/conn), and Redis Pub/Sub broadcast tiers.',
    },
    {
      num: '03',
      title: 'Black Friday 10x Surge Survival',
      tag: '5-Tier Load Shedding',
      summary: 'Pre-scale Kubernetes HPA, absorb 85%+ static traffic at Anycast CDN edge, and drop non-critical background jobs.',
    },
    {
      num: '04',
      title: 'Payment Idempotency & Zero Double-Charge',
      tag: 'Distributed Locks',
      summary: 'Prevent duplicate credit card transactions during mobile network timeouts using Redis lock keys and transactional DB deduplication.',
    },
    {
      num: '05',
      title: 'Kafka Consumer Lag Spike Diagnostics',
      tag: 'Streaming Health',
      summary: 'Troubleshoot consumer rebalance storms, unindexed DB locks, and configure CooperativeStickyAssignors for zero downtime.',
    },
    {
      num: '06',
      title: 'Dead-Letter Queue (DLQ) Recovery',
      tag: 'Poison Pill Defense',
      summary: 'Architect 4-tier exponential backoff retry topics (5s → 30s → 5m → DLQ) with shadow canary replay tooling.',
    },
  ];

  const faqs = [
    {
      q: 'What is the story behind this tool? Why build and share it for free?',
      a: 'Having personally been impacted by tech industry layoffs, I experienced firsthand how stressful and unstructured system design preparation can be without guidance. While algorithm coding has clear answers, candidates frequently struggle with back-of-the-envelope estimations under interview pressure. I needed a hands-on way to calculate scale, practice the math repeatedly, and articulate architectural decisions with confidence. I built this comprehensive engine and decided to share it 100% free so that any engineer facing layoffs or preparing for high-stakes interviews can master the math and succeed without expensive $300 course paywalls.',
    },
    {
      q: 'Can I contribute or add new architecture sheets to this product?',
      a: 'Yes, absolutely! System Design is open-source under the Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) license. You are welcome to fork the GitHub repository, add new distributed system patterns, expand formula calculators, or submit improvements via Pull Requests (PRs). Commercial use and charging job seekers for access is strictly prohibited to keep this resource 100% free forever.',
    },
    {
      q: 'Is this really 100% free with no sign-up or credit card?',
      a: 'Yes, completely free. There are no paywalls, no email gates, no credit cards, and no logins. You can open the studio, adjust numbers, test scenarios, and review rubrics instantly.',
    },
    {
      q: 'How are the calculations and formulas derived?',
      a: 'All sizing rules, latency hops, and capacity ratios are grounded in proven distributed systems engineering practices used across FAANG and tier-1 tech companies (Google SRE, Meta TAO/Memcached, AWS Well-Architected, Netflix Chaos Engineering).',
    },
    {
      q: 'Can I use this during real mock interview practice?',
      a: 'Absolutely. Use the 60-Minute Mock Timer, practice asking the 8 probing questions first, and memorize the auto-interpolated 60-Second Whiteboard Talk-Track from the Summary Cheatsheet.',
    },
    {
      q: 'Does it work on mobile phones and tablets?',
      a: 'Yes, the entire product is fully mobile responsive across portrait and landscape orientations, with native filter dropdowns and touch-friendly controls.',
    },
  ];

  return (
    <div className="space-y-24 pb-28 font-sans">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] sm:h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono font-medium shadow-sm">
          <Sparkles size={14} className="text-indigo-400 shrink-0" />
          <span>The Missing Skill Between<strong className="text-white font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"> Code &amp; Whiteboard</strong></span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            <span className="block text-2xl sm:text-4xl md:text-5xl text-indigo-200 font-bold mb-3 tracking-normal">
              Practice Daily
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Master Back-of-the-Envelope Math
            </span>{' '}
            for System Design Interviews.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            In today&apos;s hyper-competitive tech market with high-volume layoffs, engineers spend months grinding coding algorithms—only to fail system design rounds because they skip basic capacity estimation and jump blindly into drawing boxes.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-center pt-2">
          <Link
            href="/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer group"
          >
            <span>Learn Estimation</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            ✓ Real-Time Capacity Sizing
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            ✓ 30 Concepts Math Proofs
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            ✓ 8 Probing Questions
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            ✓ 16 Swim Lane Checklists
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            ✓ 10 Master FAANG Scenarios
          </span>
        </div>
      </section>

      {/* PROBLEM STATEMENT: THE COST OF SKIPPING THE MATH */}
      <section id="problem" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-[#120b12] via-[#0e1017] to-[#0d0e15] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <AlertTriangle size={15} />
            <span>The #1 Reason Senior Candidates Get Downleveled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-rose-300">01.</span>
              <h3 className="text-base font-bold text-white">The LeetCode Trap</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Candidates practice hundreds of dynamic programming puzzles, but freeze when an interviewer asks: <em>&ldquo;How many Kafka partitions and database read replicas do we need for 10M DAU?&rdquo;</em>
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-amber-300">02.</span>
              <h3 className="text-base font-bold text-white">Blind Component Insertion</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Saying <em>&ldquo;We will put Redis here&rdquo;</em> without calculating cache working set memory, hot SKU retention hours, or eviction policies signals junior-level hand-waving.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-indigo-300">03.</span>
              <h3 className="text-base font-bold text-white">Skipping Probing Questions</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Jumping straight into drawing boxes without clarifying active user ratios, read/write splits, payload sizes, and latency SLAs leads to catastrophic architectural redesigns mid-interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE MATH ENGINE TEASER */}
      <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
            Interactive Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See Back-of-the-Envelope Math in Action
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Drag the slider or adjust user volume below to watch the entire distributed system size dynamically in real-time.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-[#0c0d14] p-5 sm:p-8 shadow-2xl space-y-6">
          {/* Top Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-white/[0.08]">
            <div className="rounded-xl border border-white/[0.08] bg-[#090a0f] p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">Monthly Active Users (MAU)</span>
                <span className="font-mono text-indigo-300 font-bold">{(teaserMau / 1000000).toFixed(0)} Million MAU</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={100000000}
                step={1000000}
                value={teaserMau}
                onChange={(e) => setTeaserMau(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1M MAU</span>
                <span>50M MAU</span>
                <span>100M MAU</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#090a0f] p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">DAU % of MAU (Active Ratio)</span>
                <span className="font-mono text-emerald-300 font-bold">{teaserDauPct}% Active</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={teaserDauPct}
                onChange={(e) => setTeaserDauPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>5% (Low)</span>
                <span>20% (Standard)</span>
                <span>50% (High)</span>
              </div>
            </div>
          </div>

          {/* Real-time Derived Architecture Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Daily Active (DAU)</span>
              <div className="text-base sm:text-lg font-bold font-mono text-white">
                {(derivedDau / 1000000).toFixed(2)}M
              </div>
              <span className="text-[10px] text-zinc-500 block font-mono">users / day</span>
            </div>

            <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3.5 text-center space-y-1 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold block">Peak API RPS</span>
              <div className="text-base sm:text-lg font-bold font-mono text-indigo-200">
                {derivedPeakRps.toLocaleString()}
              </div>
              <span className="text-[10px] text-indigo-400/80 block font-mono">2x buffer req/s</span>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-purple-300 block">Kafka Brokers</span>
              <div className="text-base sm:text-lg font-bold font-mono text-purple-200">
                {derivedKafkaBrokers} Nodes
              </div>
              <span className="text-[10px] text-purple-400/80 block font-mono">KRaft Quorum</span>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-blue-300 block">DB Storage / Mo</span>
              <div className="text-base sm:text-lg font-bold font-mono text-blue-200">
                {derivedDbStorageGb.toLocaleString()} GB
              </div>
              <span className="text-[10px] text-blue-400/80 block font-mono">hot OLTP SSD</span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-300 block">Redis RAM</span>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-200">
                ~{Math.round(derivedDbStorageGb * 0.2)} GB
              </div>
              <span className="text-[10px] text-amber-400/80 block font-mono">hot SKU cache</span>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">AWS Cost</span>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-200">
                ${derivedMonthlyCost.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400/80 block font-mono">/ mo ($8.46/1k)</span>
            </div>
          </div>

          {/* Action to launch full studio */}
          <div className="pt-2 text-center">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              <span>Explore all 25 deep-dive subsystem calculation sheets</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 16-LAYER ARCHITECTURE RUBRIC & FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
            Complete Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            End-to-End System Design Architecture Toolkit
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Everything you need to navigate requirements, derive exact capacities, justify engine tradeoffs, and survive interviewer probing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.08] bg-[#0c0d14] p-5 sm:p-6 space-y-3 hover:border-white/[0.15] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <div className={clsx('w-9 h-9 rounded-lg border flex items-center justify-center', f.color)}>
                <f.icon size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">{f.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 30 CORE CONCEPTS MASTER PRIMER BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c0e18] via-[#090b14] to-[#120f22] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles size={12} />
                <span>Sheet 22 Master Sizing Reference</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                30 Core System Design Concepts & Mathematical Primer
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl">
                Formulas, numbers to quote, Bloom filters, Geohashing, Consistent Hashing, PACELC theorem, B+ Trees, and engine trade-offs.
              </p>
            </div>

            <Link
              href="/concepts"
              className="self-start md:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all group shrink-0"
            >
              <span>Explore All 30 Concepts</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs font-mono">
            {[
              { name: '1. APIs & Protocols', path: '/concepts' },
              { name: '2. API Gateways', path: '/concepts' },
              { name: '6. Load Balancing', path: '/concepts' },
              { name: '11. CAP & PACELC', path: '/concepts' },
              { name: '14. B+ Tree Indexes', path: '/concepts' },
              { name: '15. DB Sharding', path: '/concepts' },
              { name: '16. Consistent Hashing', path: '/concepts' },
              { name: '17. Debezium CDC', path: '/concepts' },
              { name: '18. 80/20 Caching', path: '/concepts' },
              { name: '22. Rate Limiting', path: '/concepts' },
              { name: '24. Bloom Filters', path: '/concepts' },
              { name: '30. Geohashing', path: '/concepts' },
            ].map((c, i) => (
              <Link
                key={i}
                href={c.path}
                className="p-2 rounded-lg border border-white/[0.06] bg-black/40 hover:bg-white/[0.04] text-zinc-300 hover:text-indigo-300 transition-colors text-[10.5px] truncate"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10 MASTER FAANG INTERVIEW SCENARIOS */}
      <section id="scenarios" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            High-Yield Scenarios
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Master 10 Real-World Interview Case Studies
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Pre-configured architectures with model answers, red flags to avoid, and Staff-level bonus points.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s) => (
            <div
              key={s.num}
              className="rounded-xl border border-white/[0.08] bg-[#0e1017] p-4 sm:p-5 space-y-2.5 hover:border-indigo-500/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20">
                  Scenario #{s.num}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{s.tag}</span>
              </div>
              <h3 className="text-sm font-semibold text-white">{s.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.summary}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <span>View All 10 Practice Flashcards & 60-Min Timer &rarr;</span>
          </Link>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Common Questions & Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-[#0c0d14] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] gap-4"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.04] bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-[#0e101f] to-purple-950/60 p-8 sm:p-14 text-center space-y-6 shadow-2xl overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Ace Your Next System Design Interview?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              No sign-up. No credit card. 100% free access to all 25 architecture sheets, capacity calculators, and interview rubrics.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all cursor-pointer group"
            >
              <span>Launch Studio (100% Free)</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
