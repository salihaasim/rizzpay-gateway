import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const AdminTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Sample transaction data with RP prefix
  const transactions = [
    { id: 'RP123456', date: '2023-09-15T10:34:23Z', amount: '₹1,200.00', merchant: 'Acme Inc', customer: 'John Doe', status: 'successful', paymentMethod: 'UPI', customerEmail: 'john@example.com', merchantId: 'MERCH001', processingFee: '₹24.00', netAmount: '₹1,176.00', utrNumber: 'UTR123456789' },
    { id: 'RP123455', date: '2023-09-14T14:12:45Z', amount: '₹450.50', merchant: 'XYZ Corp', customer: 'Jane Smith', status: 'successful', paymentMethod: 'Net Banking', customerEmail: 'jane@example.com', merchantId: 'MERCH002', processingFee: '₹9.01', netAmount: '₹441.49', utrNumber: 'UTR123456788' },
    { id: 'RP123454', date: '2023-09-13T08:23:11Z', amount: '₹5,000.00', merchant: 'ABC Ltd', customer: 'Mike Brown', status: 'failed', paymentMethod: 'Card', customerEmail: 'mike@example.com', merchantId: 'MERCH003', processingFee: '₹0.00', netAmount: '₹0.00', utrNumber: '' },
    { id: 'RP123453', date: '2023-09-12T19:45:32Z', amount: '₹750.25', merchant: 'Tech Solutions', customer: 'Sarah Lee', status: 'pending', paymentMethod: 'UPI', customerEmail: 'sarah@example.com', merchantId: 'MERCH004', processingFee: '₹15.01', netAmount: '₹735.24', utrNumber: '' },
    { id: 'RP123452', date: '2023-09-10T11:22:09Z', amount: '₹3,200.00', merchant: 'Acme Inc', customer: 'Robert White', status: 'successful', paymentMethod: 'UPI', customerEmail: 'robert@example.com', merchantId: 'MERCH001', processingFee: '₹64.00', netAmount: '₹3,136.00', utrNumber: 'UTR123456787' }
  ];

  // Filter transactions based on search term and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const downloadAdvancedExcel = () => {
    try {
      // Prepare comprehensive data for Excel export
      const excelData = filteredTransactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'Date': new Date(transaction.date).toLocaleDateString('en-IN'),
        'Time': new Date(transaction.date).toLocaleTimeString('en-IN'),
        'Merchant Name': transaction.merchant,
        'Merchant ID': transaction.merchantId,
        'Customer Name': transaction.customer,
        'Customer Email': transaction.customerEmail,
        'Payment Method': transaction.paymentMethod,
        'Transaction Amount': transaction.amount,
        'Processing Fee': transaction.processingFee,
        'Net Amount': transaction.netAmount,
        'Status': transaction.status.toUpperCase(),
        'UTR Number': transaction.utrNumber || 'N/A',
        'Payment Gateway': 'RizzPay',
        'Currency': 'INR',
        'Settlement Status': transaction.status === 'successful' ? 'SETTLED' : 'PENDING',
        'Created At': new Date(transaction.date).toISOString(),
      }));

      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new();

      // Main transactions sheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 15 },
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 8 },
        { wch: 15 }, { wch: 20 }
      ];
      ws['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Transactions");

      // Summary sheet
      const summary = [
        { Metric: 'Total Transactions', Value: filteredTransactions.length },
        { Metric: 'Successful Transactions', Value: filteredTransactions.filter(t => t.status === 'successful').length },
        { Metric: 'Failed Transactions', Value: filteredTransactions.filter(t => t.status === 'failed').length },
        { Metric: 'Pending Transactions', Value: filteredTransactions.filter(t => t.status === 'pending').length },
        { Metric: 'Total Amount', Value: filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount.replace('₹', '').replace(',', '')), 0).toLocaleString('en-IN') },
        { Metric: 'Success Rate', Value: `${((filteredTransactions.filter(t => t.status === 'successful').length / filteredTransactions.length) * 100).toFixed(2)}%` },
        { Metric: 'Export Date', Value: new Date().toLocaleString('en-IN') },
        { Metric: 'Export Type', Value: 'Admin Transaction Report' },
      ];

      const summaryWs = XLSX.utils.json_to_sheet(summary);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `RizzPay_Admin_Transactions_${timestamp}_${filteredTransactions.length}records.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Excel report downloaded: ${filename}`);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all system transactions
            </p>
          </div>
          <Button 
            onClick={downloadAdvancedExcel}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Advanced Excel Report
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label htmlFor="search" className="text-sm font-medium">Search</label>
                <Input
                  id="search"
                  placeholder="Search by ID, merchant, or customer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="date" className="text-sm font-medium">Date Range</label>
                <Input id="date" type="date" />
              </div>
              <div className="flex items-end gap-2">
                <Button>Apply Filters</Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={downloadAdvancedExcel}
                  title="Download Excel Report"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction List ({filteredTransactions.length} records)</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAdvancedExcel}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Transaction ID</th>
                    <th className="py-3 text-left">Date</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Merchant</th>
                    <th className="py-3 text-left">Customer</th>
                    <th className="py-3 text-left">Status</th>
                    <th className="py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">{transaction.id}</td>
                      <td className="py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3">{transaction.amount}</td>
                      <td className="py-3">{transaction.merchant}</td>
                      <td className="py-3">{transaction.customer}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          transaction.status === 'successful' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
