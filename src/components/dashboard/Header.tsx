
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart4, Settings, PieChart, RefreshCcw, Power } from "lucide-react";

interface HeaderProps {
  activeBalance: number;
  botActive: boolean;
  onToggleBot: () => void;
}

export const Header = ({ activeBalance, botActive, onToggleBot }: HeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 mb-6">
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="mr-2 bg-solana-purple/10 p-2 rounded-lg">
          <BarChart4 className="h-6 w-6 text-solana-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-bold gradient-text glow">Solana Snipe Ace</h1>
          <p className="text-muted-foreground text-sm">High-performance token sniping bot</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-card px-4 py-2 rounded-lg border border-border">
          <div className="text-xs text-muted-foreground">Active Balance</div>
          <div className="font-bold text-sm flex items-center">
            <PieChart className="inline mr-1 h-3 w-3 text-solana-blue" /> 
            {activeBalance.toFixed(2)} SOL
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
        
        <Button 
          size="sm"
          variant={botActive ? "destructive" : "default"}
          onClick={onToggleBot}
        >
          <Power className="h-4 w-4 mr-1" />
          {botActive ? "Stop Bot" : "Start Bot"}
        </Button>
      </div>
    </div>
  );
};
