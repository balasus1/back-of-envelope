'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Marketing Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090a0f]/80 border-b border-white/[0.08] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                📐
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base tracking-tight text-white block">
                  System Design Studio
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block -mt-0.5">
                  Back-of-Envelope & Rubric
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
              <a href="#problem" className="hover:text-white transition-colors">Why It Matters</a>
              <a href="#calculator" className="hover:text-white transition-colors">Live Math Engine</a>
              <a href="#features" className="hover:text-white transition-colors">16 Architecture Layers</a>
              <a href="#scenarios" className="hover:text-white transition-colors">10 FAANG Scenarios</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/rubric"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs font-medium text-zinc-300 transition-colors"
              >
                <span>View Rubric</span>
              </Link>
              <Link
                href="/studio"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer group"
              >
                <span>Launch Studio Free</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </header>

        {/* Landing Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Marketing Footer */}
        <footer className="border-t border-white/[0.08] bg-[#07080c] py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs">
                📐
              </div>
              <span>System Design Studio — 100% Free & Open System Architecture Sizing Engine</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/studio" className="hover:text-zinc-300 transition-colors">Control Panel</Link>
              <Link href="/metrics" className="hover:text-zinc-300 transition-colors">User Metrics</Link>
              <Link href="/rubric" className="hover:text-zinc-300 transition-colors">Swim Lane Rubric</Link>
              <Link href="/reference" className="hover:text-zinc-300 transition-colors">Reference Library</Link>
              <Link href="/architecture" className="hover:text-zinc-300 transition-colors">Mermaid Diagrams</Link>
              <Link href="/cost" className="hover:text-zinc-300 transition-colors">AWS Cost Engine</Link>
            </div>

            <div className="text-zinc-600 font-mono text-[11px]">
              No Login • No Sign-Up • Instant Access
            </div>
          </div>
        </footer>

        <CommandPalette />
      </div>
    );
  }

  // Studio / Internal Sheets Shell
  return (
    <div className="bg-[#090a0f] text-zinc-100 h-screen flex overflow-hidden antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 bg-[#090a0f]">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
