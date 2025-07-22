
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle, LayoutDashboard, TestTubeDiagonal } from 'lucide-react';

const HeaderLogo = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <defs>
      <linearGradient id="blueGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3ea8ff" />
        <stop offset="100%" stopColor="#266bff" />
      </linearGradient>
    </defs>
    <path d="M 15 25 H 80 L 30 80 H 65" 
          stroke="url(#blueGradientHeader)" 
          strokeWidth="10" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <circle cx="75" cy="28" r="6" fill="#24b0ff" />
  </svg>
  );

export default function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    // Clear the session cookie to ensure middleware recognizes the logout state
    document.cookie = "firebase-auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'QA';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
           <HeaderLogo />
          <span className="font-headline text-xl font-bold text-foreground">Zenit Tracker</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/new-session')}>
            <TestTubeDiagonal className="mr-2 h-4 w-4" />
            New Test Session
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "QA User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/30 focus:text-destructive-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
