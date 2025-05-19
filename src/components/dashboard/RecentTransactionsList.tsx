
import React from 'react';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/stores/transactionStore';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

const RecentTransactionsList = React.memo(({ transactions }: RecentTransactionsListProps) => (
  <div className="space-y-4">
    {transactions.length > 0 ? (
      transactions.map((transaction) => (
        <TransactionCard key={transaction.id} {...transaction} />
      ))
    ) : (
      <div className="text-center py-12 border rounded-lg bg-secondary/30">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    )}
  </div>
));

RecentTransactionsList.displayName = 'RecentTransactionsList';

export default RecentTransactionsList;
