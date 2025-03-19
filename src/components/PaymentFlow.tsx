
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const PaymentFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    paymentMethod: 'upi',
    upiId: '',
    name: '',
    email: '',
  });

  const form = useForm({
    defaultValues: {
      amount: '',
      currency: 'INR',
      paymentMethod: 'upi',
      upiId: '',
      name: '',
      email: '',
    }
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
      if (formData.paymentMethod === 'upi' && !formData.upiId) {
        toast.error('Please enter UPI ID');
        return;
      }
      
      // Simulate payment processing
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        // After successful payment
        toast.success(`Payment of ₹${formData.amount} successful!`);
      }, 1500);
    }
  };

  // Open UPI app for payment
  const handleUpiPayment = () => {
    if (!formData.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    const amount = formData.amount;
    const upiId = formData.upiId;

    // Create UPI payment link
    const upiUrl = `upi://pay?pa=${upiId}&pn=Rizzpay&am=${amount}&cu=INR&tn=Payment%20for%20order`;
    
    // Check if mobile device to open UPI app
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = upiUrl;
    } else {
      // For desktop, show QR code or ask to enter UPI ID manually
      console.log("UPI URL for QR code:", upiUrl);
      toast.info("Scan the QR code with your UPI app or use your mobile device");
      
      // Simulate payment for demo purpose
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        toast.success(`Payment of ₹${formData.amount} successful!`);
      }, 1500);
    }
  };

  const validateUpiId = (value: string) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(value) || "Please enter a valid UPI ID (e.g., name@upi)";
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
                  type="number"
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                type="email"
              />
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
              {formData.paymentMethod === 'upi' && (
                <>
                  <div className="text-sm font-medium mb-2">Google Pay (UPI)</div>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">UPI ID</label>
                      <div className="flex items-center gap-2">
                        <Input
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@upi"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., name@okhdfcbank, name@ybl)</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 flex items-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Pay with Google Pay</div>
                      <div className="text-sm text-muted-foreground">Quick, secure UPI payment</div>
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === 'card' && (
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
                        <Input placeholder="Name on card" value={formData.name} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === 'netbanking' && (
                <>
                  <div className="text-sm font-medium mb-2">Net Banking</div>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Select Bank</label>
                      <Select defaultValue="hdfc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">You will be redirected to the bank's website to complete the payment</p>
                    </div>
                  </div>
                </>
              )}
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
                <span className="font-medium">UPI{Math.floor(Math.random() * 10000000)}</span>
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
          <Button 
            onClick={formData.paymentMethod === 'upi' ? handleUpiPayment : handleNext} 
            disabled={loading} 
            className="rounded-full px-6 w-full"
          >
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
            setFormData({ 
              amount: '', 
              currency: 'INR', 
              paymentMethod: 'upi',
              upiId: '',
              name: '',
              email: '' 
            });
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
