
import React from 'react';
import { Transaction } from '@/stores/transactions/types';
import TransactionListItem from './TransactionListItem';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails?: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }
  
  return (
    <div>
      {transactions.map((transaction) => (
        <TransactionListItem
          key={transaction.id}
          transaction={transaction}
          onViewDetails={onViewDetails}
          showStatus={true}
        />
      ))}
    </div>
  );
};

export default TransactionList;
