import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '../components/AppShell';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  themeColor: '#090a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://systemdesign.balashan.dev'),
  title: {
    default: 'System Design Studio — Free Back-of-the-Envelope Calculator & Interview Rubric',
    template: '%s | System Design Studio',
  },
  description:
    'Free back-of-the-envelope calculation engine and 16-layer architecture rubric for software engineering interviews. Derive Peak RPS, Kafka brokers, DB replicas, cache RAM, and cloud costs with zero guesswork. 100% free, no sign-up required.',
  keywords: [
    'system design interview',
    'back of envelope calculation',
    'system design capacity planning',
    'distributed systems sizing',
    'FAANG system design',
    'system design interview rubric',
    'kafka partition calculator',
    'database replica sizing',
    'cloud infrastructure cost estimator',
    'software engineering interview preparation',
    'system architecture interview cheat sheet',
  ],
  authors: [{ name: 'Bala Shan', url: 'https://balashan.dev' }],
  creator: 'Bala Shan',
  publisher: 'System Design Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://systemdesign.balashan.dev',
    siteName: 'System Design Studio',
    title: 'System Design Studio — Free Back-of-the-Envelope Calculator & Interview Rubric',
    description:
      'Master back-of-the-envelope calculations and probing questions for FAANG system design interviews. 100% free with no login or credit card required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System Design Studio — Free Back-of-the-Envelope Calculator & Interview Rubric',
    description:
      'Stop failing system design interviews on basic capacity estimations. Derive Peak RPS, storage, brokers, and cloud costs in seconds. 100% free.',
  },
  alternates: {
    canonical: 'https://systemdesign.balashan.dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'System Design Studio',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Production-grade system design back-of-the-envelope interview calculation engine and 16-layer architecture grading rubric.',
    url: 'https://systemdesign.balashan.dev',
    author: {
      '@type': 'Person',
      name: 'Bala Shan',
      url: 'https://balashan.dev',
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#090a0f] text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AppShell>
          {children}
        </AppShell>
        <Analytics />
      </body>
    </html>
  );
}
