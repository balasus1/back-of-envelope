'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, Compass, Zap, Cpu, Database, Server, Layers, HelpCircle, BookOpen } from 'lucide-react';
import { useStore, Scenario } from '../lib/store';
import clsx from 'clsx';

const allRoutes = [
  { name: '0. Home / Landing', path: '/', category: 'Core', icon: Compass },
  { name: '1. Master Control Panel', path: '/studio', category: 'Core', icon: Zap },
  { name: '2. User Metrics (Funnel)', path: '/metrics', category: 'Edge & Users', icon: Compass },
  { name: '3. Frontend & CDN', path: '/frontend', category: 'Edge & Users', icon: Layers },
  { name: '4. API Gateway & Edge', path: '/gateway', category: 'Edge & Users', icon: Server },
  { name: '5. Load Balancer (NLB/ALB)', path: '/lb', category: 'Edge & Users', icon: Server },
  { name: '6. Backend Microservices', path: '/backend', category: 'Compute', icon: Cpu },
  { name: '7. Network Latency Waterfall', path: '/latency', category: 'Network', icon: Compass },
  { name: '8. Kafka Event Bus', path: '/kafka', category: 'Async Queue', icon: Layers },
  { name: '9. Database Design (PostgreSQL)', path: '/db', category: 'Storage', icon: Database },
  { name: '10. Cache Tier (Redis Cluster)', path: '/cache', category: 'Storage', icon: Database },
  { name: '11. DLQ & Retry Logic', path: '/dlq', category: 'Resiliency', icon: Layers },
  { name: '12. Traffic Spikes & DDoS', path: '/spikes', category: 'Resiliency', icon: Zap },
  { name: '13. Observability (Logs/Traces/Metrics)', path: '/observability', category: 'Ops', icon: Compass },
  { name: '14. Cloud Provider Equivalence', path: '/cloud', category: 'Cloud', icon: Layers },
  { name: '15. Cloud Infra Instance Picker', path: '/infra', category: 'Cloud', icon: Cpu },
  { name: '16. Cost Estimator (AWS Mo/Yr)', path: '/cost', category: 'Cloud', icon: Zap },
  { name: '17. Final Summary Cheatsheet', path: '/summary', category: 'Interview', icon: Compass },
  { name: '18. Interview Practice Flashcards', path: '/practice', category: 'Interview', icon: HelpCircle },
  { name: '19. Live Architecture Diagram (Mermaid)', path: '/architecture', category: 'Visuals', icon: Layers },
  { name: '20. System Design Rubric & Checklist', path: '/rubric', category: 'Interview', icon: HelpCircle },
  { name: '21. Reference Library & Free Roadmaps', path: '/reference', category: 'Interview', icon: BookOpen },
  { name: '22. 30 Core Concepts & Math Primer', path: '/concepts', category: 'Interview', icon: Zap },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, setScenario } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  const filteredRoutes = allRoutes.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    router.push(path);
    setCommandPaletteOpen(false);
  };

  if (!commandPaletteOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/75 backdrop-blur-md animate-in fade-in duration-100"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-white/[0.12] bg-[#0c0d14] shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.08] bg-[#10121a]">
          <Search size={16} className="text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sheets, models, calculations... (Type 'Black Friday' to switch scenario)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filteredRoutes.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter' && filteredRoutes[selectedIndex]) {
                e.preventDefault();
                handleSelect(filteredRoutes[selectedIndex].path);
              }
            }}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/[0.06] rounded border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredRoutes.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              No matching sheets or models found.
            </div>
          ) : (
            filteredRoutes.map((route, idx) => {
              const Icon = route.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={route.path + route.name}
                  onClick={() => handleSelect(route.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={clsx(
                    'w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors',
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isSelected ? 'text-indigo-400' : 'text-zinc-500'} />
                    <span className="text-xs font-medium">{route.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500">
                    {route.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-[#090a0f] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 font-mono">21 System Design Sheets</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
