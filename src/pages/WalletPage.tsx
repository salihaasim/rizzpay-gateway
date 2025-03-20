
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Wallet from '@/components/Wallet';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { ArrowUpCircle, ArrowDownCircle, CreditCard, Filter, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import TransactionDetails from '@/components/TransactionDetails';

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  
  // Filter wallet transactions
  const walletTransactions = userEmail 
    ? transactions.filter(t => t.walletTransactionType && t.customer === userEmail)
    : [];
  
  // Apply additional filtering
  const filteredTransactions = walletTransactions.filter(t => {
    if (transactionFilter === 'all') return true;
    return t.walletTransactionType === transactionFilter;
  });
  
  // Calculate statistics
  const totalDeposits = walletTransactions
    .filter(t => t.walletTransactionType === 'deposit')
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
  
  const totalWithdrawals = walletTransactions
    .filter(t => t.walletTransactionType === 'withdrawal')
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);

  const pendingTransactions = walletTransactions
    .filter(t => t.status === 'pending' || t.status === 'processing')
    .length;
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle className="h-5 w-5 text-emerald-500" />;
      case 'withdrawal':
        return <ArrowDownCircle className="h-5 w-5 text-rose-500" />;
      case 'transfer':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary" />;
    }
  };

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer':
        return userEmail === transactions.find(t => t.id === selectedTransaction)?.customer
          ? 'Received Transfer'
          : 'Sent Transfer';
      default:
        return 'Transaction';
    }
  };
  
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
              
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <Card key={transaction.id} className="mb-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            {getTransactionTypeIcon(transaction.walletTransactionType || '')}
                          </div>
                          <div>
                            <p className="font-medium">
                              {getTransactionTypeName(transaction.walletTransactionType || '')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <p className={`font-semibold ${
                              transaction.walletTransactionType === 'deposit' || 
                              (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail)
                                ? 'text-emerald-500' 
                                : 'text-rose-500'
                            }`}>
                              {transaction.walletTransactionType === 'deposit' || 
                               (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail) 
                                ? '+' : '-'}{transaction.amount}
                            </p>
                            <TransactionStatusBadge status={transaction.status} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ID: {transaction.id}
                          </p>
                        </div>
                      </div>
                      
                      {transaction.description && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm">
                          {transaction.description}
                        </div>
                      )}
                      
                      {transaction.processingState && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Card className="border-0 shadow-sm overflow-hidden mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Wallet Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                      <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Total Deposits</p>
                    </div>
                    <p className="text-emerald-500 font-semibold">₹{totalDeposits.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
                      <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Total Withdrawals</p>
                    </div>
                    <p className="text-rose-500 font-semibold">₹{totalWithdrawals.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Transactions</p>
                    </div>
                    <p className="font-semibold">{walletTransactions.length}</p>
                  </div>
                  
                  {pendingTransactions > 0 && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Pending</p>
                      </div>
                      <p className="text-amber-500 font-semibold">{pendingTransactions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm overflow-hidden mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Transaction Fees</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-muted-foreground">Deposit</span>
                    <span className="font-medium">1.2%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-muted-foreground">Withdrawal</span>
                    <span className="font-medium">₹25 or 1.5%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-muted-foreground">Transfer</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Currency Conversion</span>
                    <span className="font-medium">2.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">How It Works</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium mb-1">Deposit Funds</p>
                      <p className="text-sm text-muted-foreground">Add money to your wallet for secure storage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium mb-1">Use for Payments</p>
                      <p className="text-sm text-muted-foreground">Pay for services directly from your wallet</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium mb-1">Withdraw Anytime</p>
                      <p className="text-sm text-muted-foreground">Transfer funds back to your bank account when needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
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
