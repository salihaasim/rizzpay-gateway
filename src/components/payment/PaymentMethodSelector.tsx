
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="flex space-x-2 justify-center">
      <Button 
        variant={paymentMethod === 'card' ? 'default' : 'outline'} 
        size="sm"
        onClick={handleCardClick}
        className="min-w-24"
      >
        Card
      </Button>
      <Button 
        variant={paymentMethod === 'neft' ? 'default' : 'outline'} 
        size="sm"
        onClick={handleNeftClick}
        className="min-w-24"
      >
        Net Banking
      </Button>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PaymentMethodSelector);
