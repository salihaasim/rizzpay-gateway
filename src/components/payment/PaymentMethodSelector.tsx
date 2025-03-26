
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, QrCode, Wallet } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onMethodChange
}) => {
  const isAuthenticated = useTransactionStore(state => state.userEmail !== null);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Payment Method</div>
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={onMethodChange}
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <RadioGroupItem 
            value="card" 
            id="card" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">Card</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="upi" 
            id="upi" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="upi"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <QrCode className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">UPI</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="neft" 
            id="neft" 
            className="peer sr-only" 
          />
          <Label
            htmlFor="neft"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Building className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">NetBanking</span>
          </Label>
        </div>
        
        {isAuthenticated && (
          <div>
            <RadioGroupItem 
              value="wallet" 
              id="wallet" 
              className="peer sr-only" 
            />
            <Label
              htmlFor="wallet"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Wallet className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Wallet</span>
            </Label>
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
