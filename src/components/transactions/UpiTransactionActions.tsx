
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactions';
import { toast } from 'sonner';

interface UpiTransactionActionsProps {
  transactionId: string;
}

const UpiTransactionActions: React.FC<UpiTransactionActionsProps> = ({ transactionId }) => {
  const { updateTransaction, getTransactionById } = useTransactionStore();
  
  const handleVerify = () => {
    const transaction = getTransactionById(transactionId);
    if (transaction) {
      updateTransaction(transactionId, {
        status: 'successful',
        detailedStatus: 'Manually verified by merchant'
      });
      toast.success('Transaction verified successfully');
    }
  };
  
  const handleReject = () => {
    const transaction = getTransactionById(transactionId);
    if (transaction) {
      updateTransaction(transactionId, {
        status: 'failed',
        detailedStatus: 'Rejected during manual verification'
      });
      toast.error('Transaction rejected');
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleVerify}
        className="text-emerald-500 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
      >
        <Check className="h-4 w-4 mr-1" />
        Verify
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReject}
        className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
};

export default UpiTransactionActions;
