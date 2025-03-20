
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Smartphone, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface UpiPaymentProps {
  paymentData: {
    upiId: string;
    amount: string;
    currency: string;
    transactionId: string;
    purpose: string;
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
  return (
    <>
      <div className="text-sm font-medium mb-2">UPI Payment</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">UPI ID</label>
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
        </div>
        
        {paymentData.upiId && validateUpiId(paymentData.upiId) && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Scan QR Code</p>
            {qrCodeError ? (
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600">Could not generate QR code</p>
                <button 
                  onClick={() => qrCodeError}
                  className="text-xs text-primary mt-2 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : qrCodeUrl ? (
              <div className="bg-white p-2 rounded-lg inline-block">
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
          </div>
        )}
      </div>
      
      <div className="rounded-lg border p-4 flex items-center cursor-pointer hover:bg-secondary/50 transition-colors" onClick={handleUpiPayment}>
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="font-medium">Pay with UPI</div>
          <div className="text-sm text-muted-foreground">Quick, secure UPI payment</div>
        </div>
      </div>
    </>
  );
};

export default UpiPayment;
