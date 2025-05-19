
import React from 'react';
import { useTransactionStore } from '@/stores/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionListItem from './TransactionListItem';
import { Transaction } from '@/stores/transactions/types';

const RecentTransactions: React.FC = () => {
  const { transactions } = useTransactionStore();
  
  // Get wallet transactions (deposits, withdrawals, transfers)
  const walletTransactions = transactions
    .filter((tx: Transaction) => 
      tx.walletTransactionType === 'deposit' || 
      tx.walletTransactionType === 'withdrawal' || 
      tx.walletTransactionType === 'transfer_in' || 
      tx.walletTransactionType === 'transfer_out'
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
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
