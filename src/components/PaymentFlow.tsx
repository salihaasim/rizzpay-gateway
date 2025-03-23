import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePaymentForm } from './payment/usePaymentForm';

// Lazy load components for better initial loading performance
const PaymentAmountForm = lazy(() => import('./payment/PaymentAmountForm'));
const PaymentMethodComponent = lazy(() => import('./payment/PaymentMethod'));
const PaymentSuccess = lazy(() => import('./payment/PaymentSuccess'));
const RazorpayPaymentHandler = lazy(() => import('./payment/RazorpayPaymentHandler'));
const UpiPaymentHandler = lazy(() => import('./payment/UpiPaymentHandler'));
const PaymentSuccessActions = lazy(() => import('./payment/PaymentSuccessActions'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="p-4 flex justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

const PaymentFlow = () => {
  const navigate = useNavigate();
  const {
    step,
    setStep,
    loading,
    setLoading,
    qrCodeError,
    setQrCodeError,
    qrCodeUrl,
    currentTransactionId,
    setCurrentTransactionId,
    paymentData,
    setPaymentData,
    handleInputChange,
    handleSelectChange,
    validateUpiId,
    generateUpiQrCode,
    handleQrCodeError,
    resetForm,
    getCurrencySymbol
  } = usePaymentForm();

  // Generate QR code when UPI ID changes and is valid
  useEffect(() => {
    if (step === 2 && paymentData.paymentMethod === 'upi' && paymentData.upiId && validateUpiId(paymentData.upiId)) {
      generateUpiQrCode();
    }
  }, [step, paymentData.upiId, paymentData.paymentMethod, paymentData.amount, generateUpiQrCode, validateUpiId]);

  // Reset QR code error state when UPI ID changes
  useEffect(() => {
    if (paymentData.paymentMethod === 'upi') {
      setQrCodeError(false);
    }
  }, [paymentData.upiId, paymentData.paymentMethod, setQrCodeError]);

  const handleNext = useCallback(() => {
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
    }
  }, [step, paymentData.amount, paymentData.name, setStep]);

  const handlePaymentSuccess = useCallback((transactionId: string) => {
    setCurrentTransactionId(transactionId);
    setPaymentData(prev => ({
      ...prev,
      paymentStatus: 'successful'
    }));
    setStep(3);
    setLoading(false);
  }, [setCurrentTransactionId, setPaymentData, setStep, setLoading]);

  const handlePaymentError = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const handleViewTransaction = useCallback(() => {
    if (currentTransactionId) {
      navigate(`/transactions?id=${currentTransactionId}`);
    }
  }, [currentTransactionId, navigate]);

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
            <>
              <div className="bg-secondary rounded-lg p-4 mb-4">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-2xl font-semibold">
                  {getCurrencySymbol(paymentData.currency)} {paymentData.amount}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Transaction ID: {paymentData.transactionId}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">UPI ID</label>
                <input 
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="your-name@upi" 
                  value={paymentData.upiId}
                  onChange={(e) => handleInputChange({
                    target: { name: 'upiId', value: e.target.value }
                  } as React.ChangeEvent<HTMLInputElement>)}
                />
                {paymentData.upiId && !validateUpiId(paymentData.upiId) && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Please enter a valid UPI ID (e.g. name@bank)
                  </p>
                )}
              </div>
            </>
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
          <Suspense fallback={<LoadingFallback />}>
            <RazorpayPaymentHandler
              paymentData={paymentData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Suspense>
        )}
        
        {step === 2 && paymentData.paymentMethod === 'upi' && (
          <Suspense fallback={<LoadingFallback />}>
            <UpiPaymentHandler
              paymentData={paymentData}
              validateUpiId={validateUpiId}
              onSuccess={handlePaymentSuccess}
            />
          </Suspense>
        )}
        
        {step === 3 && (
          <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccessActions
              onViewTransaction={handleViewTransaction}
              onMakeAnotherPayment={resetForm}
            />
          </Suspense>
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(PaymentFlow);
