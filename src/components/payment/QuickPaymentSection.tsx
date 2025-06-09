
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, QrCode, Smartphone, Trash2, Star, Plus } from 'lucide-react';
import { toast } from 'sonner';

const QuickPaymentSection = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('NEFT');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [savedAccounts] = useState([
    {
      id: 1,
      name: 'HDFC Primary',
      number: 'XXXX1234',
      ifsc: 'HDFC0001234',
      isPrimary: true
    },
    {
      id: 2,
      name: 'ICICI Business',
      number: 'XXXX5678',
      ifsc: 'ICIC0005678',
      isPrimary: false
    }
  ]);

  const handleGeneratePayment = () => {
    if (!customerName || !email || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success(`${selectedPaymentType} payment link generated successfully`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-[#0052FF]" />
          Quick Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Type Tabs */}
        <Tabs value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Card" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Card
            </TabsTrigger>
            <TabsTrigger value="NEFT" className="flex items-center gap-1 bg-[#0052FF] text-white" data-state={selectedPaymentType === 'NEFT' ? 'active' : ''}>
              ₹ NEFT
            </TabsTrigger>
            <TabsTrigger value="UPI" className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              UPI
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Customer Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name*</Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address*</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Required for payment receipt</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)*</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Saved Bank Accounts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Saved Bank Accounts</Label>
            <Button variant="ghost" size="sm" className="text-[#0052FF]">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>
          
          <div className="space-y-2">
            {savedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {account.isPrimary && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.number} • {account.ifsc}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Payment Button */}
        <Button 
          onClick={handleGeneratePayment}
          className="w-full bg-[#0052FF] hover:bg-[#0041CC] text-white"
        >
          <span className="mr-2">₹</span>
          Generate {selectedPaymentType} Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickPaymentSection;
