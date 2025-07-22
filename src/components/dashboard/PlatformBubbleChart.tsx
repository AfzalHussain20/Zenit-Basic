
"use client";

import { useMemo } from 'react';
import type { TestSession } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shapes } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlatformStats {
  platformName: string;
  total: number;
  pass: number;
  fail: number;
  failKnown: number;
  na: number;
}

interface PlatformBubbleChartProps {
  sessions: TestSession[];
}

export default function PlatformBubbleChart({ sessions }: PlatformBubbleChartProps) {
  const platformData = useMemo(() => {
    const stats: { [key: string]: PlatformStats } = {};

    sessions.forEach(session => {
      const name = session.platformDetails.platformName;
      if (!stats[name]) {
        stats[name] = { platformName: name, total: 0, pass: 0, fail: 0, failKnown: 0, na: 0 };
      }
      stats[name].total += session.summary?.total || 0;
      stats[name].pass += session.summary?.pass || 0;
      stats[name].fail += session.summary?.fail || 0;
      stats[name].failKnown += session.summary?.failKnown || 0;
      stats[name].na += session.summary?.na || 0;
    });

    return Object.values(stats).filter(p => p.total > 0).sort((a,b) => b.total - a.total);
  }, [sessions]);

  if (sessions.length === 0 || platformData.length === 0) {
     return null;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Shapes /> Platform Health Overview
        </CardTitle>
        <CardDescription>
            Each bubble represents a platform. Size indicates test volume, color indicates pass rate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <motion.div 
            className="flex flex-wrap gap-4 items-center justify-center p-4 min-h-[250px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {platformData.map((platform) => {
              const tested = platform.pass + platform.fail + platform.failKnown;
              const passRate = tested > 0 ? platform.pass / tested : 0;
              const hue = passRate * 120; // 0 is red, 120 is green
              const size = Math.max(60, Math.min(180, Math.sqrt(platform.total) * 12));
              
              return (
                <Tooltip key={platform.platformName}>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={bubbleVariants}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full flex items-center justify-center text-center cursor-pointer shadow-lg"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: `hsla(${hue}, 60%, 50%, 0.8)`,
                        borderColor: `hsla(${hue}, 60%, 40%, 1)`,
                        borderWidth: '2px',
                      }}
                    >
                      <div className="text-white font-bold p-2 break-words" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                         {platform.platformName}
                         <span className="block text-xs font-normal opacity-90">{platform.total} cases</span>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 bg-background border-primary shadow-2xl rounded-lg">
                    <p className="font-bold text-lg text-primary">{platform.platformName}</p>
                    <p><span className="text-green-500 font-semibold">Pass:</span> {platform.pass}</p>
                    <p><span className="text-destructive font-semibold">Fail (New):</span> {platform.fail}</p>
                    <p><span className="text-orange-500 font-semibold">Fail (Known):</span> {platform.failKnown}</p>
                    <p><span className="text-muted-foreground font-semibold">N/A:</span> {platform.na}</p>
                    <p className="font-bold mt-1">Total: {platform.total}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </motion.div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
