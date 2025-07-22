import type { ReactNode } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is available for app-specific toasts if needed

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      {/* Toaster is in RootLayout, but can be added here too if scoped toasts are needed */}
    </div>
  );
}
