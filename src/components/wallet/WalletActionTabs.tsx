
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Merchant } from '@/stores/profileStore';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransferForm from './TransferForm';
import BulkWithdrawalForm from './BulkWithdrawalForm';

interface WalletActionTabsProps {
  merchants: Merchant[];
  isProcessing: boolean;
  onDeposit: (amount: number, description?: string) => void;
  onWithdraw: (amount: number, description?: string, bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    beneficiaryName: string;
    method: string;
  }) => void;
  onTransfer: (recipient: string, amount: number, description?: string) => void;
  userEmail?: string | null;
}

const WalletActionTabs: React.FC<WalletActionTabsProps> = ({
  merchants,
  isProcessing,
  onDeposit,
  onWithdraw,
  onTransfer,
  userEmail
}) => {
  return (
    <Tabs defaultValue="deposit" className="mt-6">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="bulk-withdraw">Bulk Withdraw</TabsTrigger>
        <TabsTrigger value="transfer">Transfer</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deposit">
        <DepositForm onDeposit={onDeposit} isProcessing={isProcessing} />
      </TabsContent>
      
      <TabsContent value="withdraw">
        <WithdrawForm onWithdraw={onWithdraw} isProcessing={isProcessing} />
      </TabsContent>
      
      <TabsContent value="bulk-withdraw">
        <BulkWithdrawalForm userEmail={userEmail} />
      </TabsContent>
      
      <TabsContent value="transfer">
        <TransferForm 
          onTransfer={onTransfer} 
          isProcessing={isProcessing} 
          merchants={merchants}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WalletActionTabs;
