
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'successful' | 'failed' | 'pending';
export type UserRole = 'admin' | 'merchant' | 'client' | null;

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  paymentMethod: string;
  status: TransactionStatus;
  customer: string;
  createdBy?: string; // To track which role created the transaction
}

interface TransactionState {
  transactions: Transaction[];
  userRole: UserRole;
  userEmail: string | null;
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      userRole: null,
      userEmail: null,
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions] 
        })),
      clearTransactions: () => set({ transactions: [] }),
      setUserRole: (role, email) => set({ userRole: role, userEmail: email }),
      clearUserData: () => set({ userRole: null, userEmail: null }),
    }),
    {
      name: 'transactions-storage',
    }
  )
);

// Helper functions to get transactions filtered by role
export const getFilteredTransactions = (state: TransactionState) => {
  const { transactions, userRole, userEmail } = state;
  
  if (userRole === 'admin') {
    return transactions; // Admin sees all transactions
  } else if (userRole === 'merchant') {
    // Merchants see transactions they created or where they are the receiver
    return transactions.filter(t => 
      t.createdBy === userEmail || 
      t.customer === userEmail
    );
  } else if (userRole === 'client') {
    // Clients only see transactions they're involved in
    return transactions.filter(t => 
      t.customer === userEmail || 
      t.createdBy === userEmail
    );
  }
  
  return []; // If no role is set, return empty array
};
