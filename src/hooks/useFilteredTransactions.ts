
import { useMemo } from 'react';
import { Transaction } from '@/stores/transactions';

export const useFilteredTransactions = (
  transactions: Transaction[],
  activeTab: string,
  searchTerm: string
): Transaction[] => {
  return useMemo(() => {
    // First filter by active tab
    let filtered = transactions;
    if (activeTab !== 'all') {
      filtered = transactions.filter(transaction => transaction.status === activeTab);
    }
    
    // Then filter by search term if provided
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        transaction =>
          transaction.id.toLowerCase().includes(search) ||
          transaction.customer.toLowerCase().includes(search) ||
          transaction.amount.toLowerCase().includes(search) ||
          transaction.status.toLowerCase().includes(search) ||
          transaction.paymentMethod.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [transactions, activeTab, searchTerm]);
};
