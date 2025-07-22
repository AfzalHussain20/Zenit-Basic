
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SplashScreen = () => (
    <div className="splash-container">
       <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[150px] h-[150px]">
        <defs>
          <linearGradient id="blueGradientSplash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#3ea8ff" />
            <stop offset="100%" stopColor="#266bff" />
          </linearGradient>
        </defs>
        <path 
              className="z-path"
              d="M 15 25 H 80 L 30 80 H 65" 
              stroke="url(#blueGradientSplash)" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"/>
        <circle 
              className="z-dot"
              cx="75" cy="28" r="5" fill="#24b0ff" />
      </svg>
      <h1 className="text-4xl font-headline font-bold text-foreground mt-4">
        Zenit Tracker
      </h1>
      <p className="text-muted-foreground mt-2">
        Precision in Every Test.
      </p>
    </div>
);


export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/dashboard');
        } else {
          router.replace('/login');
        }
      }, 2500); 

      return () => clearTimeout(timer); 
    }
  }, [user, loading, router]);

  return <SplashScreen />;
}
