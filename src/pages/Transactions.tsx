
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionDetails from '@/components/TransactionDetails';
import UpiTransactionToggle from '@/components/transactions/UpiTransactionToggle';
import UpiTransactionCard from '@/components/transactions/UpiTransactionCard';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionStats from '@/components/transactions/TransactionStats';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTabsContent from '@/components/transactions/TransactionTabsContent';

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
      <TransactionHeader exportAllTransactions={exportAllTransactions} />
      
      <UpiTransactionToggle 
        showUpiTransactions={showUpiTransactions} 
        setShowUpiTransactions={setShowUpiTransactions}
        upiTransactions={upiTransactions}
      />
      
      <TransactionStats transactions={transactions} />
      
      <div className="space-y-6 mt-6">
        {!showUpiTransactions && (
          <TransactionFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
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
            
            <TransactionTabsContent 
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              onSelectTransaction={setSelectedTransactionId}
            />
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Transactions;
