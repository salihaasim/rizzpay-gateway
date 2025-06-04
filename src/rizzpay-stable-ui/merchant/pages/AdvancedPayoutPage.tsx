
import React, { useState } from 'react';
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
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';

const AdvancedPayoutPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bulkUploads] = useState([
    { id: 'BU001', fileName: 'bulk_payout_jan_2024.csv', records: 150, status: 'completed', uploadDate: '2024-01-15', processedAmount: 750000 },
    { id: 'BU002', fileName: 'salary_payout_feb.xlsx', records: 89, status: 'processing', uploadDate: '2024-01-14', processedAmount: 445000 },
    { id: 'BU003', fileName: 'vendor_payments.csv', records: 25, status: 'failed', uploadDate: '2024-01-13', processedAmount: 0 }
  ]);

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
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('File uploaded successfully', {
        description: 'Your bulk payout file is being processed.'
      });
      
      setSelectedFile(null);
      
    } catch (error) {
      toast.error('Upload failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (type: 'csv' | 'excel') => {
    const headers = [
      'beneficiary_name',
      'account_number', 
      'ifsc_code',
      'amount',
      'payout_method',
      'description'
    ];
    
    if (type === 'csv') {
      const csvContent = headers.join(',') + '\n' + 
        'John Doe,1234567890,SBIN0001234,5000,bank_transfer,Salary Payment\n' +
        'Jane Smith,9876543210,HDFC0001234,3000,bank_transfer,Freelance Payment';
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bulk_payout_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast.info('Excel template download feature coming soon');
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Payout</h1>
          <p className="text-muted-foreground">Bulk payouts with advanced features</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(125000)}</p>
        </div>
      </div>

      <Tabs defaultValue="bulk" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Bulk Payout File</CardTitle>
                <CardDescription>Upload CSV or Excel file with payout details</CardDescription>
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

                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
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
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Track your bulk payout uploads</CardDescription>
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
  );
};

export default AdvancedPayoutPage;
