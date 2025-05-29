
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  IndianRupee, 
  ArrowUpRight, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

const PayoutPage = () => {
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for wallet balance and payout history
  const [walletBalance] = useState(125000); // ₹1,25,000
  const [payoutHistory] = useState([
    { id: 'PO001', amount: 25000, method: 'Bank Transfer', status: 'completed', date: '2024-01-15', reference: 'TXN123456789' },
    { id: 'PO002', amount: 15000, method: 'UPI', status: 'pending', date: '2024-01-14', reference: 'TXN123456790' },
    { id: 'PO003', amount: 35000, method: 'Bank Transfer', status: 'failed', date: '2024-01-13', reference: 'TXN123456791' },
    { id: 'PO004', amount: 50000, method: 'Bank Transfer', status: 'completed', date: '2024-01-12', reference: 'TXN123456792' }
  ]);

  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    branch: ''
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
    upiName: ''
  });

  const handlePayout = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > walletBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsLoading(true);
    
    // Simulate payout processing
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Payout request submitted successfully');
      setAmount('');
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
      pending: <Clock className="h-3 w-3 mr-1" />,
      failed: <AlertTriangle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge className={`flex items-center ${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout</h1>
          <p className="text-muted-foreground">Withdraw funds from your wallet</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(walletBalance)}</p>
        </div>
      </div>

      {/* Payout Information Card */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Payout Information</h3>
              <p className="text-sm text-blue-600 mt-1">
                • Processing time: 1-3 business days for bank transfers, instant for UPI
              </p>
              <p className="text-sm text-blue-600">
                • Minimum payout amount: ₹100 | Maximum: ₹1,00,000 per day
              </p>
              <p className="text-sm text-blue-600">
                • Service charges: Bank Transfer (₹5 + GST), UPI (Free)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Request Payout</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Request</CardTitle>
                <CardDescription>Enter the amount and select payout method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    max={walletBalance}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum: ₹100 | Available: {formatCurrency(walletBalance)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                          <Bank className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          UPI
                        </div>
                      </SelectItem>
                      <SelectItem value="wallet">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Wallet Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {payoutMethod === 'bank' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Bank Details</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
                        <Input
                          id="confirmAccountNumber"
                          placeholder="Re-enter account number"
                          value={bankDetails.confirmAccountNumber}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, confirmAccountNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="Enter IFSC code"
                          value={bankDetails.ifscCode}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          placeholder="Enter account holder name"
                          value={bankDetails.accountHolderName}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {payoutMethod === 'upi' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">UPI Details</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="username@paytm"
                          value={upiDetails.upiId}
                          onChange={(e) => setUpiDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="upiName">UPI Name</Label>
                        <Input
                          id="upiName"
                          placeholder="Name as per UPI"
                          value={upiDetails.upiName}
                          onChange={(e) => setUpiDetails(prev => ({ ...prev, upiName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handlePayout} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Request Payout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Payout Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Summary</CardTitle>
                <CardDescription>Review your payout details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Payout Amount</span>
                      <span className="font-medium">{amount ? formatCurrency(parseFloat(amount)) : '₹0'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Service Charges</span>
                      <span className="font-medium">
                        {payoutMethod === 'upi' ? 'Free' : '₹5 + GST'}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Net Amount</span>
                        <span className="font-bold text-lg">
                          {amount ? formatCurrency(parseFloat(amount) - (payoutMethod === 'upi' ? 0 : 6)) : '₹0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-medium capitalize">{payoutMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="font-medium">
                        {payoutMethod === 'upi' ? 'Instant' : '1-3 business days'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available Balance:</span>
                      <span className="font-medium text-green-600">{formatCurrency(walletBalance)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Track your recent payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutHistory.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{formatCurrency(payout.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {payout.method} • {payout.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ref: {payout.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(payout.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {payout.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayoutPage;
