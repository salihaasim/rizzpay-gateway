import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Building, Smartphone } from 'lucide-react';

interface PaymentAmountFormProps {
  paymentData: {
    amount: string;
    currency: string;
    name: string;
    paymentMethod: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  getCurrencySymbol: (currency: string) => string;
}

const PaymentAmountForm: React.FC<PaymentAmountFormProps> = ({
  paymentData,
  handleInputChange,
  handleSelectChange,
  getCurrencySymbol,
}) => {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {getCurrencySymbol(paymentData.currency)}
            </span>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              className="pl-8"
              value={paymentData.amount}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={paymentData.currency}
            onValueChange={(value) => handleSelectChange('currency', value)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={paymentData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup 
            value={paymentData.paymentMethod} 
            onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground">Pay with Visa, Mastercard or RuPay</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="neft" id="neft" className="sr-only" />
              <Label htmlFor="neft" className="flex items-center cursor-pointer">
                <Building className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">Net Banking</div>
                  <div className="text-sm text-muted-foreground">Pay through your bank account</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="upi" id="upi" className="sr-only" />
              <Label htmlFor="upi" className="flex items-center cursor-pointer">
                <Smartphone className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">UPI</div>
                  <div className="text-sm text-muted-foreground">Pay with BHIM, Google Pay, PhonePe etc.</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export default PaymentAmountForm;
