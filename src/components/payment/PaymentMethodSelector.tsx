
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark, QrCode } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onMethodChange 
}) => {
  // Use useCallback to prevent recreating these functions on every render
  const handleCardClick = useCallback(() => onMethodChange('card'), [onMethodChange]);
  const handleNeftClick = useCallback(() => onMethodChange('neft'), [onMethodChange]);
  const handleUpiClick = useCallback(() => onMethodChange('upi'), [onMethodChange]);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant={paymentMethod === 'card' ? 'default' : 'outline'} 
        size="sm"
        onClick={handleCardClick}
        className="min-w-20 flex items-center gap-1"
      >
        <CreditCard className="h-4 w-4" />
        <span>Card</span>
      </Button>
      <Button 
        variant={paymentMethod === 'neft' ? 'default' : 'outline'} 
        size="sm"
        onClick={handleNeftClick}
        className="min-w-20 flex items-center gap-1"
      >
        <Landmark className="h-4 w-4" />
        <span>Net Banking</span>
      </Button>
      <Button 
        variant={paymentMethod === 'upi' ? 'default' : 'outline'} 
        size="sm"
        onClick={handleUpiClick}
        className="min-w-20 flex items-center gap-1"
      >
        <QrCode className="h-4 w-4" />
        <span>UPI</span>
      </Button>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PaymentMethodSelector);
