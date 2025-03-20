
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Building, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { showTransactionNotification, simulateSuccessfulPayment } from '@/utils/notificationUtils';

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
  
  const handlePaymentClick = () => {
    // Show friendly toast per the Instamojo docs recommendation
    showTransactionNotification(
      'info',
      `Preparing ${isCard ? 'card' : 'NEFT'} payment via Instamojo`,
      'You will be redirected to Instamojo\'s secure payment gateway'
    );
    
    // When in development/test, offer a way to simulate successful payments
    if (process.env.NODE_ENV === 'development') {
      const simulateId = `sim_${Math.random().toString(36).substring(2, 10)}`;
      
      // Store a simulated amount for the demo
      localStorage.setItem(`instamojo_payment_amount_${simulateId}`, '500.00');
      
      // Add a hidden test button for development only
      const testMode = window.localStorage.getItem('enable_test_mode') === 'true';
      if (testMode) {
        toast.info(
          "Test Mode Enabled", 
          {
            description: "Click here to simulate a successful payment",
            action: {
              label: "Simulate Success",
              onClick: () => simulateSuccessfulPayment(simulateId)
            }
          }
        );
      }
    }
    
    initiateInstamojoPayment(type);
  };
  
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

        <div className="p-3 bg-muted/50 rounded mb-4 space-y-2">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              {isCard
                ? 'Your card details are securely processed by Instamojo. All major credit & debit cards are accepted, including Visa, Mastercard, RuPay, and American Express.'
                : 'You\'ll receive NEFT bank details to complete your transfer. After making the NEFT payment from your bank, verify with the provided reference number.'}
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              You'll be redirected to Instamojo's secure payment portal to complete your transaction.
            </p>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-amber-50 rounded mb-4 border border-amber-200">
            <p className="text-xs text-amber-700 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              Test Mode: In a real implementation, you'll be redirected to the Instamojo payment page.
            </p>
          </div>
        )}
        
        <Button 
          onClick={handlePaymentClick} 
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
