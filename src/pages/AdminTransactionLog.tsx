import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Download, FileSpreadsheet, Search } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import AdminLayout from '@/components/admin/AdminLayout';
import { useTransactionStore } from '@/stores/transactionStore';
import { Helmet } from 'react-helmet';

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
  
  const exportToExcel = () => {
    const data = filteredTransactions.map(t => ({
      'Transaction ID': t.id,
      'Date': format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
      'Amount': `₹${t.amount}`,
      'Status': t.status,
      'Payment Method': t.paymentMethod,
      'Customer': t.customer || 'N/A',
      'Email': t.paymentDetails?.buyerEmail || 'N/A',
      'Merchant ID': t.createdBy || 'N/A',
      'Description': t.description || 'N/A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    
    const fileName = `RizzPay_Transactions_${format(startDate || new Date(), 'yyyyMMdd')}_${format(endDate || new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Transaction data exported successfully!');
  };
  
  return (
    <AdminLayout hideNavigation={true}>
      <Helmet>
        <title>Transaction Log | RizzPay Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaction Log</h1>
            <p className="text-muted-foreground mt-1">
              View and export transaction records
            </p>
          </div>
          
          <Button onClick={exportToExcel} disabled={filteredTransactions.length === 0}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
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
          <CardHeader className="pb-3">
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>
              Showing {filteredTransactions.length} transactions
              {startDate && endDate && ` from ${format(startDate, 'dd MMM yyyy')} to ${format(endDate, 'dd MMM yyyy')}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground/30 mb-4" />
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
