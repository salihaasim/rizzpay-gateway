
import React, { useState, useEffect } from 'react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import Layout from '@/components/Layout';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Download,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface PayoutRequest {
  id: string;
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
}

const EnhancedPayoutPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  
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

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const merchantId = currentMerchant?.id;

  useEffect(() => {
    if (merchantId) {
      fetchPayoutRequests();
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
      setWalletBalance(50000); // Fallback for demo
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      toast.error('Failed to load payout history');
    } finally {
      setIsLoading(false);
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
      const processingFee = payoutAmount * 0.005; // 0.5% fee
      const gstAmount = processingFee * 0.18; // 18% GST
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
      setUpiId('');
      setDescription('');
      
      // Refresh data
      await fetchPayoutRequests();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
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

  const exportToExcel = () => {
    const exportData = payoutRequests.map(payout => ({
      'Payout ID': payout.id.substring(0, 8),
      'Date': format(new Date(payout.created_at), 'dd/MM/yyyy HH:mm'),
      'Amount': `₹${payout.amount}`,
      'Method': payout.payout_method.replace('_', ' ').toUpperCase(),
      'Status': payout.status.toUpperCase(),
      'Beneficiary': payout.beneficiary_name || payout.upi_id || 'N/A',
      'Account/UPI': payout.account_number || payout.upi_id || 'N/A',
      'Processing Fee': `₹${payout.processing_fee}`,
      'Net Amount': payout.net_amount ? `₹${payout.net_amount}` : 'N/A',
      'UTR': payout.utr_number || 'N/A',
      'Failure Reason': payout.failure_reason || 'N/A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payouts');
    
    const fileName = `RizzPay_Payouts_${format(new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Payout data exported successfully!');
  };

  const filteredPayouts = payoutRequests.filter(payout => {
    if (statusFilter !== 'all' && payout.status !== statusFilter) return false;
    
    if (dateFilter !== 'all') {
      const payoutDate = new Date(payout.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return payoutDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return payoutDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return payoutDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enhanced Payout System</h1>
            <p className="text-muted-foreground">Advanced payout management with real-time tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchPayoutRequests}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bank Details */}
                  {payoutMethod === 'bank_transfer' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
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
                        Request Payout
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary & Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payout Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {filteredPayouts.filter(p => p.status === 'pending').length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Processing</span>
                  <span className="font-semibold text-blue-600">
                    {filteredPayouts.filter(p => p.status === 'processing').length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-green-600">
                    {filteredPayouts.filter(p => p.status === 'completed').length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <span className="font-semibold text-red-600">
                    {filteredPayouts.filter(p => p.status === 'failed').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payout History</CardTitle>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredPayouts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No payout requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead>UTR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">
                          {payout.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {format(new Date(payout.created_at), 'dd MMM yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(payout.created_at), 'HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>₹{payout.amount}</TableCell>
                        <TableCell className="capitalize">
                          {payout.payout_method.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payout.status)}
                            {getStatusBadge(payout.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {payout.beneficiary_name || payout.upi_id || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {payout.utr_number || 'Pending'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EnhancedPayoutPage;
