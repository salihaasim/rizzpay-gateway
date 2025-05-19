
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { simulateWalletProcessing } from '@/utils/walletUtils';
import { toast } from 'sonner';
import { generateTransactionId } from '@/utils/formatUtils';

interface RazorpayPaymentHandlerProps {
  paymentData: any;
  onSuccess: (transactionId: string) => void;
  onError: () => void;
}

const RazorpayPaymentHandler: React.FC<RazorpayPaymentHandlerProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [processing, setProcessing] = useState(false);
  const { depositToWallet, userEmail } = useTransactionStore();

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    
    try {
      // If payment method is wallet, handle it directly
      if (paymentData.paymentMethod === 'wallet' && userEmail) {
        const walletBalance = useTransactionStore.getState().getWalletBalance(userEmail);
        const amount = parseFloat(paymentData.amount);
        
        // Check if wallet has sufficient balance
        if (amount > walletBalance) {
          toast.error("Insufficient wallet balance", {
            description: "Please add funds to your wallet or choose a different payment method."
          });
          setProcessing(false);
          return;
        }
        
        // Create a transaction ID
        const transactionId = generateTransactionId();
        
        // Process the payment from wallet
        await simulateWalletProcessing(
          userEmail, 
          amount, 
          'withdrawal', 
          `Payment for ${paymentData.transactionId || 'order'}`
        );
        
        // Notify success
        toast.success("Payment successful", {
          description: `₹${amount.toFixed(2)} has been paid from your wallet.`
        });
        
        // Call success callback
        onSuccess(transactionId);
        return;
      }
      
      // For other payment methods, simulate payment processing
      // In a real implementation, this would call the payment processor SDK
      setTimeout(() => {
        const transactionId = generateTransactionId();
        
        // For 90% of cases, simulate success
        if (Math.random() < 0.9) {
          onSuccess(transactionId);
        } else {
          toast.error("Payment failed", {
            description: "Please try again or use a different payment method."
          });
          onError();
        }
        
        setProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment processing error", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
      onError();
      setProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleRazorpayPayment}
      disabled={processing}
      className="w-full bg-[#0052FF] hover:bg-[#0045DB]"
    >
      {processing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Pay with RizzPay
        </>
      )}
    </Button>
  );
};

export default RazorpayPaymentHandler;
