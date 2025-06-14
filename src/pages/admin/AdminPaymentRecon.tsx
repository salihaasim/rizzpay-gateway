import React, { useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, Download, History,
  CheckCircle, Clock, XCircle
} from "lucide-react";
import { toast } from "sonner";

import { 
  PayoutRecord, CsvRecord, ReconciliationLog,
} from "./reconTypes";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import ReconPayoutRecordsTable from "./ReconPayoutRecordsTable";
import CSVUploadSection from "./CSVUploadSection";
import CSVPreviewTable from "./CSVPreviewTable";
import ReconciliationLogsTable from "./ReconciliationLogsTable";

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
          <p className="text-gray-600">
            Monitor and reconcile payment transactions with bank records
          </p>
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
                <CardTitle className="text-black">
                  Reconciliation Records ({filteredRecords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReconPayoutRecordsTable
                  records={filteredRecords}
                  onView={setSelectedRecord}
                  selectedRecord={selectedRecord}
                  onManualOverride={handleManualOverride}
                  isProcessing={isProcessing}
                  onStatusCheck={handleStatusCheck}
                  getStatusBadge={getStatusBadge}
                  getPayoutStatusIcon={getPayoutStatusIcon}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv-upload" className="space-y-6">
            {/* CSV Upload Section */}
            <CSVUploadSection
              isDragOver={isDragOver}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileInput={handleFileInput}
              csvFile={csvFile}
            />
            {csvData.length > 0 && (
              <Card className="bg-white border-2 border-black">
                <CardHeader className="bg-white">
                  <CardTitle className="text-black">
                    CSV Preview & Matching Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CSVPreviewTable
                    csvData={csvData}
                    selectedUnmatchedRecord={selectedUnmatchedRecord}
                    setSelectedUnmatchedRecord={setSelectedUnmatchedRecord}
                    manualOrderId={manualOrderId}
                    setManualOrderId={setManualOrderId}
                    handleManualMatch={handleManualMatch}
                  />
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
                <ReconciliationLogsTable 
                  logs={reconciliationLogs}
                  onDownload={logId => {
                    // No-op; add real logic for download
                    toast.success("Download (simulation): " + logId);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentRecon;
