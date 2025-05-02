
import React from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent } from '@/components/ui/card';
import WalletBalance from '@/components/wallet/WalletBalance';
import RecentTransactions from '@/components/wallet/RecentTransactions';
import WalletActionTabs from '@/components/wallet/WalletActionTabs';
import { useProfileStore } from '@/stores/profileStore';
import { useWalletActions } from '@/hooks/useWalletActions';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';

const Wallet = () => {
  // Extract just the email from store to prevent re-renders
  const userEmail = useTransactionStore(state => state.userEmail);
  const { merchants } = useProfileStore();
  
  // Use custom hooks to handle wallet functionality
  const { isProcessing, walletBalance, handleDeposit, handleWithdraw, handleTransfer } = 
    useWalletActions(userEmail);
    
  const { recentWalletTransactions } = useWalletTransactions(userEmail);
  
  if (!userEmail) {
    return (
      <Card className="mb-4 sm:mb-8">
        <CardContent className="pt-4 sm:pt-6">
          <p className="text-center text-sm sm:text-base text-muted-foreground">Please login to access your wallet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4 sm:mb-8 border-0 shadow-sm">
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <WalletBalance balance={walletBalance} />
            
            <WalletActionTabs 
              merchants={merchants}
              isProcessing={isProcessing}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onTransfer={handleTransfer}
              userEmail={userEmail}
            />
          </div>
          
          <div className="md:border-l md:pl-4 sm:md:pl-6">
            <RecentTransactions 
              transactions={recentWalletTransactions}
              userEmail={userEmail}
              merchantCount={merchants.length}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Wallet;
