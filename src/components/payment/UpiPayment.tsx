
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Loader2, Smartphone, AlertTriangle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface UpiPaymentProps {
  paymentData: {
    upiId: string;
    receiverUpiId?: string;
    amount: string;
    currency: string;
    transactionId: string;
    purpose?: string;
    name: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateUpiId: (value: string) => boolean;
  qrCodeUrl: string;
  qrCodeError: boolean;
  handleQrCodeError: () => void;
  handleUpiPayment: () => void;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({
  paymentData,
  handleInputChange,
  validateUpiId,
  qrCodeUrl,
  qrCodeError,
  handleQrCodeError,
  handleUpiPayment
}) => {
  const [generating, setGenerating] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = useIsMobile();

  // Check device platform
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/i.test(userAgent));
    setIsIOS(/iphone|ipad|ipod/i.test(userAgent) || /mac/i.test(userAgent) && navigator.maxTouchPoints > 1);
  }, []);

  // Generate QR code whenever valid UPI ID changes
  useEffect(() => {
    if (paymentData.upiId && validateUpiId(paymentData.upiId) && !qrCodeUrl && !generating) {
      setGenerating(true);
      // This timeout simulates the generation process
      setTimeout(() => {
        setGenerating(false);
      }, 1500);
    }
  }, [paymentData.upiId, validateUpiId, qrCodeUrl, generating]);

  // Determine which UPI ID to use for payment - receiver's UPI ID if provided, otherwise user's UPI ID
  const paymentUpiId = paymentData.receiverUpiId && validateUpiId(paymentData.receiverUpiId) 
    ? paymentData.receiverUpiId 
    : paymentData.upiId;

  // Handle UPI deep link for mobile devices
  const handleUpiDeepLink = () => {
    if (!paymentData.upiId || !validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    if (paymentData.amount === '' || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Format the UPI payment URL (upi://pay format)
    const upiUrl = `upi://pay?pa=${paymentUpiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}&tr=${paymentData.transactionId}`;
    
    // Different handling based on platform
    if (isAndroid) {
      // Android uses intent:// scheme which opens the app selector
      window.location.href = upiUrl;
    } else if (isIOS) {
      // iOS doesn't have a universal deep link for UPI, but we can try
      // to open common UPI apps directly
      const apps = [
        { name: 'Google Pay', url: `gpay://upi/pay?pa=${paymentUpiId}&pn=${encodeURIComponent(paymentData.name)}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}` },
        { name: 'PhonePe', url: `phonepe://pay?pa=${paymentUpiId}&pn=${encodeURIComponent(paymentData.name)}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}` },
        { name: 'Paytm', url: `paytmmp://pay?pa=${paymentUpiId}&pn=${encodeURIComponent(paymentData.name)}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}` }
      ];
      
      // Try opening the first app
      window.location.href = apps[0].url;
      
      // Show user instructions to use QR code if deep link fails
      toast.info('If no UPI app opens, please scan the QR code or copy the UPI ID manually', {
        duration: 5000
      });
    } else {
      // On desktop, suggest QR code scanning
      toast.info('Please scan the QR code using your mobile UPI app', {
        duration: 5000
      });
    }

    // Call the original UPI payment handler too
    setTimeout(() => {
      handleUpiPayment();
    }, 1000);
  };

  // Function to handle copy to clipboard
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentUpiId).then(() => {
      toast.success('UPI ID copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy UPI ID');
    });
  };

  return (
    <>
      <div className="text-sm font-medium mb-2">UPI Payment</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Your UPI ID</label>
          <div className="flex items-center gap-2">
            <Input
              name="upiId"
              value={paymentData.upiId}
              onChange={handleInputChange}
              placeholder="yourname@upi"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., name@okaxis, name@ybl)</p>
          
          <div className="space-y-1 mt-4">
            <Label htmlFor="receiverUpiId">Receiver's UPI ID (Optional)</Label>
            <Input
              id="receiverUpiId"
              name="receiverUpiId"
              value={paymentData.receiverUpiId || ''}
              onChange={handleInputChange}
              placeholder="receiver@upi"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              If provided, payment will be directed to this UPI ID instead of yours
            </p>
          </div>
        </div>
        
        {isMobile && (
          <div className="mt-4 bg-primary/5 p-3 rounded-lg">
            <p className="text-sm text-center">
              {isAndroid ? 'Open UPI apps directly' : isIOS ? 'Open UPI app' : 'Pay using UPI'}
            </p>
            <button 
              onClick={handleUpiDeepLink}
              className="mt-2 bg-primary text-white w-full py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Smartphone className="h-5 w-5" />
              {isAndroid ? 'Open UPI Apps' : isIOS ? 'Open UPI App' : 'Pay with UPI'}
            </button>
            {isIOS && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Note: If the app doesn't open, please use the QR code below
              </p>
            )}
          </div>
        )}
        
        {paymentData.upiId && validateUpiId(paymentData.upiId) && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Scan QR Code</p>
              <button 
                onClick={handleCopyUpiId}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Copy UPI ID
              </button>
            </div>
            {qrCodeError ? (
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600">Could not generate QR code</p>
                <button 
                  onClick={handleQrCodeError}
                  className="text-xs text-primary mt-2 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : generating ? (
              <div className="flex items-center justify-center h-[200px] w-[200px] bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : qrCodeUrl ? (
              <div className="bg-white p-2 rounded-lg inline-block shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  width={200} 
                  height={200} 
                  onError={handleQrCodeError}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] w-[200px] bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">Scan this QR code with any UPI app</p>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium mb-1">Payment Details:</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">{paymentData.currency === 'INR' ? '₹' : paymentData.currency} {paymentData.amount}</div>
                <div className="text-muted-foreground">To:</div>
                <div className="font-medium truncate max-w-[150px]">{paymentUpiId}</div>
                <div className="text-muted-foreground">Transaction ID:</div>
                <div className="font-medium text-xs truncate max-w-[150px]">{paymentData.transactionId}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="rounded-lg border p-4 flex items-center cursor-pointer hover:bg-secondary/50 transition-colors" onClick={isMobile ? handleUpiDeepLink : handleUpiPayment}>
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
          {isMobile ? <Smartphone className="h-6 w-6 text-primary" /> : <QrCode className="h-6 w-6 text-primary" />}
        </div>
        <div>
          <div className="font-medium">Pay with UPI</div>
          <div className="text-sm text-muted-foreground">
            {isMobile ? 'Quick, secure UPI payment' : 'Scan QR code to pay'}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpiPayment;
