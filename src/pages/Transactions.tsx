import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import TransactionCard from '@/components/TransactionCard';
import TransactionDetails from '@/components/TransactionDetails';
import { Search, Download, Filter, ArrowUpDown } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useLocation } from 'react-router-dom';
import UpiTransactionToggle from '@/components/transactions/UpiTransactionToggle';
import UpiTransactionCard from '@/components/transactions/UpiTransactionCard';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const Transactions = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const transactionIdParam = searchParams.get('id');
  
  const { transactions } = useTransactionStore();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(transactionIdParam);
  const [showUpiTransactions, setShowUpiTransactions] = useState(false);
  
  useEffect(() => {
    if (transactionIdParam) {
      setSelectedTransactionId(transactionIdParam);
    }
  }, [transactionIdParam]);
  
  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId);
  
  // Get UPI transactions
  const upiTransactions = transactions.filter(t => t.paymentMethod === 'upi_manual');
  
  // Filter transactions based on selected filter and UPI toggle
  const filteredTransactions = transactions.filter(transaction => {
    // Apply status filter
    if (filter !== 'all' && transaction.status !== filter) {
      return false;
    }
    
    // Apply UPI filter if toggled on
    if (showUpiTransactions) {
      return transaction.paymentMethod === 'upi_manual';
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(query) ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.amount.toLowerCase().includes(query) ||
        transaction.paymentMethod.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Calculate totals
  const getTotalAmount = (status: string) => {
    return transactions
      .filter(t => status === 'all' || t.status === status)
      .reduce((sum, t) => {
        // Remove non-numeric characters and convert to number
        const amount = Number(t.amount.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
  };

  const successfulTotal = getTotalAmount('successful');
  const pendingTotal = getTotalAmount('pending');
  const failedTotal = getTotalAmount('failed');
  const processingTotal = getTotalAmount('processing');

  // Generate payment method data for pie chart
  const getPaymentMethodData = () => {
    const methodCounts: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const method = transaction.paymentMethod;
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    const colors: Record<string, string> = {
      'upi': '#34A853',
      'Google Pay': '#4285F4',
      'UPI': '#34A853',
      'card': '#EA4335',
      'Credit Card': '#EA4335',
      'Debit Card': '#FBBC05',
      'netbanking': '#003087',
      'PayPal': '#003087',
      'Cash': '#6B7280',
    };
    
    return Object.entries(methodCounts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#6B7280',
    }));
  };

  const paymentMethodData = getPaymentMethodData();
  
  const exportAllTransactions = () => {
    // Format data for Excel
    const data = filteredTransactions.map(t => ({
      'Transaction ID': t.id,
      'Date': new Date(t.date).toLocaleString(),
      'Amount': t.amount,
      'Status': t.status.charAt(0).toUpperCase() + t.status.slice(1),
      'Payment Method': t.paymentMethod,
      'Customer': t.customer || 'N/A',
      'UPI ID': t.paymentDetails?.upiId || '',
      'UPI Transaction ID': t.paymentDetails?.upiTransactionId || t.paymentDetails?.razorpay_payment_id || '',
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    
    // Get current date for filename
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    // Export to file
    XLSX.writeFile(wb, `RizzPay_Transactions_${dateString}.xlsx`);
    
    toast.success('Transactions downloaded successfully');
  };

  if (selectedTransaction) {
    return (
      <div className="container py-6">
        <TransactionDetails 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransactionId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your payment transactions</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center" onClick={exportAllTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      
      <UpiTransactionToggle 
        showUpiTransactions={showUpiTransactions} 
        setShowUpiTransactions={setShowUpiTransactions}
        upiTransactions={upiTransactions}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-sm overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Transaction Overview</CardTitle>
            <CardDescription>Summary of transaction status</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex gap-4 flex-wrap">
              <div className="bg-emerald-50 text-emerald-500 rounded-lg p-4 flex-1 min-w-[120px]">
                <div className="text-sm font-medium mb-1">Successful</div>
                <div className="text-2xl font-bold">₹{successfulTotal.toLocaleString('en-IN')}</div>
                <div className="text-xs text-emerald-600 mt-1">{transactions.filter(t => t.status === 'successful').length} transactions</div>
              </div>
              
              <div className="bg-blue-50 text-blue-500 rounded-lg p-4 flex-1 min-w-[120px]">
                <div className="text-sm font-medium mb-1">Processing</div>
                <div className="text-2xl font-bold">₹{processingTotal.toLocaleString('en-IN')}</div>
                <div className="text-xs text-blue-600 mt-1">{transactions.filter(t => t.status === 'processing').length} transactions</div>
              </div>
              
              <div className="bg-amber-50 text-amber-500 rounded-lg p-4 flex-1 min-w-[120px]">
                <div className="text-sm font-medium mb-1">Pending</div>
                <div className="text-2xl font-bold">₹{pendingTotal.toLocaleString('en-IN')}</div>
                <div className="text-xs text-amber-600 mt-1">{transactions.filter(t => t.status === 'pending').length} transactions</div>
              </div>
              
              <div className="bg-rose-50 text-rose-500 rounded-lg p-4 flex-1 min-w-[120px]">
                <div className="text-sm font-medium mb-1">Failed</div>
                <div className="text-2xl font-bold">₹{failedTotal.toLocaleString('en-IN')}</div>
                <div className="text-xs text-rose-600 mt-1">{transactions.filter(t => t.status === 'failed').length} transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No transaction data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6 mt-6">
        {!showUpiTransactions && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 flex-1 items-center">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm mr-2">Filter:</span>
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center ml-1">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm mr-2">Sort:</span>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {showUpiTransactions ? (
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <UpiTransactionCard 
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No UPI plugin transactions found</p>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="successful">Successful</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} onClick={() => setSelectedTransactionId(transaction.id)} className="cursor-pointer">
                      <TransactionCard {...transaction} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="successful" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'successful').map((transaction) => (
                  <div key={transaction.id} onClick={() => setSelectedTransactionId(transaction.id)} className="cursor-pointer">
                    <TransactionCard {...transaction} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="processing" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'processing').map((transaction) => (
                  <div key={transaction.id} onClick={() => setSelectedTransactionId(transaction.id)} className="cursor-pointer">
                    <TransactionCard {...transaction} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'pending').map((transaction) => (
                  <div key={transaction.id} onClick={() => setSelectedTransactionId(transaction.id)} className="cursor-pointer">
                    <TransactionCard {...transaction} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="failed" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'failed').map((transaction) => (
                  <div key={transaction.id} onClick={() => setSelectedTransactionId(transaction.id)} className="cursor-pointer">
                    <TransactionCard {...transaction} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Transactions;
