
import React, { useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';

interface RecentTransactionsProps {
  transactions: Transaction[];
  userEmail: string;
  merchantCount: number;
}

const TransactionItem = React.memo(({ transaction, userEmail }: { transaction: Transaction, userEmail: string }) => {
  const isIncoming = transaction.walletTransactionType === 'deposit' || 
                    (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail);
  
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center">
        {transaction.walletTransactionType === 'deposit' ? (
          <ArrowUpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-1 sm:mr-2" />
        ) : transaction.walletTransactionType === 'withdrawal' ? (
          <ArrowDownCircle className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 mr-1 sm:mr-2" />
        ) : (
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 sm:mr-2" />
        )}
        <div>
          <p className="text-xs sm:text-sm font-medium">
            {transaction.walletTransactionType === 'deposit' 
              ? 'Deposit' 
              : transaction.walletTransactionType === 'withdrawal'
                ? 'Withdrawal'
                : transaction.customer === userEmail
                  ? 'Received Transfer'
                  : 'Sent Transfer'}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {new Date(transaction.date).toLocaleString()}
          </p>
        </div>
      </div>
      <p className={`text-xs sm:text-sm font-medium ${isIncoming ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isIncoming ? '+' : '-'}{transaction.amount}
      </p>
    </div>
  );
});

TransactionItem.displayName = 'TransactionItem';

const RecentTransactions: React.FC<RecentTransactionsProps> = React.memo(({
  transactions,
  userEmail,
  merchantCount
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <p className="text-xs sm:text-sm font-medium">Recent Transactions</p>
        {merchantCount > 0 && (
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            You have {merchantCount} merchants
          </div>
        )}
      </div>
      {transactions.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              userEmail={userEmail} 
            />
          ))}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-muted-foreground text-center py-2 sm:py-3">No transactions yet</p>
      )}
    </div>
  );
});

RecentTransactions.displayName = 'RecentTransactions';

export default RecentTransactions;
