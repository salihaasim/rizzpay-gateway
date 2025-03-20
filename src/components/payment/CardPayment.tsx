
import React from 'react';
import { Input } from '@/components/ui/input';

interface CardPaymentProps {
  name: string;
}

const CardPayment: React.FC<CardPaymentProps> = ({ name }) => {
  return (
    <>
      <div className="text-sm font-medium mb-2">Credit/Debit Card</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <Input placeholder="1234 5678 9012 3456" className="flex-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <Input placeholder="123" type="password" maxLength={3} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Holder Name</label>
            <Input placeholder="Name on card" value={name} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPayment;
