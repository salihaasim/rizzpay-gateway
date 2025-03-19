
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, Loader2, CreditCard } from 'lucide-react';

const PaymentFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    paymentMethod: 'upi'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.amount) {
        toast.error('Please enter an amount');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Simulate payment processing
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1500);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-8">
        <CardTitle className="text-xl font-semibold">Make a Payment</CardTitle>
        <CardDescription>Complete your transaction securely</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <Input
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select
                value={formData.currency}
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
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">Google Pay (UPI)</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Amount</div>
              <div className="text-2xl font-semibold">₹ {formData.amount}</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium mb-2">Google Pay (UPI)</div>
              <div className="rounded-lg border p-4 flex items-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Pay with Google Pay</div>
                  <div className="text-sm text-muted-foreground">Quick, secure UPI payment</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="text-center py-6 animate-fade-in">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-500" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-6">Your transaction has been completed.</p>
            <div className="bg-secondary rounded-lg p-4 max-w-xs mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium">UPI87654321</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹ {formData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`flex ${step === 3 ? 'justify-center' : 'justify-end'} pt-2 pb-6`}>
        {step === 1 && (
          <Button onClick={handleNext} className="rounded-full px-6">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {step === 2 && (
          <Button onClick={handleNext} disabled={loading} className="rounded-full px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                Pay Now <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        
        {step === 3 && (
          <Button variant="outline" onClick={() => {
            setStep(1);
            setFormData({ amount: '', currency: 'INR', paymentMethod: 'upi' });
          }} className="rounded-full px-6">
            Make Another Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Internal component for success icon
const Check = ({ className, ...props }: React.ComponentProps<typeof ArrowRight>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M20 6L9 17L4 12" />
  </svg>
);

export default PaymentFlow;
