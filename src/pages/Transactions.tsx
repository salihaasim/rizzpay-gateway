import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import TransactionCard from '@/components/TransactionCard';
import Navbar from '@/components/Navbar';
import { Search, Download, Filter, ArrowUpDown } from 'lucide-react';

// Mock data
const transactionsData = [
  { id: '8721', date: 'Today, 2:30 PM', amount: '₹12,500', paymentMethod: 'Google Pay', status: 'successful', customer: 'Ajay Sharma' },
  { id: '8720', date: 'Today, 11:15 AM', amount: '₹3,200', paymentMethod: 'UPI', status: 'pending', customer: 'Priya Patel' },
  { id: '8719', date: 'Yesterday, 5:45 PM', amount: '₹8,750', paymentMethod: 'Credit Card', status: 'successful', customer: 'Rahul Verma' },
  { id: '8718', date: 'Yesterday, 1:20 PM', amount: '₹950', paymentMethod: 'Google Pay', status: 'failed', customer: 'Neha Singh' },
  { id: '8717', date: '2 days ago, 9:30 AM', amount: '₹5,200', paymentMethod: 'UPI', status: 'successful', customer: 'Vikram Malhotra' },
  { id: '8716', date: '2 days ago, 8:15 AM', amount: '₹2,800', paymentMethod: 'Credit Card', status: 'successful', customer: 'Ananya Desai' },
  { id: '8715', date: '3 days ago, 7:45 PM', amount: '₹15,250', paymentMethod: 'Google Pay', status: 'successful', customer: 'Rohan Sharma' },
  { id: '8714', date: '3 days ago, 3:20 PM', amount: '₹4,750', paymentMethod: 'UPI', status: 'failed', customer: 'Meera Patel' },
] as const;

const paymentMethodData = [
  { name: 'Google Pay', value: 45, color: '#4285F4' },
  { name: 'UPI', value: 30, color: '#34A853' },
  { name: 'Credit Card', value: 15, color: '#EA4335' },
  { name: 'Debit Card', value: 10, color: '#FBBC05' },
];

const Transactions = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter transactions based on selected filter
  const filteredTransactions = transactionsData.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  }).filter(transaction => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(query) ||
      transaction.customer.toLowerCase().includes(query) ||
      transaction.amount.toLowerCase().includes(query) ||
      transaction.paymentMethod.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-20 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your payment transactions</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
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
                  <div className="text-2xl font-bold">₹42,500</div>
                  <div className="text-xs text-emerald-600 mt-1">+12.5% from last week</div>
                </div>
                
                <div className="bg-amber-50 text-amber-500 rounded-lg p-4 flex-1 min-w-[120px]">
                  <div className="text-sm font-medium mb-1">Pending</div>
                  <div className="text-2xl font-bold">₹12,200</div>
                  <div className="text-xs text-amber-600 mt-1">-3.2% from last week</div>
                </div>
                
                <div className="bg-rose-50 text-rose-500 rounded-lg p-4 flex-1 min-w-[120px]">
                  <div className="text-sm font-medium mb-1">Failed</div>
                  <div className="text-2xl font-bold">₹5,700</div>
                  <div className="text-xs text-rose-600 mt-1">+2.1% from last week</div>
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
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
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
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="successful">Successful</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} {...transaction} />
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Other tabs have same content but different filters */}
            <TabsContent value="successful" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'successful').map((transaction) => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'pending').map((transaction) => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="failed" className="mt-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'failed').map((transaction) => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
