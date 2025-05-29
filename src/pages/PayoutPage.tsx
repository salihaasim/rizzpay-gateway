
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTransactionStore } from '@/stores/transactions';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import Layout from '@/components/Layout';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  CreditCard,
  Building2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const PayoutPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const { getWalletBalance } = useTransactionStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
    bankName: ''
  });
  const [description, setDescription] = useState('');

  // Mock payout history
  const [payoutHistory] = useState([
    {
      id: 'PO001',
      amount: '₹25,000',
      method: 'Bank Transfer',
      status: 'completed',
      date: '2025-01-29',
      accountNumber: '****1234'
    },
    {
      id: 'PO002',
      amount: '₹15,000',
      method: 'UPI',
      status: 'pending',
      date: '2025-01-28',
      accountNumber: 'merchant@upi'
    },
    {
      id: 'PO003',
      amount: '₹8,500',
      method: 'Bank Transfer',
      status: 'failed',
      date: '2025-01-27',
      accountNumber: '****5678'
    }
  ]);

  const userEmail = currentMerchant?.email || '';
  const availableBalance = getWalletBalance(userEmail);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payoutAmount = parseFloat(amount);
    if (isNaN(payoutAmount) || payoutAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (payoutAmount > availableBalance) {
      toast.error('Insufficient balance for this payout');
      return;
    }
    
    if (!payoutMethod) {
      toast.error('Please select a payout method');
      return;
    }
    
    if (payoutMethod === 'bank' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.beneficiaryName)) {
      toast.error('Please fill all bank details');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payout processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payout request submitted successfully', {
        description: `₹${payoutAmount.toFixed(2)} payout request has been submitted for processing.`
      });
      
      // Reset form
      setAmount('');
      setPayoutMethod('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        beneficiaryName: '',
        bankName: ''
      });
      setDescription('');
      
    } catch (error) {
      toast.error('Payout request failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payout</h1>
            <p className="text-muted-foreground">Request payouts from your wallet balance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Request Payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayout} className="space-y-6">
                  {/* Available Balance */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Available Balance</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-900">₹{availableBalance.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payout Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input 
                        id="amount"
                        type="number" 
                        min="1"
                        max={availableBalance}
                        step="0.01"
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                        disabled={isProcessing}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum payout: ₹{availableBalance.toFixed(2)}
                    </p>
                  </div>

                  {/* Payout Method */}
                  <div className="space-y-2">
                    <Label htmlFor="payoutMethod">Payout Method</Label>
                    <Select value={payoutMethod} onValueChange={setPayoutMethod} disabled={isProcessing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer (NEFT/RTGS)</SelectItem>
                        <SelectItem value="upi">UPI Transfer</SelectItem>
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bank Details */}
                  {payoutMethod === 'bank' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Building2 className="h-4 w-4" />
                        Bank Account Details
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                          <Input 
                            id="beneficiaryName"
                            value={bankDetails.beneficiaryName} 
                            onChange={(e) => setBankDetails(prev => ({ ...prev, beneficiaryName: e.target.value }))}
                            placeholder="Account holder name"
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input 
                            id="bankName"
                            value={bankDetails.bankName} 
                            onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                            placeholder="Bank name"
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input 
                            id="accountNumber"
                            value={bankDetails.accountNumber} 
                            onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                            placeholder="Bank account number"
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input 
                            id="ifscCode"
                            value={bankDetails.ifscCode} 
                            onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                            placeholder="IFSC code"
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {payoutMethod === 'upi' && (
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input 
                        id="upiId"
                        placeholder="yourname@paytm"
                        disabled={isProcessing}
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description"
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a note for this payout"
                      className="resize-none" 
                      rows={3}
                      disabled={isProcessing}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isProcessing || !amount || !payoutMethod || parseFloat(amount) <= 0}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payout...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Request Payout
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payout History & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payout Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">₹48,500</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Payouts</span>
                  <span className="font-semibold">₹2,45,000</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold text-yellow-600">₹15,000</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutHistory.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(payout.status)}
                        <div>
                          <p className="font-medium text-sm">{payout.amount}</p>
                          <p className="text-xs text-muted-foreground">{payout.accountNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        <p className="text-xs text-muted-foreground mt-1">{payout.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payout Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payout Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-medium">Processing Time</p>
                    <p className="text-muted-foreground">Bank transfers: 1-2 business days</p>
                    <p className="text-muted-foreground">UPI: Instant to 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">Minimum Payout</p>
                    <p className="text-muted-foreground">₹100 for all methods</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-orange-500" />
                  <div>
                    <p className="font-medium">Cut-off Time</p>
                    <p className="text-muted-foreground">6:00 PM for same-day processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PayoutPage;
