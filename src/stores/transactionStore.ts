
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'successful' | 'failed' | 'pending';

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  paymentMethod: string;
  status: TransactionStatus;
  customer: string;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions] 
        })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'transactions-storage',
    }
  )
);
