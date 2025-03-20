
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

interface CardPaymentProps {
  name: string;
  onSubmit?: (cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  }) => void;
  isLoading?: boolean;
}

const CardPayment: React.FC<CardPaymentProps> = ({ 
  name, 
  onSubmit,
  isLoading = false
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState(name);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        cardNumber,
        expiryDate,
        cvv,
        cardHolderName
      });
    }
  };
  
  const isFormValid = cardNumber.replace(/\s/g, '').length >= 16 
    && expiryDate.length === 5 
    && cvv.length >= 3 
    && cardHolderName.trim().length > 0;
  
  return (
    <>
      <div className="text-sm font-medium mb-2">Credit/Debit Card</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <Input 
              placeholder="1234 5678 9012 3456" 
              className="flex-1" 
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input 
                placeholder="MM/YY" 
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <Input 
                placeholder="123" 
                type="password" 
                maxLength={3} 
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Holder Name</label>
            <Input 
              placeholder="Name on card" 
              value={cardHolderName} 
              onChange={(e) => setCardHolderName(e.target.value)}
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded flex items-start mt-2">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your card information is securely processed. We don't store your card details.
            </p>
          </div>
          
          {onSubmit && (
            <Button 
              onClick={handleSubmit} 
              className="w-full flex items-center justify-center mt-2"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
              ) : (
                <><CreditCard className="mr-2 h-4 w-4" /> Pay Now</>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default CardPayment;
