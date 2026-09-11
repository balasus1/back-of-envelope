'use client';

import React from 'react';
import { GithubIcon, XTwitterIcon, LinkedinIcon } from './Icons';

interface FooterProps {
  variant?: 'landing' | 'dashboard';
}

export function Footer({ variant = 'dashboard' }: FooterProps) {
  const isLanding = variant === 'landing';

  return (
    <footer
      className={`sticky bottom-0 z-30 h-[35px] border-t border-white/[0.08] bg-[#07080c]/95 backdrop-blur-md px-4 sm:px-6 flex items-center shrink-0 select-none ${
        isLanding ? 'w-full' : 'w-full bg-[#07080c]/90'
      }`}
    >
      <div
        className={`w-full flex items-center justify-between gap-4 h-full ${
          isLanding ? 'max-w-7xl mx-auto' : ''
        }`}
      >
        <div className="flex items-center text-xs text-zinc-500 font-mono">
          <span>© {new Date().getFullYear()}&nbsp;</span>
          <a
            href="https://portfolio.balashan.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-2"
            title="Bala Shan Portfolio"
          >
            balashan.dev
          </a>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <a
            href="https://github.com/balasus1/back-of-envelope"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group"
            title="GitHub Repository"
          >
            <GithubIcon size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
            <span className="hidden xs:inline sm:inline">GitHub</span>
          </a>
          <a
            href="https://x.com/balashan0027"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group"
            title="X / Twitter @balashan0027"
          >
            <XTwitterIcon size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
            <span>balashan0027</span>
          </a>
          <a
            href="https://linkedin.com/in/spike0027"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group"
            title="LinkedIn /spike0027"
          >
            <LinkedinIcon size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
            <span>spike0027</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
