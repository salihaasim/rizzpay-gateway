
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, Loader2, CreditCard, Smartphone, Copy, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';

const PaymentFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    currency: 'INR',
    paymentMethod: 'upi',
    upiId: '',
    name: '',
    email: '',
    phone: '',
    purpose: '',
    transactionId: '',
    paymentStatus: ''
  });

  // Generate a random transaction ID when component mounts
  useEffect(() => {
    const randomId = 'RIZZPAY' + Math.floor(Math.random() * 10000000);
    setPaymentData(prev => ({
      ...prev,
      transactionId: randomId
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate first step
      if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      if (!paymentData.name) {
        toast.error('Please enter your name');
        return;
      }
      
      if (paymentData.email && !/\S+@\S+\.\S+/.test(paymentData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (paymentData.paymentMethod === 'upi' && !validateUpiId(paymentData.upiId)) {
        toast.error('Please enter a valid UPI ID');
        return;
      }
      
      // Start payment flow
      initiatePayment();
    }
  };

  // Initiate payment based on selected method
  const initiatePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      // Set payment status (success for demo)
      setPaymentData(prev => ({
        ...prev,
        paymentStatus: 'success'
      }));
      
      setStep(3);
      toast.success(`Payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount} successful!`);
    }, 2000);
  };

  // Get currency symbol based on selected currency
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₹';
    }
  };

  // Create UPI payment link
  const getUpiPaymentLink = () => {
    if (!paymentData.upiId) return '';
    
    const amount = paymentData.amount;
    const upiId = paymentData.upiId;
    const txnId = paymentData.transactionId;
    const purpose = paymentData.purpose || 'Payment via Rizzpay';
    
    return `upi://pay?pa=${upiId}&pn=Rizzpay&am=${amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(purpose)}&tr=${txnId}`;
  };

  // Handle UPI payment
  const handleUpiPayment = () => {
    if (!validateUpiId(paymentData.upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    const upiUrl = getUpiPaymentLink();
    
    // Check if mobile device to open UPI app
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = upiUrl;
      
      // Set timer to check payment status (for demo, we'll assume success)
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        setPaymentData(prev => ({
          ...prev,
          paymentStatus: 'success'
        }));
        toast.success(`Payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount} successful!`);
      }, 3000);
    } else {
      // For desktop, show the UPI ID and info for manual payment
      toast.info("Scan the QR code with your UPI app or use your mobile device");
      
      // For demo purposes
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        setPaymentData(prev => ({
          ...prev,
          paymentStatus: 'success'
        }));
        toast.success(`Payment of ${getCurrencySymbol(paymentData.currency)}${paymentData.amount} successful!`);
      }, 3000);
    }
  };

  // Copy UPI ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Validate UPI ID format
  const validateUpiId = (value: string) => {
    if (!value) return false;
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(value);
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Purpose (Optional)</label>
              <Input
                name="purpose"
                value={paymentData.purpose}
                onChange={handleInputChange}
                placeholder="Enter payment purpose"
              />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Email (Optional)</label>
              <Input
                name="email"
                value={paymentData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone (Optional)</label>
              <Input
                name="phone"
                value={paymentData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Amount</div>
              <div className="text-2xl font-semibold">
                {getCurrencySymbol(paymentData.currency)} {paymentData.amount}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Transaction ID: {paymentData.transactionId}
              </div>
            </div>
            
            <div className="space-y-4">
              {paymentData.paymentMethod === 'upi' && (
                <>
                  <div className="text-sm font-medium mb-2">UPI Payment</div>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">UPI ID</label>
                      <div className="flex items-center gap-2">
                        <Input
                          name="upiId"
                          value={paymentData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@upi"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., name@okaxis, name@ybl)</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 flex items-center cursor-pointer hover:bg-secondary/50 transition-colors" onClick={handleUpiPayment}>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Pay with UPI</div>
                      <div className="text-sm text-muted-foreground">Quick, secure UPI payment</div>
                    </div>
                  </div>
                </>
              )}

              {paymentData.paymentMethod === 'card' && (
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
                        <Input placeholder="Name on card" value={paymentData.name} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentData.paymentMethod === 'netbanking' && (
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
                <span className="font-medium">{paymentData.transactionId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{getCurrencySymbol(paymentData.currency)} {paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-emerald-500">Successful</span>
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
            onClick={paymentData.paymentMethod === 'upi' ? handleUpiPayment : handleNext} 
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
            setPaymentData(prev => ({ 
              ...prev,
              amount: '',
              upiId: '',
              purpose: '',
              paymentStatus: '',
              // Generate a new transaction ID
              transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000)
            }));
          }} className="rounded-full px-6">
            Make Another Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentFlow;
