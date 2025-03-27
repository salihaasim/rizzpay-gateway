
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Filter, Info } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Wallet from '@/components/Wallet';

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('transactions');
  
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
      <div className="content-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Wallet</h1>
            <p className="page-description">Manage your funds securely</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="dashboard-card overflow-hidden">
              <Wallet />
            </Card>
            
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground mr-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Filter your transactions by type
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
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
                
                <TabsContent value="transactions" className="mt-4">
                  <Card className="dashboard-card border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionList 
                        transactions={filteredTransactions}
                        userEmail={userEmail || ''}
                        onViewDetails={handleViewTransaction}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-4">
                  <Card className="dashboard-card border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Wallet Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="py-8 text-center text-muted-foreground">
                        Analytics feature coming soon
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="dashboard-card border border-border/50">
              {userEmail && <WalletSummary walletTransactions={walletTransactions} userEmail={userEmail} />}
            </Card>
            
            <Card className="dashboard-card border border-border/50">
              <WalletFees />
            </Card>
            
            <Card className="dashboard-card border border-border/50">
              <WalletHowItWorks />
            </Card>
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
