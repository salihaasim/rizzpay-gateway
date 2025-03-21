
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Wallet from '@/components/Wallet';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TransactionDetails from '@/components/TransactionDetails';
import WalletSummary from '@/components/wallet/WalletSummary';
import WalletFees from '@/components/wallet/WalletFees';
import WalletHowItWorks from '@/components/wallet/WalletHowItWorks';
import TransactionList from '@/components/wallet/TransactionList';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  
  const { walletTransactions, filteredTransactions } = useFilteredTransactions(
    transactions,
    userEmail,
    transactionFilter
  );
  
  const handleViewTransaction = (id: string) => {
    setSelectedTransaction(id);
  };
  
  const handleCloseTransactionDetails = () => {
    setSelectedTransaction(null);
  };
  
  const getTransactionById = (id: string | null) => {
    if (!id) return null;
    return transactions.find(t => t.id === id) || null;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-20 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Wallet</h1>
            <p className="text-muted-foreground">Manage your funds securely</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Wallet />
            
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Select 
                    value={transactionFilter} 
                    onValueChange={setTransactionFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="transfer">Transfers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TransactionList 
                transactions={filteredTransactions}
                userEmail={userEmail || ''}
                onViewDetails={handleViewTransaction}
              />
            </div>
          </div>
          
          <div>
            {userEmail && <WalletSummary walletTransactions={walletTransactions} userEmail={userEmail} />}
            <WalletFees />
            <WalletHowItWorks />
          </div>
        </div>
      </div>
      
      {/* Transaction Details Dialog */}
      <Dialog 
        open={selectedTransaction !== null} 
        onOpenChange={(open) => !open && handleCloseTransactionDetails()}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && getTransactionById(selectedTransaction) && (
            <TransactionDetails 
              transaction={getTransactionById(selectedTransaction)!}
              onClose={handleCloseTransactionDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;
