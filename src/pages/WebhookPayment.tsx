import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getWebhookPaymentDetails, completeWebhookPayment } from '@/components/webhook/webhookUtils';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const WebhookPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  const transactionId = searchParams.get('id');
  
  useEffect(() => {
    if (!transactionId) {
      setError('Invalid payment request: Missing transaction ID');
      setLoading(false);
      return;
    }
    
    // Get payment details
    const details = getWebhookPaymentDetails(transactionId);
    if (!details) {
      setError('Payment request not found or expired');
      setLoading(false);
      return;
    }
    
    setPaymentData(details);
    setLoading(false);
  }, [transactionId]);
  
  const handlePayment = (status: 'success' | 'failed') => {
    if (!transactionId) return;
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const result = completeWebhookPayment(transactionId, status);
      
      if (result) {
        // If there's no callback URL, navigate to transactions page
        if (!paymentData.callbackUrl) {
          navigate(`/transactions?source=webhook&id=${transactionId}&status=${status}`);
        }
        // Otherwise, completeWebhookPayment will handle the redirect
      } else {
        setError('Failed to complete payment. Please try again.');
        setProcessing(false);
      }
    }, 1500);
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
            <span className="font-medium">{paymentData.merchantEmail}</span>
          </div>
          {paymentData.description && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description:</span>
              <span className="font-medium">{paymentData.description}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-center">
          You are about to make a payment to {paymentData.merchantEmail}.
          Please confirm to proceed or cancel to return.
        </p>
      </CardContent>
      
      <CardFooter className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => handlePayment('failed')}
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handlePayment('success')}
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

export default WebhookPayment;
