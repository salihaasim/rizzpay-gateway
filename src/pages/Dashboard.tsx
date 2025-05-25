
import React, { useState, useMemo, useEffect } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMediaQuery } from '@/hooks/use-media-query';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  IndianRupee, 
  ArrowRight, 
  Send, 
  QrCode, 
  Star,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UpiQrPopup from '@/components/upi/UpiQrPopup';
import { createRazorpayOrder, loadRazorpayScript } from '@/utils/razorpay';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const Dashboard = () => {
  const { currentMerchant } = useMerchantAuth();
  const transactionStore = useTransactionStore();
  const [activeTab, setActiveTab] = useState(currentMerchant?.role === 'admin' ? 'admin' : 'merchant');
  const navigate = useNavigate();
  
  // Simplified merchant name - just use the email without GROUP suffix
  const merchantName = useMemo(() => {
    if (!currentMerchant?.email) return "MERCHANT";
    return currentMerchant.email.split('@')[0].toUpperCase();
  }, [currentMerchant?.email]);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [customerUpiId, setCustomerUpiId] = useState('');
  const [isUpiPopupOpen, setIsUpiPopupOpen] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [generatedUpiUrl, setGeneratedUpiUrl] = useState('');
  
  // Bank account favorites
  const [bankAccounts, setBankAccounts] = useState([
    { id: '1', name: 'HDFC Primary', accountNumber: 'XXXX1234', ifscCode: 'HDFC0001234', isFavorite: true },
    { id: '2', name: 'ICICI Business', accountNumber: 'XXXX5678', ifscCode: 'ICIC0005678', isFavorite: false }
  ]);
  
  // UPI states
  const [upiProvider, setUpiProvider] = useState('gpay');
  
  // Only access userRole and userEmail from the store after component mounts
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    if (transactionStore) {
      setUserRole(transactionStore.userRole || (currentMerchant?.role === 'admin' ? 'admin' : 'merchant'));
      setUserEmail(transactionStore.userEmail || currentMerchant?.email || '');
    }
  }, [transactionStore, currentMerchant]);
  
  const toggleFavorite = (id: string) => {
    setBankAccounts(accounts => 
      accounts.map(acc => 
        acc.id === id ? { ...acc, isFavorite: !acc.isFavorite } : acc
      )
    );
    toast.success('Favorite status updated');
  };

  // Validate UPI ID format
  const validateUpiId = (upiId: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  };

  // Generate UPI QR code URL
  const generateUpiQrCode = (upiId: string, amount: string) => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(customerName || 'Customer')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment via RizzPay`)}&tr=RIZZPAY${Date.now()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
    return { upiUrl, qrCodeUrl };
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Handle based on payment method
    switch(paymentMethod) {
      case 'card':
      case 'neft':
        try {
          // Load Razorpay script
          const isLoaded = await loadRazorpayScript();
          
          if (!isLoaded) {
            toast.error('Failed to load payment gateway');
            return;
          }
          
          // Create order
          const orderResult = await createRazorpayOrder(
            amountValue,
            'INR',
            paymentMethod,
            customerName,
            customerEmail,
            `Payment via ${paymentMethod === 'card' ? 'Card' : 'NEFT'}`
          );
          
          if (!orderResult) {
            toast.error('Failed to create payment order');
            return;
          }
          
          // Configure Razorpay options
          const options = {
            key: "rzp_test_JXIkZl2p0iUbRw",
            amount: amountValue * 100, // Convert to paise
            currency: 'INR',
            name: "RizzPay",
            description: paymentMethod === 'card' ? "Card Payment" : "NEFT Payment",
            order_id: orderResult.orderId,
            prefill: {
              name: customerName,
              email: customerEmail,
            },
            theme: {
              color: "#0052FF",
            },
            handler: function(response: any) {
              console.log('Payment successful:', response);
              toast.success('Payment successful!', {
                description: `Payment ID: ${response.razorpay_payment_id}`
              });
              
              // Clear form
              setCustomerName('');
              setCustomerEmail('');
              setAmount('');
            }
          };
          
          // Open Razorpay payment form
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          console.error('Error processing payment:', error);
          toast.error('Payment processing failed');
        }
        break;
      
      case 'upi':
        if (customerUpiId && validateUpiId(customerUpiId)) {
          // Generate UPI QR code for custom UPI ID
          const { upiUrl, qrCodeUrl } = generateUpiQrCode(customerUpiId, amount);
          setGeneratedUpiUrl(qrCodeUrl);
          setShowUpiQr(true);
          
          toast.success('UPI QR code generated', {
            description: 'Customer can scan the QR code to make payment'
          });
        } else if (upiProvider) {
          // Open UPI QR popup for merchant UPI
          setIsUpiPopupOpen(true);
        } else {
          toast.error('Please enter a valid UPI ID or select a provider');
        }
        break;
      
      default:
        toast.error('Please select a valid payment method');
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardHeader 
          merchantName={merchantName}
          userRole={userRole || (currentMerchant?.role === 'admin' ? 'admin' : 'merchant')}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="my-8">
          <DashboardStatCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Payment Card - Redesigned with modern UI */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <Send className="h-5 w-5" />
                Quick Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-3 mb-4 bg-muted/50">
                  <TabsTrigger value="card" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="neft" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <IndianRupee className="mr-2 h-4 w-4" />
                    NEFT
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <QrCode className="mr-2 h-4 w-4" />
                    UPI
                  </TabsTrigger>
                </TabsList>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Customer Name*</Label>
                    <Input
                      type="text"
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address*</Label>
                    <Input
                      type="email"
                      id="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Required for payment receipt</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium">Amount (₹)*</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-8 w-full"
                      />
                    </div>
                  </div>
                  
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="upiId" className="text-sm font-medium">Customer UPI ID</Label>
                        <Input
                          type="text"
                          id="upiId"
                          value={customerUpiId}
                          onChange={(e) => setCustomerUpiId(e.target.value)}
                          placeholder="customer@upi (e.g. john@paytm)"
                          className="w-full"
                        />
                        {customerUpiId && !validateUpiId(customerUpiId) && (
                          <p className="text-xs text-destructive flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Please enter a valid UPI ID (e.g. name@bank)
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter customer's UPI ID to generate QR code for them, or select provider below for merchant QR
                        </p>
                      </div>
                      
                      {!customerUpiId && (
                        <div className="space-y-2 p-4 bg-muted/20 rounded-md">
                          <Label className="text-sm font-medium">Or use Merchant UPI Provider</Label>
                          <RadioGroup value={upiProvider} onValueChange={setUpiProvider} className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/20">
                              <RadioGroupItem value="gpay" id="gpay" />
                              <Label htmlFor="gpay" className="cursor-pointer">Google Pay</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/20">
                              <RadioGroupItem value="phonepe" id="phonepe" />
                              <Label htmlFor="phonepe" className="cursor-pointer">PhonePe</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/20">
                              <RadioGroupItem value="paytm" id="paytm" />
                              <Label htmlFor="paytm" className="cursor-pointer">Paytm</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/20">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="cursor-pointer">Other UPI</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {/* Display generated QR code */}
                      {showUpiQr && generatedUpiUrl && (
                        <div className="border rounded-md p-4 bg-white">
                          <div className="text-center">
                            <h4 className="text-sm font-medium mb-2">UPI QR Code for {customerUpiId}</h4>
                            <img 
                              src={generatedUpiUrl} 
                              alt="UPI QR Code" 
                              className="mx-auto border rounded"
                              width="200" 
                              height="200"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Customer can scan this QR code to pay ₹{amount}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setShowUpiQr(false)}
                            >
                              Close QR Code
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {paymentMethod === 'neft' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Saved Bank Accounts</Label>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Plus className="h-3 w-3 mr-1" /> Add New
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {bankAccounts.map((account) => (
                            <div 
                              key={account.id} 
                              className="flex items-center justify-between border rounded-md p-2 hover:bg-muted/20"
                            >
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`p-0 h-6 w-6 ${account.isFavorite ? 'text-amber-500' : 'text-muted-foreground'}`}
                                  onClick={() => toggleFavorite(account.id)}
                                >
                                  <Star className="h-4 w-4 fill-current" />
                                </Button>
                                <div>
                                  <p className="text-sm font-medium">{account.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {account.accountNumber} • {account.ifscCode}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    {paymentMethod === 'card' && <CreditCard className="mr-2 h-4 w-4" />}
                    {paymentMethod === 'neft' && <IndianRupee className="mr-2 h-4 w-4" />}
                    {paymentMethod === 'upi' && <QrCode className="mr-2 h-4 w-4" />}
                    {paymentMethod === 'upi' && customerUpiId ? 'Generate QR Code' : `Generate ${paymentMethod.toUpperCase()} Payment`}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Account Overview Card */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary">
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Available Balance</h4>
                  <p className="text-3xl font-bold">₹24,500.00</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Today's Transactions</h4>
                    <p className="text-xl font-semibold mt-1">12</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Pending Approvals</h4>
                    <p className="text-xl font-semibold mt-1">3</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center" 
                    onClick={() => navigate('/transfers')}
                  >
                    Manage Transfers & Withdrawals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* UPI QR Payment Popup */}
      <UpiQrPopup 
        isOpen={isUpiPopupOpen}
        setIsOpen={setIsUpiPopupOpen}
        amount={parseFloat(amount) || 0}
        merchantName={merchantName}
        onSuccess={(transactionId) => {
          setCustomerName('');
          setCustomerEmail('');
          setAmount('');
          setCustomerUpiId('');
        }}
      />
    </Layout>
  );
};

export default Dashboard;
