import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase } from '@/utils/supabaseClient';
import PaymentMethod from '@/components/payment/PaymentMethod';
import { processCardPayment, processNeftPayment } from '@/utils/paymentBackendUtils';

// Define PaymentDetails interface to fix TypeScript error
interface PaymentDetails {
  callbackUrl?: string;
  [key: string]: any;
}

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const { addTransaction } = useTransactionStore();
  
  const transactionId = searchParams.get('id');
  
  useEffect(() => {
    if (!transactionId) {
      setError('Invalid payment request: Missing transaction ID');
      setLoading(false);
      return;
    }
    
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch from Supabase
        const { data, error } = await supabase()
          .from('transactions')
          .select('*, merchants(name, email)')
          .eq('id', transactionId)
          .single();
        
        if (error) {
          console.error('Error fetching transaction:', error);
          setError('Payment request not found or expired');
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError('Payment request not found');
          setLoading(false);
          return;
        }
        
        // Extract payment details and ensure proper typing
        const paymentDetails = data.payment_details as PaymentDetails | null;
        
        // Format the payment data
        setPaymentData({
          transactionId: data.id,
          amount: data.amount,
          currency: data.currency || 'INR',
          description: data.description,
          merchant: data.merchants?.name || 'Merchant',
          merchantEmail: data.merchants?.email,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          callbackUrl: paymentDetails?.callbackUrl,
          date: new Date(data.date).toLocaleString()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading payment details:', err);
        setError('An error occurred while loading payment details');
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [transactionId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  const handlePayment = async () => {
    if (!transactionId || !paymentData) return;
    
    setProcessing(true);
    
    try {
      let transaction = null;
      
      // Process payment based on selected method using backend utilities
      if (paymentMethod === 'card') {
        transaction = await processCardPayment(
          parseFloat(paymentData.amount),
          paymentData.customerName || 'Customer',
          paymentData.customerEmail,
          {
            cardNumber: paymentData.cardNumber || '4242424242424242',
            cardExpiry: paymentData.cardExpiry || '12/25',
            cardHolderName: paymentData.customerName || 'Customer'
          }
        );
      } else if (paymentMethod === 'neft') {
        transaction = await processNeftPayment(
          parseFloat(paymentData.amount),
          paymentData.customerName || 'Customer',
          paymentData.customerEmail,
          {
            accountNumber: paymentData.bankAccount || '1234567890',
            ifscCode: paymentData.bankIfsc || 'HDFC0001234',
            bankName: paymentData.bankName || 'HDFC Bank'
          }
        );
      } else {
        // Update transaction in Supabase
        const processingTimeline = [
          {
            stage: 'processing',
            timestamp: new Date().toISOString(),
            message: `Payment initiated with ${paymentMethod}`
          },
          {
            stage: 'completed',
            timestamp: new Date().toISOString(),
            message: 'Payment successfully processed'
          }
        ];
        
        const paymentDetails = {
          ...paymentData,
          processor: 'webhook',
          paymentMethod,
          cardNumber: paymentData.cardNumber ? `**** **** **** ${paymentData.cardNumber.slice(-4)}` : undefined,
          upiId: paymentData.upiId,
          bankName: paymentData.bankName
        };
        
        // Update the transaction in Supabase
        const { error } = await supabase()
          .from('transactions')
          .update({
            status: 'successful',
            processing_state: 'completed',
            payment_method: paymentMethod,
            processing_timeline: processingTimeline,
            payment_details: paymentDetails
          })
          .eq('id', transactionId);
        
        if (error) {
          console.error('Error updating transaction:', error);
          setError('Failed to process payment');
          setProcessing(false);
          return;
        }
        
        // Add transaction to local store for UI display
        transaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount: `₹${paymentData.amount}`,
          paymentMethod,
          status: 'successful',
          customer: paymentData.customerName || 'Customer',
          createdBy: paymentData.merchantEmail,
          processingState: 'completed',
          processingTimeline,
          paymentDetails
        };
      }
      
      if (!transaction) {
        throw new Error('Failed to process payment');
      }
      
      // Add transaction to local store for UI display
      addTransaction(transaction);
      
      // If there's a callback URL, redirect
      const paymentDetails = paymentData.payment_details as PaymentDetails | null;
      if (paymentDetails?.callbackUrl) {
        window.location.href = `${paymentDetails.callbackUrl}&status=success`;
        return;
      }
      
      // Otherwise, navigate to success page
      navigate(`/payment/success?id=${transactionId}`);
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An error occurred while processing the payment');
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="max-w-md mx-auto mt-8 border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Complete Your Payment</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">₹{parseFloat(paymentData.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Merchant:</span>
            <span className="font-medium">{paymentData.merchant}</span>
          </div>
          {paymentData.description && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description:</span>
              <span className="font-medium">{paymentData.description}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 justify-center">
          <Button 
            variant={paymentMethod === 'card' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePaymentMethodChange('card')}
          >
            Card
          </Button>
          <Button 
            variant={paymentMethod === 'upi' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePaymentMethodChange('upi')}
          >
            UPI
          </Button>
          <Button 
            variant={paymentMethod === 'neft' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePaymentMethodChange('neft')}
          >
            Net Banking
          </Button>
        </div>
        
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

export default PaymentPage;
