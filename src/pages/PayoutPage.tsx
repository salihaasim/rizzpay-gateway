
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Banknote, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const PayoutPage = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data
  const accountBalance = 25000;
  const minimumPayout = 100;
  const processingFee = 1; // 1%
  
  const recentPayouts = [
    {
      id: 'PO001',
      amount: 5000,
      fee: 50,
      netAmount: 4950,
      status: 'completed',
      requestedAt: '2025-01-15T10:30:00',
      processedAt: '2025-01-15T11:45:00',
      bankAccount: '****1234'
    },
    {
      id: 'PO002', 
      amount: 10000,
      fee: 100,
      netAmount: 9900,
      status: 'processing',
      requestedAt: '2025-01-14T14:20:00',
      processedAt: null,
      bankAccount: '****1234'
    },
    {
      id: 'PO003',
      amount: 3000,
      fee: 30,
      netAmount: 2970,
      status: 'failed',
      requestedAt: '2025-01-13T09:15:00',
      processedAt: null,
      bankAccount: '****1234'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateFee = (amount: number) => {
    return Math.round(amount * (processingFee / 100));
  };

  const calculateNetAmount = (amount: number) => {
    return amount - calculateFee(amount);
  };

  const handlePayoutRequest = async () => {
    const amount = parseFloat(payoutAmount);
    
    if (!amount || amount < minimumPayout) {
      toast.error(`Minimum payout amount is ${formatCurrency(minimumPayout)}`);
      return;
    }
    
    if (amount > accountBalance) {
      toast.error('Insufficient balance for this payout');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payout request submitted successfully');
      setPayoutAmount('');
      setActiveTab('history');
    } catch (error) {
      toast.error('Failed to submit payout request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Payout Management | RizzPay</title>
        <meta name="description" content="Request and manage your merchant payouts" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payout Management</h1>
            <p className="text-gray-600 mt-2">Request withdrawals and track your payout history</p>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(accountBalance)}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Minimum Payout</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(minimumPayout)}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Processing Fee</p>
                  <h3 className="text-2xl font-bold">{processingFee}%</h3>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Request Payout</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request New Payout</CardTitle>
                <CardDescription>
                  Withdraw funds from your merchant account to your registered bank account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Payout Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      min={minimumPayout}
                      max={accountBalance}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {formatCurrency(accountBalance)} | Minimum: {formatCurrency(minimumPayout)}
                    </p>
                  </div>

                  {payoutAmount && parseFloat(payoutAmount) >= minimumPayout && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Payout Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Requested Amount:</span>
                            <span>{formatCurrency(parseFloat(payoutAmount))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processing Fee ({processingFee}%):</span>
                            <span>-{formatCurrency(calculateFee(parseFloat(payoutAmount)))}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Net Amount:</span>
                            <span>{formatCurrency(calculateNetAmount(parseFloat(payoutAmount)))}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Bank Account Details</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          Payouts will be processed to your registered bank account ending in ****1234
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          Processing time: 2-3 business days
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePayoutRequest}
                    disabled={!payoutAmount || parseFloat(payoutAmount) < minimumPayout || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Banknote className="h-4 w-4 mr-2" />
                        Request Payout
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>
                  Track the status of all your payout requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayouts.map((payout) => (
                    <div key={payout.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{payout.id}</div>
                          {getStatusBadge(payout.status)}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(payout.netAmount)}</div>
                          <div className="text-sm text-gray-500">
                            Fee: {formatCurrency(payout.fee)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Requested:</span>
                          <div>{formatDateTime(payout.requestedAt)}</div>
                        </div>
                        {payout.processedAt && (
                          <div>
                            <span className="text-gray-500">Processed:</span>
                            <div>{formatDateTime(payout.processedAt)}</div>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Bank Account:</span>
                          <div>{payout.bankAccount}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {payout.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PayoutPage;
