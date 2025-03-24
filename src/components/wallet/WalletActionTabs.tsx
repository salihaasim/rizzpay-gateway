
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import { Merchant } from '@/stores/profileStore';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WalletActionTabsProps {
  merchants: Merchant[];
  isProcessing: boolean;
  onDeposit: (amount: number, description?: string) => void;
  onWithdraw: (amount: number, description?: string) => void;
  onTransfer: (recipient: string, amount: number, description?: string) => void;
}

const WalletActionTabs: React.FC<WalletActionTabsProps> = ({
  merchants,
  isProcessing,
  onDeposit,
  onWithdraw,
  onTransfer
}) => {
  return (
    <Card className="dashboard-card border border-border/50 mt-6 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Wallet Actions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">
                  Deposit funds to your wallet, withdraw to your bank account, or transfer to other merchants.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Deposit, withdraw, or transfer funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit" className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Deposit</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Withdraw</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              disabled={merchants.length === 0}
              className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Transfer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-6 animate-fade-in">
            <DepositForm onDeposit={onDeposit} isProcessing={isProcessing} />
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-6 animate-fade-in">
            <WithdrawForm onWithdraw={onWithdraw} isProcessing={isProcessing} />
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-6 animate-fade-in">
            <TransferForm 
              merchants={merchants}
              onTransfer={onTransfer}
              isProcessing={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletActionTabs;
