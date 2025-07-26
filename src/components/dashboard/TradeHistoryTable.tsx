
import React from "react";
import { TradeHistory } from "@/types/sniperBot";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TradeHistoryTableProps {
  trades: TradeHistory[];
}

export const TradeHistoryTable = ({ trades }: TradeHistoryTableProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const getStatusBadge = (status: TradeHistory["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Completed</Badge>;
      case "stop-loss":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Stop-Loss</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="text-left p-2 font-medium">Token</th>
            <th className="text-left p-2 font-medium">Buy</th>
            <th className="text-left p-2 font-medium">Sell</th>
            <th className="text-left p-2 font-medium">Profit</th>
            <th className="text-left p-2 font-medium">Time</th>
            <th className="text-left p-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-card/60">
              <td className="p-2">
                <div className="font-medium">{trade.tokenName}</div>
                <div className="text-xs text-muted-foreground">{trade.tokenSymbol}</div>
              </td>
              <td className="p-2">
                <div>{trade.buyAmount.toFixed(2)} SOL</div>
                <div className="text-xs text-muted-foreground">@ ${trade.buyPrice.toFixed(8)}</div>
              </td>
              <td className="p-2">
                {trade.sellAmount ? (
                  <>
                    <div>{trade.sellAmount.toFixed(2)} SOL</div>
                    <div className="text-xs text-muted-foreground">@ ${trade.sellPrice?.toFixed(8)}</div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Pending</div>
                )}
              </td>
              <td className="p-2">
                {trade.profit !== null ? (
                  <span className={cn(
                    "font-medium",
                    trade.profit > 0 ? "text-green-500" : 
                    trade.profit < 0 ? "text-red-500" : ""
                  )}>
                    {trade.profit > 0 ? "+" : ""}{trade.profit}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="p-2 text-muted-foreground">
                {formatDate(trade.timestamp)}
              </td>
              <td className="p-2">
                {getStatusBadge(trade.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
