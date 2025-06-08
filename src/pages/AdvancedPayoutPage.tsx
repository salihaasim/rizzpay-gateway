
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  IndianRupee,
  Loader2,
  CreditCard,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface BulkPaymentEntry {
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
  payoutMethod: string;
  description?: string;
}

const AdvancedPayoutPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkEntries, setBulkEntries] = useState<BulkPaymentEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Single payout form
  const [singlePayout, setSinglePayout] = useState({
    beneficiaryName: '',
    accountNumber: '',
    ifscCode: '',
    amount: '',
    description: ''
  });

  const [bulkUploads] = useState([
    { id: 'BU001', fileName: 'bulk_payout_jan_2024.csv', records: 150, status: 'completed', uploadDate: '2024-01-15', processedAmount: 750000 },
    { id: 'BU002', fileName: 'salary_payout_feb.xlsx', records: 89, status: 'processing', uploadDate: '2024-01-14', processedAmount: 445000 },
    { id: 'BU003', fileName: 'vendor_payments.csv', records: 25, status: 'failed', uploadDate: '2024-01-13', processedAmount: 0 }
  ]);

  const validateEntries = (data: BulkPaymentEntry[]): string[] => {
    const newErrors: string[] = [];
    
    if (data.length === 0) {
      newErrors.push('Excel file contains no valid entries.');
      return newErrors;
    }
    
    data.forEach((entry, index) => {
      if (!entry.beneficiaryName || entry.beneficiaryName.trim() === '') {
        newErrors.push(`Row ${index + 1}: Beneficiary name is required.`);
      }
      
      if (!entry.accountNumber || !/^\d{9,18}$/.test(entry.accountNumber)) {
        newErrors.push(`Row ${index + 1}: Invalid account number format.`);
      }
      
      if (!entry.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(entry.ifscCode)) {
        newErrors.push(`Row ${index + 1}: Invalid IFSC code format.`);
      }
      
      if (!entry.amount || entry.amount <= 0) {
        newErrors.push(`Row ${index + 1}: Amount must be greater than zero.`);
      }
      
      if (!entry.payoutMethod) {
        newErrors.push(`Row ${index + 1}: Payout method is required.`);
      }
    });
    
    return newErrors;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Invalid file type. Please upload CSV or Excel files only.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size too large. Maximum size is 5MB.');
        return;
      }
      
      setSelectedFile(file);
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setErrors([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        const parsedEntries: BulkPaymentEntry[] = jsonData.map(row => ({
          beneficiaryName: row['Beneficiary Name'] || '',
          accountNumber: row['Account Number']?.toString() || '',
          ifscCode: row['IFSC Code'] || '',
          amount: parseFloat(row['Amount'] || 0),
          payoutMethod: row['Payout Method'] || 'bank_transfer',
          description: row['Description'] || ''
        }));
        
        const validationErrors = validateEntries(parsedEntries);
        setErrors(validationErrors);
        
        if (validationErrors.length === 0) {
          setBulkEntries(parsedEntries);
          toast.success(`Uploaded ${parsedEntries.length} payment entries successfully.`);
        }
        
      } catch (error) {
        console.error('Error parsing file:', error);
        setErrors(['Failed to parse file. Please ensure it is a valid Excel/CSV file with the correct format.']);
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setErrors(['Error reading file.']);
      setIsUploading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = (type: 'csv' | 'excel') => {
    const sampleData = [
      {
        'Beneficiary Name': 'John Doe',
        'Account Number': '1234567890',
        'IFSC Code': 'SBIN0001234',
        'Amount': 5000,
        'Payout Method': 'bank_transfer',
        'Description': 'Salary Payment'
      },
      {
        'Beneficiary Name': 'Jane Smith',
        'Account Number': '9876543210',
        'IFSC Code': 'HDFC0001234',
        'Amount': 3000,
        'Payout Method': 'bank_transfer',
        'Description': 'Freelance Payment'
      }
    ];
    
    if (type === 'csv') {
      const headers = Object.keys(sampleData[0]);
      const csvContent = headers.join(',') + '\n' + 
        sampleData.map(row => Object.values(row).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bulk_payment_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk Payments');
      XLSX.writeFile(workbook, 'bulk_payment_template.xlsx');
    }
    
    toast.success(`${type.toUpperCase()} template downloaded successfully`);
  };

  const processBulkPayments = async () => {
    if (bulkEntries.length === 0 || errors.length > 0) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Successfully processed ${bulkEntries.length} bulk payments`, {
        description: 'All payments have been submitted for processing.'
      });
      
      setBulkEntries([]);
      setSelectedFile(null);
      
    } catch (error) {
      toast.error('Bulk payment processing failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processSinglePayout = () => {
    if (!singlePayout.beneficiaryName || !singlePayout.accountNumber || !singlePayout.ifscCode || !singlePayout.amount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    toast.success('Single payout initiated successfully');
    setSinglePayout({
      beneficiaryName: '',
      accountNumber: '',
      ifscCode: '',
      amount: '',
      description: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
      processing: <Clock className="h-3 w-3 mr-1" />,
      failed: <AlertTriangle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge className={`flex items-center ${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Advanced Payout</h1>
            <p className="text-sm text-muted-foreground">Process single and bulk payouts efficiently</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(125000)}</p>
          </div>
        </div>

        <Tabs defaultValue="single" className="space-y-4">
          <TabsList>
            <TabsTrigger value="single">Single Payout</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Payout</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Single Payout</CardTitle>
                <CardDescription>Process individual payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                    <Input
                      id="beneficiaryName"
                      value={singlePayout.beneficiaryName}
                      onChange={(e) => setSinglePayout({ ...singlePayout, beneficiaryName: e.target.value })}
                      placeholder="Enter beneficiary name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={singlePayout.accountNumber}
                      onChange={(e) => setSinglePayout({ ...singlePayout, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      value={singlePayout.ifscCode}
                      onChange={(e) => setSinglePayout({ ...singlePayout, ifscCode: e.target.value })}
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={singlePayout.amount}
                      onChange={(e) => setSinglePayout({ ...singlePayout, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={singlePayout.description}
                    onChange={(e) => setSinglePayout({ ...singlePayout, description: e.target.value })}
                    placeholder="Payment description (optional)"
                  />
                </div>
                <Button onClick={processSinglePayout} className="w-full bg-[#0052FF]">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Process Single Payout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Bulk Payment File</CardTitle>
                  <CardDescription>Upload CSV or Excel file with payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, XLSX, XLS (Max 5MB)
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}

                  {errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {bulkEntries.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800 mb-2">Ready to Process</h3>
                        <p className="text-xs text-green-700">
                          {bulkEntries.length} payment entries • Total: {formatCurrency(bulkEntries.reduce((sum, entry) => sum + entry.amount, 0))}
                        </p>
                      </div>

                      <Button 
                        onClick={processBulkPayments} 
                        disabled={isProcessing || errors.length > 0}
                        className="w-full bg-[#0052FF]"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing {bulkEntries.length} Payments...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Process {bulkEntries.length} Bulk Payments
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {isUploading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Processing file...</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Instructions</CardTitle>
                  <CardDescription>Follow these guidelines for successful uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Use the provided template format</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Verify all account numbers and IFSC codes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Maximum 1000 records per file</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Ensure sufficient wallet balance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Processing time: 5-10 minutes</span>
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
                <CardDescription>Track your bulk payment uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bulkUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileSpreadsheet className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{upload.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {upload.records} records • {upload.uploadDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Amount: {formatCurrency(upload.processedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(upload.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {upload.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Download Templates</CardTitle>
                <CardDescription>Get started with our pre-formatted templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileSpreadsheet className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">CSV Template</h3>
                        <p className="text-sm text-muted-foreground">Standard CSV format</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadTemplate('csv')}
                      variant="outline" 
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Excel Template</h3>
                        <p className="text-sm text-muted-foreground">Excel with validation</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadTemplate('excel')}
                      variant="outline" 
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdvancedPayoutPage;
