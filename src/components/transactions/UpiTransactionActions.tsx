
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactions';
import { toast } from 'sonner';

interface UpiTransactionActionsProps {
  transactionId: string;
}

const UpiTransactionActions: React.FC<UpiTransactionActionsProps> = ({ transactionId }) => {
  const { updateTransaction, transactions } = useTransactionStore();
  const transaction = transactions.find(t => t.id === transactionId);
  
  if (!transaction) return null;

  const handleAccept = () => {
    updateTransaction(transactionId, {
      status: 'successful',
      detailedStatus: 'Transaction manually approved by admin'
    });
    toast.success('Transaction has been approved');
  };

  const handleDecline = () => {
    updateTransaction(transactionId, {
      status: 'failed',
      detailedStatus: 'Transaction manually declined by admin'
    });
    toast.error('Transaction has been declined');
  };

  if (transaction.status !== 'pending') {
    return (
      <div className="text-gray-500 text-xs">
        {transaction.status === 'successful' ? 'Approved' : 'Declined'}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
        onClick={handleAccept}
      >
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
        onClick={handleDecline}
      >
        Decline
      </Button>
    </div>
  );
};

export default UpiTransactionActions;
