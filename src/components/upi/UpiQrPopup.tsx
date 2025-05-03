
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
import { Check, Copy, QrCode } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';

interface UpiQrPopupProps {
  amount: number;
  merchantName?: string;
  onSuccess?: (transactionId: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const UpiQrPopup: React.FC<UpiQrPopupProps> = ({
  amount,
  merchantName,
  onSuccess,
  onClose,
  isOpen,
  setIsOpen
}) => {
  const { currentMerchant } = useMerchantAuth();
  const { addTransaction } = useTransactionStore();
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Using the UPI settings from the merchant store
  const upiId = currentMerchant?.upiSettings?.upiId || 'default@rizzpay';
  
  // Generate UPI URL for payment
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName || 'RizzPay')}&am=${amount}&cu=INR`;
  
  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const handleSubmitTransaction = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter your UPI transaction ID');
      return;
    }
    
    // Generate a unique transaction reference
    const reference = `UPI-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Add to transaction store
    addTransaction({
      id: reference,
      amount: amount.toString(), // Convert to string to fix type error
      currency: 'INR',
      method: 'upi_manual',
      status: 'pending',
      reference: transactionId,
      customerName: 'Manual UPI Payment',
      timestamp: new Date().toISOString(),
      processingState: 'initiated', // Using a valid PaymentProcessingState value
      detailedStatus: 'Awaiting manual verification',
      paymentDetails: {
        upiId: upiId,
        razorpay_order_id: transactionId, // Use a valid property name from PaymentDetails
        // Remove the invalid property manualVerificationRequired
      }
    });
    
    toast.success('Transaction submitted for verification');
    
    if (onSuccess) {
      onSuccess(reference);
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
          <DialogTitle>Pay ₹{amount.toFixed(2)} via UPI</DialogTitle>
          <DialogDescription>
            Scan the QR code or use the UPI ID below to make your payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center p-4">
          <div className="border rounded-md p-2 bg-white">
            <img src={qrCodeUrl} alt="UPI QR Code" width="200" height="200" />
          </div>
          
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
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-3">
          <Label htmlFor="transactionId">UPI Transaction ID</Label>
          <Input
            id="transactionId"
            placeholder="Enter your UPI Transaction ID after payment"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Please enter the transaction ID you received after completing the UPI payment
          </p>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitTransaction} className="bg-[#0052FF]">
            Submit & Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpiQrPopup;
