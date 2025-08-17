
"use client"

import * as React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Supporter } from '@/lib/data';

interface DashboardChartsProps {
  data: (Supporter & { referrerName?: string })[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const referrerData = React.useMemo(() => {
    const referrerCounts: { [key: string]: number } = {};

    // Count supporters for each referrer
    data.forEach(supporter => {
      if (supporter.referrerName) {
        if (referrerCounts[supporter.referrerName]) {
          referrerCounts[supporter.referrerName]++;
        } else {
          referrerCounts[supporter.referrerName] = 1;
        }
      }
    });

    // Format for chart
    return Object.keys(referrerCounts).map(referrerName => ({
      name: referrerName,
      total: referrerCounts[referrerName],
    })).sort((a, b) => b.total - a.total); // Sort descending

  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={referrerData} layout="vertical" margin={{ right: 20, left: 30, top: 20, bottom: 10 }}>
         <XAxis 
            type="number" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
         />
        <YAxis
          dataKey="name"
          type="category"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
          tick={{ dx: -10 }}
        />
        <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
        />
        <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '1rem' }}
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
        />
        <Bar 
            dataKey="total" 
            name="عدد المؤيدين" 
            fill="hsl(var(--primary))" 
            radius={[0, 4, 4, 0]} 
            background={{ fill: 'hsl(var(--background))', radius: 4 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
