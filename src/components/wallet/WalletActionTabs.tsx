
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import { Merchant } from '@/stores/profileStore';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="dashboard-card border border-border/50 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Wallet Actions</CardTitle>
        <CardDescription>
          Deposit, withdraw, or transfer funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit" className="flex items-center justify-center">
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Deposit</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center justify-center">
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Withdraw</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              disabled={merchants.length === 0}
              className="flex items-center justify-center"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Transfer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-6">
            <DepositForm onDeposit={onDeposit} isProcessing={isProcessing} />
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-6">
            <WithdrawForm onWithdraw={onWithdraw} isProcessing={isProcessing} />
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-6">
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
