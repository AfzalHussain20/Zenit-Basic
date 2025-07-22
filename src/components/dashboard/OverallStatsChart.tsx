
"use client";

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

interface OverallStatsChartProps {
  data: {
    pass: number;
    fail: number;
    failKnown: number;
    na: number;
    untested: number;
  };
}

const chartConfig = {
  pass: { label: "Pass", color: "hsl(var(--chart-2))" },
  fail: { label: "Fail (New)", color: "hsl(var(--destructive))" },
  failKnown: { label: "Fail (Known)", color: "hsl(24, 9.8%, 10%)" }, // Using a dark orange/brown for known fails
  na: { label: "N/A", color: "hsl(var(--muted-foreground))" },
  untested: { label: "Untested", color: "hsl(var(--border))" },
} satisfies ChartConfig;

export default function OverallStatsChart({ data }: OverallStatsChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: chartConfig[key as keyof typeof chartConfig].label,
    value: value,
    fill: chartConfig[key as keyof typeof chartConfig].color,
  })).filter(item => item.value > 0);
  
  const totalTests = Object.values(data).reduce((acc, val) => acc + val, 0);
  const hasData = totalTests > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp /> Overall Test Results
        </CardTitle>
        <CardDescription>
            A summary of all test cases across all sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[230px]">
            {hasData ? (
                 <ChartContainer config={chartConfig} className="w-full h-full">
                    <RechartsBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} dx={-10} width={80} />
                        <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                        <Bar dataKey="value" layout="vertical" radius={5} barSize={15}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No test results yet. Start a session to see stats.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
