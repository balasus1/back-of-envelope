'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import { Footer } from './Footer';
import { TriangleScaleIcon } from './Icons';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Marketing Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090a0f]/80 border-b border-white/[0.08] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <TriangleScaleIcon size={16} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white block leading-none">
                  System Design
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-1 leading-none">
                  Back-of-Envelope & Rubric
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Landing Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Marketing Footer */}
        <Footer variant="landing" />

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
        <Footer variant="dashboard" />
      </div>
      <CommandPalette />
    </div>
  );
}
