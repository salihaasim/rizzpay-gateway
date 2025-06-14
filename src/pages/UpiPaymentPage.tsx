import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactions';
import { safeSupabaseTable } from '@/utils/supabaseClient';
import UpiPaymentForm, { UpiPaymentFormProps } from '@/components/payment/UpiPaymentForm';
import UpiPaymentSuccess from '@/components/payment/UpiPaymentSuccess';
import { PaymentMethod } from '@/stores/transactions/types';

const UpiPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [upiUrl, setUpiUrl] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const { addTransaction } = useTransactionStore();

  // Get payment details from URL parameters
  const amount: string = searchParams.get('amount') || '0';
  const customerName: string = searchParams.get('name') || 'Customer';
  const customerEmail: string = searchParams.get('email') || '';
  const description: string = searchParams.get('desc') || 'Payment via RizzPay';
  const upiId: string = searchParams.get('upi') || 'merchant@rizzpay';
  const linkId: string = searchParams.get('id') || 'unknown';

  useEffect(() => {
    // Create UPI payment URL and QR code
    if (upiId && amount) {
      const upiPaymentUrl: string =
        `upi://pay?pa=${upiId}&pn=${encodeURIComponent('RizzPay')}` +
        `&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;

      setUpiUrl(upiPaymentUrl);

      // Generate QR code URL using a third-party service
      const qrCodeApiUrl: string = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPaymentUrl)}`;
      setQrCodeUrl(qrCodeApiUrl);
    }
  }, [upiId, amount, description]);

  // Explicit type for copyToClipboard function
  const copyToClipboard: (text: string) => void = (text) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    toast.success('UPI ID copied to clipboard!');

    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  // Explicit type for handlePaymentSuccess function
  const handlePaymentSuccess: () => Promise<void> = async () => {
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
        paymentMethod: 'upi' as PaymentMethod,
        status: 'successful',
        customer: customerName,
        processingState: 'completed',
        paymentDetails: {
          upiId,
          buyerName: customerName,
          buyerEmail: customerEmail,
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

  // Explicit type for openUpiApp function
  const openUpiApp: () => void = () => {
    // Try to open the UPI app
    window.location.href = upiUrl;

    // Show guidance toast
    toast.info('Opening UPI app...', {
      description: "If the app doesn't open, try copying the UPI ID manually"
    });
  };

  // Explicitly typed props for UpiPaymentForm (ONLY shallow/primitive types and functions)
  const formProps: UpiPaymentFormProps = {
    amount,
    description,
    upiId,
    qrCodeUrl,
    openUpiApp,
    handlePaymentSuccess,
    loading,
    linkCopied,
    copyToClipboard,
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
            <UpiPaymentForm {...formProps} />
          )}
        </CardContent>

        {!success && (
          <CardFooter className="flex justify-center">
            {/* No extra content */}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UpiPaymentPage;
