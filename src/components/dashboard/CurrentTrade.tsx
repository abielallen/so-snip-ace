
import React, { useState, useEffect } from "react";
import { TradeHistory } from "@/types/sniperBot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CurrentTradeProps {
  activeTrade: TradeHistory | null;
  onSellNow: () => void;
}

export const CurrentTrade = ({ activeTrade, onSellNow }: CurrentTradeProps) => {
  const [currentProfit, setCurrentProfit] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("");
  
  useEffect(() => {
    if (!activeTrade) {
      setCurrentProfit(null);
      setElapsedTime("");
      return;
    }
    
    // Simulate profit changing over time
    const interval = setInterval(() => {
      const randomChange = Math.random() * 2 - 0.5; // Random value between -0.5 and 1.5
      const newProfit = currentProfit === null 
        ? 45 + randomChange 
        : currentProfit + randomChange;
      setCurrentProfit(newProfit);
      
      // Calculate elapsed time
      const now = new Date();
      const timeDiff = now.getTime() - activeTrade.timestamp.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const seconds = Math.floor((timeDiff % 60000) / 1000);
      setElapsedTime(`${minutes}m ${seconds}s`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeTrade, currentProfit]);
  
  if (!activeTrade) {
    return (
      <div className="dashboard-card flex flex-col items-center justify-center py-8">
        <div className="text-muted-foreground text-center">
          <p className="mb-2">No active trade</p>
          <p className="text-xs">Bot is waiting for the next opportunity</p>
        </div>
      </div>
    );
  }
  
  const isProfitable = currentProfit !== null && currentProfit > 0;
  
  return (
    <div className="dashboard-card space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{activeTrade.tokenName}</h3>
          <p className="text-sm text-muted-foreground">{activeTrade.tokenSymbol}</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
          Active Trade
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Buy Amount</p>
          <p className="text-sm font-medium">{activeTrade.buyAmount.toFixed(3)} SOL</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Buy Price</p>
          <p className="text-sm font-medium">${activeTrade.buyPrice.toFixed(8)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Profit</p>
          <p className={`text-sm font-medium flex items-center ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitable ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {currentProfit !== null ? `${currentProfit > 0 ? '+' : ''}${currentProfit.toFixed(2)}%` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Elapsed Time</p>
          <p className="text-sm font-medium">{elapsedTime}</p>
        </div>
      </div>
      
      <div className="pt-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center p-2 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground mb-1">Target</p>
          <p className="text-sm font-medium text-green-500">+100%</p>
        </div>
        <div className="flex flex-col items-center p-2 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground mb-1">Stop-Loss</p>
          <p className="text-sm font-medium text-red-500">-5%</p>
        </div>
      </div>
      
      <Button 
        variant="destructive" 
        size="sm" 
        className="w-full mt-4"
        onClick={onSellNow}
      >
        Sell Now
      </Button>
    </div>
  );
};
