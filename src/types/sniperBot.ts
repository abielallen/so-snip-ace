
// Types for the Solana Sniper Bot

export type TokenStatus = "active" | "inactive" | "blacklisted";
export type TradeStatus = "active" | "completed" | "stop-loss" | "failed";
export type DetectionStatus = "detected" | "processing" | "traded" | "rejected";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  liquidity: number;
  price: number;
  change24h: number;
  safetyScore: number;
  status: TokenStatus;
}

export interface TradeHistory {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  buyAmount: number;
  buyPrice: number;
  sellAmount: number | null;
  sellPrice: number | null;
  profit: number | null;
  timestamp: Date;
  status: TradeStatus;
}

export interface TokenDetection {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  initialLiquidity: number;
  timestamp: Date;
  status: DetectionStatus;
  safetyScore: number;
  rejectReason?: string;
  processing?: boolean;
}

export interface BotConfig {
  general: {
    baseToken: string;
    slippageTolerance: number;
    profitTarget: number;
    stopLoss: number;
    minLiquidity: number;
  };
  compounding: {
    enabled: boolean;
    withdrawalInterval: number;
    withdrawalPercentage: number;
  };
  antiScam: {
    minSafetyScore: number;
    maxHolderPercentage: number;
    checkMintAuthority: boolean;
    checkFreezeAuthority: boolean;
  };
  advanced: {
    rpcEndpoints: string[];
    useMev: boolean;
    priorityFee: number;
  };
}

export interface PerformanceStats {
  profitToday: number;
  profitAllTime: number;
  successRate: number;
  averageProfit: number;
  totalTrades: number;
  winningTrades: number;
  stopLossTrades: number;
  averageHoldTime: string;
  withdrawnProfits: number;
  activeBalance: number;
}
