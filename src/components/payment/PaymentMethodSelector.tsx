
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onMethodChange 
}) => {
  return (
    <div className="flex space-x-2 justify-center">
      <Button 
        variant={paymentMethod === 'card' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onMethodChange('card')}
      >
        Card
      </Button>
      <Button 
        variant={paymentMethod === 'neft' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onMethodChange('neft')}
      >
        Net Banking
      </Button>
    </div>
  );
};

export default React.memo(PaymentMethodSelector);
