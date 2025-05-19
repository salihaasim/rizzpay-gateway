
import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '@/stores/transactions';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, Tab, Tabs } from '@/components/ui/tabs';
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
        />
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-3 space-y-6">
            <TransactionStats 
              transactions={filteredTransactions}
              paymentMethodCount={paymentMethodCount}
              calculatePercentage={calculatePercentage}
            />
            
            <TransactionFilters 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              count={filteredTransactions.length}
            />
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
                    isUpiView={showUpiTransactions}
                    setIsUpiView={setShowUpiTransactions}
                    totalUpiTransactions={upiTransactions.length}
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <TransactionTabsContent 
                  transactions={showUpiTransactions ? upiTransactions : filteredTransactions}
                  isUpiView={showUpiTransactions}
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
