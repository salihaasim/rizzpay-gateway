
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Building } from 'lucide-react';

interface InstamojoPaymentProps {
  type: 'card' | 'neft';
  loading: boolean;
  initiateInstamojoPayment: (type: 'card' | 'neft') => void;
}

const InstamojoPayment: React.FC<InstamojoPaymentProps> = ({ 
  type, 
  loading, 
  initiateInstamojoPayment 
}) => {
  const isCard = type === 'card';
  
  return (
    <>
      <div className="text-sm font-medium mb-2">
        {isCard ? 'Card Payment (Instamojo)' : 'NEFT Payment (Instamojo)'}
      </div>
      <div className="rounded-lg border p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            {isCard ? (
              <CreditCard className="h-5 w-5 text-primary" />
            ) : (
              <Building className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <div className="font-medium">
              {isCard ? 'Secure Card Payment' : 'NEFT Bank Transfer'}
            </div>
            <div className="text-sm text-muted-foreground">
              {isCard 
                ? 'Process through Instamojo secure portal' 
                : 'Process using your bank\'s NEFT facility'}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isCard 
            ? 'You\'ll be redirected to Instamojo\'s secure payment gateway to complete your transaction.'
            : 'You\'ll be redirected to Instamojo to receive NEFT transfer details for your payment.'}
        </p>
        <Button 
          onClick={() => initiateInstamojoPayment(type)} 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
          ) : (
            <>Proceed to {isCard ? 'Card' : 'NEFT'} Payment</>
          )}
        </Button>
      </div>
    </>
  );
};

export default InstamojoPayment;
