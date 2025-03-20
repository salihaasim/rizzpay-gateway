
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Building, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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

        {isCard ? (
          <div className="p-3 bg-muted/50 rounded mb-4 flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your card details are securely processed by Instamojo. All major credit & debit cards 
              are accepted, including Visa, Mastercard, RuPay, and American Express.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-muted/50 rounded mb-4 flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              You'll receive NEFT bank details to complete your transfer. After making the NEFT payment 
              from your bank, verify with the provided reference number.
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => initiateInstamojoPayment(type)} 
          className="w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
          ) : (
            <>
              Proceed to {isCard ? 'Card' : 'NEFT'} Payment
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default InstamojoPayment;
