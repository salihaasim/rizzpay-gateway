
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Copy, Check, AlertCircle } from 'lucide-react';
import UpiQrCodeDisplay from './UpiQrCodeDisplay';

// Use a plain type (not interface), and do not export it, to avoid any recursive inference.
type UpiPaymentFormProps = {
  amount: string;
  description: string;
  upiId: string;
  qrCodeUrl: string;
  openUpiApp: () => void;
  handlePaymentSuccess: () => Promise<void>;
  loading: boolean;
  linkCopied: boolean;
  copyToClipboard: (text: string) => void;
};

const UpiPaymentForm: React.FC<UpiPaymentFormProps> = ({
  amount,
  description,
  upiId,
  qrCodeUrl,
  openUpiApp,
  handlePaymentSuccess,
  loading,
  linkCopied,
  copyToClipboard
}) => {
  return (
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
      
      <div className="space-y-4 mt-4">
        <UpiQrCodeDisplay 
          qrCodeUrl={qrCodeUrl} 
          upiId={upiId} 
          isLoading={!qrCodeUrl && loading}
        />
        
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
      
      <Button
        onClick={handlePaymentSuccess}
        disabled={loading}
        className="min-w-[200px] w-full mt-4"
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
    </>
  );
};

export default UpiPaymentForm;

// NOTE: If you need to extend the props, do so carefully and avoid recursive or extremely generic types.

