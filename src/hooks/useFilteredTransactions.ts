
import { useMemo } from 'react';
import { Transaction } from '@/stores/transactionStore';

export const useFilteredTransactions = (
  transactions: Transaction[],
  filter: string,
  searchTerm: string
): Transaction[] => {
  // First filter by status (if specified)
  const statusFiltered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.status === filter);
  }, [transactions, filter]);
  
  // Then apply search term filtering
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return statusFiltered;
    
    const searchLower = searchTerm.toLowerCase();
    return statusFiltered.filter(t => 
      t.id.toLowerCase().includes(searchLower) || 
      t.customer.toLowerCase().includes(searchLower) ||
      t.amount.toLowerCase().includes(searchLower) ||
      t.paymentMethod.toLowerCase().includes(searchLower) ||
      (t.description && t.description.toLowerCase().includes(searchLower)) ||
      (t.customerEmail && t.customerEmail.toLowerCase().includes(searchLower))
    );
  }, [statusFiltered, searchTerm]);
  
  return filteredTransactions;
};
