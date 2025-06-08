
import React, { useState } from 'react';
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
  Search,
  RefreshCw,
  Edit,
  Eye,
  AlertTriangle,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PayoutRecord {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  status: string;
  payoutMethod: string;
  beneficiary: string;
  utrNumber?: string;
  createdAt: string;
  updatedAt: string;
  bankStatus?: string;
  reconciliationStatus: string;
}

const AdminPaymentRecon = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<PayoutRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample data with RP transaction IDs
  const payoutRecords: PayoutRecord[] = [
    {
      id: 'PO123456',
      transactionId: 'RP123456',
      merchant: 'Acme Inc',
      amount: 1200,
      status: 'completed',
      payoutMethod: 'bank_transfer',
      beneficiary: 'John Doe',
      utrNumber: 'UTR123456789',
      createdAt: '2023-09-15T10:34:23Z',
      updatedAt: '2023-09-15T11:34:23Z',
      bankStatus: 'success',
      reconciliationStatus: 'matched'
    },
    {
      id: 'PO123457',
      transactionId: 'RP123457',
      merchant: 'XYZ Corp',
      amount: 450,
      status: 'pending',
      payoutMethod: 'upi',
      beneficiary: 'Jane Smith',
      createdAt: '2023-09-14T14:12:45Z',
      updatedAt: '2023-09-14T14:12:45Z',
      reconciliationStatus: 'pending'
    },
    {
      id: 'PO123458',
      transactionId: 'RP123458',
      merchant: 'ABC Ltd',
      amount: 5000,
      status: 'failed',
      payoutMethod: 'bank_transfer',
      beneficiary: 'Mike Brown',
      createdAt: '2023-09-13T08:23:11Z',
      updatedAt: '2023-09-13T09:23:11Z',
      bankStatus: 'failed',
      reconciliationStatus: 'unmatched'
    }
  ];

  const filteredRecords = payoutRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.reconciliationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleManualOverride = async (recordId: string, newStatus: string, notes: string) => {
    try {
      setIsProcessing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Payout ${recordId} status manually overridden to ${newStatus}`);
      setSelectedRecord(null);
    } catch (error) {
      toast.error('Failed to override payout status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusCheck = async (recordId: string) => {
    try {
      setIsProcessing(true);
      // Simulate bank status check API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Status check completed for payout ${recordId}`);
    } catch (error) {
      toast.error('Failed to check payout status');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: 'bg-green-100 text-green-800',
      unmatched: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      manual: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPayoutStatusIcon = (status: string) => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Reconciliation</h1>
            <p className="text-muted-foreground">Monitor and reconcile payment transactions with bank records</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reconciliation Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {payoutRecords.filter(r => r.reconciliationStatus === 'matched').length}
              </div>
              <div className="text-sm text-muted-foreground">Matched Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {payoutRecords.filter(r => r.reconciliationStatus === 'unmatched').length}
              </div>
              <div className="text-sm text-muted-foreground">Unmatched Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {payoutRecords.filter(r => r.reconciliationStatus === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Reconciliation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                ₹{payoutRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Payout ID, Transaction ID, or Merchant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label>Reconciliation Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="manual">Manual Override</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Records ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payout Status</TableHead>
                    <TableHead>Bank Status</TableHead>
                    <TableHead>Reconciliation</TableHead>
                    <TableHead>UTR Number</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell className="font-mono">{record.transactionId}</TableCell>
                      <TableCell>{record.merchant}</TableCell>
                      <TableCell>₹{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPayoutStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.bankStatus ? (
                          <span className={`capitalize ${
                            record.bankStatus === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.bankStatus}
                          </span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.reconciliationStatus)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.utrNumber || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Payment Reconciliation Details</DialogTitle>
                              </DialogHeader>
                              {selectedRecord && (
                                <ReconciliationModal 
                                  record={selectedRecord}
                                  onManualOverride={handleManualOverride}
                                  isProcessing={isProcessing}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleStatusCheck(record.id)}
                            disabled={isProcessing}
                            title="Check Bank Status"
                          >
                            <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                          </Button>
                          
                          {record.reconciliationStatus === 'unmatched' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedRecord(record)}
                              title="Manual Override"
                            >
                              <Edit className="h-4 w-4" />
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

// Reconciliation Modal Component
const ReconciliationModal: React.FC<{
  record: PayoutRecord;
  onManualOverride: (id: string, status: string, notes: string) => void;
  isProcessing: boolean;
}> = ({ record, onManualOverride, isProcessing }) => {
  const [newStatus, setNewStatus] = useState(record.reconciliationStatus);
  const [notes, setNotes] = useState('');

  const handleOverride = () => {
    onManualOverride(record.id, newStatus, notes);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payout ID</Label>
          <div className="font-mono text-sm bg-muted p-2 rounded">{record.id}</div>
        </div>
        <div>
          <Label>Transaction ID</Label>
          <div className="font-mono text-sm bg-muted p-2 rounded">{record.transactionId}</div>
        </div>
        <div>
          <Label>Amount</Label>
          <div className="text-lg font-semibold">₹{record.amount.toLocaleString()}</div>
        </div>
        <div>
          <Label>Current Status</Label>
          <div className="flex items-center gap-2">
            {record.reconciliationStatus === 'matched' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : record.reconciliationStatus === 'unmatched' ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-500" />
            )}
            <span className="capitalize">{record.reconciliationStatus}</span>
          </div>
        </div>
      </div>

      <div className="bg-muted p-3 rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Merchant:</strong> {record.merchant}</div>
          <div><strong>Beneficiary:</strong> {record.beneficiary}</div>
          <div><strong>Payout Method:</strong> {record.payoutMethod.replace('_', ' ')}</div>
          <div><strong>UTR Number:</strong> {record.utrNumber || 'N/A'}</div>
          <div><strong>Bank Status:</strong> {record.bankStatus || 'Pending'}</div>
          <div><strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {record.reconciliationStatus === 'unmatched' && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Manual Override Required</span>
          </div>
          
          <div>
            <Label>Override Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matched">Mark as Matched</SelectItem>
                <SelectItem value="unmatched">Keep Unmatched</SelectItem>
                <SelectItem value="manual">Manual Override</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Override Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide reason for manual override..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleOverride} 
            disabled={isProcessing || !notes.trim()}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Apply Manual Override'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentRecon;
