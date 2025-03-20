
import React from 'react';
import Navbar from '@/components/Navbar';
import Wallet from '@/components/Wallet';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { ArrowUpCircle, ArrowDownCircle, CreditCard } from 'lucide-react';

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  
  // Filter wallet transactions
  const walletTransactions = userEmail 
    ? transactions.filter(t => t.walletTransactionType && t.customer === userEmail)
    : [];
  
  // Calculate statistics
  const totalDeposits = walletTransactions
    .filter(t => t.walletTransactionType === 'deposit')
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
  
  const totalWithdrawals = walletTransactions
    .filter(t => t.walletTransactionType === 'withdrawal')
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
  
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
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              
              {walletTransactions.length > 0 ? (
                walletTransactions.map((transaction) => (
                  <Card key={transaction.id} className="mb-4 border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {transaction.walletTransactionType === 'deposit' ? (
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                              <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
                              <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {transaction.walletTransactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.walletTransactionType === 'deposit' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {transaction.walletTransactionType === 'deposit' ? '+' : '-'}{transaction.amount}
                          </p>
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No transactions yet</p>
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
    </div>
  );
};

export default WalletPage;
