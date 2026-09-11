'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../lib/store';
import {
  Sliders,
  Users,
  Globe,
  Shield,
  GitBranch,
  Cpu,
  Clock,
  Radio,
  Database,
  Layers,
  AlertTriangle,
  Flame,
  Activity,
  Cloud,
  Server,
  DollarSign,
  FileText,
  HelpCircle,
  Network,
  CheckSquare,
  BookOpen,
  Sparkles,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import clsx from 'clsx';
import { TriangleScaleIcon } from './Icons';

interface RouteGroup {
  title: string;
  items: {
    name: string;
    path: string;
    icon: any;
  }[];
}

const routeGroups: RouteGroup[] = [
  {
    title: 'CONFIGURATION',
    items: [
      { name: 'Control Panel', path: '/studio', icon: Sliders },
    ],
  },
  {
    title: 'TRAFFIC & EDGE',
    items: [
      { name: 'User Metrics', path: '/metrics', icon: Users },
      { name: 'Frontend & CDN', path: '/frontend', icon: Globe },
      { name: 'API Gateway', path: '/gateway', icon: Shield },
      { name: 'Load Balancer', path: '/lb', icon: GitBranch },
    ],
  },
  {
    title: 'COMPUTE & DATA',
    items: [
      { name: 'Backend Services', path: '/backend', icon: Cpu },
      { name: 'Network Latency', path: '/latency', icon: Clock },
      { name: 'Kafka Event Bus', path: '/kafka', icon: Radio },
      { name: 'Database (PG)', path: '/db', icon: Database },
      { name: 'Cache (Redis)', path: '/cache', icon: Layers },
    ],
  },
  {
    title: 'RESILIENCY & OPS',
    items: [
      { name: 'DLQ & Errors', path: '/dlq', icon: AlertTriangle },
      { name: 'Traffic Spikes & DDoS', path: '/spikes', icon: Flame },
      { name: 'Observability', path: '/observability', icon: Activity },
    ],
  },
  {
    title: 'CLOUD & COST',
    items: [
      { name: 'Cloud Mapping', path: '/cloud', icon: Cloud },
      { name: 'Infra Picker', path: '/infra', icon: Server },
      { name: 'Cost Estimator', path: '/cost', icon: DollarSign },
    ],
  },
  {
    title: 'REVIEW & PRACTICE',
    items: [
      { name: 'Summary Cheatsheet', path: '/summary', icon: FileText },
      { name: 'Interview Practice', path: '/practice', icon: HelpCircle },
      { name: 'Live Architecture', path: '/architecture', icon: Network },
      { name: 'Rubric & Checklist', path: '/rubric', icon: CheckSquare },
      { name: 'Reference Library', path: '/reference', icon: BookOpen },
      { name: '30 Core Concepts', path: '/concepts', icon: Sparkles },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useStore();

  // Desktop manual expand/collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden md:flex bg-[#0a0b10] border-r border-white/[0.08] h-screen flex-col flex-shrink-0 font-sans select-none no-print transition-all duration-200 relative z-30',
          isCollapsed ? 'w-12' : 'w-[150px]'
        )}
      >
        {/* Header with Prominent Expand/Collapse Button */}
        <div className="p-2 border-b border-white/[0.08] bg-[#0d0e15] flex items-center justify-between flex-shrink-0 h-11">
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-1.5 min-w-0 group" title="System Design">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shrink-0">
                  <TriangleScaleIcon size={13} className="text-white" />
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Collapse Menu (Show icons only)"
                aria-label="Collapse Menu"
              >
                <PanelLeftClose size={15} />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="w-8 h-8 rounded-lg border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                title="Expand Menu (Show text names)"
                aria-label="Expand Menu"
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Area with Hidden Scrollbar */}
        <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2">
          {/* Collapsed State: ICONS ONLY */}
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-2.5 px-1">
              {routeGroups.map((group) => (
                <div key={group.title} className="w-full flex flex-col items-center space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <div key={item.path} className="relative group w-full flex justify-center">
                        <Link
                          href={item.path}
                          title={item.name}
                          className={clsx(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                            isActive
                              ? 'bg-indigo-600 text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)] border border-indigo-400/50'
                              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                          )}
                        >
                          <Icon size={14} />
                        </Link>

                        {/* Floating Tooltip Label on Hover */}
                        <div className="hidden group-hover:flex items-center absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md border border-white/[0.15] bg-[#0e1017] shadow-2xl text-[11px] font-semibold text-white whitespace-nowrap z-50 pointer-events-none drop-shadow-lg">
                          {item.name}
                        </div>
                      </div>
                    );
                  })}
                  <div className="w-4 h-[1px] bg-white/[0.06] my-0.5" />
                </div>
              ))}
            </div>
          ) : (
            /* Expanded State: CLEAN TEXT NAMES ONLY (NO ICONS, NO NUMBERING) */
            <div className="space-y-3 px-2">
              {routeGroups.map((group) => (
                <div key={group.title} className="space-y-0.5">
                  <div className="px-1.5 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={clsx(
                          'block px-1.5 py-1 rounded-md text-[11px] transition-all',
                          isActive
                            ? 'bg-indigo-600/25 text-white font-semibold border border-indigo-500/40 shadow-sm'
                            : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                        )}
                      >
                        <span className="truncate block leading-tight">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-2.5 border-t border-white/[0.08] bg-[#0d0e15]/80 text-[10px] text-zinc-500 font-mono flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-1">
              <span>Pure JS Engine</span>
              <span className="text-emerald-400 font-bold">● Live</span>
            </div>
          ) : (
            <div className="flex justify-center" title="Pure JS Engine Live">
              <span className="text-emerald-400 text-xs">●</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex font-sans select-none">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#0a0b10] border-r border-white/[0.1] h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3.5 border-b border-white/[0.08] bg-[#0d0e15] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                  <TriangleScaleIcon size={14} className="text-white" />
                </div>
                <h1 className="text-xs font-bold text-white">System Design</h1>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="p-3 space-y-4 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {routeGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div className="px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={clsx(
                          'block px-3 py-2 rounded-lg text-xs transition-all',
                          isActive
                            ? 'bg-indigo-600/25 text-white font-semibold border border-indigo-500/40 shadow-sm'
                            : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        <span className="truncate block">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
