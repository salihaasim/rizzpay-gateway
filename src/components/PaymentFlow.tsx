
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { addTransaction, simulatePaymentProcessing } from './TransactionUtils';
import { PaymentMethod } from '@/stores/transactionStore';
import { useNavigate } from 'react-router-dom';
import { createCardPayment, createNeftPayment } from './webhook/instamojoUtils';
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
    paymentMethod: 'upi' as PaymentMethod,
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
      if (paymentData.paymentMethod === 'upi' && !validateUpiId(paymentData.upiId)) {
        toast.error('Please enter a valid UPI ID');
        return;
      } else if (paymentData.paymentMethod === 'instamojo_card') {
        initiateInstamojoPayment('card');
        return;
      } else if (paymentData.paymentMethod === 'instamojo_neft') {
        initiateInstamojoPayment('neft');
        return;
      }
      
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
          upiId: paymentData.paymentMethod === 'upi' ? paymentData.upiId : undefined,
          cardNumber: paymentData.paymentMethod === 'card' ? '•••• •••• •••• 4242' : undefined,
          cardHolderName: paymentData.paymentMethod === 'card' ? paymentData.name : undefined,
          bankName: paymentData.paymentMethod === 'netbanking' ? paymentData.bankName || 'HDFC Bank' : undefined,
        }
      );
      
      setCurrentTransactionId(transaction.id);
      
      showTransactionNotification(
        'info',
        'Processing Payment',
        `Processing payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount}...`
      );
      
      await simulatePaymentProcessing(
        transaction.id, 
        paymentData.paymentMethod,
        Math.random() > 0.2
      );
      
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred during payment processing");
      setLoading(false);
    }
  };

  const initiateInstamojoPayment = async (type: 'card' | 'neft') => {
    setLoading(true);
    
    try {
      const internalTxnId = generateTransactionId();
      
      const paymentFunction = type === 'card' ? createCardPayment : createNeftPayment;
      const response = await paymentFunction({
        purpose: paymentData.purpose || `Payment via RizzPay (${type})`,
        amount: paymentData.amount,
        buyer_name: paymentData.name,
        email: paymentData.email || undefined,
        phone: paymentData.phone || undefined,
        redirect_url: `${window.location.origin}/dashboard?transaction_id=${internalTxnId}`,
        webhook_url: `${window.location.origin}/api/webhooks/instamojo`,
        allow_repeated_payments: false
      });
      
      if (response.success && response.payment_request) {
        const transaction = addTransaction(
          paymentData.amount,
          type === 'card' ? 'instamojo_card' : 'instamojo_neft',
          'pending',
          paymentData.name,
          {
            processor: 'Instamojo',
            recipientName: paymentData.name,
            recipientEmail: paymentData.email,
            processorMethod: type // Using processorMethod instead of paymentMethod
          }
        );
        
        setCurrentTransactionId(transaction.id);
        
        showTransactionNotification(
          'info',
          'Redirecting to Payment Gateway',
          `You'll be redirected to complete your ${type === 'card' ? 'card' : 'NEFT'} payment`
        );
        
        setTimeout(() => {
          window.location.href = response.payment_request.longurl;
        }, 1500);
      } else {
        toast.error(response.message || "Failed to create payment request");
        setLoading(false);
      }
    } catch (error) {
      console.error("Instamojo payment error:", error);
      toast.error("An error occurred during payment setup");
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

  // Validate UPI ID using a regex pattern
  const validateUpiId = (value: string) => {
    if (!value) return false;
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(value);
  };

  // Generate UPI payment link
  const getUpiPaymentLink = () => {
    try {
      if (!paymentData.upiId || !validateUpiId(paymentData.upiId)) return '';
      
      const amount = paymentData.amount;
      const upiId = encodeURIComponent(paymentData.upiId);
      const txnId = encodeURIComponent(paymentData.transactionId);
      const purpose = encodeURIComponent(paymentData.purpose || 'Payment via Rizzpay');
      
      return `upi://pay?pa=${upiId}&pn=Rizzpay&am=${amount}&cu=${paymentData.currency}&tn=${purpose}&tr=${txnId}`;
    } catch (error) {
      console.error("Error generating UPI link:", error);
      return '';
    }
  };

  // Generate UPI QR code URL with caching
  const getUpiQrCodeUrl = () => {
    try {
      if (!paymentData.upiId || !validateUpiId(paymentData.upiId)) {
        return '';
      }
      
      const upiUrl = getUpiPaymentLink();
      if (!upiUrl) {
        return '';
      }
      
      const encodedUpiUrl = encodeURIComponent(upiUrl);
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUpiUrl}`;
    } catch (error) {
      console.error("Error generating QR code URL:", error);
      return '';
    }
  };

  const handleUpiPayment = () => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    const upiUrl = getUpiPaymentLink();
    
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        window.location.href = upiUrl;
        initiatePayment();
      } catch (error) {
        setLoading(false);
        toast.error("Error opening UPI app. Please try another payment method.");
      }
    } else {
      toast.info("Scan the QR code with your UPI app or use your mobile device");
      initiatePayment();
    }
  };

  const handleQrCodeError = () => {
    console.error("QR code failed to load");
    setQrCodeError(true);
    toast.error("Error loading QR code. Please check your UPI ID.");
  };

  const handleViewTransaction = () => {
    if (currentTransactionId) {
      navigate(`/transactions?id=${currentTransactionId}`);
    }
  };

  const generateTransactionId = (): string => {
    return 'txn_' + Math.random().toString(36).substr(2, 9);
  };

  // Use memo to avoid recalculating the QR code URL on every render
  const qrCodeUrl = useMemo(() => {
    if (step === 2 && 
        paymentData.paymentMethod === 'upi' && 
        paymentData.upiId && 
        validateUpiId(paymentData.upiId)) {
      return getUpiQrCodeUrl();
    }
    return '';
  }, [step, paymentData.paymentMethod, paymentData.upiId, paymentData.amount, paymentData.transactionId, paymentData.purpose]);

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
              validateUpiId={validateUpiId}
              qrCodeUrl={qrCodeUrl}
              qrCodeError={qrCodeError}
              handleQrCodeError={handleQrCodeError}
              handleUpiPayment={handleUpiPayment}
              loading={loading}
              initiateInstamojoPayment={initiateInstamojoPayment}
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
            onClick={paymentData.paymentMethod === 'upi' ? handleUpiPayment : handleNext} 
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
                  upiId: '',
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
