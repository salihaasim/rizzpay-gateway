
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, FileSpreadsheet, Filter, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import AdminLayout from '@/components/admin/AdminLayout';
import { useTransactionStore } from '@/stores/transactionStore';
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const AdminTransactionLog = () => {
  // State for date range selection
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Get transactions from the store
  const { transactions } = useTransactionStore();
  
  // Filter transactions by date, search term, and status
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const matchesDate = (!startDate || transactionDate >= startDate) && 
                         (!endDate || transactionDate <= endDate);
                         
    const matchesSearch = !searchTerm || 
                          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });
  
  // Export transactions to Excel
  const exportToExcel = () => {
    try {
      // Transform transactions for export
      const exportData = filteredTransactions.map(t => ({
        'Transaction ID': t.id,
        'Date': format(new Date(t.date), 'yyyy-MM-dd HH:mm:ss'),
        'Customer': t.customer,
        'Amount': t.amount,
        'Payment Method': t.paymentMethod,
        'Status': t.status,
        'Processing State': t.processingState || '-'
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      
      // Generate file name with date range
      const fileName = `RizzPay_Transactions_${format(startDate || new Date(), 'yyyyMMdd')}_to_${format(endDate || new Date(), 'yyyyMMdd')}.xlsx`;
      
      // Export to file
      XLSX.writeFile(wb, fileName);
      
      toast.success('Transaction log exported successfully');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaction Log</h1>
            <p className="text-muted-foreground mt-1">
              Review and export transaction history
            </p>
          </div>
          
          <Button onClick={exportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Filters</CardTitle>
            <CardDescription>
              Filter transactions by date range, status, and search terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select start date'}
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
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Select end date'}
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
              
              <div className="space-y-2 flex-1">
                <Label>Status Filter</Label>
                <div className="flex gap-2">
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 flex-1">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID or customer"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => {
                setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
                setEndDate(new Date());
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found for the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.id.substring(0, 12)}...
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          transaction.status === 'successful' && "bg-green-100 text-green-800",
                          transaction.status === 'pending' && "bg-yellow-100 text-yellow-800",
                          transaction.status === 'failed' && "bg-red-100 text-red-800",
                          transaction.status === 'processing' && "bg-blue-100 text-blue-800"
                        )}>
                          {transaction.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionLog;
