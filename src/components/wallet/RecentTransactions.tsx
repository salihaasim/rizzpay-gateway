
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';

interface RecentTransactionsProps {
  transactions: Transaction[];
  userEmail: string;
  merchantCount: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  userEmail,
  merchantCount
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Recent Transactions</p>
        {merchantCount > 0 && (
          <div className="text-xs text-muted-foreground">
            You have {merchantCount} merchants
          </div>
        )}
      </div>
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center">
                {transaction.walletTransactionType === 'deposit' ? (
                  <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                ) : transaction.walletTransactionType === 'withdrawal' ? (
                  <ArrowDownCircle className="h-4 w-4 text-rose-500 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {transaction.walletTransactionType === 'deposit' 
                      ? 'Deposit' 
                      : transaction.walletTransactionType === 'withdrawal'
                        ? 'Withdrawal'
                        : transaction.customer === userEmail
                          ? 'Received Transfer'
                          : 'Sent Transfer'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className={`font-medium ${
                transaction.walletTransactionType === 'deposit' || (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail)
                  ? 'text-emerald-500' 
                  : 'text-rose-500'
              }`}>
                {transaction.walletTransactionType === 'deposit' || (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail)
                  ? '+' 
                  : '-'}{transaction.amount}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-3">No transactions yet</p>
      )}
    </div>
  );
};

export default RecentTransactions;
