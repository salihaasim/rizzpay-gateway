
import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '@/stores/transactions';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import TransactionStats from '@/components/transactions/TransactionStats';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTabsContent from '@/components/transactions/TransactionTabsContent';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import UpiTransactionToggle from '@/components/transactions/UpiTransactionToggle';

const Transactions = () => {
  const { transactions } = useTransactionStore();
  const [activeTab, setActiveTab] = useState('all');
  const [showUpiTransactions, setShowUpiTransactions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filter, setFilter] = useState('all');
  
  // Get filtered transactions based on active tab and search term
  const filteredTransactions = useFilteredTransactions(transactions, activeTab, searchTerm);
  
  // Get UPI transactions for the special UPI view
  const upiTransactions = transactions.filter(
    transaction => 
      transaction.paymentMethod === 'upi' || 
      transaction.paymentMethod === 'upi_manual'
  );
  
  // Stats for the current filtered transactions
  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    const amount = transaction.rawAmount || parseFloat(transaction.amount.replace(/[^\d.-]/g, '')) || 0;
    if (transaction.status === 'successful') {
      return sum + amount;
    }
    return sum;
  }, 0);
  
  // Count by payment method
  const paymentMethodCount = filteredTransactions.reduce((acc, transaction) => {
    const method = transaction.paymentMethod;
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Simple percentage calculation
  const calculatePercentage = (count: number) => {
    return filteredTransactions.length > 0 
      ? Math.round((count / filteredTransactions.length) * 100) 
      : 0;
  };
  
  // Handle sorting transactions
  const sortedTransactions = React.useMemo(() => {
    const displayTransactions = showUpiTransactions ? upiTransactions : filteredTransactions;
    
    return [...displayTransactions].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        const amountA = a.rawAmount || parseFloat(a.amount.replace(/[^\d.-]/g, '')) || 0;
        const amountB = b.rawAmount || parseFloat(b.amount.replace(/[^\d.-]/g, '')) || 0;
        return amountB - amountA;
      } else if (sortBy === 'customer') {
        return a.customer.localeCompare(b.customer);
      }
      return 0;
    });
  }, [filteredTransactions, upiTransactions, showUpiTransactions, sortBy]);

  const handleExportTransactions = () => {
    // Implementation for exporting transactions
    console.log('Export transactions');
  };
  
  const handleSelectTransaction = (id: string) => {
    // Implementation for selecting a transaction
    console.log('Selected transaction:', id);
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Transactions | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-screen-xl mx-auto p-4 md:p-6">
        <TransactionHeader 
          totalAmount={totalAmount}
          transactionCount={filteredTransactions.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          exportAllTransactions={handleExportTransactions}
        />
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-3 space-y-6">
            <TransactionStats 
              transactions={filteredTransactions}
              paymentMethodCount={paymentMethodCount}
              calculatePercentage={calculatePercentage}
            />
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionFilters 
                  searchQuery={searchTerm}
                  setSearchQuery={setSearchTerm}
                  filter={filter}
                  setFilter={setFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-9">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      {filteredTransactions.length} transactions found
                    </CardDescription>
                  </div>
                  
                  <UpiTransactionToggle 
                    isUpiView={false}
                    setIsUpiView={() => {}}
                    totalUpiTransactions={upiTransactions.length}
                    showUpiTransactions={showUpiTransactions}
                    setShowUpiTransactions={setShowUpiTransactions}
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="successful">Successful</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                  </TabsList>
                  
                  <TransactionTabsContent 
                    transactions={sortedTransactions}
                    isUpiView={showUpiTransactions}
                    onSelectTransaction={handleSelectTransaction}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Transactions;
