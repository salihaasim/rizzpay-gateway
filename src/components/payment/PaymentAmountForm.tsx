
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PaymentAmountFormProps {
  paymentData: any;
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={paymentData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input
          id="customerEmail"
          name="customerEmail"
          type="email"
          placeholder="your@email.com"
          value={paymentData.customerEmail}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          Required for receipt (will be sent to Razorpay)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            {getCurrencySymbol(paymentData.currency)}
          </span>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            className="pl-7"
            value={paymentData.amount}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={paymentData.currency}
          onValueChange={(value) => handleSelectChange('currency', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
            <SelectItem value="USD">US Dollar ($)</SelectItem>
            <SelectItem value="EUR">Euro (€)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select
          value={paymentData.paymentMethod}
          onValueChange={(value) => handleSelectChange('paymentMethod', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="neft">NEFT/Bank Transfer</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose">Payment Purpose</Label>
        <Input
          id="purpose"
          name="purpose"
          placeholder="Payment purpose (optional)"
          value={paymentData.purpose}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default PaymentAmountForm;
