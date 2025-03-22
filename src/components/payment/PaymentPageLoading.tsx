
import React from 'react';
import { Loader2 } from 'lucide-react';

const PaymentPageLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default React.memo(PaymentPageLoading);
