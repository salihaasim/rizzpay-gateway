
import React, { useState, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  RefreshCw,
  Edit,
  Eye,
  AlertTriangle,
  Download,
  Upload,
  FileText,
  History
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

interface CsvRecord {
  id: string;
  utrNumber: string;
  amount: number;
  narration: string;
  date: string;
  matched: boolean;
  matchedOrderId?: string;
}

interface ReconciliationLog {
  id: string;
  fileName: string;
  uploadedAt: string;
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  uploadedBy: string;
}

const AdminPaymentRecon = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<PayoutRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvRecord[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedUnmatchedRecord, setSelectedUnmatchedRecord] = useState<CsvRecord | null>(null);
  const [manualOrderId, setManualOrderId] = useState('');

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

  const reconciliationLogs: ReconciliationLog[] = [
    {
      id: 'LOG001',
      fileName: 'bank_statement_2023_09_15.csv',
      uploadedAt: '2023-09-15T14:30:00Z',
      totalRecords: 125,
      matchedRecords: 118,
      unmatchedRecords: 7,
      uploadedBy: 'admin@rizzpay.com'
    },
    {
      id: 'LOG002',
      fileName: 'bank_statement_2023_09_14.csv',
      uploadedAt: '2023-09-14T16:45:00Z',
      totalRecords: 89,
      matchedRecords: 85,
      unmatchedRecords: 4,
      uploadedBy: 'admin@rizzpay.com'
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      setCsvFile(csvFile);
      parseCsvFile(csvFile);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCsvFile(file);
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const data: CsvRecord[] = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        return {
          id: `CSV${index + 1}`,
          utrNumber: values[0]?.trim() || '',
          amount: parseFloat(values[1]?.trim() || '0'),
          narration: values[2]?.trim() || '',
          date: values[3]?.trim() || '',
          matched: Math.random() > 0.3, // Simulate matching logic
          matchedOrderId: Math.random() > 0.3 ? `RP${Math.floor(Math.random() * 100000)}` : undefined
        };
      }).filter(record => record.utrNumber); // Filter out empty rows
      
      setCsvData(data);
      toast.success(`Successfully parsed ${data.length} records from CSV`);
    };
    reader.readAsText(file);
  };

  const handleManualOverride = async (recordId: string, newStatus: string, notes: string) => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Payout ${recordId} status manually overridden to ${newStatus}`);
      setSelectedRecord(null);
    } catch (error) {
      toast.error('Failed to override payout status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualMatch = () => {
    if (selectedUnmatchedRecord && manualOrderId) {
      const updatedData = csvData.map(record => 
        record.id === selectedUnmatchedRecord.id 
          ? { ...record, matched: true, matchedOrderId: manualOrderId }
          : record
      );
      setCsvData(updatedData);
      setSelectedUnmatchedRecord(null);
      setManualOrderId('');
      toast.success(`Record manually matched to order ${manualOrderId}`);
    }
  };

  const handleStatusCheck = async (recordId: string) => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Status check completed for payout ${recordId}`);
    } catch (error) {
      toast.error('Failed to check payout status');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportReconciliation = (format: 'csv' | 'pdf') => {
    // Simulate export functionality
    toast.success(`Reconciliation report exported as ${format.toUpperCase()}`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: 'bg-green-100 text-green-800 border-green-200',
      unmatched: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      manual: 'bg-black text-white border-black'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPayoutStatusIcon = (status: string) => {
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
        <div className="bg-white">
          <h1 className="text-2xl font-bold text-black">Payment Reconciliation</h1>
          <p className="text-gray-600">Monitor and reconcile payment transactions with bank records</p>
        </div>

        <Tabs defaultValue="reconciliation" className="space-y-4">
          <TabsList className="bg-white border-2 border-black">
            <TabsTrigger value="reconciliation" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              Reconciliation
            </TabsTrigger>
            <TabsTrigger value="csv-upload" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              CSV Upload
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              Reconciliation Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reconciliation" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border-2 border-black">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {payoutRecords.filter(r => r.reconciliationStatus === 'matched').length}
                  </div>
                  <div className="text-sm text-gray-600">Matched Records</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-black">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {payoutRecords.filter(r => r.reconciliationStatus === 'unmatched').length}
                  </div>
                  <div className="text-sm text-gray-600">Unmatched Records</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-black">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {payoutRecords.filter(r => r.reconciliationStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Reconciliation</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-black">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-black">
                    ₹{payoutRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white border-2 border-black">
              <CardContent className="p-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label className="text-black">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search by Payout ID, Transaction ID, or Merchant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 border-black"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-black">Reconciliation Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48 border-black">
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
                  <div className="flex gap-2">
                    <Button onClick={() => exportReconciliation('csv')} className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={() => exportReconciliation('pdf')} className="bg-black hover:bg-gray-800 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reconciliation Table */}
            <Card className="bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-black">Reconciliation Records ({filteredRecords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Payout ID</TableHead>
                        <TableHead className="text-black">Transaction ID</TableHead>
                        <TableHead className="text-black">Merchant</TableHead>
                        <TableHead className="text-black">Amount</TableHead>
                        <TableHead className="text-black">Payout Status</TableHead>
                        <TableHead className="text-black">Bank Status</TableHead>
                        <TableHead className="text-black">Reconciliation</TableHead>
                        <TableHead className="text-black">UTR Number</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium text-black">{record.id}</TableCell>
                          <TableCell className="font-mono text-black">{record.transactionId}</TableCell>
                          <TableCell className="text-black">{record.merchant}</TableCell>
                          <TableCell className="text-black">₹{record.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPayoutStatusIcon(record.status)}
                              <span className="capitalize text-black">{record.status}</span>
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
                          <TableCell className="font-mono text-sm text-black">
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv-upload" className="space-y-6">
            {/* CSV Upload Section */}
            <Card className="bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-black">Upload Bank Statement CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed p-8 text-center ${
                    isDragOver ? 'border-blue-500 bg-blue-50' : 'border-black'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-black mb-2">Drag and drop your CSV file here, or</p>
                  <Label htmlFor="csv-file" className="cursor-pointer">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Browse Files
                    </Button>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </Label>
                  {csvFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {csvFile.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CSV Preview Table */}
            {csvData.length > 0 && (
              <Card className="bg-white border-2 border-black">
                <CardHeader className="bg-white">
                  <CardTitle className="text-black">CSV Preview & Matching Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-black">UTR Number</TableHead>
                          <TableHead className="text-black">Amount</TableHead>
                          <TableHead className="text-black">Narration</TableHead>
                          <TableHead className="text-black">Date</TableHead>
                          <TableHead className="text-black">Matching Status</TableHead>
                          <TableHead className="text-black">Matched Order ID</TableHead>
                          <TableHead className="text-black">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.map((record) => (
                          <TableRow key={record.id} className={record.matched ? 'bg-green-50' : 'bg-red-50'}>
                            <TableCell className="font-mono text-black">{record.utrNumber}</TableCell>
                            <TableCell className="text-black">₹{record.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-black">{record.narration}</TableCell>
                            <TableCell className="text-black">{record.date}</TableCell>
                            <TableCell>
                              {record.matched ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 border">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Matched
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 border-red-200 border">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Unmatched
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-black">
                              {record.matchedOrderId || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {!record.matched && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => setSelectedUnmatchedRecord(record)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Manual Match Record</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-black">UTR Number</Label>
                                        <div className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedUnmatchedRecord?.utrNumber}</div>
                                      </div>
                                      <div>
                                        <Label className="text-black">Amount</Label>
                                        <div className="text-lg font-semibold">₹{selectedUnmatchedRecord?.amount.toLocaleString()}</div>
                                      </div>
                                      <div>
                                        <Label className="text-black">Order ID to Match</Label>
                                        <Input
                                          value={manualOrderId}
                                          onChange={(e) => setManualOrderId(e.target.value)}
                                          placeholder="Enter order ID (e.g., RP123456)"
                                          className="border-black"
                                        />
                                      </div>
                                      <Button 
                                        onClick={handleManualMatch}
                                        disabled={!manualOrderId.trim()}
                                        className="w-full bg-black hover:bg-gray-800 text-white"
                                      >
                                        Match Record
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {/* Reconciliation Logs */}
            <Card className="bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-black flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Last Reconciled Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">File Name</TableHead>
                        <TableHead className="text-black">Upload Date</TableHead>
                        <TableHead className="text-black">Total Records</TableHead>
                        <TableHead className="text-black">Matched</TableHead>
                        <TableHead className="text-black">Unmatched</TableHead>
                        <TableHead className="text-black">Uploaded By</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliationLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-black flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {log.fileName}
                          </TableCell>
                          <TableCell className="text-black">
                            {new Date(log.uploadedAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-black">{log.totalRecords}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{log.matchedRecords}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">{log.unmatchedRecords}</span>
                          </TableCell>
                          <TableCell className="text-black">{log.uploadedBy}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" title="Download Report">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
          <Label className="text-black">Payout ID</Label>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">{record.id}</div>
        </div>
        <div>
          <Label className="text-black">Transaction ID</Label>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">{record.transactionId}</div>
        </div>
        <div>
          <Label className="text-black">Amount</Label>
          <div className="text-lg font-semibold">₹{record.amount.toLocaleString()}</div>
        </div>
        <div>
          <Label className="text-black">Current Status</Label>
          <div className="flex items-center gap-2">
            {record.reconciliationStatus === 'matched' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : record.reconciliationStatus === 'unmatched' ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-blue-500" />
            )}
            <span className="capitalize text-black">{record.reconciliationStatus}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-3 rounded">
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
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Manual Override Required</span>
          </div>
          
          <div>
            <Label className="text-black">Override Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-black">
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
            <Label className="text-black">Override Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide reason for manual override..."
              rows={3}
              className="border-black"
            />
          </div>

          <Button 
            onClick={handleOverride} 
            disabled={isProcessing || !notes.trim()}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isProcessing ? 'Processing...' : 'Apply Manual Override'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentRecon;
