
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/utils/razorpay/razorpayLoader';
import { Loader2, IndianRupee } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Preload Razorpay script to improve user experience
  useEffect(() => {
    const preloadScript = async () => {
      try {
        const isLoaded = await loadRazorpayScript();
        setScriptLoaded(isLoaded);
      } catch (error) {
        console.error('Failed to preload Razorpay script:', error);
      }
    };
    
    preloadScript();
  }, []);

  // Force set currency to INR
  useEffect(() => {
    if (paymentData.currency !== 'INR') {
      handleSelectChange('currency', 'INR');
    }
  }, [paymentData.currency, handleSelectChange]);

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
      
      // Load Razorpay script if not already loaded
      if (!scriptLoaded) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error('Failed to load payment gateway');
          setIsProcessing(false);
          return;
        }
        setScriptLoaded(true);
      }
      
      // Convert amount to paise (Razorpay requires amount in smallest currency unit)
      const amountInPaise = Math.round(parseFloat(paymentData.amount) * 100);
      
      // Create Razorpay options
      const options = {
        key: "rzp_test_JXIkZl2p0iUbRw", // Using the Razorpay Key ID
        amount: amountInPaise,
        currency: 'INR',
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
          },
          // Mobile-specific options
          animation: true,
          backdropclose: false,
          escape: false
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
          className="h-11 md:h-10" // Taller input for mobile touch
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
          className="h-11 md:h-10" // Taller input for mobile touch
        />
        <p className="text-xs text-muted-foreground">
          Required for receipt (will be sent to Razorpay)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount (₹)</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <IndianRupee className="h-4 w-4" />
          </span>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            className="pl-7 h-11 md:h-10 text-lg" // Larger text for better readability on mobile
            value={paymentData.amount}
            onChange={handleInputChange}
            min="1"
            required
            inputMode="decimal" // Better keyboard for number input on mobile
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <select
          id="paymentMethod"
          className="flex h-11 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={paymentData.paymentMethod}
          onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
        >
          <option value="card">Credit/Debit Card</option>
          <option value="neft">NEFT/Bank Transfer</option>
          <option value="upi">UPI</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose">Payment Purpose</Label>
        <Input
          id="purpose"
          name="purpose"
          placeholder="Payment purpose (optional)"
          value={paymentData.purpose}
          onChange={handleInputChange}
          className="h-11 md:h-10" // Taller input for mobile touch
        />
      </div>

      {(paymentData.paymentMethod === 'card' || paymentData.paymentMethod === 'neft') && (
        <Button 
          onClick={handleDirectRazorpayPayment}
          className={`w-full mt-4 ${isMobile ? 'h-12 text-base' : 'h-10'}`} // Taller button with larger text on mobile
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
