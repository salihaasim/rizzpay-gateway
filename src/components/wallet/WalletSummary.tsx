
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, CreditCard, Clock } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';

interface WalletSummaryProps {
  walletTransactions: Transaction[];
  userEmail: string;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ walletTransactions, userEmail }) => {
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

  return (
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
  );
};

export default WalletSummary;
