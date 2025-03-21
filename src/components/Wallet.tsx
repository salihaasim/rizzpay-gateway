
import React, { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WalletBalance from '@/components/wallet/WalletBalance';
import DepositForm from '@/components/wallet/DepositForm';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import RecentTransactions from '@/components/wallet/RecentTransactions';
import { useProfileStore } from '@/stores/profileStore';
import { toast } from 'sonner';
import { simulateWalletProcessing } from '@/utils/walletUtils';

const Wallet = () => {
  const { userEmail, getWalletBalance } = useTransactionStore();
  const { merchants } = useProfileStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get transactions from store
  const recentWalletTransactions = useTransactionStore(state => 
    state.transactions
      .filter(t => t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail))
      .slice(0, 5)
  );
  
  if (!userEmail) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please login to access your wallet.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Get current wallet balance
  const walletBalance = getWalletBalance(userEmail);
  
  const handleDeposit = async (amount: number, description?: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing deposit...");
      
      // Use the utility function to simulate processing
      await simulateWalletProcessing(userEmail, amount, 'deposit', description);
      
      toast.success("Deposit successful", {
        description: `₹${amount.toFixed(2)} has been added to your wallet.`
      });
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error("Deposit failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleWithdraw = async (amount: number, description?: string) => {
    if (isProcessing) return;
    
    if (amount > walletBalance) {
      toast.error("Insufficient balance", {
        description: "Your wallet balance is insufficient for this withdrawal."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing withdrawal...");
      
      // Use the utility function to simulate processing
      await simulateWalletProcessing(userEmail, amount, 'withdrawal', description);
      
      toast.success("Withdrawal successful", {
        description: `₹${amount.toFixed(2)} has been withdrawn from your wallet.`
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error("Withdrawal failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleTransfer = async (recipient: string, amount: number, description?: string) => {
    if (isProcessing) return;
    
    if (amount > walletBalance) {
      toast.error("Insufficient balance", {
        description: "Your wallet balance is insufficient for this transfer."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing transfer...");
      
      // Add processing delay to simulate real transfer
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { transferFunds } = useTransactionStore.getState();
      transferFunds(userEmail, recipient, amount, description);
      
      toast.success("Transfer successful", {
        description: `₹${amount.toFixed(2)} has been sent successfully.`
      });
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error("Transfer failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="mb-8 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WalletBalance balance={walletBalance} />
            
            <Tabs defaultValue="deposit" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                <TabsTrigger value="transfer" disabled={merchants.length === 0}>Transfer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit" className="mt-4">
                <DepositForm onDeposit={handleDeposit} isProcessing={isProcessing} />
              </TabsContent>
              
              <TabsContent value="withdraw" className="mt-4">
                <WithdrawForm onWithdraw={handleWithdraw} isProcessing={isProcessing} />
              </TabsContent>
              
              <TabsContent value="transfer" className="mt-4">
                <TransferForm 
                  merchants={merchants}
                  onTransfer={handleTransfer}
                  isProcessing={isProcessing}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:border-l md:pl-6">
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
