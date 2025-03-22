
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/utils/razorpay/razorpayLoader';
import { Loader2 } from 'lucide-react';

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
  const [isProcessing, setIsProcessing] = useState(false);

  // Direct Razorpay payment handling
  const handleDirectRazorpayPayment = async () => {
    // Validate form
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!paymentData.name) {
      toast.error('Please enter your name');
      return;
    }

    if (paymentData.paymentMethod !== 'card' && paymentData.paymentMethod !== 'neft') {
      toast.error('Please select either Card or NEFT payment method');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
        return;
      }
      
      // Convert amount to paise (Razorpay requires amount in smallest currency unit)
      const amountInPaise = Math.round(parseFloat(paymentData.amount) * 100);
      
      // Create Razorpay options
      const options = {
        key: "rzp_test_JXIkZl2p0iUbRw", // Using the Razorpay Key ID
        amount: amountInPaise,
        currency: paymentData.currency,
        name: "Rizzpay",
        description: paymentData.purpose || "Payment Processing",
        prefill: {
          name: paymentData.name,
          email: paymentData.customerEmail || '',
        },
        theme: {
          color: "#2563eb", // Primary color
        },
        handler: function(response: any) {
          console.log('Razorpay payment successful:', response);
          toast.success('Payment successful!', {
            description: `Payment ID: ${response.razorpay_payment_id}`
          });
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay payment dismissed by user');
            toast.info('Payment cancelled');
            setIsProcessing(false);
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Error processing direct Razorpay payment:', error);
      toast.error('Payment processing failed');
      setIsProcessing(false);
    }
  };

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

      {(paymentData.paymentMethod === 'card' || paymentData.paymentMethod === 'neft') && (
        <Button 
          onClick={handleDirectRazorpayPayment}
          className="w-full mt-4"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay with Razorpay</>
          )}
        </Button>
      )}
    </div>
  );
};

export default PaymentAmountForm;
