import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  QrCode, 
  Send, 
  AlertCircle, 
  Smartphone, 
  Copy, 
  Link, 
  Check
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';

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
    id: 'bhim', 
    name: 'BHIM',
    logo: 'https://play-lh.googleusercontent.com/B5cNBA15IxjCT-8UTXEWgiPcGkJ1C07iHKwm2Hbs8xR3PnJvZ0swTag3abdRsNjzBKc=w240-h480-rw',
    packageName: 'in.org.npci.upiapp'
  }
];

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
  const [paymentLink, setPaymentLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState<UpiApp | null>(null);
  
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpiId(value);
    const valid = validateUpiId(value);
    setIsValid(valid);
    
    handleInputChange({
      target: { name: 'upiId', value }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  useEffect(() => {
    if (paymentData.amount && upiId && isValid) {
      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId || 'UPI Payment'}`)}&tr=${paymentData.transactionId || ''}`;
      
      const webLink = `https://upi.link/pay?pa=${upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId || 'UPI Payment'}`)}`;
      
      setPaymentLink(webLink);
    } else {
      setPaymentLink('');
    }
  }, [paymentData.amount, upiId, isValid, paymentData.name, paymentData.currency, paymentData.transactionId]);
  
  const handleQrCodeLoad = () => {
    setQrLoading(false);
  };
  
  const handleQrCodeLoadError = () => {
    setQrLoading(false);
    handleQrCodeError();
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

  const openUpiApp = (app: UpiApp) => {
    setSelectedApp(app);
    
    if (!isValid || !paymentData.amount) {
      toast.error('Please enter a valid UPI ID and amount');
      return;
    }
    
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId || 'UPI Payment'}`)}&tr=${paymentData.transactionId || ''}`;
    
    try {
      window.location.href = upiUrl;
      
      toast.info(`Opening ${app.name}...`, {
        description: 'If the app doesn\'t open, please try another method.'
      });
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast.error('Failed to open UPI app');
    }
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
        
        <Tabs defaultValue="upi-id" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upi-id">UPI ID</TabsTrigger>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="apps">UPI Apps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi-id" className="space-y-4">
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
            
            {isValid && paymentLink && (
              <div className="flex items-center space-x-2 relative">
                <Input 
                  value={paymentLink}
                  readOnly
                  className="flex-1 text-sm pr-20"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyPaymentLink}
                  className="absolute right-2"
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="qr-code" className="flex flex-col items-center space-y-2 py-2">
            {qrCodeUrl ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center h-48 w-48 border rounded-lg">
                <QrCode className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground px-4">
                  Enter a valid UPI ID to generate QR code
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Scan this QR code with any UPI app to make the payment
            </p>
          </TabsContent>
          
          <TabsContent value="apps" className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose a UPI app to pay:</p>
            <div className="grid grid-cols-4 gap-3">
              {UPI_APPS.map(app => (
                <button
                  key={app.id}
                  onClick={() => openUpiApp(app)}
                  className="flex flex-col items-center p-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  <img 
                    src={app.logo} 
                    alt={app.name} 
                    className="h-10 w-10 rounded-full object-contain mb-1"
                  />
                  <span className="text-xs text-center font-medium">{app.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" size="sm" className="text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Get payment link
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Payment Link</h4>
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={paymentLink || "Enter valid UPI ID first"}
                        readOnly
                        className="flex-1 text-xs"
                      />
                      <Button 
                        size="icon"
                        variant="outline"
                        onClick={copyPaymentLink}
                        disabled={!paymentLink}
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this link to collect payment
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>
        </Tabs>
      
        <div className="p-3 bg-muted/50 rounded flex items-start mt-4">
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
          className="w-full mt-4"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Pay Now</>
          )}
        </Button>
      </div>
    </>
  );
};

export default React.memo(UpiPayment);
