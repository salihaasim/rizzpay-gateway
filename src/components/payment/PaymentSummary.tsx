
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PaymentSummaryProps {
  paymentData: {
    amount: string;
    currency: string;
    transactionId: string;
  };
  getCurrencySymbol: (currency: string) => string;
  onContinue: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  paymentData,
  getCurrencySymbol,
  onContinue
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-secondary rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Amount</div>
        <div className="text-2xl font-semibold">
          {getCurrencySymbol(paymentData.currency)} {paymentData.amount}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Transaction ID: {paymentData.transactionId}
        </div>
      </div>
      
      <Button onClick={onContinue} className="rounded-full px-6 w-full">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaymentSummary;
