
import React from 'react';
import { Loader2, QrCode, IndianRupee } from 'lucide-react';

const PaymentPageLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="flex items-center justify-center relative">
        <div className="absolute animate-ping opacity-75">
          <IndianRupee className="h-10 w-10 text-coinbase" />
        </div>
        <div className="relative flex gap-3 items-center">
          <Loader2 className="h-12 w-12 animate-spin text-coinbase" />
          <QrCode className="h-10 w-10 text-muted-foreground animate-pulse" />
        </div>
      </div>
      <p className="text-muted-foreground">Processing payment...</p>
      <div className="text-xs text-muted-foreground mt-2">
        Setting up secure INR payment channels...
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PaymentPageLoading);
