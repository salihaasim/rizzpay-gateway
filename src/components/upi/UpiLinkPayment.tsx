
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Check, Copy, QrCode, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';

interface UpiLinkPaymentProps {
  amount: number;
  merchantName?: string;
  upiId: string;
  description?: string;
  onSuccess?: (transactionId: string, utrId: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const UpiLinkPayment: React.FC<UpiLinkPaymentProps> = ({
  amount,
  merchantName = 'RizzPay',
  upiId,
  description = 'Payment via RizzPay',
  onSuccess,
  onClose,
  isOpen,
  setIsOpen
}) => {
  const { addTransaction } = useTransactionStore();
  const [utrId, setUtrId] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isStaticQR, setIsStaticQR] = useState(false);
  
  // Generate UPI URL for payment
  const upiUrl = isStaticQR
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(description)}`
    : `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
  
  // Generate QR code URL using a free QR code API
  React.useEffect(() => {
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    setQrCodeUrl(qrCodeApiUrl);
  }, [upiUrl]);
  
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const handleSubmitUTR = () => {
    if (!utrId.trim()) {
      toast.error('Please enter your UPI transaction UTR ID');
      return;
    }
    
    // Generate a unique transaction reference
    const reference = `UPI-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Add to transaction store
    addTransaction({
      id: reference,
      amount: amount.toString(),
      paymentMethod: 'upi_manual',
      status: 'pending',
      customer: 'Link Payment',
      date: new Date().toISOString(),
      processingState: 'initiated',
      detailedStatus: 'Awaiting manual verification',
      paymentDetails: {
        upiId,
        utrId,
        description
      }
    });
    
    toast.success('UTR submitted for verification');
    
    if (onSuccess) {
      onSuccess(reference, utrId);
    }
    
    setIsOpen(false);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isStaticQR ? 'Pay via UPI' : `Pay ₹${amount.toFixed(2)} via UPI`}</DialogTitle>
          <DialogDescription>
            Scan the QR code or use the UPI ID below to make your payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mb-4">
          <Toggle
            pressed={isStaticQR}
            onPressedChange={setIsStaticQR}
            className="relative px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {isStaticQR ? "Static QR (Any Amount)" : "Fixed Amount QR"}
          </Toggle>
        </div>
        
        <div className="flex flex-col items-center p-4">
          <div className="border rounded-md p-2 bg-white">
            <img src={qrCodeUrl} alt="UPI QR Code" width="200" height="200" />
          </div>
          
          {isStaticQR && (
            <p className="mt-2 text-sm text-center text-muted-foreground">
              Enter any amount in your UPI app when scanning
            </p>
          )}
          
          <div className="mt-4 w-full">
            <Label>UPI ID</Label>
            <div className="flex items-center mt-2">
              <div className="flex-1 bg-muted p-2 rounded-md text-center font-mono">
                {upiId}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2" 
                onClick={handleCopyUpiId}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 w-full">
            <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-800">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <p>Please make the payment using any UPI app and then enter the UTR ID you received after payment completion.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-3">
          <Label htmlFor="utrId">Enter UTR ID / UPI Reference ID</Label>
          <Input
            id="utrId"
            placeholder="Enter the UTR ID received after payment"
            value={utrId}
            onChange={(e) => setUtrId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The UTR ID is a unique transaction reference provided by your bank after the payment is completed
          </p>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitUTR} className="bg-[#0052FF]">
            Submit UTR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpiLinkPayment;
