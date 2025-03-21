
import React from 'react';
import { Transaction } from '@/stores/transactionStore';
import TransactionListItem from './TransactionListItem';

interface TransactionListProps {
  transactions: Transaction[];
  userEmail: string;
  onViewDetails: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  userEmail,
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
          userEmail={userEmail}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default TransactionList;
