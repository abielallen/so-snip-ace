
import React from "react";
import { PerformanceStats } from "@/types/sniperBot";
import { StatusCard } from "./StatusCard";
import { AreaChart, LineChart, ArrowUpRight, Target, Clock, CreditCard, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceStatsProps {
  stats: PerformanceStats;
}

export const PerformanceStatsDisplay = ({ stats }: PerformanceStatsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance</h2>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            title="Today's Profit"
            value={`+${stats.profitToday.toFixed(2)} SOL`}
            icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
            status="success"
          />
          <StatusCard
            title="Overall Profit"
            value={`+${stats.profitAllTime.toFixed(2)} SOL`}
            subtitle="All-time accumulated profit"
            icon={<AreaChart className="h-5 w-5 text-blue-500" />}
            status="info"
          />
          <StatusCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            subtitle={`${stats.winningTrades}/${stats.totalTrades} trades successful`}
            icon={<Target className="h-5 w-5 text-purple-500" />}
            status="info"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="trades" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            title="Avg. Profit per Trade"
            value={`+${stats.averageProfit}%`}
            subtitle="On successful trades"
            icon={<LineChart className="h-5 w-5 text-green-500" />}
            status="success"
          />
          <StatusCard
            title="Stop-Loss Triggered"
            value={stats.stopLossTrades}
            subtitle={`${((stats.stopLossTrades / stats.totalTrades) * 100).toFixed(1)}% of total trades`}
            icon={<Target className="h-5 w-5 text-red-500" />}
            status="warning"
          />
          <StatusCard
            title="Average Hold Time"
            value={stats.averageHoldTime}
            subtitle="From buy to sell"
            icon={<Clock className="h-5 w-5 text-blue-500" />}
            status="info"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="balance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            title="Active Trading Balance"
            value={`${stats.activeBalance.toFixed(2)} SOL`}
            subtitle="Currently in trading wallet"
            icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            status="info"
          />
          <StatusCard
            title="Withdrawn Profits"
            value={`${stats.withdrawnProfits.toFixed(2)} SOL`}
            subtitle="Secured in cold storage"
            icon={<Wallet className="h-5 w-5 text-green-500" />}
            status="success"
          />
          <StatusCard
            title="Next Withdrawal"
            value="In 2 trades"
            subtitle="25% of balance will be secured"
            icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
            status="info"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
