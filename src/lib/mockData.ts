
import { Token, TradeHistory, TokenDetection } from "@/types/sniperBot";

// Mock data for development and UI demonstration

export const mockTokens: Token[] = [
  {
    id: "1",
    name: "WorkerCat",
    symbol: "$MCDCAT",
    address: "So11111111111111111111111111111111111111112",
    liquidity: 12120.15,
    price: 0.00045,
    change24h: 125.4,
    safetyScore: 87,
    status: "active"
  },
  {
    id: "2",
    name: "Solana Monkey Business",
    symbol: "SMB",
    address: "Eo11111111111111111111111111111111111111112",
    liquidity: 48220.33,
    price: 0.032,
    change24h: -12.3,
    safetyScore: 92,
    status: "active"
  },
  {
    id: "3",
    name: "Lifinity",
    symbol: "LFNTY",
    address: "Lo11111111111111111111111111111111111111112",
    liquidity: 32980.55,
    price: 0.0089,
    change24h: 5.7,
    safetyScore: 79,
    status: "active"
  },
  {
    id: "4",
    name: "Solice",
    symbol: "SLC",
    address: "Vo11111111111111111111111111111111111111112",
    liquidity: 9800.25,
    price: 0.00021,
    change24h: 54.2,
    safetyScore: 61,
    status: "active"
  },
  {
    id: "5",
    name: "BonkCoin",
    symbol: "BONK",
    address: "Bo11111111111111111111111111111111111111112",
    liquidity: 152840.78,
    price: 0.000003,
    change24h: 8.1,
    safetyScore: 94,
    status: "active"
  }
];

export const mockTradeHistory: TradeHistory[] = [
  {
    id: "1",
    tokenName: "SolMoonRocket",
    tokenSymbol: "SMR",
    buyAmount: 0.5,
    buyPrice: 0.00025,
    sellAmount: 1.05,
    sellPrice: 0.00052,
    profit: 110,
    timestamp: new Date("2025-04-10T15:30:22"),
    status: "completed"
  },
  {
    id: "2",
    tokenName: "Galaxy Goblins",
    tokenSymbol: "GGOB",
    buyAmount: 0.75,
    buyPrice: 0.0004,
    sellAmount: 1.65,
    sellPrice: 0.00088,
    profit: 120,
    timestamp: new Date("2025-04-10T14:15:07"),
    status: "completed"
  },
  {
    id: "3",
    tokenName: "SolPups",
    tokenSymbol: "PUPS",
    buyAmount: 0.3,
    buyPrice: 0.00012,
    sellAmount: 0.285,
    sellPrice: 0.000114,
    profit: -5,
    timestamp: new Date("2025-04-10T12:42:55"),
    status: "stop-loss"
  },
  {
    id: "4",
    tokenName: "WorkerCat",
    tokenSymbol: "$MCDCAT",
    buyAmount: 0.4,
    buyPrice: 0.00022,
    sellAmount: null,
    sellPrice: null,
    profit: null,
    timestamp: new Date("2025-04-11T09:12:30"),
    status: "active"
  },
  {
    id: "5",
    tokenName: "SolMars",
    tokenSymbol: "MARS",
    buyAmount: 0.6,
    buyPrice: 0.00035,
    sellAmount: 1.38,
    sellPrice: 0.0008,
    profit: 130,
    timestamp: new Date("2025-04-09T18:22:11"),
    status: "completed"
  }
];

export const mockBalanceHistory = [
  { date: "Apr 01", balance: 200 },
  { date: "Apr 03", balance: 400 },
  { date: "Apr 05", balance: 800 },
  { date: "Apr 07", balance: 1600 },
  { date: "Apr 09", balance: 3200 },
  { date: "Apr 11", balance: 6400 }
];

export const mockTokenDetections: TokenDetection[] = [
  {
    id: "1",
    tokenName: "SolPups",
    tokenSymbol: "PUPS",
    initialLiquidity: 5800,
    timestamp: new Date("2025-04-10T12:40:12"),
    status: "traded",
    safetyScore: 75
  },
  {
    id: "2",
    tokenName: "Galaxy Goblins",
    tokenSymbol: "GGOB",
    initialLiquidity: 12400,
    timestamp: new Date("2025-04-10T14:10:45"),
    status: "traded",
    safetyScore: 82
  },
  {
    id: "3",
    tokenName: "WorkerCat",
    tokenSymbol: "$MCDCAT",
    initialLiquidity: 8200,
    timestamp: new Date("2025-04-11T09:10:18"),
    status: "traded",
    safetyScore: 87
  },
  {
    id: "4",
    tokenName: "SolRug",
    tokenSymbol: "RUG",
    initialLiquidity: 2200,
    timestamp: new Date("2025-04-11T10:05:33"),
    status: "rejected",
    safetyScore: 22,
    rejectReason: "Mint authority not renounced"
  },
  {
    id: "5",
    tokenName: "Moon Lambo",
    tokenSymbol: "LAMBO",
    initialLiquidity: 3500,
    timestamp: new Date("2025-04-11T11:12:45"),
    status: "detected",
    safetyScore: 68,
    processing: true
  }
];

export const mockBotConfig = {
  general: {
    baseToken: "SOL",
    slippageTolerance: 2,
    profitTarget: 100,
    stopLoss: 5,
    minLiquidity: 2000,
  },
  compounding: {
    enabled: true,
    withdrawalInterval: 3,
    withdrawalPercentage: 25,
  },
  antiScam: {
    minSafetyScore: 60,
    maxHolderPercentage: 30,
    checkMintAuthority: true,
    checkFreezeAuthority: true,
  },
  advanced: {
    rpcEndpoints: [
      "https://api.mainnet-beta.solana.com",
      "https://solana-mainnet.g.alchemy.com/v2/your-key",
    ],
    useMev: true,
    priorityFee: 5000,
  }
};

export const mockPerformanceStats = {
  profitToday: 4.25,
  profitAllTime: 32.4,
  successRate: 85,
  averageProfit: 110,
  totalTrades: 28,
  winningTrades: 24,
  stopLossTrades: 4,
  averageHoldTime: "8m 42s",
  withdrawnProfits: 16,
  activeBalance: 6.4,
};
