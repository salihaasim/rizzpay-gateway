
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { addTransaction, simulatePaymentProcessing } from './TransactionUtils';
import { PaymentMethod } from '@/stores/transactionStore';
import { useNavigate } from 'react-router-dom';
import { showTransactionNotification } from '@/utils/notificationUtils';

// Lazy load components for better initial loading performance
const PaymentAmountForm = lazy(() => import('./payment/PaymentAmountForm'));
const PaymentMethodComponent = lazy(() => import('./payment/PaymentMethod'));
const PaymentSuccess = lazy(() => import('./payment/PaymentSuccess'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="p-4 flex justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

const PaymentFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCodeError, setQrCodeError] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    currency: 'INR',
    paymentMethod: 'card' as PaymentMethod,
    upiId: '',
    name: '',
    email: '',
    phone: '',
    purpose: '',
    transactionId: '',
    paymentStatus: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    bankAccount: '',
    bankIfsc: '',
    bankName: ''
  });

  // Generate transaction ID only once on component mount
  useEffect(() => {
    const randomId = 'RIZZPAY' + Math.floor(Math.random() * 10000000);
    setPaymentData(prev => ({
      ...prev,
      transactionId: randomId
    }));
  }, []);

  // Reset QR code error state when UPI ID changes
  useEffect(() => {
    setQrCodeError(false);
  }, [paymentData.upiId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      if (!paymentData.name) {
        toast.error('Please enter your name');
        return;
      }
      
      if (paymentData.email && !/\S+@\S+\.\S+/.test(paymentData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      initiatePayment();
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      const transaction = addTransaction(
        paymentData.amount,
        paymentData.paymentMethod,
        'pending',
        paymentData.name,
        {
          cardNumber: paymentData.paymentMethod === 'card' ? paymentData.cardNumber || '•••• •••• •••• 4242' : undefined,
          cardHolderName: paymentData.paymentMethod === 'card' ? paymentData.name : undefined,
          bankName: paymentData.paymentMethod === 'neft' ? paymentData.bankName || 'HDFC Bank' : undefined,
          bankAccount: paymentData.paymentMethod === 'neft' ? paymentData.bankAccount : undefined,
          bankIfsc: paymentData.paymentMethod === 'neft' ? paymentData.bankIfsc : undefined,
          recipientName: paymentData.name,
          recipientEmail: paymentData.email,
          processor: 'Direct' + (paymentData.paymentMethod === 'card' ? 'Card' : 'NEFT')
        }
      );
      
      setCurrentTransactionId(transaction.id);
      
      // Process the real payment - this would connect to your payment gateway
      processRealPayment(transaction.id, paymentData);
      
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred during payment processing");
      setLoading(false);
    }
  };

  const processRealPayment = (transactionId: string, paymentData: any) => {
    // Show payment notification
    showTransactionNotification(
      'info',
      'Processing Payment',
      `Processing ${paymentData.paymentMethod.toUpperCase()} payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount}...`
    );
    
    // In a real implementation, this would call your payment gateway API
    // This is a placeholder for where you would implement your real payment processing
    // For now, we're simulating a successful payment
    simulatePaymentProcessing(
      transactionId, 
      paymentData.paymentMethod,
      true // Force success for this example
    ).then(() => {
      console.log(`Real ${paymentData.paymentMethod} payment would be processed here`);
    });
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₹';
    }
  };

  const handleViewTransaction = () => {
    if (currentTransactionId) {
      navigate(`/transactions?id=${currentTransactionId}`);
    }
  };

  const generateTransactionId = (): string => {
    return 'txn_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-8">
        <CardTitle className="text-xl font-semibold">Make a Payment</CardTitle>
        <CardDescription>Complete your transaction securely</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Suspense fallback={<LoadingFallback />}>
          {step === 1 && (
            <PaymentAmountForm 
              paymentData={paymentData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              getCurrencySymbol={getCurrencySymbol}
            />
          )}
          
          {step === 2 && (
            <PaymentMethodComponent
              paymentMethod={paymentData.paymentMethod}
              paymentData={paymentData}
              handleInputChange={handleInputChange}
              loading={loading}
            />
          )}
          
          {step === 3 && (
            <PaymentSuccess
              paymentData={paymentData}
              getCurrencySymbol={getCurrencySymbol}
            />
          )}
        </Suspense>
      </CardContent>
      
      <CardFooter className={`flex ${step === 3 ? 'justify-center flex-col space-y-2' : 'justify-end'} pt-2 pb-6`}>
        {step === 1 && (
          <Button onClick={handleNext} className="rounded-full px-6">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {step === 2 && (
          <Button 
            onClick={handleNext} 
            disabled={loading} 
            className="rounded-full px-6 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                Pay Now <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        
        {step === 3 && (
          <>
            <Button onClick={handleViewTransaction} variant="default" className="rounded-full px-6 w-full">
              View Transaction Details
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setStep(1);
                setPaymentData(prev => ({ 
                  ...prev,
                  amount: '',
                  purpose: '',
                  paymentStatus: '',
                  transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000)
                }));
                setCurrentTransactionId(null);
              }} 
              className="rounded-full px-6 w-full"
            >
              Make Another Payment
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(PaymentFlow);
