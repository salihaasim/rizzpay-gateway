
import React from 'react';
import { ArrowDown, ArrowUp, RefreshCw, CreditCard, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/stores/transactions/types';

interface TransactionListItemProps {
  transaction: Transaction;
  showStatus?: boolean;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  transaction,
  showStatus = false
}) => {
  const getTransactionIcon = () => {
    if (transaction.walletTransactionType === 'deposit') {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    } else if (transaction.walletTransactionType === 'withdrawal') {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    } else if (transaction.walletTransactionType === 'transfer_in' || transaction.walletTransactionType === 'transfer_out') {
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    } else if (transaction.paymentMethod === 'card') {
      return <CreditCard className="h-4 w-4 text-purple-500" />;
    } else {
      return <Wallet className="h-4 w-4 text-primary" />;
    }
  };

  const getTransactionTitle = () => {
    if (transaction.walletTransactionType === 'deposit') {
      return 'Deposit to Wallet';
    } else if (transaction.walletTransactionType === 'withdrawal') {
      return 'Withdrawal from Wallet';
    } else if (transaction.walletTransactionType === 'transfer_in') {
      return 'Transfer Received';
    } else if (transaction.walletTransactionType === 'transfer_out') {
      return 'Transfer Sent';
    } else {
      return transaction.description || 'Payment';
    }
  };

  const getAmountColor = () => {
    if (transaction.walletTransactionType === 'deposit' || transaction.walletTransactionType === 'transfer_in') {
      return 'text-green-600';
    } else if (transaction.walletTransactionType === 'withdrawal' || transaction.walletTransactionType === 'transfer_out') {
      return 'text-red-600';
    } else {
      return '';
    }
  };

  const getAmountPrefix = () => {
    if (transaction.walletTransactionType === 'deposit' || transaction.walletTransactionType === 'transfer_in') {
      return '+';
    } else if (transaction.walletTransactionType === 'withdrawal' || transaction.walletTransactionType === 'transfer_out') {
      return '-';
    } else {
      return '';
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {getTransactionIcon()}
        </div>
        <div>
          <div className="font-medium text-sm">{getTransactionTitle()}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(transaction.date), 'MMM d, yyyy • h:mm a')}
          </div>
          {showStatus && (
            <div className={`text-xs mt-1 ${
              transaction.status === 'successful' ? 'text-green-600' : 
              transaction.status === 'failed' ? 'text-red-600' : 
              transaction.status === 'pending' ? 'text-amber-600' : ''
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
          )}
        </div>
      </div>
      <div className={`font-medium ${getAmountColor()}`}>
        {getAmountPrefix()}{transaction.amount}
      </div>
    </div>
  );
};

export default TransactionListItem;
