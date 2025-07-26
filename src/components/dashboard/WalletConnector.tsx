import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WalletConnectorProps {
  onWalletConnected?: (address: string, source: string) => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletSource, setWalletSource] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const { toast } = useToast();

  const isValidSolanaAddress = (addr: string): boolean => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const saveWalletToSupabase = async (address: string, source: string) => {
    try {
      const { error } = await supabase
        .from('Solflare Wallet Keys')
        .insert({
          address,
          source,
        });

      if (error) {
        console.error('Error saving wallet to Supabase:', error);
        toast({
          title: "Database Error",
          description: "Failed to save wallet to database, but connection still works.",
          variant: "destructive",
        });
      } else {
        console.log('Wallet saved to Supabase successfully');
      }
    } catch (err) {
      console.error('Error saving wallet:', err);
    }
  };

  const handleWalletConnected = async (address: string, source: string) => {
    const icons = {
      Solflare: '🔥',
      Phantom: '👻',
      Manual: '✍️',
      Saved: '💾'
    };

    setWalletAddress(address);
    setWalletSource(source);
    
    // Save to localStorage
    localStorage.setItem('solana_wallet_address', address);
    localStorage.setItem('solana_wallet_source', source);
    
    // Save to global config
    if (typeof window !== 'undefined') {
      (window as any).botConfig = (window as any).botConfig || {};
      (window as any).botConfig.walletAddress = address;
    }

    // Save to Supabase database
    if (source !== 'Saved') { // Only save new connections, not auto-loaded ones
      await saveWalletToSupabase(address, source);
    }

    toast({
      title: "Wallet Connected",
      description: `${icons[source as keyof typeof icons] || '✅'} Connected via ${source}: ${address.slice(0, 8)}...${address.slice(-8)}`,
    });

    onWalletConnected?.(address, source);
    console.log(`Wallet connected via ${source}:`, address);
  };

  const connectWallet = async () => {
    try {
      if (isMobile) {
        const solflareDeepLink = `https://solflare.com/ul/v1/connect?redirect_url=${encodeURIComponent(window.location.href)}`;
        if (confirm('Open Solflare to connect?')) {
          window.location.href = solflareDeepLink;
          return;
        }
      } else {
        // Try Solflare first
        if ((window as any).solflare && (window as any).solflare.isSolflare) {
          const resp = await (window as any).solflare.connect();
          handleWalletConnected(resp.publicKey.toString(), 'Solflare');
          return;
        }
        
        // Fallback to Phantom
        if ((window as any).solana && (window as any).solana.isPhantom) {
          const resp = await (window as any).solana.connect();
          handleWalletConnected(resp.publicKey.toString(), 'Phantom');
          return;
        }

        toast({
          title: "No Wallet Found",
          description: "Please install Solflare or Phantom wallet extension.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
      console.warn('Wallet connect error:', err);
    }
  };

  const connectWalletConnect = () => {
    const solflareDeepLink = `https://solflare.com/ul/v1/connect?redirect_url=${encodeURIComponent(window.location.href)}`;
    window.location.href = solflareDeepLink;
  };

  const showLedgerInstructions = () => {
    toast({
      title: "Ledger Instructions",
      description: "💡 Open the Solflare browser extension, select 'Connect Ledger', then return here and press Connect.",
    });
  };

  const handleManualInput = (value: string) => {
    setManualInput(value);
    if (isValidSolanaAddress(value.trim())) {
      handleWalletConnected(value.trim(), 'Manual');
    }
  };

  const resetWallet = () => {
    setWalletAddress('');
    setWalletSource('');
    setManualInput('');
    
    localStorage.removeItem('solana_wallet_address');
    localStorage.removeItem('solana_wallet_source');
    
    if (typeof window !== 'undefined' && (window as any).botConfig) {
      delete (window as any).botConfig.walletAddress;
    }

    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected and cleared from storage.",
    });
    
    console.log('Wallet disconnected/reset');
  };

  // Auto-load saved wallet on mount
  useEffect(() => {
    const loadSavedWallet = async () => {
      const saved = localStorage.getItem('solana_wallet_address');
      const savedSource = localStorage.getItem('solana_wallet_source') || 'Saved';
      
      if (saved && isValidSolanaAddress(saved)) {
        setWalletAddress(saved);
        setWalletSource(savedSource);
        
        // Update global config
        if (typeof window !== 'undefined') {
          (window as any).botConfig = (window as any).botConfig || {};
          (window as any).botConfig.walletAddress = saved;
        }
        
        onWalletConnected?.(saved, savedSource);
        console.log(`Auto-loaded wallet from ${savedSource}:`, saved);
      }
    };
    
    loadSavedWallet();
  }, []);

  const getWalletIcon = (source: string) => {
    const icons = {
      Solflare: '🔥',
      Phantom: '👻',
      Manual: '✍️',
      Saved: '💾'
    };
    return icons[source as keyof typeof icons] || '✅';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">🔗 Connect Solana Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletAddress ? (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              {getWalletIcon(walletSource)} Connected ({walletSource})
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Wallet not connected</p>
        )}

        <div className="space-y-2">
          <Button 
            onClick={connectWallet} 
            className="w-full"
            variant="default"
          >
            🔥 Connect via Solflare (Default)
          </Button>
          
          <Button 
            onClick={connectWalletConnect} 
            className="w-full"
            variant="outline"
          >
            🔗 WalletConnect Mobile (Beta)
          </Button>
          
          <Button 
            onClick={showLedgerInstructions} 
            className="w-full"
            variant="outline"
          >
            🔐 Connect Ledger via Solflare
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Input
          type="text"
          placeholder="✍️ Paste wallet address manually"
          value={manualInput}
          onChange={(e) => handleManualInput(e.target.value)}
          className="font-mono text-sm"
        />

        {walletAddress && (
          <Button 
            onClick={resetWallet} 
            className="w-full"
            variant="destructive"
          >
            ❌ Disconnect / Reset
          </Button>
        )}
      </CardContent>
    </Card>
  );
};