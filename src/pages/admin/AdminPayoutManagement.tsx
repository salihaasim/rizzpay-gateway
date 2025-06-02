
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const AdminPayoutManagement = () => {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const fetchPayoutRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      toast.error('Failed to load payout requests');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePayoutStatus = async (payoutId: string, newStatus: string, notes?: string, utrNumber?: string) => {
    try {
      setIsProcessing(true);
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.internal_notes = notes;
      }

      if (utrNumber) {
        updateData.utr_number = utrNumber;
      }

      if (newStatus === 'processing') {
        updateData.processing_started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus === 'failed') {
        updateData.failed_at = new Date().toISOString();
        updateData.failure_reason = notes || 'Manual failure by admin';
      }

      const { error } = await supabase
        .from('payout_requests')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      toast.success(`Payout status updated to ${newStatus}`);
      await fetchPayoutRequests();
      setSelectedPayout(null);
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast.error('Failed to update payout status');
    } finally {
      setIsProcessing(false);
    }
  };

  const retryPayout = async (payoutId: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status: 'pending',
          retry_count: supabase.sql`retry_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', payoutId);

      if (error) throw error;

      toast.success('Payout queued for retry');
      await fetchPayoutRequests();
    } catch (error) {
      console.error('Error retrying payout:', error);
      toast.error('Failed to retry payout');
    } finally {
      setIsProcessing(false);
    }
  };

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
    XLSX.utils.book_append_sheet(wb, ws, 'Admin_Payouts');
    
    const fileName = `Admin_Payouts_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Admin payout data exported successfully!');
  };

  const filteredPayouts = payoutRequests.filter(payout => {
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesSearch = !searchTerm || 
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.merchant_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payout.beneficiary_name && payout.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: payoutRequests.length,
    pending: payoutRequests.filter(p => p.status === 'pending').length,
    processing: payoutRequests.filter(p => p.status === 'processing').length,
    completed: payoutRequests.filter(p => p.status === 'completed').length,
    failed: payoutRequests.filter(p => p.status === 'failed').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payout Management</h1>
            <p className="text-muted-foreground">Monitor and manage all merchant payout requests</p>
          </div>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Payouts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Search</Label>
                <Input
                  placeholder="Search by ID, merchant, or beneficiary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Requests ({filteredPayouts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        {payout.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{payout.merchant_id.substring(0, 8)}...</TableCell>
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
                      <TableCell>{getPriorityBadge(payout.priority)}</TableCell>
                      <TableCell>
                        {payout.beneficiary_name || payout.upi_id || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedPayout(payout)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Payout Details</DialogTitle>
                              </DialogHeader>
                              {selectedPayout && (
                                <PayoutDetailsModal 
                                  payout={selectedPayout} 
                                  onStatusUpdate={updatePayoutStatus}
                                  isProcessing={isProcessing}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {payout.status === 'failed' && payout.retry_count < payout.max_retries && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => retryPayout(payout.id)}
                              disabled={isProcessing}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

// Payout Details Modal Component
const PayoutDetailsModal: React.FC<{
  payout: PayoutRequest;
  onStatusUpdate: (id: string, status: string, notes?: string, utr?: string) => void;
  isProcessing: boolean;
}> = ({ payout, onStatusUpdate, isProcessing }) => {
  const [newStatus, setNewStatus] = useState(payout.status);
  const [notes, setNotes] = useState(payout.internal_notes || '');
  const [utrNumber, setUtrNumber] = useState(payout.utr_number || '');

  const handleUpdate = () => {
    onStatusUpdate(payout.id, newStatus, notes, utrNumber);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payout ID</Label>
          <div className="font-mono text-sm bg-muted p-2 rounded">{payout.id}</div>
        </div>
        <div>
          <Label>Merchant ID</Label>
          <div className="font-mono text-sm bg-muted p-2 rounded">{payout.merchant_id}</div>
        </div>
        <div>
          <Label>Amount</Label>
          <div className="text-lg font-semibold">₹{payout.amount}</div>
        </div>
        <div>
          <Label>Net Amount</Label>
          <div className="text-lg">₹{payout.net_amount}</div>
        </div>
        <div>
          <Label>Method</Label>
          <div className="capitalize">{payout.payout_method.replace('_', ' ')}</div>
        </div>
        <div>
          <Label>Current Status</Label>
          <div className="flex items-center gap-2">
            {getStatusIcon(payout.status)}
            {getStatusBadge(payout.status)}
          </div>
        </div>
      </div>

      {payout.beneficiary_name && (
        <div>
          <Label>Bank Details</Label>
          <div className="bg-muted p-3 rounded space-y-1">
            <div><strong>Name:</strong> {payout.beneficiary_name}</div>
            <div><strong>Account:</strong> {payout.account_number}</div>
            <div><strong>IFSC:</strong> {payout.ifsc_code}</div>
            <div><strong>Bank:</strong> {payout.bank_name}</div>
          </div>
        </div>
      )}

      {payout.upi_id && (
        <div>
          <Label>UPI ID</Label>
          <div className="bg-muted p-2 rounded">{payout.upi_id}</div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label>Update Status</Label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(newStatus === 'completed' || payout.utr_number) && (
          <div>
            <Label>UTR Number</Label>
            <Input
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter UTR number"
            />
          </div>
        )}

        <div>
          <Label>Internal Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleUpdate} 
          disabled={isProcessing || newStatus === payout.status}
          className="w-full"
        >
          {isProcessing ? 'Updating...' : 'Update Payout'}
        </Button>
      </div>
    </div>
  );
};

export default AdminPayoutManagement;
