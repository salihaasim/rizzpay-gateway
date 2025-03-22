
import React, { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import PaymentMethod from '@/components/payment/PaymentMethod';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import PaymentSummary from '@/components/payment/PaymentSummary';
import { 
  processRazorpayCardPayment, 
  processRazorpayNeftPayment 
} from '@/utils/paymentBackendUtils';

interface PaymentPageDetailsProps {
  paymentData: any;
  transactionId: string | null;
  addTransaction: (transaction: any) => void;
  navigate: NavigateFunction;
}

const PaymentPageDetails: React.FC<PaymentPageDetailsProps> = ({
  paymentData,
  transactionId,
  addTransaction,
  navigate
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    paymentData[name] = value;
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  const handlePayment = async () => {
    if (!transactionId || !paymentData) return;
    
    setProcessing(true);
    
    try {
      let transaction = null;
      
      if (paymentMethod === 'card') {
        transaction = await processRazorpayCardPayment(
          parseFloat(paymentData.amount),
          paymentData.customerName || 'Customer',
          paymentData.customerEmail,
          {
            cardNumber: paymentData.cardNumber || '4242424242424242',
            cardExpiry: paymentData.cardExpiry || '12/25',
            cardHolderName: paymentData.cardName || paymentData.customerName || 'Customer'
          }
        );
      } else if (paymentMethod === 'neft') {
        transaction = await processRazorpayNeftPayment(
          parseFloat(paymentData.amount),
          paymentData.customerName || 'Customer',
          paymentData.customerEmail,
          {
            accountNumber: paymentData.bankAccount || '1234567890',
            ifscCode: paymentData.bankIfsc || 'HDFC0001234',
            bankName: paymentData.bankName || 'HDFC Bank'
          }
        );
      }
      
      if (!transaction) {
        throw new Error('Failed to process payment');
      }
      
      addTransaction(transaction);
      
      if (paymentData.callbackUrl) {
        window.location.href = `${paymentData.callbackUrl}&status=success`;
        return;
      }
      
      navigate(`/payment/success?id=${transactionId}`);
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setProcessing(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto mt-8 border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Complete Your Payment</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <PaymentSummary 
          paymentData={paymentData} 
          getCurrencySymbol={() => '₹'} 
          onContinue={() => {}}
        />
        
        <PaymentMethodSelector 
          paymentMethod={paymentMethod}
          onMethodChange={handlePaymentMethodChange}
        />
        
        <PaymentMethod
          paymentMethod={paymentMethod}
          paymentData={paymentData}
          handleInputChange={handleInputChange}
          loading={processing}
        />
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button
          onClick={handlePayment}
          disabled={processing}
          className="min-w-[120px]"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Pay Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(PaymentPageDetails);
