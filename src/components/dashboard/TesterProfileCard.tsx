
"use client";

import type { User } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';

interface TesterProfileCardProps {
  user: User;
}

export default function TesterProfileCard({ user }: TesterProfileCardProps) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'QA';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col justify-center">
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback className="text-3xl bg-card">
             { user.photoURL ? getInitials(user.displayName) : <UserCircle className="h-12 w-12 text-muted-foreground" /> }
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-headline">{user.displayName || 'QA Tester'}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="text-center pt-0">
        <p className="text-sm text-muted-foreground">Welcome back! Ready for the next session?</p>
      </CardContent>
    </Card>
  );
}
