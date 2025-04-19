import { Transaction, TransactionState } from './types';
import { useActivityLogStore } from '../activityLog';

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
  
  addTransaction: (transaction) => {
    const activityStore = useActivityLogStore.getState();
    activityStore.addActivityLog({
      activityType: transaction.walletTransactionType === 'withdrawal' ? 'payment_out' : 'payment_in',
      userId: transaction.createdBy || null,
      userEmail: transaction.customer,
      details: {
        amount: transaction.amount,
        transactionId: transaction.id,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod
      }
    });
    
    set((state) => ({ 
      transactions: [transaction, ...state.transactions] 
    }));
  },
  
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
