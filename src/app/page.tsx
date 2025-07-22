
"use client";

import SplashScreen from "@/components/SplashScreen";

// This is now a Server Component by default
export default function RootPage() {
  // It renders the SplashScreen, which is a Client Component
  return <SplashScreen />;
}
