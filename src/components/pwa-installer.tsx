
"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PwaInstaller() {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          toast({
            title: 'PWA Registration Failed',
            description: 'Could not register service worker for installability.',
            variant: 'destructive',
          });
        });
    }
  }, [toast]);

  return null; // This component does not render anything
}
