'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../lib/store';
import {
  Home,
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
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Columns,
} from 'lucide-react';
import clsx from 'clsx';

interface RouteGroup {
  title: string;
  items: {
    name: string;
    path: string;
    sheetNum: string;
    icon: any;
  }[];
}

const routeGroups: RouteGroup[] = [
  {
    title: 'CONFIGURATION',
    items: [
      { name: 'Home / Landing', path: '/', sheetNum: '00', icon: Home },
      { name: 'Control Panel', path: '/studio', sheetNum: '01', icon: Sliders },
    ],
  },
  {
    title: 'TRAFFIC & EDGE',
    items: [
      { name: 'User Metrics', path: '/metrics', sheetNum: '02', icon: Users },
      { name: 'Frontend & CDN', path: '/frontend', sheetNum: '03', icon: Globe },
      { name: 'API Gateway', path: '/gateway', sheetNum: '04', icon: Shield },
      { name: 'Load Balancer', path: '/lb', sheetNum: '05', icon: GitBranch },
    ],
  },
  {
    title: 'COMPUTE & DATA',
    items: [
      { name: 'Backend Services', path: '/backend', sheetNum: '06', icon: Cpu },
      { name: 'Network Latency', path: '/latency', sheetNum: '07', icon: Clock },
      { name: 'Kafka Event Bus', path: '/kafka', sheetNum: '08', icon: Radio },
      { name: 'Database (PG)', path: '/db', sheetNum: '09', icon: Database },
      { name: 'Cache (Redis)', path: '/cache', sheetNum: '10', icon: Layers },
    ],
  },
  {
    title: 'RESILIENCY & OPS',
    items: [
      { name: 'DLQ & Errors', path: '/dlq', sheetNum: '11', icon: AlertTriangle },
      { name: 'Traffic Spikes & DDoS', path: '/spikes', sheetNum: '12', icon: Flame },
      { name: 'Observability', path: '/observability', sheetNum: '13', icon: Activity },
    ],
  },
  {
    title: 'CLOUD & COST',
    items: [
      { name: 'Cloud Mapping', path: '/cloud', sheetNum: '14', icon: Cloud },
      { name: 'Infra Picker', path: '/infra', sheetNum: '15', icon: Server },
      { name: 'Cost Estimator', path: '/cost', sheetNum: '16', icon: DollarSign },
    ],
  },
  {
    title: 'REVIEW & PRACTICE',
    items: [
      { name: 'Summary Cheatsheet', path: '/summary', sheetNum: '17', icon: FileText },
      { name: 'Interview Practice', path: '/practice', sheetNum: '18', icon: HelpCircle },
      { name: 'Live Architecture', path: '/architecture', sheetNum: '19', icon: Network },
      { name: 'Rubric & Checklist', path: '/rubric', sheetNum: '20', icon: CheckSquare },
      { name: 'Reference Library', path: '/reference', sheetNum: '21', icon: BookOpen },
      { name: '30 Core Concepts', path: '/concepts', sheetNum: '22', icon: Sparkles },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useStore();

  // Desktop collapse state (default collapsed as requested)
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-collapse timer when expanded and not pinned
  const startAutoCollapseTimer = (seconds: number = 4) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPinned) {
      timerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, seconds * 1000);
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isCollapsed && !isPinned) {
      startAutoCollapseTimer(4);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isCollapsed, isPinned]);

  const handleMouseEnter = () => {
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (!isPinned && !isCollapsed) {
      startAutoCollapseTimer(1.5);
    }
  };

  // Group split for 2-column desktop expanded layout
  const col1Groups = routeGroups.slice(0, 3); // CONFIGURATION, TRAFFIC & EDGE, COMPUTE & DATA
  const col2Groups = routeGroups.slice(3);    // RESILIENCY & OPS, CLOUD & COST, REVIEW & PRACTICE

  return (
    <>
      {/* Desktop Sidebar (Collapsible with 2-Column Expansion) */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          'hidden md:flex bg-[#0a0b10] border-r border-white/[0.08] h-screen flex-col flex-shrink-0 font-sans select-none no-print transition-all duration-300 relative z-30',
          isCollapsed ? 'w-15' : 'w-[520px] shadow-2xl ring-1 ring-indigo-500/20'
        )}
      >
        {/* Header */}
        <div className="p-3 border-b border-white/[0.08] bg-[#0d0e15] flex items-center justify-between flex-shrink-0 h-13">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)] shrink-0 hover:scale-105 transition-transform"
              title="System Design Studio"
            >
              <Radio size={16} className="text-white" />
            </Link>

            {!isCollapsed && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <h1 className="text-xs font-bold text-white leading-none tracking-tight truncate">
                  System Design Studio
                </h1>
                <p className="text-[9.5px] text-zinc-400 mt-0.5 font-mono uppercase tracking-wider flex items-center gap-1">
                  <Columns size={10} className="text-indigo-400" />
                  <span>2-Column Architecture Menu</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={clsx(
                  'p-1.5 rounded-md border text-xs transition-colors cursor-pointer',
                  isPinned
                    ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300'
                    : 'border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                )}
                title={isPinned ? 'Unpin (Auto-collapse enabled)' : 'Pin Menu (Keep expanded)'}
              >
                {isPinned ? <Pin size={13} className="text-indigo-400" /> : <PinOff size={13} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const nextState = !isCollapsed;
                setIsCollapsed(nextState);
                if (nextState) setIsPinned(false);
              }}
              className="p-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand 2-Column Menu' : 'Collapse Menu'}
            >
              {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>
        </div>

        {/* Collapsed Icon Bar Mode (Slim, default) */}
        {isCollapsed ? (
          <div className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3 flex flex-col items-center">
            {routeGroups.map((group) => (
              <div key={group.title} className="space-y-1 w-full flex flex-col items-center">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <div key={item.path} className="relative group/icon w-full flex justify-center">
                      <Link
                        href={item.path}
                        className={clsx(
                          'w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-all relative',
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-indigo-400/50'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
                        )}
                      >
                        <Icon size={15} />
                      </Link>

                      {/* Tooltip on Hover */}
                      <div className="hidden group-hover/icon:flex absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md border border-white/[0.1] bg-[#0c0d14]/98 shadow-xl text-left z-50 pointer-events-none whitespace-nowrap animate-in fade-in duration-100">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold mr-1.5">
                          {item.sheetNum}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="w-4 h-[1px] bg-white/[0.06] my-1" />
              </div>
            ))}
          </div>
        ) : (
          /* Expanded 2-Column Menu Layout */
          <div className="flex-1 overflow-y-auto p-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Column 1 */}
              <div className="space-y-4">
                {col1Groups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <div className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-400/80">
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={clsx(
                            'group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all duration-150',
                            isActive
                              ? 'bg-indigo-600/25 text-white font-semibold border border-indigo-500/40 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon
                              size={13}
                              className={clsx(
                                'transition-colors shrink-0',
                                isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
                              )}
                            />
                            <span className="truncate text-[11.5px]">{item.name}</span>
                          </div>
                          <span
                            className={clsx(
                              'text-[9.5px] font-mono px-1 rounded shrink-0',
                              isActive ? 'text-indigo-300 bg-indigo-500/30' : 'text-zinc-500'
                            )}
                          >
                            {item.sheetNum}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {col2Groups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <div className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-purple-400/80">
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={clsx(
                            'group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all duration-150',
                            isActive
                              ? 'bg-indigo-600/25 text-white font-semibold border border-indigo-500/40 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon
                              size={13}
                              className={clsx(
                                'transition-colors shrink-0',
                                isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
                              )}
                            />
                            <span className="truncate text-[11.5px]">{item.name}</span>
                          </div>
                          <span
                            className={clsx(
                              'text-[9.5px] font-mono px-1 rounded shrink-0',
                              isActive ? 'text-indigo-300 bg-indigo-500/30' : 'text-zinc-500'
                            )}
                          >
                            {item.sheetNum}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-2.5 border-t border-white/[0.08] bg-[#0d0e15]/80 text-[10px] text-zinc-500 font-mono flex-shrink-0">
          {isCollapsed ? (
            <div className="flex justify-center" title="Live Model Active">
              <span className="text-emerald-400 text-xs">●</span>
            </div>
          ) : (
            <div className="flex items-center justify-between px-1">
              <span>{isPinned ? '📌 Menu Pinned' : '⏳ Auto-collapse in 4s'}</span>
              <span className="text-emerald-400">● Live Sizing</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex font-sans select-none">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] bg-[#0a0b10] border-r border-white/[0.1] h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3.5 border-b border-white/[0.08] bg-[#0d0e15] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                  <Radio size={15} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xs font-bold text-white leading-none tracking-tight">
                    System Design Studio
                  </h1>
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase tracking-wider">
                    Architecture & Sizing
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
              {routeGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div className="px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-widest text-indigo-400/80">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={clsx(
                          'group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all',
                          isActive
                            ? 'bg-indigo-600/25 text-white font-semibold border border-indigo-500/40 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-zinc-500'} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {item.sheetNum}
                        </span>
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
