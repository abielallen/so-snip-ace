import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

const connection = new Connection(process.env.RPC_ENDPOINT!, {
  wsEndpoint: process.env.RPC_WEBSOCKET_ENDPOINT,
  commitment: 'confirmed'
});

const wallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const quoteMint = new PublicKey(process.env.QUOTE_MINT!);
const quoteAmount = BigInt(process.env.QUOTE_AMOUNT || '0');
const takeProfit = parseFloat(process.env.TAKE_PROFIT || '1.25');
const stopLoss = parseFloat(process.env.STOP_LOSS || '0.8');
const lpThreshold = parseFloat(process.env.LP_THRESHOLD || '1000');

const RAYDIUM_PROGRAM_ID = new PublicKey(
  process.env.RAYDIUM_PROGRAM_ID || 'RVKd61ztZW9ekMSCJaoN96D2YzNhztsh5dz7ie1C6u3'
);

function log(...args: unknown[]) {
  console.log(new Date().toISOString(), ...args);
}

async function checkRisk(tokenMint: PublicKey) {
  try {
    const info = await connection.getParsedAccountInfo(tokenMint);
    if (!info.value) return false;
    const parsed: any = info.value.data;
    const mintAuth = parsed.parsed.info.mintAuthority;
    const freezeAuth = parsed.parsed.info.freezeAuthority;
    const supply = parseFloat(parsed.parsed.info.supply);
    if (mintAuth !== null || freezeAuth !== null) {
      log('Mint authority not renounced');
      return false;
    }
    if (supply < lpThreshold) {
      log('LP size below threshold');
      return false;
    }
    return true;
  } catch (e) {
    log('Risk check failed', e);
    return false;
  }
}

async function getBestRoute(inputMint: PublicKey, outputMint: PublicKey, amount: bigint) {
  const params = new URLSearchParams({
    inputMint: inputMint.toString(),
    outputMint: outputMint.toString(),
    amount: amount.toString(),
    slippageBps: '100'
  });
  const res = await fetch(`https://quote-api.jup.ag/v6/quote?${params}`);
  const data = await res.json();
  return data.data?.[0];
}

async function executeSwap(route: any) {
  const res = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      route,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true
    })
  });
  const { swapTransaction } = await res.json();
  const tx = Transaction.from(Buffer.from(swapTransaction, 'base64'));
  tx.partialSign(wallet);
  const sig = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true
  });
  await connection.confirmTransaction(sig);
  return { signature: sig, outAmount: parseFloat(route.outAmount) };
}

async function buyToken(tokenMint: PublicKey) {
  const route = await getBestRoute(quoteMint, tokenMint, quoteAmount);
  if (!route) {
    log('No buy route found');
    return null;
  }
  const result = await executeSwap(route);
  log('Bought token', tokenMint.toBase58(), 'tx:', result.signature);
  return result.outAmount;
}

async function sellToken(tokenMint: PublicKey, amount: bigint) {
  const route = await getBestRoute(tokenMint, quoteMint, amount);
  if (!route) {
    log('No sell route found');
    return null;
  }
  const result = await executeSwap(route);
  log('Sold token', tokenMint.toBase58(), 'tx:', result.signature);
  return result.outAmount;
}

async function monitorAndTrade(tokenMint: PublicKey) {
  const buyOut = await buyToken(tokenMint);
  if (!buyOut) return;
  const buyInput = parseFloat(process.env.QUOTE_AMOUNT!);
  const buyPrice = buyOut / buyInput;
  const interval = setInterval(async () => {
    try {
      const priceRes = await fetch(
        `https://price.jup.ag/v4/price?ids=${tokenMint.toString()}`
      );
      const priceData = await priceRes.json();
      const price = priceData.data[tokenMint.toString()].price;
      const change = price / buyPrice;
      if (change >= takeProfit || change <= stopLoss) {
        clearInterval(interval);
        const sellOut = await sellToken(tokenMint, BigInt(Math.floor(buyOut)));
        if (!sellOut) return;
        const profit = sellOut - buyInput;
        log('Profit', profit);
        await supabase.rpc('increment_balance', {
          p_wallet: wallet.publicKey.toString(),
          p_delta: profit
        });
      } else {
        log('Price', price, 'Change', change);
      }
    } catch (e) {
      log('Monitor error', e);
    }
  }, 10000);
}

function extractTokenFromLogs(logs: string[]): PublicKey | null {
  for (const log of logs) {
    const match = log.match(/mint\s*:?\s*([0-9A-Za-z]+)/i);
    if (match) {
      try {
        return new PublicKey(match[1]);
      } catch {
        return null;
      }
    }
  }
  return null;
}

function listenForPools() {
  connection.onLogs(RAYDIUM_PROGRAM_ID, async (logs) => {
    const tokenMint = extractTokenFromLogs(logs.logs);
    if (!tokenMint) return;
    if (await checkRisk(tokenMint)) {
      monitorAndTrade(tokenMint);
    }
  });
}

listenForPools();
log('Sniper bot started');
