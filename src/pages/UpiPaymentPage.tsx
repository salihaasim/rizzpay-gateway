
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactions';
import UpiPaymentForm from '@/components/payment/UpiPaymentForm';
import UpiQrCodeDisplay from '@/components/payment/UpiQrCodeDisplay';
import PaymentSuccess from '@/components/payment/PaymentSuccess';
import PaymentPageLoading from '@/components/payment/PaymentPageLoading';
import PaymentPageError from '@/components/payment/PaymentPageError';
import { generateTransactionId } from '@/stores/transactions/utils';
import { toast } from 'sonner';
import { PaymentDetails } from '@/stores/transactions/types';

const UpiPaymentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { addTransaction } = useTransactionStore();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const amount = params.get('amount');
    const orderId = params.get('order_id') || generateTransactionId();
    const merchantId = params.get('merchant_id') || 'demo_merchant';
    const callbackUrl = params.get('callback_url');
    const customerName = params.get('customer_name') || 'Guest';
    const customerEmail = params.get('customer_email') || 'guest@example.com';
    
    if (!amount) {
      setError('Missing required payment parameters');
      setIsLoading(false);
      return;
    }
    
    // Set transaction data
    setPaymentData({
      amount: amount,
      orderId: orderId,
      merchantId: merchantId,
      callbackUrl: callbackUrl,
      customerName: customerName,
      customerEmail: customerEmail,
      createdAt: new Date().toISOString()
    });
    
    setTransactionId(orderId);
    setIsLoading(false);
  }, [location]);
  
  const handlePaymentSuccess = (upiId: string) => {
    if (!transactionId || !paymentData) return;
    
    // Create a successful transaction
    const transaction = {
      id: transactionId,
      date: new Date().toISOString(),
      amount: `₹${paymentData.amount}`,
      rawAmount: parseFloat(paymentData.amount),
      customer: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      status: 'successful',
      paymentMethod: 'upi',
      description: `UPI Payment for order ${paymentData.orderId}`,
      detailedStatus: 'Payment completed',
      paymentDetails: {
        upiId: upiId,
        buyerName: paymentData.customerName,
        buyerEmail: paymentData.customerEmail,
        amountInPaise: parseFloat(paymentData.amount) * 100,
        gateway: 'UPI Direct'
      } as PaymentDetails
    };
    
    // Add to transaction store
    addTransaction(transaction);
    
    // Show success state
    setIsPaid(true);
    
    toast.success('Payment Successful!', {
      description: `₹${paymentData.amount} paid via UPI`,
    });
    
    // Handle callback if provided
    if (paymentData.callbackUrl) {
      // In production, you would redirect or send a webhook
      console.log('Callback URL:', paymentData.callbackUrl);
    }
  };
  
  if (isLoading) {
    return <PaymentPageLoading />;
  }
  
  if (error) {
    return <PaymentPageError error={error} />;
  }
  
  if (isPaid) {
    return <PaymentSuccess transactionId={transactionId} amount={paymentData?.amount} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="border shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-center text-xl">UPI Payment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {showQr ? (
            <UpiQrCodeDisplay 
              amount={paymentData.amount} 
              transactionId={transactionId || ''}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowQr(false)}
            />
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">₹{paymentData?.amount}</h2>
                <p className="text-muted-foreground">Pay using any UPI app</p>
              </div>
              
              <UpiPaymentForm
                onSubmit={(upiId) => handlePaymentSuccess(upiId)}
                onShowQr={() => setShowQr(true)}
              />
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Cancel Payment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpiPaymentPage;
