
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Smartphone, QrCode, AlertCircle, ExternalLink, Copy, Check, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { addTransaction } from '../TransactionUtils';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface UpiPaymentHandlerProps {
  paymentData: {
    amount: string;
    currency: string;
    upiId: string;
    name: string;
    email?: string;
  };
  validateUpiId: (upiId: string) => boolean;
  onSuccess: (transactionId: string) => void;
}

interface UpiApp {
  id: string;
  name: string;
  logo: string;
  packageName?: string;
}

const UPI_APPS: UpiApp[] = [
  { 
    id: 'gpay', 
    name: 'Google Pay',
    logo: 'https://play-lh.googleusercontent.com/HArtbyi53u0jnqhnnxkQnMx9dHOERNcQ2hXLgtNGtOAaUlbzXYE7XUrpYT30ov6BJ1s=w240-h480-rw',
    packageName: 'com.google.android.apps.nbu.paisa.user'
  },
  { 
    id: 'phonepe', 
    name: 'PhonePe',
    logo: 'https://play-lh.googleusercontent.com/6iyA2zVz5PyyMjK5SIxdUhrb7oh9cYVXJ93q6DZkmx07Er1o90PXYeo6mzL4VC2Gj9s=w240-h480-rw',
    packageName: 'com.phonepe.app'
  },
  { 
    id: 'paytm', 
    name: 'Paytm',
    logo: 'https://play-lh.googleusercontent.com/uEkLdxQQYqZWgQTwG6XhQw7koOKUb7AV1GoZ7AyMe7iv5vPDV_j6BdBc9CJUb1qTPQ=w240-h480-rw',
    packageName: 'net.one97.paytm'
  },
  { 
    id: 'amazpay', 
    name: 'Amazon Pay',
    logo: 'https://play-lh.googleusercontent.com/eHvNurCQXQ8DwqCG4HKTBGiqK9FCHu_JQPqSfpJGPK0OWVL32Lm1KGSgcUGHJvZ76qNk=w240-h480-rw'
  },
  { 
    id: 'bhim', 
    name: 'BHIM UPI',
    logo: 'https://play-lh.googleusercontent.com/B5cNBA15IxjCT_huhpfkaQFiWiquLBGZJwbXkPITrtba5BzXQS6J3MLC5DTGFfoAQg=w240-h480-rw'
  }
];

const UpiPaymentHandler: React.FC<UpiPaymentHandlerProps> = ({
  paymentData,
  validateUpiId,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrCodeError, setQrCodeError] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [showAppsDialog, setShowAppsDialog] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // Generate QR code URL
  useEffect(() => {
    if (validateUpiId(paymentData.upiId) && paymentData.amount) {
      generateQrCode();
    }
  }, [paymentData.upiId, paymentData.amount]);

  const generateQrCode = () => {
    setQrCodeError(false);
    try {
      // Format the UPI payment URL (upi://pay format)
      const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Payment via RizzPay`)}&tr=${generateTransactionId()}`;
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
      
      setQrCodeUrl(qrCodeApiUrl);
      
      // Generate direct UPI payment link
      setPaymentLink(upiUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
      setQrCodeError(true);
    }
  };

  // Generate a simple transaction ID
  const generateTransactionId = () => {
    return 'RZPY' + Math.floor(Math.random() * 1000000);
  };

  const handleUpiPayment = () => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    if (paymentData.amount === '' || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    
    try {
      // Construct the payment parameters
      const params = new URLSearchParams({
        amount: paymentData.amount,
        name: paymentData.name,
        email: paymentData.email || '',
        desc: `Payment via RizzPay`,
        upi: paymentData.upiId,
        id: generateTransactionId()
      });
      
      // Navigate to UPI payment page with query parameters
      navigate(`/upi-payment?${params.toString()}`);
    } catch (error) {
      console.error("UPI payment error:", error);
      toast.error("An error occurred during UPI payment processing");
      setLoading(false);
    }
  };

  const openUpiApp = (app: UpiApp) => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    // Format the UPI payment URL (upi://pay format)
    const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Payment via RizzPay`)}&tr=${generateTransactionId()}`;
    
    // Try to open the UPI app
    try {
      window.location.href = upiUrl;
      
      // Display toast notification
      toast.info(`Opening ${app.name}...`, {
        description: 'If the app doesn\'t open, please try another method.'
      });

      // Show the verification dialog after a short delay
      setTimeout(() => {
        setShowAppsDialog(false);
        handleShowVerification();
      }, 1500);
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast.error('Failed to open UPI app');
    }
  };

  const copyPaymentLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
        .then(() => {
          setLinkCopied(true);
          toast.success('Payment link copied to clipboard');
          setTimeout(() => setLinkCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          toast.error('Failed to copy link');
        });
    }
  };

  const downloadQrCode = () => {
    if (!qrCodeUrl) return;
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCodeUrl;
    downloadLink.download = `rizzpay-upi-qr-code.png`;
    
    // Append to the body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success('QR code downloaded successfully');
  };

  const handleShowVerification = () => {
    // Generate a unique transaction ID for verification
    const newTransactionId = generateTransactionId();
    setTransactionId(newTransactionId);
    
    // Show verification dialog
    setShowQrDialog(false);
    setShowAppsDialog(false);
    setVerificationSubmitted(false);
  };

  const handleVerifyPayment = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter your UPI transaction ID');
      return;
    }

    setLoading(true);

    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      setVerificationSubmitted(true);

      // Create a transaction record
      const paymentTransactionId = `upipay_${Math.random().toString(36).substring(2, 12)}`;
      
      // Notify about success
      onSuccess(paymentTransactionId);
      
      toast.success('Payment verification submitted!', {
        description: 'Your payment is being verified and will be processed shortly.'
      });
    }, 1500);
  };

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          onClick={handleUpiPayment}
          disabled={loading || !validateUpiId(paymentData.upiId)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" /> Pay with UPI via RizzPay
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowQrDialog(true)}
            className="flex-1"
            disabled={!validateUpiId(paymentData.upiId)}
          >
            <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowAppsDialog(true)}
            className="flex-1"
            disabled={!validateUpiId(paymentData.upiId)}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> UPI Apps
          </Button>
        </div>
      </div>
      
      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RizzPay QR Code Payment</DialogTitle>
            <DialogDescription>
              Scan this QR code with any UPI app to make the payment of ₹{paymentData.amount}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4">
            {qrCodeError ? (
              <div className="h-48 w-48 flex flex-col items-center justify-center text-destructive">
                <AlertCircle className="h-10 w-10 mb-2" />
                <p className="text-sm text-center">Failed to load QR code</p>
              </div>
            ) : qrCodeUrl ? (
              <div className="bg-white p-4 rounded-lg border relative group">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code"
                  className="h-48 w-48 object-contain"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Powered by RizzPay
                </p>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={downloadQrCode}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={handleShowVerification}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      I've Paid
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 w-48 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}
            
            <div className="mt-4 text-center w-full">
              <p className="text-sm mb-2">Or use this payment link:</p>
              <div className="flex gap-2 w-full relative">
                <Input
                  type="text"
                  value={paymentLink}
                  readOnly
                  className="text-xs pr-16 w-full"
                />
                <Button 
                  size="sm" 
                  onClick={copyPaymentLink} 
                  className="absolute right-0"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Clicking the link will directly open a UPI payment app on your device
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-center pt-2">
            <Button 
              variant="default"
              onClick={handleShowVerification}
            >
              <Check className="mr-2 h-4 w-4" />
              I've made the payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* UPI Apps Dialog */}
      <Dialog open={showAppsDialog} onOpenChange={setShowAppsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose UPI App</DialogTitle>
            <DialogDescription>
              Select a UPI app to make your payment of ₹{paymentData.amount}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4 p-4">
            {UPI_APPS.map(app => (
              <button
                key={app.id}
                onClick={() => openUpiApp(app)}
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <img 
                  src={app.logo} 
                  alt={app.name} 
                  className="h-12 w-12 rounded-full object-contain mb-2"
                />
                <span className="text-xs text-center font-medium">{app.name}</span>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <p className="text-sm mb-2">RizzPay Payment Link:</p>
            <div className="flex gap-2 relative">
              <Input
                type="text"
                value={paymentLink}
                readOnly
                className="text-xs pr-16 w-full"
              />
              <Button 
                size="sm" 
                onClick={copyPaymentLink}
                className="absolute right-0"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this link to make payment directly with any UPI app
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              variant="default"
              onClick={handleShowVerification}
            >
              <Check className="mr-2 h-4 w-4" />
              I've made the payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Verification Dialog */}
      <Dialog open={verificationSubmitted} onOpenChange={setVerificationSubmitted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
            <DialogDescription>
              Your payment is being processed and will be confirmed shortly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold">Thank You!</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Your transaction has been submitted for verification
            </p>
            
            <div className="mt-6 w-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-medium">₹{paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Reference ID</span>
                    <span className="font-mono text-sm">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Processing
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(UpiPaymentHandler);
