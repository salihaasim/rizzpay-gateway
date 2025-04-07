
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { safeSupabaseTable } from '@/utils/supabaseClient';
import UpiPaymentForm from '@/components/payment/UpiPaymentForm';
import UpiPaymentSuccess from '@/components/payment/UpiPaymentSuccess';

const UpiPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiUrl, setUpiUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const { addTransaction } = useTransactionStore();
  
  // Get payment details from URL parameters
  const amount = searchParams.get('amount') || '0';
  const customerName = searchParams.get('name') || 'Customer';
  const customerEmail = searchParams.get('email') || '';
  const description = searchParams.get('desc') || 'Payment via RizzPay';
  const upiId = searchParams.get('upi') || 'merchant@rizzpay';
  const linkId = searchParams.get('id') || 'unknown';
  
  useEffect(() => {
    // Create UPI payment URL and QR code
    if (upiId && amount) {
      const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('RizzPay')}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
      
      setUpiUrl(upiPaymentUrl);
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPaymentUrl)}`;
      setQrCodeUrl(qrCodeApiUrl);
    }
  }, [upiId, amount, description]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    toast.success('UPI ID copied to clipboard!');
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };
  
  const handlePaymentSuccess = async () => {
    setLoading(true);
    
    try {
      // Create a transaction record
      const transactionId = `upipay_${Math.random().toString(36).substring(2, 12)}`;
      const date = new Date().toISOString();
      
      // Create transaction in store
      addTransaction({
        id: transactionId,
        date,
        amount: `₹${parseFloat(amount).toFixed(2)}`,
        rawAmount: parseFloat(amount),
        paymentMethod: 'upi',
        status: 'successful',
        customer: customerName,
        processingState: 'completed',
        paymentDetails: {
          upiId,
          buyerName: customerName,
          buyerEmail: customerEmail,
          paidAmount: amount,
        },
        description,
      });
      
      // Try to update the payment link status in Supabase using the safe method
      try {
        await safeSupabaseTable('payment_links')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', linkId);
      } catch (error) {
        console.error('Error updating payment link status:', error);
        // Continue anyway since we've created the transaction
      }
      
      setSuccess(true);
      setLoading(false);
      
      toast.success('Payment confirmed!', {
        description: 'Your transaction was completed successfully'
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      setLoading(false);
      toast.error('Error recording payment. Please try again.');
    }
  };
  
  const openUpiApp = () => {
    // Try to open the UPI app
    window.location.href = upiUrl;
    
    // Show guidance toast
    toast.info('Opening UPI app...', {
      description: 'If the app doesn\'t open, try copying the UPI ID manually'
    });
  };
  
  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <IndianRupee className="h-5 w-5 mr-2 text-primary" />
            RizzPay UPI Payment
          </CardTitle>
          <CardDescription>
            Secure UPI payment via RizzPay
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {success ? (
            <UpiPaymentSuccess amount={amount} />
          ) : (
            <UpiPaymentForm 
              amount={amount}
              description={description}
              upiId={upiId}
              qrCodeUrl={qrCodeUrl}
              openUpiApp={openUpiApp}
              handlePaymentSuccess={handlePaymentSuccess}
              loading={loading}
              linkCopied={linkCopied}
              copyToClipboard={copyToClipboard}
            />
          )}
        </CardContent>
        
        {!success && (
          <CardFooter className="flex justify-center">
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UpiPaymentPage;
