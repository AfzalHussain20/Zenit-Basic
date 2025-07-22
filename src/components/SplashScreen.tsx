
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This component solely displays the visual content of the splash screen.
const SplashScreenContent = () => (
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

// This component handles the redirection logic after the splash screen animation.
export default function SplashScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect after the authentication state is resolved.
    if (!loading) {
      const timer = setTimeout(() => {
        // The middleware handles the initial redirect. This is a client-side
        // fallback to navigate the user after the animation finishes.
        router.replace(user ? '/dashboard' : '/login');
      }, 2500); // This duration should match your splash screen animation time.

      return () => clearTimeout(timer); // Cleanup timer on component unmount.
    }
  }, [user, loading, router]);

  // Render the visual part of the splash screen.
  // The redirection logic runs in the background.
  return <SplashScreenContent />;
}
