
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
import { CreditCard, IndianRupee, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { userRole, userEmail } = useTransactionStore();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'admin' : 'merchant');
  
  // Simplified merchant name - just use the email without GROUP suffix
  const merchantName = useMemo(() => {
    if (!userEmail) return "MERCHANT";
    return userEmail.split('@')[0].toUpperCase();
  }, [userEmail]);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');

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
          {/* Quick Payment Card - Enhanced with payment options */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary">
                Quick Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="neft">NEFT</TabsTrigger>
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Customer Name</Label>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter customer name"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="customer@email.com"
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Required for payment receipt</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium">Amount (₹)</Label>
                      <Input
                        type="number"
                        id="amount"
                        placeholder="0.00"
                        className="w-full"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Generate Card Payment Link
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="neft">
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="neft-name" className="text-sm font-medium">Customer Name</Label>
                      <Input
                        type="text"
                        id="neft-name"
                        placeholder="Enter customer name"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="neft-email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        type="email"
                        id="neft-email"
                        placeholder="customer@email.com"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="neft-amount" className="text-sm font-medium">Amount (₹)</Label>
                      <Input
                        type="number"
                        id="neft-amount"
                        placeholder="0.00"
                        className="w-full"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                      <IndianRupee className="mr-2 h-4 w-4" />
                      Generate NEFT Details
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="upi">
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="upi-name" className="text-sm font-medium">Customer Name</Label>
                      <Input
                        type="text"
                        id="upi-name"
                        placeholder="Enter customer name"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="upi-email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        type="email"
                        id="upi-email"
                        placeholder="customer@email.com"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="upi-amount" className="text-sm font-medium">Amount (₹)</Label>
                      <Input
                        type="number"
                        id="upi-amount"
                        placeholder="0.00"
                        className="w-full"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                      Generate UPI QR Code
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Additional card for dashboard balance */}
          <Card className="shadow-md">
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
                  <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => window.location.href = '/transfers'}>
                    View Transaction History
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
