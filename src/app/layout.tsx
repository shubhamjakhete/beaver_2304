import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { TitleBar } from '@/components/dashboard/TitleBar';
import { BottomNav } from '@/components/dashboard/BottomNav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Beaver Project 2304 — IndianTown Water Monitoring',
  description: 'Real-time water quality monitoring dashboard for IndianTown STP, Project 2304.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${inter.variable}`}
    >
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col gap-[10px] p-[14px_18px_16px]">
            <TitleBar />
            <main className="flex flex-col gap-[10px] flex-1">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
