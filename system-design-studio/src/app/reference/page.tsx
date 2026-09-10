'use client';

import { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
  Mic,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Compass,
  FileCode,
  Globe,
  Radio,
  Copy,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

interface ReferenceResource {
  id: number;
  name: string;
  url: string;
  category: 'Interview Roadmaps' | 'Mock Interviews' | 'Architecture Primers' | 'Cloud & Enterprise' | 'Engineering Blogs';
  badge: string;
  description: string;
  highlights: string[];
  freeTier: string;
}

const resources: ReferenceResource[] = [
  {
    id: 1,
    name: 'Tech Interview Handbook',
    url: 'https://www.interviewhandbook.io/',
    category: 'Interview Roadmaps',
    badge: 'Curated Guide',
    description: 'Well-structured, comprehensive roadmap covering system design interview steps, algorithmic patterns, behavioral frameworks, and negotiation rubrics.',
    highlights: ['End-to-end interview playbook', 'System design step-by-step checklist', 'Cheat sheets for resume & salary'],
    freeTier: '100% Free & Open Source',
  },
  {
    id: 2,
    name: 'Interviewing.io (Free Library)',
    url: 'https://interviewing.io/',
    category: 'Mock Interviews',
    badge: 'Video & Transcripts',
    description: 'Extensive library of real mock interview recordings conducted by senior staff engineers from FAANG/MAMAA companies with timestamped feedback and critiques.',
    highlights: ['Uncut FAANG system design mock videos', 'Failure mode analyses & interviewer probing', 'Live technical interview breakdowns'],
    freeTier: 'Free Video Library & Guides',
  },
  {
    id: 3,
    name: 'NeetCode.io System Design',
    url: 'https://neetcode.io/',
    category: 'Interview Roadmaps',
    badge: 'Interactive Roadmaps',
    description: 'Visual system design roadmap with clear beginner-to-advanced architectural foundations, distributed system primitives, and step-by-step diagrams.',
    highlights: ['Structured visual roadmaps', 'Distributed hashing, caching & rate limiting guides', 'High-level architectural problem breakdowns'],
    freeTier: 'Free Roadmaps & Videos',
  },
  {
    id: 4,
    name: 'LeetCode System Design Community',
    url: 'https://leetcode.com/discuss/interview-question/system-design/',
    category: 'Mock Interviews',
    badge: 'Real Experiences',
    description: 'Active global community discussion board where candidates share real-world interview questions, debriefs, whiteboard drawings, and follow-up probing challenges.',
    highlights: ['Recent actual interview questions (Google, Meta, Amazon)', 'Community review of candidate designs', 'Edge-case debriefs & follow-ups'],
    freeTier: '100% Free Discussion Forum',
  },
  {
    id: 5,
    name: 'The System Design Primer (GitHub)',
    url: 'https://github.com/donnemartin/system-design-primer',
    category: 'Architecture Primers',
    badge: '280k+ Stars ⭐',
    description: 'The definitive open-source GitHub guide for learning how to design large-scale systems and prepare for system design rounds.',
    highlights: ['CAP theorem, PACELC, consistency models', 'Step-by-step solutions (URL Shortener, Twitter, Web Crawler)', 'Anki flashcards & scaling calculations'],
    freeTier: '100% Free Open Source',
  },
  {
    id: 6,
    name: 'AWS Well-Architected Framework',
    url: 'https://aws.amazon.com/architecture/well-architected/',
    category: 'Cloud & Enterprise',
    badge: 'Official AWS',
    description: 'Architectural best practices and design principles across Reliability, Security, Performance Efficiency, Cost Optimization, and Operational Excellence.',
    highlights: ['Multi-AZ & cross-region disaster recovery patterns', 'Resiliency whitepapers & failure mode checklists', 'Enterprise cloud trade-off matrices'],
    freeTier: 'Free Whitepapers & Architecture Center',
  },
  {
    id: 7,
    name: 'Google Cloud Architecture Center',
    url: 'https://cloud.google.com/architecture',
    category: 'Cloud & Enterprise',
    badge: 'Official GCP',
    description: 'Reference architectures, blueprints, and implementation guides for global load balancing, Bigtable, Spanner, and hybrid multi-cloud systems.',
    highlights: ['Global Anycast Network routing patterns', 'Spanner TrueTime & distributed consensus', 'Zero-trust BeyondCorp security architectures'],
    freeTier: 'Free Architecture Blueprints & Guides',
  },
  {
    id: 8,
    name: 'Netflix Technology Blog',
    url: 'https://netflixtechblog.com/',
    category: 'Engineering Blogs',
    badge: 'Production Scale',
    description: 'First-hand architectural articles detailing how Netflix scales global video streaming, handles multi-region failovers, and runs Chaos Engineering.',
    highlights: ['Chaos Monkey & fault injection techniques', 'Active-active multi-region database replication', 'Microservice edge gateway & telemetry architecture'],
    freeTier: '100% Free Technical Publication',
  },
  {
    id: 9,
    name: 'Meta / Facebook Engineering Blog',
    url: 'https://engineering.fb.com/',
    category: 'Engineering Blogs',
    badge: 'Billions Scale',
    description: 'Deep technical articles detailing the distributed infrastructure, memcached clusters, TAO graph store, and data pipelines powering billions of users.',
    highlights: ['TAO distributed graph data store', 'Scaling Memcached to millions of ops/sec', 'Real-time telemetry and streaming infrastructure'],
    freeTier: '100% Free Engineering Blog',
  },
  {
    id: 10,
    name: 'ByteByteGo System Design Newsletter',
    url: 'https://blog.bytebytego.com/',
    category: 'Architecture Primers',
    badge: 'Visual Diagrams',
    description: 'Concise visual infographics and newsletter breakdowns simplifying complex system design topics, protocols, and architectural trade-offs.',
    highlights: ['Weekly visual system design infographics', 'Database indexing & replication deep dives', 'API protocols comparison (REST vs gRPC vs GraphQL vs WebSocket)'],
    freeTier: 'Free Weekly Newsletter & Visuals',
  },
];

export default function ReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedNote, setCopiedNote] = useState(false);

  const categories = ['All', 'Interview Roadmaps', 'Mock Interviews', 'Architecture Primers', 'Cloud & Enterprise', 'Engineering Blogs'];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const practiceNoteText = `PRACTICE STRATEGY & INTERVIEW PROBING NOTE:
Record your voice during mock interview practice sessions and listen back to refine your pacing, eliminate verbal fillers, and sharpen your delivery.
Proactively ask the interviewer clarifying probing questions before jumping into architectural assumptions. Approach design in progressive stages:
1. Clarify Requirements & Scope (Functional, Non-Functional, SLAs)
2. Quantitative Scale & Capacity Sizing (DAU, RPS, Bandwidth, Storage)
3. High-Level API & Component Contracts
4. Deep-Dive Storage, Cache, and Event Streams
5. Bottleneck Mitigations, Failure Modes, and Resiliency
Clarifying ambiguities up-front mirrors real-world client conversations—eliminating costly requirement rework, avoiding scope creep, and delivering products aligned strictly with expectations.`;

  const copyPracticeNote = async () => {
    try {
      await navigator.clipboard.writeText(practiceNoteText);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 21
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Reference Library & Free Roadmaps</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Curated 100% free system design interview roadmaps, mock video archives, cloud blueprints, and engineering publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-white/[0.08] bg-black/40 px-3.5 py-1.5 text-right">
            <span className="text-[10px] uppercase text-zinc-500 block font-mono">Curated Free Sources</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {resources.length} Verified Links
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Mobile Dropdown (< sm) */}
        <div className="block sm:hidden w-full">
          <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Category Filter:
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0c0d14] border border-indigo-500/30 text-white text-xs rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0c0d14] text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Desktop Category Buttons (>= sm) */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-white/[0.06] bg-[#0c0d14] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0c0d14] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
      </div>

      {/* Reference Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0d14] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#10121b] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-60">Resource & Platform</th>
                <th className="py-3 px-4 w-44">Category / Type</th>
                <th className="py-3 px-4">Description & Key Highlights</th>
                <th className="py-3 px-4 w-40 text-right">Access Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Number */}
                  <td className="py-3.5 px-4 font-mono text-zinc-500 text-center font-bold">
                    {String(res.id).padStart(2, '0')}
                  </td>

                  {/* Resource Name and Link */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-white group-hover:text-indigo-300 transition-colors"
                      >
                        <span>{res.name}</span>
                        <ExternalLink size={13} className="text-zinc-500 group-hover:text-indigo-400" />
                      </a>
                      <div className="font-mono text-[10px] text-zinc-500 truncate max-w-[220px]">
                        {res.url.replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                        {res.category}
                      </span>
                      <div className="text-[10px] font-mono text-indigo-400 block">
                        {res.badge}
                      </div>
                    </div>
                  </td>

                  {/* Description & Highlights */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <p className="text-zinc-300 leading-relaxed text-xs">
                      {res.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {res.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-black/40 border border-white/[0.04] px-1.5 py-0.5 rounded"
                        >
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Free Access Tier */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                      {res.freeTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Practice & Probing Note Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0e101f] via-[#0d0e17] to-[#120f22] p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-500/20 gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Mic size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  Pro-Engineering Habit
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Voice Recording & Proactive Interview Probing Practice
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                The proven system design interview strategy: eliminate assumptions, record and review your voice, and clear doubts in structured stages.
              </p>
            </div>
          </div>

          <button
            onClick={copyPracticeNote}
            className={clsx(
              'self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer shrink-0',
              copiedNote
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                : 'border-white/[0.1] bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
            )}
            title="Copy practice note to clipboard"
          >
            {copiedNote ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Advice</span>
              </>
            )}
          </button>
        </div>

        {/* Note Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-[11px] uppercase">
              <Mic size={14} /> 1. Record & Review Pacing
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Record your voice during mock sessions and listen back. Notice verbal fillers, rambling, or rushing through numbers. Clear, calm, paced communication signals staff-level maturity.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-[11px] uppercase">
              <HelpCircle size={14} /> 2. Ask Probing Questions First
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Never jump straight into drawing architecture. Ask targeted probing questions to clarify user scale, read/write ratios, latency budgets, payload sizes, and consistency requirements first.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-[11px] uppercase">
              <ShieldCheck size={14} /> 3. Progress in Stages
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Go in progressive stages: <code className="text-indigo-300">Clarify Scope → Back-of-Envelope Math → High-Level Blocks → Deep Dive → Failure Mitigation</code>. This prevents scope creep and delivers strict alignment.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-black/60 p-3.5 text-xs font-mono text-zinc-300 leading-relaxed">
          <span className="text-indigo-400 font-bold">Key Takeaway: </span>
          &ldquo;Proactive probing prevents assumptions, ensures strict adherence to client expectations, and delivers the final architecture with minimal requirement corrections and zero scope creeps.&rdquo;
        </div>
      </div>
    </div>
  );
}
