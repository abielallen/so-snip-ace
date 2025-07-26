
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BalanceChartProps {
  data: Array<{ date: string; balance: number }>;
}

export const BalanceChart = ({ data }: BalanceChartProps) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Balance Growth</CardTitle>
        <CardDescription>All-time balance progression in SOL</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9945FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9945FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#888' }} 
                tickLine={{ stroke: '#444' }}
                axisLine={{ stroke: '#333' }}
              />
              <YAxis 
                tick={{ fill: '#888' }} 
                tickLine={{ stroke: '#444' }}
                axisLine={{ stroke: '#333' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #333',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                }}
                formatter={(value) => [`${value} SOL`, 'Balance']}
                labelFormatter={(label) => label}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#9945FF" 
                fillOpacity={1}
                fill="url(#colorBalance)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
