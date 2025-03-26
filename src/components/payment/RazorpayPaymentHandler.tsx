
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/utils/razorpay/razorpayLoader';
import { 
  processRazorpayCardPayment, 
  processRazorpayNeftPayment 
} from '@/utils/paymentBackendUtils';

interface RazorpayPaymentHandlerProps {
  paymentData: {
    amount: string;
    currency: string;
    paymentMethod: string;
    name: string;
    customerEmail: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardName?: string;
    bankAccount?: string;
    bankIfsc?: string;
    bankName?: string;
  };
  onSuccess: (transactionId: string) => void;
  onError: () => void;
}

const RazorpayPaymentHandler: React.FC<RazorpayPaymentHandlerProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      // Show processing notification
      toast.info(
        'Processing Payment',
        {
          description: `Processing ${paymentData.paymentMethod.toUpperCase()} payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount}...`
        }
      );
      
      // Process the payment using Razorpay based on payment method
      let result = null;
      
      if (paymentData.paymentMethod === 'card') {
        result = await processRazorpayCardPayment(
          parseFloat(paymentData.amount),
          paymentData.name,
          paymentData.customerEmail,
          {
            cardNumber: paymentData.cardNumber || '4242424242424242',
            cardExpiry: paymentData.cardExpiry || '12/25',
            cardHolderName: paymentData.cardName || paymentData.name
          }
        );
      } else if (paymentData.paymentMethod === 'neft') {
        result = await processRazorpayNeftPayment(
          parseFloat(paymentData.amount),
          paymentData.name,
          paymentData.customerEmail,
          {
            accountNumber: paymentData.bankAccount || '1234567890',
            ifscCode: paymentData.bankIfsc || 'SBIN0001234',
            bankName: paymentData.bankName || 'HDFC Bank'
          }
        );
      }
      
      if (result) {
        // Payment was successful
        toast.success('Payment successful!');
        onSuccess(result.id || 'transaction-id');
      } else {
        // Payment failed or was cancelled
        toast.error('Payment was not completed');
        onError();
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred during payment processing");
      setLoading(false);
      onError();
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₹';
    }
  };

  return (
    <Button 
      onClick={initiatePayment} 
      disabled={loading} 
      className="rounded-full px-6 w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
        </>
      ) : (
        <>Pay Now</>
      )}
    </Button>
  );
};

export default RazorpayPaymentHandler;
