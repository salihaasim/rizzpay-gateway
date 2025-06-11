
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface ReconciliationRecord {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  status: string;
  bankStatus?: string;
  reconciliationStatus: string;
  utrNumber?: string;
  createdAt: string;
}

const AdminPaymentReconciliation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample data
  const reconciliationRecords: ReconciliationRecord[] = [
    {
      id: 'REC001',
      transactionId: 'RP123456',
      merchant: 'Acme Inc',
      amount: 1200,
      status: 'completed',
      bankStatus: 'success',
      reconciliationStatus: 'matched',
      utrNumber: 'UTR123456789',
      createdAt: '2023-09-15T10:34:23Z'
    },
    {
      id: 'REC002', 
      transactionId: 'RP123457',
      merchant: 'XYZ Corp',
      amount: 450,
      status: 'pending',
      reconciliationStatus: 'pending',
      createdAt: '2023-09-14T14:12:45Z'
    },
    {
      id: 'REC003',
      transactionId: 'RP123458', 
      merchant: 'ABC Ltd',
      amount: 5000,
      status: 'failed',
      bankStatus: 'failed',
      reconciliationStatus: 'unmatched',
      createdAt: '2023-09-13T08:23:11Z'
    }
  ];

  const filteredRecords = reconciliationRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.reconciliationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Reconciliation data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: 'bg-green-100 text-green-800',
      unmatched: 'bg-red-100 text-red-800', 
      pending: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white">
        <div className="flex items-center justify-between bg-white">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Payment Reconciliation</h1>
            <p className="text-slate-600">Monitor and reconcile payment transactions with bank records</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white">
          <Card className="bg-white">
            <CardContent className="p-4 bg-white">
              <div className="text-2xl font-bold text-green-600">
                {reconciliationRecords.filter(r => r.reconciliationStatus === 'matched').length}
              </div>
              <div className="text-sm text-slate-600">Matched Records</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 bg-white">
              <div className="text-2xl font-bold text-red-600">
                {reconciliationRecords.filter(r => r.reconciliationStatus === 'unmatched').length}
              </div>
              <div className="text-sm text-slate-600">Unmatched Records</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 bg-white">
              <div className="text-2xl font-bold text-blue-600">
                {reconciliationRecords.filter(r => r.reconciliationStatus === 'pending').length}
              </div>
              <div className="text-sm text-slate-600">Pending Reconciliation</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 bg-white">
              <div className="text-2xl font-bold text-slate-800">
                ₹{reconciliationRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Amount</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <CardContent className="p-4 bg-white">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-slate-700">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by ID, Transaction ID, or Merchant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-700">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleRefresh} disabled={isProcessing} className="bg-blue-500 hover:bg-blue-600 text-white">
                <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation Table */}
        <Card className="bg-white">
          <CardHeader className="bg-white">
            <CardTitle className="text-slate-800">Reconciliation Records ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-700">Record ID</TableHead>
                    <TableHead className="text-slate-700">Transaction ID</TableHead>
                    <TableHead className="text-slate-700">Merchant</TableHead>
                    <TableHead className="text-slate-700">Amount</TableHead>
                    <TableHead className="text-slate-700">Status</TableHead>
                    <TableHead className="text-slate-700">Bank Status</TableHead>
                    <TableHead className="text-slate-700">Reconciliation</TableHead>
                    <TableHead className="text-slate-700">UTR Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="border-slate-200">
                      <TableCell className="font-medium text-slate-800">{record.id}</TableCell>
                      <TableCell className="font-mono text-slate-700">{record.transactionId}</TableCell>
                      <TableCell className="text-slate-700">{record.merchant}</TableCell>
                      <TableCell className="text-slate-800">₹{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="capitalize text-slate-700">{record.status}</span>
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
                          <span className="text-slate-500">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.reconciliationStatus)}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">
                        {record.utrNumber || 'N/A'}
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

export default AdminPaymentReconciliation;
