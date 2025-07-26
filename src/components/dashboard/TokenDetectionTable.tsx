import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TokenDetection } from "@/types/sniperBot";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, XCircle, AlertTriangle, Eye } from "lucide-react";

interface TokenDetectionTableProps {
  detections: TokenDetection[];
}

export const TokenDetectionTable = ({ detections }: TokenDetectionTableProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const formatTimeDiff = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  };
  
  const getStatusBadge = (status: TokenDetection["status"]) => {
    switch (status) {
      case "detected":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Detected</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Processing</Badge>;
      case "traded":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Traded</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (detection: TokenDetection) => {
    switch (detection.status) {
      case "detected":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "processing":
        return detection.processing ? 
          <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" /> : 
          <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "traded":
        return <Check className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="text-left p-2 font-medium">Token</th>
            <th className="text-left p-2 font-medium">Liquidity</th>
            <th className="text-left p-2 font-medium">Safety</th>
            <th className="text-left p-2 font-medium">Time</th>
            <th className="text-left p-2 font-medium">Status</th>
            <th className="text-left p-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {detections.map((detection) => (
            <React.Fragment key={detection.id}>
              <tr 
                className={cn(
                  "hover:bg-card/60 cursor-pointer",
                  expanded === detection.id && "bg-card/60"
                )}
                onClick={() => setExpanded(prev => prev === detection.id ? null : detection.id)}
              >
                <td className="p-2">
                  <div className="font-medium">{detection.tokenName}</div>
                  <div className="text-xs text-muted-foreground">{detection.tokenSymbol}</div>
                </td>
                <td className="p-2">
                  ${detection.initialLiquidity.toLocaleString()}
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-10 h-1.5 rounded-full bg-gradient-to-r mr-2",
                        detection.safetyScore >= 80 ? "from-green-500 to-green-300" :
                        detection.safetyScore >= 60 ? "from-yellow-500 to-yellow-300" :
                        "from-red-500 to-red-300"
                      )}
                    ></div>
                    <span>{detection.safetyScore}</span>
                  </div>
                </td>
                <td className="p-2 text-muted-foreground">
                  {formatTimeDiff(detection.timestamp)}
                </td>
                <td className="p-2">
                  {getStatusBadge(detection.status)}
                </td>
                <td className="p-2 text-right">
                  {getStatusIcon(detection)}
                </td>
              </tr>
              {expanded === detection.id && detection.status === "rejected" && (
                <tr className="bg-card/30">
                  <td colSpan={6} className="p-3 text-sm text-red-400">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Rejected: {detection.rejectReason}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
