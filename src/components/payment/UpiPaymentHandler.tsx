
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addTransaction } from '../TransactionUtils';

interface UpiPaymentHandlerProps {
  paymentData: {
    amount: string;
    currency: string;
    upiId: string;
    name: string;
  };
  validateUpiId: (upiId: string) => boolean;
  onSuccess: (transactionId: string) => void;
}

const UpiPaymentHandler: React.FC<UpiPaymentHandlerProps> = ({
  paymentData,
  validateUpiId,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpiPayment = async () => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    if (paymentData.amount === '' || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a transaction entry
      const transaction = addTransaction(
        paymentData.amount,
        'upi',
        'pending',
        paymentData.name,
        {}
      );
      
      // Simulate UPI payment processing
      console.log(`Simulating UPI payment to ${paymentData.upiId} for ${paymentData.amount}`);
      toast.success(`Payment request sent to UPI ID: ${paymentData.upiId}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      onSuccess(transaction.id);
    } catch (error) {
      console.error("UPI payment error:", error);
      toast.error("An error occurred during UPI payment processing");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpiPayment}
      disabled={loading}
      className="w-full mt-4"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
        </>
      ) : (
        <>Pay with UPI</>
      )}
    </Button>
  );
};

export default UpiPaymentHandler;
