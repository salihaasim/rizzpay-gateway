
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Send, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UpiPaymentProps {
  paymentData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateUpiId: (upiId: string) => boolean;
  qrCodeUrl: string;
  qrCodeError: boolean;
  handleQrCodeError: () => void;
  handleUpiPayment: () => void;
  isLoading?: boolean;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({
  paymentData,
  handleInputChange,
  validateUpiId,
  qrCodeUrl,
  qrCodeError,
  handleQrCodeError,
  handleUpiPayment,
  isLoading = false
}) => {
  const [upiId, setUpiId] = useState(paymentData.upiId || '');
  const [isValid, setIsValid] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);
  
  // Update parent component when UPI ID changes
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpiId(value);
    const valid = validateUpiId(value);
    setIsValid(valid);
    
    // Update in parent component
    handleInputChange({
      target: { name: 'upiId', value }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  // Handle QR code load events
  const handleQrCodeLoad = () => {
    setQrLoading(false);
  };
  
  const handleQrCodeLoadError = () => {
    setQrLoading(false);
    handleQrCodeError();
  };
  
  useEffect(() => {
    if (qrCodeUrl) {
      setQrLoading(true);
    }
  }, [qrCodeUrl]);
  
  return (
    <>
      <div className="text-sm font-medium mb-2">UPI Payment</div>
      <div className="rounded-lg border p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">UPI Transfer</div>
            <div className="text-sm text-muted-foreground">
              Pay using your UPI app
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">UPI ID</label>
            <Input 
              placeholder="your-name@upi" 
              value={upiId}
              onChange={handleUpiIdChange}
            />
            {upiId && !isValid && (
              <p className="text-xs text-destructive mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Please enter a valid UPI ID (e.g. name@bank)
              </p>
            )}
          </div>
          
          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-2 py-2">
              <p className="text-sm font-medium">Or scan QR code</p>
              <div className="relative h-48 w-48 bg-white p-2 rounded-lg border">
                {qrLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="h-40 w-40" />
                  </div>
                )}
                {qrCodeError ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-destructive">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p className="text-xs text-center">Failed to load QR code</p>
                  </div>
                ) : (
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI QR Code"
                    className="h-full w-full object-contain"
                    onLoad={handleQrCodeLoad}
                    onError={handleQrCodeLoadError}
                  />
                )}
              </div>
            </div>
          )}
          
          <div className="p-3 bg-muted/50 rounded flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Please ensure you enter a correct UPI ID. After payment, you'll receive confirmation from your UPI app.
            </p>
          </div>
          
          <Button 
            onClick={handleUpiPayment}
            disabled={isLoading || (!isValid && !qrCodeUrl)}
            className="w-full"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Pay Now</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UpiPayment;
