
import React from 'react';
import { Loader2 } from 'lucide-react';

const PaymentPageLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading payment interface...</p>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PaymentPageLoading);
