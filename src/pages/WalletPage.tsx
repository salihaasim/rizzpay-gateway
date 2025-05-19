
import React, { useState, useMemo, useEffect } from 'react';
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
import { useMobile } from '@/hooks/use-mobile';
import Layout from '@/components/Layout';

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('transactions');
  const isMobile = useMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get wallet-related transactions
  const walletTransactions = useMemo(() => {
    if (!userEmail) return [];
    return transactions.filter(t => 
      t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail)
    );
  }, [transactions, userEmail]);
  
  // Get filtered transactions based on filter
  const filteredTransactions = useFilteredTransactions(
    walletTransactions,
    transactionFilter,
    ''
  );
  
  const handleViewTransaction = (id: string) => {
    setSelectedTransaction(id);
    setDialogOpen(true);
  };
  
  const handleCloseTransactionDetails = () => {
    setSelectedTransaction(null);
    setDialogOpen(false);
  };
  
  const getTransactionById = (id: string | null) => {
    if (!id) return null;
    return transactions.find(t => t.id === id) || null;
  };
  
  return (
    <Layout>
      <div className="bg-background px-2 sm:px-4">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Wallet</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your funds securely</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="dashboard-card overflow-hidden">
              <Wallet />
            </Card>
            
            <div className="mt-4 sm:mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center">
                    {!isMobile && (
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
                    )}
                    
                    <Select 
                      value={transactionFilter} 
                      onValueChange={setTransactionFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
                
                <TabsContent value="transactions" className="mt-3 sm:mt-4">
                  <Card className="dashboard-card border border-border/50">
                    <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
                      <CardTitle className="text-base sm:text-lg font-medium">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                      <TransactionList 
                        transactions={filteredTransactions}
                        userEmail={userEmail || ''}
                        onViewDetails={handleViewTransaction}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-3 sm:mt-4">
                  <Card className="dashboard-card border border-border/50">
                    <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
                      <CardTitle className="text-base sm:text-lg font-medium">Wallet Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                      <div className="py-6 sm:py-8 text-center text-muted-foreground text-sm sm:text-base">
                        Analytics feature coming soon
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <Card className="dashboard-card border border-border/50">
              {userEmail && <WalletSummary walletTransactions={walletTransactions} userEmail={userEmail} />}
            </Card>
            
            <Card className="dashboard-card border border-border/50">
              <WalletFees />
            </Card>
            
            <Card className="dashboard-card border border-border/50 hidden sm:block">
              <WalletHowItWorks />
            </Card>
          </div>
        </div>
        
        {/* Transaction Details Dialog - Fixed DialogPortal nesting issue */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl sm:max-w-[95vw] md:max-w-3xl">
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
    </Layout>
  );
};

export default WalletPage;
