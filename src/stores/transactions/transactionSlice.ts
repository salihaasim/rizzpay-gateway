
import { Transaction, TransactionState } from './types';

export interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
}

export const createTransactionSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
): TransactionSlice => ({
  transactions: [],
  
  addTransaction: (transaction) => 
    set((state) => ({ 
      transactions: [transaction, ...state.transactions] 
    })),
    
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...updates } 
          : transaction
      )
    })),
    
  clearTransactions: () => set({ transactions: [] })
});
