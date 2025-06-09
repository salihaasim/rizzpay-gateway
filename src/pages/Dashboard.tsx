
import React, { useState } from 'react';
import { useTransactionStore } from '@/stores/transactions';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Users, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Eye,
  Plus,
  QrCode,
  Copy
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart } from 'recharts';
import { toast } from 'sonner';

const Dashboard = () => {
  const { transactions } = useTransactionStore();
  const { currentMerchant } = useMerchantAuth();
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayDescription, setQuickPayDescription] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  
  // Sample chart data
  const chartData = [
    { name: 'Jan', transactions: 65, revenue: 85000 },
    { name: 'Feb', transactions: 89, revenue: 125000 },
    { name: 'Mar', transactions: 112, revenue: 165000 },
    { name: 'Apr', transactions: 134, revenue: 195000 },
    { name: 'May', transactions: 178, revenue: 245000 },
    { name: 'Jun', transactions: 156, revenue: 215000 },
  ];

  const recentTransactions = transactions.slice(0, 5);
  
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(t => t.status === 'successful').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;
  
  const totalRevenue = transactions
    .filter(t => t.status === 'successful')
    .reduce((sum, t) => sum + (parseFloat(t.amount.replace(/[₹,]/g, '')) || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateQuickPayQR = () => {
    if (!quickPayAmount || parseFloat(quickPayAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Generate UPI payment URL
    const merchantName = currentMerchant?.fullName || 'RizzPay Merchant';
    const description = quickPayDescription || 'Quick Payment';
    const amount = parseFloat(quickPayAmount);
    
    const upiUrl = `upi://pay?pa=rizzpay@ybl&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(description)}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    
    setGeneratedQR(qrCodeUrl);
    toast.success('QR Code generated successfully');
  };

  const copyUpiLink = () => {
    if (!quickPayAmount) return;
    
    const merchantName = currentMerchant?.fullName || 'RizzPay Merchant';
    const description = quickPayDescription || 'Quick Payment';
    const amount = parseFloat(quickPayAmount);
    
    const upiUrl = `upi://pay?pa=rizzpay@ybl&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(description)}&cu=INR`;
    navigator.clipboard.writeText(upiUrl);
    toast.success('UPI link copied to clipboard');
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {currentMerchant?.fullName || 'Merchant'}!</h1>
          <p className="text-muted-foreground mt-2">Here's an overview of your RizzPay account performance</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +8.2%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +2.1%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(15247)}</div>
              <p className="text-xs text-muted-foreground">
                Ready for withdrawal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Payment Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#0052FF]" />
                Quick Payment QR Generator
              </CardTitle>
              <CardDescription>Generate UPI QR code for instant payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={quickPayAmount}
                  onChange={(e) => setQuickPayAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Payment description"
                  value={quickPayDescription}
                  onChange={(e) => setQuickPayDescription(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={generateQuickPayQR} className="flex-1 bg-[#0052FF]">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
                <Button variant="outline" onClick={copyUpiLink} disabled={!quickPayAmount}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle>Generated QR Code</CardTitle>
              <CardDescription>Show this QR code to customers for payment</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {generatedQR ? (
                <div className="text-center">
                  <img src={generatedQR} alt="UPI QR Code" className="mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Amount: ₹{quickPayAmount}
                  </p>
                  {quickPayDescription && (
                    <p className="text-sm text-muted-foreground">
                      {quickPayDescription}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter amount and generate QR code</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0052FF" 
                    strokeWidth={2}
                    dot={{ fill: '#0052FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Monthly transaction count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="transactions" fill="#0052FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Overview & Recent Transactions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Transaction Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Overview</CardTitle>
              <CardDescription>Current transaction status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{successfulTransactions}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{pendingTransactions}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {totalTransactions > 0 ? ((pendingTransactions / totalTransactions) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{failedTransactions}</span>
                  <Badge className="bg-red-100 text-red-800">
                    {totalTransactions > 0 ? ((failedTransactions / totalTransactions) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.status === 'successful' ? 'bg-green-100' : 
                          transaction.status === 'failed' ? 'bg-red-100' : 
                          'bg-yellow-100'
                        }`}>
                          <CreditCard className={`h-4 w-4 ${
                            transaction.status === 'successful' ? 'text-green-600' : 
                            transaction.status === 'failed' ? 'text-red-600' : 
                            'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.description || `Payment ${transaction.id.substring(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{transaction.amount}</p>
                        <Badge className={`text-xs ${getTransactionStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No transactions yet</p>
                    <Button className="mt-2" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Transaction
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button className="h-auto flex-col gap-2 p-4">
                <Plus className="h-6 w-6" />
                <span>Create Payment Link</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Wallet className="h-6 w-6" />
                <span>Withdraw Funds</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Users className="h-6 w-6" />
                <span>Manage API</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
