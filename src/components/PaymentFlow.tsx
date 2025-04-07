
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePaymentForm } from './payment/usePaymentForm';

// Import components directly instead of using lazy loading
import PaymentAmountForm from './payment/PaymentAmountForm';
import PaymentMethodComponent from './payment/PaymentMethod';
import PaymentSuccess from './payment/PaymentSuccess';
import RazorpayPaymentHandler from './payment/RazorpayPaymentHandler';
import UpiPaymentHandler from './payment/UpiPaymentHandler';
import PaymentSuccessActions from './payment/PaymentSuccessActions';

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

  // Force currency to INR
  useEffect(() => {
    if (paymentData.currency !== 'INR') {
      handleSelectChange('currency', 'INR');
    }
  }, [paymentData.currency, handleSelectChange]);

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

  const goToDeveloperPage = useCallback(() => {
    navigate('/developers');
  }, [navigate]);

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-8">
        <CardTitle className="text-xl font-semibold">Make a Payment</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Complete your transaction securely with Razorpay</span>
          <Button variant="link" size="sm" onClick={goToDeveloperPage}>Developer API</Button>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
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
                ₹ {paymentData.amount}
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
      </CardContent>
      
      <CardFooter className={`flex ${step === 3 ? 'justify-center flex-col space-y-2' : 'justify-end'} pt-2 pb-6`}>
        {step === 1 && (
          <Button onClick={handleNext} className="rounded-full px-6">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {step === 2 && paymentData.paymentMethod !== 'upi' && (
          <RazorpayPaymentHandler
            paymentData={paymentData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
        
        {step === 2 && paymentData.paymentMethod === 'upi' && (
          <UpiPaymentHandler
            paymentData={{
              ...paymentData,
              email: paymentData.email // Now this property exists in the type
            }}
            validateUpiId={validateUpiId}
            onSuccess={handlePaymentSuccess}
          />
        )}
        
        {step === 3 && (
          <PaymentSuccessActions
            onViewTransaction={handleViewTransaction}
            onMakeAnotherPayment={resetForm}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(PaymentFlow);
