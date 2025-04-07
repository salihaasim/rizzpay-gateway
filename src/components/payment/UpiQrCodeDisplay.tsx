
import React, { useState } from 'react';
import { Loader2, Copy, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UpiQrCodeDisplayProps {
  qrCodeUrl: string;
  upiId: string;
}

const UpiQrCodeDisplay: React.FC<UpiQrCodeDisplayProps> = ({ qrCodeUrl, upiId }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    toast.success('UPI ID copied to clipboard!');
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
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
      
      <div className="space-y-2">
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-muted px-3 py-1 rounded-md">
            <span className="text-sm font-mono mr-2">{upiId}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => copyToClipboard(upiId)}
            >
              {linkCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Scan with any UPI app or copy UPI ID
        </p>
      </div>
    </div>
  );
};

export default UpiQrCodeDisplay;
