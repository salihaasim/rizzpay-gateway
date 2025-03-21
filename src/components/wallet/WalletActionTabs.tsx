
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import { Merchant } from '@/stores/profileStore';

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
    <Tabs defaultValue="deposit" className="mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="transfer" disabled={merchants.length === 0}>Transfer</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deposit" className="mt-4">
        <DepositForm onDeposit={onDeposit} isProcessing={isProcessing} />
      </TabsContent>
      
      <TabsContent value="withdraw" className="mt-4">
        <WithdrawForm onWithdraw={onWithdraw} isProcessing={isProcessing} />
      </TabsContent>
      
      <TabsContent value="transfer" className="mt-4">
        <TransferForm 
          merchants={merchants}
          onTransfer={onTransfer}
          isProcessing={isProcessing}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WalletActionTabs;
