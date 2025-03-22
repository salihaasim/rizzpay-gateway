import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { addTransaction } from './TransactionUtils';
import { PaymentMethod } from '@/stores/transactionStore';
import { useNavigate } from 'react-router-dom';
import { showTransactionNotification } from '@/utils/notificationUtils';
import { 
  processRazorpayCardPayment, 
  processRazorpayNeftPayment 
} from '@/utils/paymentBackendUtils';

// Lazy load components for better initial loading performance
const PaymentAmountForm = lazy(() => import('./payment/PaymentAmountForm'));
const PaymentMethodComponent = lazy(() => import('./payment/PaymentMethod'));
const PaymentSuccess = lazy(() => import('./payment/PaymentSuccess'));
const UpiPayment = lazy(() => import('./payment/UpiPayment'));

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
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    currency: 'INR',
    paymentMethod: 'card' as PaymentMethod,
    upiId: 'salihaasimdevloper-4@okaxis', // Default UPI ID
    name: '',
    transactionId: '',
    paymentStatus: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    bankAccount: '',
    bankIfsc: '',
    bankName: '',
    purpose: 'Payment',
    customerEmail: '' // Added for Razorpay
  });

  // Generate transaction ID only once on component mount
  useEffect(() => {
    const randomId = 'RIZZPAY' + Math.floor(Math.random() * 10000000);
    setPaymentData(prev => ({
      ...prev,
      transactionId: randomId
    }));
  }, []);

  // Generate QR code when UPI ID changes and is valid
  useEffect(() => {
    if (step === 2 && paymentData.paymentMethod === 'upi' && paymentData.upiId && validateUpiId(paymentData.upiId)) {
      generateUpiQrCode();
    }
  }, [step, paymentData.upiId, paymentData.paymentMethod, paymentData.amount]);

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
    
    // Clear QR code when changing payment method
    if (name === 'paymentMethod') {
      setQrCodeUrl('');
    }
  };

  const validateUpiId = (upiId: string): boolean => {
    // Basic UPI ID validation (alphanumeric@provider format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  };

  const generateUpiQrCode = () => {
    if (!validateUpiId(paymentData.upiId) || !paymentData.amount) {
      return;
    }
    
    setQrCodeError(false);
    
    try {
      // Format the UPI payment URL (upi://pay format)
      const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}&tr=${paymentData.transactionId}`;
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
      
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
      setQrCodeError(true);
    }
  };

  const handleQrCodeError = () => {
    setQrCodeError(false);
    setQrCodeUrl('');
    setTimeout(() => {
      generateUpiQrCode();
    }, 500);
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
      
      setStep(2);
    } else if (step === 2) {
      initiatePayment();
    }
  };

  const handleUpiPayment = () => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    if (paymentData.amount === '' || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    initiatePayment();
  };

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      // Create a transaction entry first
      const transaction = addTransaction(
        paymentData.amount,
        paymentData.paymentMethod,
        'pending',
        paymentData.name,
        {}
      );
      
      setCurrentTransactionId(transaction.id);
      
      // Show processing notification
      showTransactionNotification(
        'info',
        'Processing Payment',
        `Processing ${paymentData.paymentMethod.toUpperCase()} payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount}...`
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
      } else if (paymentData.paymentMethod === 'upi') {
        // Handle UPI payment with existing code
        if (!validateUpiId(paymentData.upiId)) {
          toast.error('Please enter a valid UPI ID');
          return;
        }
        
        if (paymentData.amount === '' || parseFloat(paymentData.amount) <= 0) {
          toast.error('Please enter a valid amount');
          return;
        }
        
        // Simulate UPI payment processing
        console.log(`Simulating UPI payment to ${paymentData.upiId} for ${paymentData.amount}`);
        toast.success(`Payment request sent to UPI ID: ${paymentData.upiId}`);
      }
      
      if (result) {
        // Payment was successful, update UI
        setPaymentData(prev => ({
          ...prev,
          paymentStatus: 'successful'
        }));
        
        toast.success('Payment successful!');
      } else {
        // Payment failed or was cancelled
        toast.error('Payment was not completed');
      }
      
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred during payment processing");
      setLoading(false);
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

  const handleViewTransaction = () => {
    if (currentTransactionId) {
      navigate(`/transactions?id=${currentTransactionId}`);
    }
  };

  // Updated the resetForm function to only reset relevant fields
  const resetForm = () => {
    setStep(1);
    setPaymentData(prev => ({
      ...prev,
      amount: '',
      paymentStatus: '',
      transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000)
    }));
    setCurrentTransactionId(null);
    setQrCodeUrl('');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-8">
        <CardTitle className="text-xl font-semibold">Make a Payment</CardTitle>
        <CardDescription>Complete your transaction securely with Razorpay</CardDescription>
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
          
          {step === 2 && paymentData.paymentMethod !== 'upi' && (
            <PaymentMethodComponent
              paymentMethod={paymentData.paymentMethod}
              paymentData={paymentData}
              handleInputChange={handleInputChange}
              loading={loading}
            />
          )}
          
          {step === 2 && paymentData.paymentMethod === 'upi' && (
            <UpiPayment
              paymentData={paymentData}
              handleInputChange={handleInputChange}
              validateUpiId={validateUpiId}
              qrCodeUrl={qrCodeUrl}
              qrCodeError={qrCodeError}
              handleQrCodeError={handleQrCodeError}
              handleUpiPayment={handleUpiPayment}
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
        
        {step === 2 && paymentData.paymentMethod !== 'upi' && (
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
              onClick={resetForm} 
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
