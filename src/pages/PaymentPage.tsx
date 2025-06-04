
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  IndianRupee, 
  QrCode, 
  ArrowRight, 
  Check, 
  Copy, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { generateUpiUrl, getUpiQrCodeUrl } from '@/utils/upiQrUtils';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // Get payment details from URL parameters
  const amount = searchParams.get('amount') || '';
  const merchantName = searchParams.get('name') || 'RizzPay Merchant';
  const description = searchParams.get('desc') || 'Payment via RizzPay';
  const upiId = searchParams.get('upi') || '';
  const returnUrl = searchParams.get('return_url') || '';
  
  const formattedAmount = amount ? parseFloat(amount).toLocaleString('en-IN', { 
    maximumFractionDigits: 2, 
    minimumFractionDigits: 2 
  }) : '0.00';

  // Generate QR code URL when component mounts
  useEffect(() => {
    if (upiId && amount) {
      const upiUrl = generateUpiUrl(upiId, parseFloat(amount), description);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [upiId, amount, description]);

  const handlePayment = () => {
    if (!upiId || !amount) {
      toast.error('Invalid payment details');
      return;
    }

    const txnId = `txn_${Math.random().toString(36).substring(2, 10)}`;
    setTransactionId(txnId);
    
    // Generate UPI deep link for mobile payment
    const upiUrl = generateUpiUrl(upiId, parseFloat(amount), description);
    
    // Try to open UPI app on mobile
    if (window.navigator.userAgent.includes('Mobile')) {
      window.location.href = upiUrl;
    }
    
    toast.success('Payment initiated successfully', {
      description: 'Complete payment in your UPI app'
    });
    
    setPaymentSuccess(true);
    
    // Redirect after payment if return URL is provided
    if (returnUrl) {
      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.append('txnId', txnId);
      redirectUrl.searchParams.append('status', 'initiated');
      
      setTimeout(() => {
        window.location.href = redirectUrl.toString();
      }, 3000);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    toast.success('UPI ID copied to clipboard!');
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  // Show error if required parameters are missing
  if (!upiId || !amount) {
    return (
      <>
        <Helmet>
          <title>RizzPay - Invalid Payment Link</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
          <Card className="max-w-md w-full border shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">Invalid Payment Link</CardTitle>
              <CardDescription>This payment link is missing required information</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Please contact the merchant for a valid payment link.
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-xs text-muted-foreground">Powered by RizzPay</p>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>RizzPay - Pay ₹{formattedAmount}</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="flex justify-center mb-6 w-full">
          <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="max-w-md w-full">
          <Card className="border shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Payment Request</CardTitle>
              <CardDescription>Pay to {merchantName}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Amount to Pay</p>
                <p className="text-3xl font-bold">₹{formattedAmount}</p>
              </div>
              
              {description && (
                <div className="bg-muted/50 p-3 rounded-md text-sm text-center">
                  {description}
                </div>
              )}
              
              {/* QR Code Section */}
              <div className="text-center">
                <h3 className="text-sm font-medium mb-3">Scan QR Code to Pay</h3>
                <div className="flex justify-center mb-4">
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
                      <QrCode className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* UPI ID Section */}
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
              
              {/* Payment Success State */}
              {paymentSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="bg-green-100 rounded-full p-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-medium text-green-800">Payment Initiated</h3>
                  <p className="text-sm text-green-700 mt-1">Complete payment in your UPI app</p>
                  {transactionId && (
                    <p className="text-xs text-green-600 mt-3">Transaction ID: {transactionId}</p>
                  )}
                  {returnUrl && (
                    <p className="text-xs text-green-600 mt-1">You will be redirected shortly...</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    className="w-full flex items-center justify-center gap-2" 
                    onClick={handlePayment}
                  >
                    <Smartphone className="h-5 w-5" />
                    Pay with UPI App
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium mb-1">How to pay:</p>
                      <p>1. Scan QR code with any UPI app</p>
                      <p>2. Or copy UPI ID and pay manually</p>
                      <p>3. Or click "Pay with UPI App" on mobile</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-xs text-muted-foreground">Secure payments powered by RizzPay</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
