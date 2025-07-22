
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import type { TestSession } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Loader2, ChevronsRight, FolderClock, FolderCheck, ArchiveX } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ExportDataButton from '@/components/dashboard/ExportDataButton';
import TestCaseTable from '@/components/dashboard/TestCaseTable';
import TesterProfileCard from '@/components/dashboard/TesterProfileCard';
import OverallStatsChart from '@/components/dashboard/OverallStatsChart';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    const sessionsQuery = query(
        collection(db, 'testSessions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
        const fetchedSessions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date()
            } as TestSession;
        });
        setSessions(fetchedSessions);
        setLoading(false);
    }, (err) => {
        console.error("Failed to fetch sessions:", err);
        setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-20rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="sr-only">Loading dashboard...</p>
      </div>
    );
  }

  const activeSessions = sessions.filter(s => s.status === 'In Progress' || s.status === 'Aborted');
  const completedSessions = sessions.filter(s => s.status === 'Completed');

  const overallStats = sessions.reduce(
    (acc, session) => {
      acc.pass += session.summary?.pass || 0;
      acc.fail += session.summary?.fail || 0;
      acc.failKnown += session.summary?.failKnown || 0;
      acc.na += session.summary?.na || 0;
      acc.untested += session.summary?.untested || 0;
      return acc;
    },
    { pass: 0, fail: 0, failKnown: 0, na: 0, untested: 0 }
  );

  const SessionList = ({ title, sessions, icon }: { title: string; sessions: TestSession[]; icon: React.ReactNode }) => (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3"><span className="text-primary">{icon}</span>{title}</CardTitle>
        <CardDescription>{sessions.length} session(s) found.</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {sessions.map(session => {
              const summary = session.summary || { pass: 0, fail: 0, na: 0, failKnown: 0, total: 0 };
              const completedCount = summary.pass + summary.fail + summary.na + summary.failKnown;
              const completion = summary.total > 0 ? Math.round((completedCount / summary.total) * 100) : 0;
              const createdAt = session.createdAt;
              const isAborted = session.status === 'Aborted';
              const canContinue = session.status === 'In Progress' || session.status === 'Aborted';
              
              return (
                <AccordionItem value={session.id} key={session.id}>
                  <AccordionTrigger className="hover:bg-muted/50 p-2 rounded-md transition-colors -m-2">
                    <div className="w-full text-left">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold truncate">{session.platformDetails.platformName}</p>
                        <p className="text-xs text-muted-foreground">{format(createdAt, "PPP")}</p>
                      </div>
                       <div className="flex items-center gap-2 mt-2">
                        {isAborted ? (
                           <div className="flex items-center gap-2 text-sm text-amber-500 w-full">
                            <ArchiveX className="h-4 w-4" />
                            <span>Paused (Aborted)</span>
                          </div>
                        ) : (
                          <>
                            <Progress value={completion} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{completion}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-1">
                    <TestCaseTable sessionId={session.id} />
                      <div className="text-center mt-2">
                         <Button asChild variant="link" size="sm">
                            <Link href={`/dashboard/session/${canContinue ? session.id : `${session.id}/results`}`}>
                                {canContinue ? 'Continue Session' : 'View Full Report'} <ChevronsRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No {title.toLowerCase()} found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName || 'Tester'}! Here's your QA overview.</p>
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <ExportDataButton userId={user?.uid || null} />
          <Button asChild>
            <Link href="/dashboard/new-session">
              <PlusCircle className="mr-2" />
              New Session
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
            {user && <TesterProfileCard user={user} />}
        </div>
        <div className="lg:col-span-2">
            <OverallStatsChart data={overallStats} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SessionList title="Active Sessions" sessions={activeSessions} icon={<FolderClock />} />
        <SessionList title="Completed Sessions" sessions={completedSessions} icon={<FolderCheck />} />
      </div>
    </div>
  );
}
