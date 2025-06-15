
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type UpiPaymentSuccessProps = {
  amount: string;
};

// Use a standard function instead of React.FC to avoid type inference issues.
function UpiPaymentSuccess({ amount }: UpiPaymentSuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
      <p className="text-center text-muted-foreground mt-2">
        Your payment of ₹{parseFloat(amount).toFixed(2)} has been received
      </p>
      <Button
        onClick={() => navigate('/')}
        className="min-w-[200px] mt-6"
      >
        Return to Home <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export default UpiPaymentSuccess;
