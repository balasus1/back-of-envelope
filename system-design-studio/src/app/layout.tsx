import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/Sidebar';

const lora = Lora({ subsets: ['latin'] });
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
    <html lang="en">
      <body className={`${lora.className} bg-[#f4f4f4] text-gray-900 h-screen flex overflow-hidden text-sm`}>
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto bg-[#fdfdfd] p-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
          {children}
        </main>
      </body>
    </html>
  );
}
