import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import Layout from '@/components/Layout';
import PayoutStatusTracker from '@/components/payout/PayoutStatusTracker';
import PayoutBankSelector from '@/components/payout/PayoutBankSelector';
import { BankIntegrationService } from '@/services/BankIntegrationService';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  CreditCard,
  Building2,
  Loader2,
  RotateCcw,
  Download,
  Filter,
  Search,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface PayoutRequest {
  id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  payout_method: string;
  status: string;
  beneficiary_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  description?: string;
  created_at: string;
  processing_fee: number;
  net_amount?: number;
  utr_number?: string;
  failure_reason?: string;
  retry_count: number;
  max_retries: number;
  priority: number;
  internal_notes?: string;
}

// Utility functions for status display
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'processing':
      return <Play className="h-4 w-4 text-blue-500" />;
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
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const EnhancedPayoutPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedBank, setSelectedBank] = useState('hdfc');
  
  // Form state
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
    bankName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [description, setDescription] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const merchantId = currentMerchant?.id;

  useEffect(() => {
    if (merchantId) {
      fetchPayoutHistory();
      fetchWalletBalance();
    }
  }, [merchantId]);

  const fetchWalletBalance = async () => {
    try {
      const { data, error } = await supabase.rpc('get_merchant_wallet_balance', {
        merchant_uuid: merchantId
      });
      
      if (error) throw error;
      setWalletBalance(data || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Fallback to mock data for demo
      setWalletBalance(50000);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayoutHistory(data || []);
    } catch (error) {
      console.error('Error fetching payout history:', error);
      // Fallback to mock data for demo
      setPayoutHistory([
        {
          id: 'PO001',
          merchant_id: 'M001',
          amount: 25000,
          currency: 'INR',
          payout_method: 'bank_transfer',
          status: 'completed',
          created_at: '2025-01-29T10:30:00Z',
          account_number: '****1234',
          processing_fee: 125,
          net_amount: 24875,
          utr_number: 'UTR123456789',
          retry_count: 0,
          max_retries: 3,
          priority: 3
        },
        {
          id: 'PO002',
          merchant_id: 'M001',
          amount: 15000,
          currency: 'INR',
          payout_method: 'upi',
          status: 'pending',
          created_at: '2025-01-28T14:20:00Z',
          upi_id: 'merchant@upi',
          processing_fee: 75,
          net_amount: 14925,
          retry_count: 0,
          max_retries: 3,
          priority: 3
        }
      ] as PayoutRequest[]);
    }
  };

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payoutAmount = parseFloat(amount);
    if (isNaN(payoutAmount) || payoutAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (payoutAmount > walletBalance) {
      toast.error('Insufficient balance for this payout');
      return;
    }
    
    if (!payoutMethod) {
      toast.error('Please select a payout method');
      return;
    }
    
    if (payoutMethod === 'bank_transfer' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.beneficiaryName)) {
      toast.error('Please fill all bank details');
      return;
    }

    if (payoutMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const processingFee = BankIntegrationService.calculateProcessingFee(payoutAmount, payoutMethod, selectedBank);
      const gstAmount = processingFee * 0.18;
      const netAmount = payoutAmount - processingFee - gstAmount;

      const payoutData = {
        merchant_id: merchantId,
        amount: payoutAmount,
        currency: 'INR',
        payout_method: payoutMethod,
        status: 'pending',
        processing_fee: processingFee,
        gst_amount: gstAmount,
        net_amount: netAmount,
        description: description || null,
        priority: 1,
        ...(payoutMethod === 'bank_transfer' && {
          beneficiary_name: bankDetails.beneficiaryName,
          account_number: bankDetails.accountNumber,
          ifsc_code: bankDetails.ifscCode,
          bank_name: bankDetails.bankName
        }),
        ...(payoutMethod === 'upi' && {
          upi_id: upiId
        })
      };

      const { data, error } = await supabase
        .from('payout_requests')
        .insert([payoutData])
        .select()
        .single();

      if (error) throw error;

      // Initiate payout through bank integration
      const bankResponse = await BankIntegrationService.initiatePayout({
        id: data.id,
        amount: payoutAmount,
        currency: 'INR',
        beneficiary_name: bankDetails.beneficiaryName || 'UPI User',
        account_number: bankDetails.accountNumber,
        ifsc_code: bankDetails.ifscCode,
        upi_id: upiId,
        payout_method: payoutMethod
      }, selectedBank);

      if (bankResponse.success) {
        toast.success('Payout request submitted successfully', {
          description: `₹${payoutAmount.toFixed(2)} payout initiated via ${BankIntegrationService.getBankConfig(selectedBank)?.name}`,
        });
      } else {
        toast.warning('Payout submitted but bank processing failed', {
          description: bankResponse.message
        });
      }
      
      // Reset form
      setAmount('');
      setPayoutMethod('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        beneficiaryName: '',
        bankName: ''
      });
      setUpiId('');
      setDescription('');
      
      // Refresh data
      await fetchPayoutHistory();
      await fetchWalletBalance();
      
    } catch (error) {
      console.error('Error submitting payout:', error);
      toast.error('Payout request failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityBadge = (priority: number) => {
    const variants = {
      5: 'bg-red-100 text-red-800',
      4: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      2: 'bg-blue-100 text-blue-800',
      1: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      5: 'Critical',
      4: 'High',
      3: 'Medium',
      2: 'Low',
      1: 'Normal'
    };
    
    return (
      <Badge className={variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[priority as keyof typeof labels] || 'Normal'}
      </Badge>
    );
  };

  const exportToExcel = () => {
    const exportData = filteredPayouts.map(payout => ({
      'Payout ID': payout.id,
      'Merchant ID': payout.merchant_id,
      'Date': format(new Date(payout.created_at), 'dd/MM/yyyy HH:mm'),
      'Amount': payout.amount,
      'Method': payout.payout_method,
      'Status': payout.status,
      'Priority': payout.priority,
      'Beneficiary': payout.beneficiary_name || payout.upi_id || 'N/A',
      'Account/UPI': payout.account_number || payout.upi_id || 'N/A',
      'Processing Fee': payout.processing_fee,
      'Net Amount': payout.net_amount || 'N/A',
      'UTR': payout.utr_number || 'N/A',
      'Retry Count': payout.retry_count,
      'Failure Reason': payout.failure_reason || 'N/A',
      'Internal Notes': payout.internal_notes || 'N/A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payouts');
    
    const fileName = `Payouts_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Payout data exported successfully!');
  };

  const filteredPayouts = payoutHistory.filter(payout => {
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payout.payout_method === methodFilter;
    const matchesSearch = !searchTerm || 
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.beneficiary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.upi_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const stats = {
    total: payoutHistory.length,
    pending: payoutHistory.filter(p => p.status === 'pending').length,
    processing: payoutHistory.filter(p => p.status === 'processing').length,
    completed: payoutHistory.filter(p => p.status === 'completed').length,
    failed: payoutHistory.filter(p => p.status === 'failed').length
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enhanced Payout Management</h1>
            <p className="text-muted-foreground">Advanced payout processing with real-time tracking and multiple banking partners</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Payout Form */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="submit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="submit">Submit Payout</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="submit">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5" />
                      Request Payout
                    </CardTitle>
                    <CardDescription>
                      Submit a new payout request with advanced processing options
                    </CardDescription>
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
                          <span className="text-2xl font-bold text-blue-900">₹{walletBalance.toFixed(2)}</span>
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
                            max={walletBalance}
                            step="0.01"
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            disabled={isProcessing}
                          />
                        </div>
                      </div>

                      {/* Payout Method */}
                      <div className="space-y-2">
                        <Label htmlFor="payoutMethod">Payout Method</Label>
                        <Select value={payoutMethod} onValueChange={setPayoutMethod} disabled={isProcessing}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payout method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer (NEFT/RTGS)</SelectItem>
                            <SelectItem value="upi">UPI Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bank Selection */}
                      {payoutMethod && (
                        <PayoutBankSelector
                          selectedBank={selectedBank}
                          onBankChange={setSelectedBank}
                          amount={parseFloat(amount) || 0}
                          payoutMethod={payoutMethod}
                        />
                      )}

                      {/* Bank Details */}
                      {payoutMethod === 'bank_transfer' && (
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
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
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
                            Submit Payout Request
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulk">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Payout Upload</CardTitle>
                    <CardDescription>Upload multiple payouts via CSV/Excel file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Bulk upload feature coming soon</p>
                      <p className="text-sm mt-2">Upload CSV files with multiple payout requests</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-2 space-y-6">
            {/* Real-time Status Tracker */}
            <PayoutStatusTracker />

            {/* Summary Stats */}
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
                  <span className="font-semibold text-yellow-600">
                    {payoutHistory.filter(p => p.status === 'pending').length}
                  </span>
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
                  {payoutHistory.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(payout.status)}
                        <div>
                          <p className="font-medium text-sm">₹{payout.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {payout.account_number || payout.upi_id || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(payout.created_at), 'dd MMM')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payout History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              Track and manage all payout requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search payouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payout.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(payout.created_at), 'dd MMM yyyy')}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(payout.created_at), 'HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{payout.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payout.payout_method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payout.status)}
                          {getStatusBadge(payout.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPriorityBadge(payout.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Add action buttons here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EnhancedPayoutPage;
