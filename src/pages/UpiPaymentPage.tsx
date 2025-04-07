
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, IndianRupee, QrCode, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase, safeSupabaseTable } from '@/utils/supabaseClient';

const UpiPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
              <p className="text-center text-muted-foreground mt-2">
                Your payment of ₹{parseFloat(amount).toFixed(2)} has been received
              </p>
            </div>
          ) : (
            <>
              <div className="bg-primary/5 p-4 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Amount Due</div>
                <div className="text-3xl font-bold flex items-center justify-center">
                  ₹{parseFloat(amount).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {description}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium">Scan QR Code to Pay</h3>
                  <div className="flex justify-center my-4">
                    {qrCodeUrl ? (
                      <div className="p-2 bg-white border rounded-lg">
                        <img 
                          src={qrCodeUrl} 
                          alt="UPI QR Code" 
                          className="h-48 w-48 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-48 flex items-center justify-center border rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <div className="flex">
                    <Input
                      value={upiId}
                      readOnly
                      className="text-sm font-mono"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="ml-2"
                      onClick={() => copyToClipboard(upiId)}
                    >
                      {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    className="w-full"
                    onClick={openUpiApp}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Pay with UPI App
                  </Button>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium mb-1">After completing payment:</p>
                    <p>Please click "I've Completed Payment" below to update your payment status.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {success ? (
            <Button
              onClick={() => navigate('/')}
              className="min-w-[200px]"
            >
              Return to Home <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handlePaymentSuccess}
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'I\'ve Completed Payment'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpiPaymentPage;
