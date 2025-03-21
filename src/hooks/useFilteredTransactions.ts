
import { useMemo } from 'react';
import { Transaction } from '@/stores/transactionStore';

export const useFilteredTransactions = (
  transactions: Transaction[],
  userEmail: string | null,
  filter: string
) => {
  // Filter wallet transactions
  const walletTransactions = useMemo(() => {
    if (!userEmail) return [];
    return transactions.filter(t => t.walletTransactionType && t.customer === userEmail);
  }, [transactions, userEmail]);
  
  // Apply additional filtering
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return walletTransactions;
    return walletTransactions.filter(t => t.walletTransactionType === filter);
  }, [walletTransactions, filter]);
  
  return { walletTransactions, filteredTransactions };
};
