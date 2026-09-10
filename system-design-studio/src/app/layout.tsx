import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'System Design Studio',
  description: 'FAANG-style system design interview calculator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 h-screen flex overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto bg-slate-950 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
