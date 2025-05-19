
import React from 'react';
import { useTransactionStore } from '@/stores/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionListItem from './TransactionListItem';
import { Transaction } from '@/stores/transactions/types';

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const storeTransactions = useTransactionStore(state => state.transactions);
  
  // Use provided transactions or get from store
  const transactionsToUse = transactions || storeTransactions;
  
  // Get wallet transactions (deposits, withdrawals, transfers)
  const walletTransactions = transactionsToUse
    .filter((tx: Transaction) => 
      tx.walletTransactionType === 'deposit' || 
      tx.walletTransactionType === 'withdrawal' || 
      tx.walletTransactionType === 'transfer'
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {walletTransactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y">
            {walletTransactions.map((transaction) => (
              <TransactionListItem 
                key={transaction.id} 
                transaction={transaction} 
                showStatus={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
