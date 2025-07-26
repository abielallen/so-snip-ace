
import React from "react";
import { cn } from "@/lib/utils";
import { BarChart, CheckCircle, Clock, Eye, AlertTriangle } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  status?: "success" | "warning" | "info" | "danger";
  loading?: boolean;
}

export const StatusCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  status = "info",
  loading = false,
}: StatusCardProps) => {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
    danger: "text-red-500",
  };
  
  const trendIcon = trend && trend > 0 ? (
    <span className="text-green-500">↑</span>
  ) : trend && trend < 0 ? (
    <span className="text-red-500">↓</span>
  ) : null;
  
  const statusIcon = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Eye className="h-5 w-5 text-blue-500" />,
    danger: <AlertTriangle className="h-5 w-5 text-red-500" />,
  };
  
  return (
    <div className={cn(
      "dashboard-card flex flex-col glow-box h-full",
      loading && "animate-pulse-slow"
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="bg-secondary/40 p-1 rounded-md">
          {icon || statusIcon[status]}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      {(trend || trendLabel) && (
        <div className="mt-3 text-xs flex items-center">
          {trendIcon}
          <span className={cn(
            "ml-1",
            trend && trend > 0 ? "text-green-500" : trend && trend < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            {trend ? `${Math.abs(trend)}%` : ""} {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};
