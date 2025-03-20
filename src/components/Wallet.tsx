
import React, { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProfileStore } from '@/stores/profileStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletIcon } from 'lucide-react';
import { toast } from 'sonner';

// Import our new components
import WalletBalance from './wallet/WalletBalance';
import DepositForm from './wallet/DepositForm';
import WithdrawForm from './wallet/WithdrawForm';
import TransferForm from './wallet/TransferForm';
import AddMerchantDialog from './wallet/AddMerchantDialog';
import RecentTransactions from './wallet/RecentTransactions';

const Wallet = () => {
  const { userEmail, getWalletBalance, depositToWallet, withdrawFromWallet, transferFunds, transactions } = useTransactionStore();
  const { merchants, addMerchant } = useProfileStore();
  const [activeTab, setActiveTab] = useState('deposit');
  const [showAddMerchant, setShowAddMerchant] = useState(false);
  
  if (!userEmail) {
    return (
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Wallet</CardTitle>
          <CardDescription>Please login to access your wallet</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const walletBalance = getWalletBalance(userEmail);
  
  // Filter wallet transactions
  const walletTransactions = transactions
    .filter(t => (t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail)))
    .slice(0, 5); // Show only 5 most recent

  const handleDeposit = (amount: number, description?: string) => {
    try {
      depositToWallet(userEmail, amount, 'wallet');
      toast.success('Deposit successful!');
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
    }
  };

  const handleWithdraw = (amount: number, description?: string) => {
    try {
      if (amount > walletBalance) {
        toast.error('Insufficient balance!');
        return;
      }
      withdrawFromWallet(userEmail, amount, 'wallet');
      toast.success('Withdrawal successful!');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };
  
  const handleAddMerchant = (data: { name: string; email: string; phone: string; company: string }) => {
    try {
      // Check if merchant with this email already exists
      const existingMerchant = merchants.find(m => m.email === data.email);
      if (existingMerchant) {
        toast.error('A merchant with this email already exists');
        return;
      }
      
      // Ensure all required fields are present
      const merchantData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company
      };
      
      addMerchant(merchantData);
      setShowAddMerchant(false);
      toast.success('Merchant added successfully!');
    } catch (error) {
      toast.error('Failed to add merchant. Please try again.');
    }
  };
  
  const handleTransfer = (recipient: string, amount: number, description?: string) => {
    try {
      if (amount > walletBalance) {
        toast.error('Insufficient balance!');
        return;
      }
      
      transferFunds(userEmail, recipient, amount, description);
      toast.success('Transfer successful!');
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium flex items-center">
              <WalletIcon className="h-5 w-5 mr-2" />
              My Wallet
            </CardTitle>
            <CardDescription>Manage your funds</CardDescription>
          </div>
          
          <AddMerchantDialog 
            onAddMerchant={handleAddMerchant} 
            open={showAddMerchant} 
            onOpenChange={setShowAddMerchant} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <WalletBalance balance={walletBalance} />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-4">
            <DepositForm onDeposit={handleDeposit} />
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-4">
            <WithdrawForm onWithdraw={handleWithdraw} />
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-4">
            <TransferForm 
              merchants={merchants} 
              onTransfer={handleTransfer} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <RecentTransactions 
          transactions={walletTransactions} 
          userEmail={userEmail}
          merchantCount={merchants.length}
        />
      </CardFooter>
    </Card>
  );
};

export default Wallet;
