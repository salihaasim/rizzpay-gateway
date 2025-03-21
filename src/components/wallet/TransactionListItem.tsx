
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, CreditCard } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge';
import { Button } from '@/components/ui/button';

interface TransactionListItemProps {
  transaction: Transaction;
  userEmail: string;
  onViewDetails: (id: string) => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  transaction,
  userEmail,
  onViewDetails
}) => {
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
        return userEmail === transaction.customer
          ? 'Received Transfer'
          : 'Sent Transfer';
      default:
        return 'Transaction';
    }
  };

  return (
    <Card className="mb-4 border-0 shadow-sm hover:shadow-md transition-shadow">
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
              onClick={() => onViewDetails(transaction.id)}
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionListItem;
