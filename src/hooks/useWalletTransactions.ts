
import { useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';

export const useWalletTransactions = (userEmail: string | null) => {
  const { transactions } = useTransactionStore();
  
  // Get recent wallet transactions for the user
  const recentWalletTransactions = useMemo(() => {
    if (!userEmail) return [];
    return transactions
      .filter(t => t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail))
      .slice(0, 5);
  }, [transactions, userEmail]);
  
  return { recentWalletTransactions };
};
