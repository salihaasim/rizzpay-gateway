
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Code, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import UpiPluginCode from '@/components/upi/UpiPluginCode';
import { Helmet } from 'react-helmet';

const UpiPluginPage = () => {
  const [testAmount, setTestAmount] = useState('100');

  const handleTestPayment = () => {
    const amount = parseFloat(testAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Redirect to the UPI payment link page with test parameters
    const upiPaymentUrl = `/upi-link-payment?amount=${amount}&name=Test%20Merchant&desc=Test%20Payment`;
    window.location.href = upiPaymentUrl;
  };

  return (
    <Layout>
      <Helmet>
        <title>UPI Plugin | RizzPay</title>
      </Helmet>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UPI Plugin</h1>
            <p className="text-muted-foreground mt-2">
              Integrate UPI payments directly into your website with our plugin.
            </p>
          </div>
          
          <Button onClick={handleTestPayment} className="flex items-center gap-2 bg-[#0052FF]">
            <QrCode className="h-4 w-4" />
            <span>Test QR Payment</span>
          </Button>
        </div>

        <Tabs defaultValue="integration" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integration">
            <UpiPluginCode />
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-[#0052FF]" />
                    Test UPI QR Code
                  </CardTitle>
                  <CardDescription>
                    Preview how your UPI QR code will appear to customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <div className="w-full sm:w-1/3">
                      <Label htmlFor="testAmount">Test Amount (₹)</Label>
                      <Input 
                        id="testAmount" 
                        type="number" 
                        value={testAmount}
                        onChange={(e) => setTestAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleTestPayment} className="bg-[#0052FF]">Launch Test Payment</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  UPI Plugin Settings
                </CardTitle>
                <CardDescription>
                  Configure your UPI plugin appearance and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">Your UPI ID</Label>
                    <Input 
                      id="upiId" 
                      placeholder="yourname@ybl" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the UPI ID where you want to receive payments
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="redirectUrl">Success Redirect URL (Optional)</Label>
                    <Input 
                      id="redirectUrl" 
                      placeholder="https://yoursite.com/thank-you" 
                    />
                    <p className="text-sm text-muted-foreground">
                      URL to redirect users after successful payment
                    </p>
                  </div>
                  
                  <Button className="w-full sm:w-auto bg-[#0052FF]">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UpiPluginPage;
