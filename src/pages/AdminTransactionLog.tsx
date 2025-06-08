import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Search, FileSpreadsheet, Download } from "lucide-react";
import { useTransactionStore } from '@/stores/transactionStore';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const AdminTransactionLog = () => {
  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get transactions from store
  const { transactions } = useTransactionStore();
  
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const inDateRange = 
      (!startDate || transactionDate >= startDate) && 
      (!endDate || transactionDate <= new Date(endDate.setHours(23, 59, 59, 999)));
    
    const matchesSearch = 
      !searchTerm || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.paymentDetails?.buyerEmail && transaction.paymentDetails.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.paymentDetails?.buyerName && transaction.paymentDetails.buyerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.createdBy && transaction.createdBy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return inDateRange && matchesSearch;
  });

  const downloadAdvancedExcel = () => {
    try {
      // Prepare comprehensive transaction log data
      const excelData = filteredTransactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'Date': format(new Date(transaction.date), 'dd/MM/yyyy'),
        'Time': format(new Date(transaction.date), 'HH:mm:ss'),
        'Amount': transaction.amount,
        'Raw Amount': transaction.rawAmount || 0,
        'Customer': transaction.customer || 'N/A',
        'Customer Email': transaction.customerEmail || 'N/A',
        'Payment Method': transaction.paymentMethod,
        'Status': transaction.status.toUpperCase(),
        'Processing State': transaction.processingState || 'N/A',
        'Description': transaction.description || 'N/A',
        'Merchant ID': transaction.createdBy || 'N/A',
        'UTR Number': transaction.paymentDetails?.utr_number || 'N/A',
        'Bank Reference': transaction.paymentDetails?.bankReference || 'N/A',
        'Payment Gateway': transaction.paymentDetails?.gateway || 'RizzPay',
        'Transaction Type': transaction.paymentDetails?.transactionType || 'Payment',
        'Processing Fee': transaction.paymentDetails?.processingFee || 'N/A',
        'Settlement Status': transaction.status === 'successful' ? 'SETTLED' : 'PENDING',
        'Created At': new Date(transaction.date).toISOString(),
        'Timeline Count': Array.isArray(transaction.processingTimeline) ? transaction.processingTimeline.length : 0,
        'Last Updated': transaction.processingTimeline && Array.isArray(transaction.processingTimeline) && transaction.processingTimeline.length > 0 
          ? transaction.processingTimeline[transaction.processingTimeline.length - 1].timestamp 
          : new Date(transaction.date).toISOString(),
      }));

      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new();

      // Main transaction log sheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Transaction ID
        { wch: 12 }, // Date
        { wch: 10 }, // Time
        { wch: 15 }, // Amount
        { wch: 12 }, // Raw Amount
        { wch: 20 }, // Customer
        { wch: 25 }, // Customer Email
        { wch: 15 }, // Payment Method
        { wch: 12 }, // Status
        { wch: 15 }, // Processing State
        { wch: 30 }, // Description
        { wch: 15 }, // Merchant ID
        { wch: 20 }, // UTR Number
        { wch: 20 }, // Bank Reference
        { wch: 15 }, // Payment Gateway
        { wch: 15 }, // Transaction Type
        { wch: 15 }, // Processing Fee
        { wch: 15 }, // Settlement Status
        { wch: 20 }, // Created At
        { wch: 12 }, // Timeline Count
        { wch: 20 }, // Last Updated
      ];
      ws['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Transaction Log");

      // Analytics summary sheet
      const totalAmount = filteredTransactions.reduce((sum, t) => sum + (t.rawAmount || 0), 0);
      const successfulTransactions = filteredTransactions.filter(t => t.status === 'successful');
      const failedTransactions = filteredTransactions.filter(t => t.status === 'failed');
      const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending');

      const analytics = [
        { Metric: 'Report Period', Value: `${startDate ? format(startDate, 'dd MMM yyyy') : 'All time'} to ${endDate ? format(endDate, 'dd MMM yyyy') : 'Present'}` },
        { Metric: 'Total Transactions', Value: filteredTransactions.length },
        { Metric: 'Successful Transactions', Value: successfulTransactions.length },
        { Metric: 'Failed Transactions', Value: failedTransactions.length },
        { Metric: 'Pending Transactions', Value: pendingTransactions.length },
        { Metric: 'Success Rate', Value: filteredTransactions.length > 0 ? `${((successfulTransactions.length / filteredTransactions.length) * 100).toFixed(2)}%` : '0%' },
        { Metric: 'Total Transaction Value', Value: `₹${totalAmount.toLocaleString('en-IN')}` },
        { Metric: 'Average Transaction Value', Value: filteredTransactions.length > 0 ? `₹${(totalAmount / filteredTransactions.length).toFixed(2)}` : '₹0' },
        { Metric: 'UPI Transactions', Value: filteredTransactions.filter(t => t.paymentMethod === 'upi').length },
        { Metric: 'Card Transactions', Value: filteredTransactions.filter(t => t.paymentMethod === 'card').length },
        { Metric: 'Net Banking Transactions', Value: filteredTransactions.filter(t => t.paymentMethod === 'netbanking').length },
        { Metric: 'Report Generated By', Value: 'RizzPay Admin' },
        { Metric: 'Export Date & Time', Value: new Date().toLocaleString('en-IN') },
        { Metric: 'Data Source', Value: 'RizzPay Transaction Database' },
      ];

      const analyticsWs = XLSX.utils.json_to_sheet(analytics);
      analyticsWs['!cols'] = [{ wch: 30 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, analyticsWs, "Analytics");

      // Payment method breakdown
      const paymentMethods = ['upi', 'card', 'netbanking', 'wallet'];
      const methodBreakdown = paymentMethods.map(method => {
        const methodTransactions = filteredTransactions.filter(t => t.paymentMethod === method);
        const methodAmount = methodTransactions.reduce((sum, t) => sum + (t.rawAmount || 0), 0);
        return {
          'Payment Method': method.toUpperCase(),
          'Transaction Count': methodTransactions.length,
          'Total Amount': `₹${methodAmount.toLocaleString('en-IN')}`,
          'Success Rate': methodTransactions.length > 0 ? `${((methodTransactions.filter(t => t.status === 'successful').length / methodTransactions.length) * 100).toFixed(2)}%` : '0%',
          'Average Amount': methodTransactions.length > 0 ? `₹${(methodAmount / methodTransactions.length).toFixed(2)}` : '₹0'
        };
      });

      const methodWs = XLSX.utils.json_to_sheet(methodBreakdown);
      methodWs['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, methodWs, "Payment Methods");

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `RizzPay_Transaction_Log_${timestamp}_${filteredTransactions.length}records.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Advanced transaction log exported: ${filename}`);
    } catch (error) {
      console.error('Error generating transaction log Excel:', error);
      toast.error('Failed to generate transaction log Excel');
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Transaction Log | RizzPay Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaction Log</h1>
            <p className="text-muted-foreground mt-1">
              View transaction records
            </p>
          </div>
          <Button 
            onClick={downloadAdvancedExcel}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Advanced Report
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Transaction Filters</CardTitle>
            <CardDescription>
              Filter transactions by date range and search terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label>Search Transactions</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by ID, customer, or merchant..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Records</CardTitle>
              <CardDescription>
                Showing {filteredTransactions.length} transactions
                {startDate && endDate && ` from ${format(startDate, 'dd MMM yyyy')} to ${format(endDate, 'dd MMM yyyy')}`}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadAdvancedExcel}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1.5">
                  Try adjusting your search filters or selecting a different date range to find transactions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Merchant ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {format(new Date(transaction.date), 'dd MMM yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'HH:mm:ss')}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === 'successful'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                        <TableCell>{transaction.customer || 'N/A'}</TableCell>
                        <TableCell>{transaction.createdBy || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionLog;
