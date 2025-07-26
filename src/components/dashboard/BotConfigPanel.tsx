
import { useEffect, useState } from "react";
import { BotConfig } from "@/types/sniperBot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, RefreshCcw, CircleDollarSign, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BotConfigPanelProps {
  config: BotConfig;
  onSave: (config: BotConfig) => void;
}

export const BotConfigPanel = ({ config: initialConfig, onSave }: BotConfigPanelProps) => {
  const [config, setConfig] = useState<BotConfig>(initialConfig);
  const [saved, setSaved] = useState(true);
  
  useEffect(() => {
    setSaved(false);
  }, [config]);
  
  const handleGeneralChange = (key: keyof BotConfig["general"], value: any) => {
    setConfig(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };
  
  const handleCompoundingChange = (key: keyof BotConfig["compounding"], value: any) => {
    setConfig(prev => ({
      ...prev,
      compounding: {
        ...prev.compounding,
        [key]: value
      }
    }));
  };
  
  const handleAntiScamChange = (key: keyof BotConfig["antiScam"], value: any) => {
    setConfig(prev => ({
      ...prev,
      antiScam: {
        ...prev.antiScam,
        [key]: value
      }
    }));
  };
  
  const handleAdvancedChange = (key: keyof BotConfig["advanced"], value: any) => {
    setConfig(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: value
      }
    }));
  };
  
  const handleSave = () => {
    onSave(config);
    setSaved(true);
  };
  
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Bot Configuration</CardTitle>
          <Button
            size="sm"
            disabled={saved}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
        <CardDescription>Customize bot behavior and trading parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-2">
            <TabsTrigger value="general" className="text-xs">
              <CircleDollarSign className="h-3 w-3 mr-1" /> General
            </TabsTrigger>
            <TabsTrigger value="compounding" className="text-xs">
              <RefreshCcw className="h-3 w-3 mr-1" /> Compounding
            </TabsTrigger>
            <TabsTrigger value="antiScam" className="text-xs">
              <Shield className="h-3 w-3 mr-1" /> Anti-Scam
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Settings2 className="h-3 w-3 mr-1" /> Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseToken">Base Token</Label>
                <Input 
                  id="baseToken" 
                  value={config.general.baseToken} 
                  onChange={(e) => handleGeneralChange("baseToken", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Token to use for trading (SOL, USDC)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slippageTolerance">Slippage Tolerance (%)</Label>
                <Input 
                  id="slippageTolerance" 
                  type="number"
                  value={config.general.slippageTolerance} 
                  onChange={(e) => handleGeneralChange("slippageTolerance", parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Maximum allowed price movement</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profitTarget">Profit Target (%)</Label>
                <Input 
                  id="profitTarget" 
                  type="number"
                  value={config.general.profitTarget} 
                  onChange={(e) => handleGeneralChange("profitTarget", parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Target profit percentage before selling</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input 
                  id="stopLoss" 
                  type="number"
                  value={config.general.stopLoss} 
                  onChange={(e) => handleGeneralChange("stopLoss", parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Maximum allowed loss before selling</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minLiquidity">Minimum Liquidity ($)</Label>
                <Input 
                  id="minLiquidity" 
                  type="number"
                  value={config.general.minLiquidity} 
                  onChange={(e) => handleGeneralChange("minLiquidity", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Minimum pool liquidity to consider buying</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compounding" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="compoundingEnabled" 
                checked={config.compounding.enabled}
                onCheckedChange={(checked) => handleCompoundingChange("enabled", checked)}
              />
              <Label htmlFor="compoundingEnabled">Enable Profit Compounding</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawalInterval">Withdrawal Interval (trades)</Label>
                <Input 
                  id="withdrawalInterval" 
                  type="number"
                  value={config.compounding.withdrawalInterval} 
                  onChange={(e) => handleCompoundingChange("withdrawalInterval", parseInt(e.target.value))}
                  disabled={!config.compounding.enabled}
                />
                <p className="text-xs text-muted-foreground">Number of successful trades before profit withdrawal</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="withdrawalPercentage">Withdrawal Percentage (%)</Label>
                <Input 
                  id="withdrawalPercentage" 
                  type="number"
                  value={config.compounding.withdrawalPercentage} 
                  onChange={(e) => handleCompoundingChange("withdrawalPercentage", parseFloat(e.target.value))}
                  disabled={!config.compounding.enabled}
                />
                <p className="text-xs text-muted-foreground">Percentage of balance to withdraw after interval</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="antiScam" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSafetyScore">Minimum Safety Score</Label>
                <Input 
                  id="minSafetyScore" 
                  type="number"
                  value={config.antiScam.minSafetyScore} 
                  onChange={(e) => handleAntiScamChange("minSafetyScore", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Minimum security score (0-100) to allow trading</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxHolderPercentage">Maximum Top Holder Percentage (%)</Label>
                <Input 
                  id="maxHolderPercentage" 
                  type="number"
                  value={config.antiScam.maxHolderPercentage} 
                  onChange={(e) => handleAntiScamChange("maxHolderPercentage", parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Maximum percentage a single holder can own</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="checkMintAuthority" 
                  checked={config.antiScam.checkMintAuthority}
                  onCheckedChange={(checked) => handleAntiScamChange("checkMintAuthority", checked)}
                />
                <Label htmlFor="checkMintAuthority">Check Mint Authority</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="checkFreezeAuthority" 
                  checked={config.antiScam.checkFreezeAuthority}
                  onCheckedChange={(checked) => handleAntiScamChange("checkFreezeAuthority", checked)}
                />
                <Label htmlFor="checkFreezeAuthority">Check Freeze Authority</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rpcEndpoints">RPC Endpoints (one per line)</Label>
                <textarea 
                  id="rpcEndpoints"
                  className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={config.advanced.rpcEndpoints.join('\n')} 
                  onChange={(e) => handleAdvancedChange("rpcEndpoints", e.target.value.split('\n'))}
                />
                <p className="text-xs text-muted-foreground">Solana RPC endpoints for transactions (primary first)</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useMev" 
                  checked={config.advanced.useMev}
                  onCheckedChange={(checked) => handleAdvancedChange("useMev", checked)}
                />
                <Label htmlFor="useMev">Use MEV Protection</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priorityFee">Priority Fee (lamports)</Label>
                <Input 
                  id="priorityFee" 
                  type="number"
                  value={config.advanced.priorityFee} 
                  onChange={(e) => handleAdvancedChange("priorityFee", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Transaction priority fee for faster inclusion</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
