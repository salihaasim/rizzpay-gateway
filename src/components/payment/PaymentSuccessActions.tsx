
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentSuccessActionsProps {
  onViewTransaction: () => void;
  onMakeAnotherPayment: () => void;
}

const PaymentSuccessActions: React.FC<PaymentSuccessActionsProps> = ({
  onViewTransaction,
  onMakeAnotherPayment
}) => {
  return (
    <>
      <Button onClick={onViewTransaction} variant="default" className="rounded-full px-6 w-full">
        View Transaction Details
      </Button>
      <Button 
        variant="outline" 
        onClick={onMakeAnotherPayment} 
        className="rounded-full px-6 w-full"
      >
        Make Another Payment
      </Button>
    </>
  );
};

export default PaymentSuccessActions;
