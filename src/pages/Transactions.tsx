
import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '@/stores/transactions';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Search, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const TransactionItem = ({ transaction }: { transaction: any }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-muted/50">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.status === 'successful' ? 'bg-green-100' : 
            transaction.status === 'failed' ? 'bg-red-100' : 
            'bg-amber-100'
          }`}>
            <span className={`text-sm font-medium ${
              transaction.status === 'successful' ? 'text-green-700' : 
              transaction.status === 'failed' ? 'text-red-700' : 
              'text-amber-700'
            }`}>
              {transaction.paymentMethod?.substring(0, 2).toUpperCase() || 'TX'}
            </span>
          </div>
        </div>
        <div>
          <div className="font-medium text-sm">
            {transaction.description || `Payment ${transaction.id.substring(0, 8)}`}
          </div>
          <div className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleString()}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{transaction.amount}</div>
        <div className={`text-xs ${
          transaction.status === 'successful' ? 'text-green-600' : 
          transaction.status === 'failed' ? 'text-red-600' : 
          'text-amber-600'
        }`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions } = useTransactionStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions based on the active tab
  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.id?.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term) ||
        t.customer?.toLowerCase().includes(term) ||
        t.amount?.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, activeTab, searchTerm]);

  const exportToExcel = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const data = filteredTransactions.map(t => ({
      'Transaction ID': t.id,
      'Date': new Date(t.date).toLocaleDateString(),
      'Time': new Date(t.date).toLocaleTimeString(),
      'Amount': t.amount,
      'Status': t.status,
      'Payment Method': t.paymentMethod,
      'Customer': t.customer || 'N/A',
      'Description': t.description || 'N/A',
      'Created By': t.createdBy || 'N/A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    
    const fileName = `RizzPay_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success(`${filteredTransactions.length} transactions exported successfully!`);
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Transactions | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">View and manage your transaction history</p>
          </div>
          
          <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={exportToExcel}
              disabled={filteredTransactions.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 border-b">
                <TabsList className="mb-0 bg-transparent">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background">All</TabsTrigger>
                  <TabsTrigger value="successful" className="data-[state=active]:bg-background">Successful</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-background">Pending</TabsTrigger>
                  <TabsTrigger value="failed" className="data-[state=active]:bg-background">Failed</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="m-0">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No transactions found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? 'Try a different search term' : 'Transactions will appear here once created'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
