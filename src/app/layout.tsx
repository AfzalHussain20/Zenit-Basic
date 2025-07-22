
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import PwaInstaller from '@/components/pwa-installer';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: 'Zenit QA Tracker',
  description: 'Precision in Every Test. A QA management application for streamlined testing.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1b2433" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <AuthProvider>
          {children}
          <Toaster />
          <PwaInstaller />
        </AuthProvider>
      </body>
    </html>
  );
}
