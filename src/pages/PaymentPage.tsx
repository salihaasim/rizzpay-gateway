
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
import { generateUpiUrl } from '@/utils/upiQrUtils';

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
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Invalid Payment Link</CardTitle>
              <CardDescription className="text-gray-600">This payment link is missing required information</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center pb-6">
              <p className="text-gray-600">
                Please contact the merchant for a valid payment link.
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-xs text-gray-500">Powered by RizzPay</p>
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="flex justify-center mb-8 w-full">
          <div className="bg-primary rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
            <IndianRupee className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold text-gray-800">Payment Request</CardTitle>
              <CardDescription className="text-gray-600">Pay to {merchantName}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 px-8">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 font-medium">Amount to Pay</p>
                <p className="text-4xl font-bold text-gray-900">₹{formattedAmount}</p>
              </div>
              
              {description && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm text-center text-gray-700">
                  {description}
                </div>
              )}
              
              {/* QR Code Section */}
              <div className="text-center space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">Scan QR Code to Pay</h3>
                <div className="flex justify-center">
                  {qrCodeUrl ? (
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-inner">
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI QR Code" 
                        className="h-48 w-48 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-56 w-56 flex items-center justify-center border-2 border-gray-200 rounded-xl bg-gray-50">
                      <QrCode className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* UPI ID Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">UPI ID</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={upiId}
                    readOnly
                    className="text-sm font-mono bg-gray-50 border-gray-200 text-gray-800"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-gray-200 hover:bg-gray-50"
                    onClick={() => copyToClipboard(upiId)}
                  >
                    {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Payment Success State */}
              {paymentSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-100 rounded-full p-3">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg">Payment Initiated</h3>
                    <p className="text-sm text-green-700 mt-1">Complete payment in your UPI app</p>
                  </div>
                  {transactionId && (
                    <p className="text-xs text-green-600 font-mono bg-green-100 px-3 py-1 rounded-full inline-block">
                      Transaction ID: {transactionId}
                    </p>
                  )}
                  {returnUrl && (
                    <p className="text-xs text-green-600">You will be redirected shortly...</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg" 
                    onClick={handlePayment}
                  >
                    <Smartphone className="h-5 w-5 mr-2" />
                    Pay with UPI App
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 space-y-2">
                        <p className="font-semibold">How to pay:</p>
                        <div className="space-y-1 text-xs">
                          <p>• Scan QR code with any UPI app</p>
                          <p>• Or copy UPI ID and pay manually</p>
                          <p>• Or click "Pay with UPI App" on mobile</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-xs text-gray-500">Secure payments powered by RizzPay</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
