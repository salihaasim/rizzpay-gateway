
import { Transaction, TransactionState } from './types';

export interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
  getTransactionById: (id: string) => Transaction | undefined;
}

export const createTransactionSlice = (
  set: (fn: (state: TransactionState) => Partial<TransactionState>) => void,
  get: () => TransactionState
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
    
  clearTransactions: () => set((state) => ({ transactions: [] })),
  
  getTransactionById: (id) => {
    const state = get();
    return state.transactions.find(transaction => transaction.id === id);
  }
});
