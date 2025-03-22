
import React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSuccessData {
  transactionId: string;
  amount: string;
  currency: string;
  paymentDetails?: {
    upiId?: string;
    [key: string]: any;
  };
  qrCodeUrl?: string;
  qrCodeError?: boolean;
}

interface PaymentSuccessProps {
  paymentData: PaymentSuccessData;
  getCurrencySymbol: (currency: string) => string;
  handleQrCodeError?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  paymentData, 
  getCurrencySymbol,
  handleQrCodeError 
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch(() => {
      toast.error('Failed to copy. Please try again.');
    });
  };

  return (
    <div className="text-center py-6 animate-fade-in">
      <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-emerald-500" strokeWidth={3} />
      </div>
      <h3 className="text-xl font-semibold mb-2">Payment Submitted</h3>
      <p className="text-muted-foreground mb-6">Your payment is being processed.</p>
      <div className="bg-secondary rounded-lg p-4 max-w-xs mx-auto">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Transaction ID:</span>
          <div className="flex items-center">
            <span className="font-medium mr-2 text-sm truncate max-w-[120px]">{paymentData.transactionId}</span>
            <button 
              onClick={() => copyToClipboard(paymentData.transactionId)}
              className="text-primary hover:text-primary/80"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">{getCurrencySymbol(paymentData.currency)} {paymentData.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
