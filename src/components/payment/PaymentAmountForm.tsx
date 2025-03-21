
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentAmountFormProps {
  paymentData: {
    amount: string;
    currency: string;
    paymentMethod: string;
    name: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  getCurrencySymbol: (currency: string) => string;
}

const PaymentAmountForm: React.FC<PaymentAmountFormProps> = ({
  paymentData,
  handleInputChange,
  handleSelectChange,
  getCurrencySymbol
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <div className="relative">
          <Input
            name="amount"
            value={paymentData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="pl-8"
            type="number"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {getCurrencySymbol(paymentData.currency)}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Currency</label>
        <Select
          value={paymentData.currency}
          onValueChange={(value) => handleSelectChange('currency', value)}
        >
          <SelectTrigger>
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
        <label className="text-sm font-medium">Payment Method</label>
        <Select
          value={paymentData.paymentMethod}
          onValueChange={(value) => handleSelectChange('paymentMethod', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upi">UPI / Google Pay</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="netbanking">Net Banking</SelectItem>
            <SelectItem value="instamojo_card">Card via Instamojo</SelectItem>
            <SelectItem value="instamojo_neft">NEFT via Instamojo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Name</label>
        <Input
          name="name"
          value={paymentData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />
      </div>
    </div>
  );
};

export default PaymentAmountForm;
