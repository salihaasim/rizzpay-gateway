
import React, { useState, useMemo } from 'react';
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
import { CreditCard, IndianRupee, ArrowRight, Send, QrCode } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const { userRole, userEmail } = useTransactionStore();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'admin' : 'merchant');
  const navigate = useNavigate();
  
  // Simplified merchant name - just use the email without GROUP suffix
  const merchantName = useMemo(() => {
    if (!userEmail) return "MERCHANT";
    return userEmail.split('@')[0].toUpperCase();
  }, [userEmail]);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');
  
  // UPI states
  const [upiProvider, setUpiProvider] = useState('gpay');
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Display success message
    toast.success('Payment link generated!', {
      description: `A ${paymentMethod.toUpperCase()} payment link for ₹${amount} has been sent to ${customerEmail}`
    });
    
    // Clear form
    setCustomerName('');
    setCustomerEmail('');
    setAmount('');
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardHeader 
          merchantName={merchantName}
          userRole={userRole}
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
                    <div className="space-y-2 p-4 bg-muted/20 rounded-md">
                      <Label className="text-sm font-medium">UPI Provider</Label>
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
                  
                  {paymentMethod === 'neft' && (
                    <div className="space-y-2 p-4 bg-muted/20 rounded-md">
                      <p className="text-sm">
                        NEFT transfer will generate payment details that can be shared with the customer.
                      </p>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    {paymentMethod === 'card' && <CreditCard className="mr-2 h-4 w-4" />}
                    {paymentMethod === 'neft' && <IndianRupee className="mr-2 h-4 w-4" />}
                    {paymentMethod === 'upi' && <QrCode className="mr-2 h-4 w-4" />}
                    Generate {paymentMethod.toUpperCase()} Payment Link
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
    </Layout>
  );
};

export default Dashboard;
