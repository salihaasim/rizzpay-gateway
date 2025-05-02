
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Merchant } from '@/stores/profileStore';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransferForm from './TransferForm';
import BulkWithdrawalForm from './BulkWithdrawalForm';
import StaticQrGenerator from './StaticQrGenerator';

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
    <Tabs defaultValue="deposit" className="mt-4 sm:mt-6">
      <TabsList className="grid grid-cols-5 mb-4 w-full overflow-x-auto">
        <TabsTrigger value="deposit" className="text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 whitespace-nowrap">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw" className="text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 whitespace-nowrap">Withdraw</TabsTrigger>
        <TabsTrigger value="bulk-withdraw" className="text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 whitespace-nowrap">Bulk</TabsTrigger>
        <TabsTrigger value="transfer" className="text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 whitespace-nowrap">Transfer</TabsTrigger>
        <TabsTrigger value="static-qr" className="text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 whitespace-nowrap">QR</TabsTrigger>
      </TabsList>
      
      <div className="px-1 sm:px-0">
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
        
        <TabsContent value="static-qr">
          <StaticQrGenerator userEmail={userEmail} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default WalletActionTabs;
