
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CreditCard, IndianRupee, QrCode, Send } from 'lucide-react';
import { toast } from 'sonner';

const MerchantDashboardNew = () => {
  const [activePaymentMethod, setActivePaymentMethod] = useState('card');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Payment generated successfully!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, MERCHANT</h1>
            <p className="text-gray-600">Your merchant dashboard and overview.</p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Current Balance */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ ₹0</div>
              </CardContent>
            </Card>

            {/* Total Pay-Ins */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pay - Ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <span>₹0</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Success</span>
                      <Progress value={75} className="w-16 h-2" />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Pending</span>
                      <Progress value={25} className="w-16 h-2 [&>div]:bg-yellow-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Payouts */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Payouts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 text-xs">Actions</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <span>₹0</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Success</span>
                      <Progress value={80} className="w-16 h-2" />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Fault</span>
                      <Progress value={20} className="w-16 h-2 [&>div]:bg-red-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Overview */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-16">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <div className="text-xs text-gray-500">Chart</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Payment Card */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Quick Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Payment Method Tabs */}
                <div className="flex gap-2 mb-6">
                  <Button
                    variant={activePaymentMethod === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePaymentMethod('card')}
                    className={activePaymentMethod === 'card' ? 'bg-blue-600 text-white' : ''}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card
                  </Button>
                  <Button
                    variant={activePaymentMethod === 'neft' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePaymentMethod('neft')}
                    className={activePaymentMethod === 'neft' ? 'bg-blue-600 text-white' : ''}
                  >
                    <IndianRupee className="h-4 w-4 mr-2" />
                    NEFT
                  </Button>
                  <Button
                    variant={activePaymentMethod === 'upi' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePaymentMethod('upi')}
                    className={activePaymentMethod === 'upi' ? 'bg-blue-600 text-white' : ''}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    UPI
                  </Button>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                      Customer Name*
                    </Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700">
                      Email Address*
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required for payment receipt</p>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                      Amount (₹)*
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Generate CARD Payment
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Overview Card */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-600">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-900">₹24,500.00</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Today's Transactions</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">12</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">3</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  Manage Transfers & Withdrawals
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MerchantDashboardNew;
