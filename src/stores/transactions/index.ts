
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransactionState, Transaction, PaymentMethod } from './types';
import { generateRandomTransaction } from './utils';
import { createTransactionSlice } from './transactionSlice';
import { createUserRoleSlice } from './userRoleSlice';

// Initial state
const initialState: Partial<TransactionState> = {
  transactions: [],
  filteredTransactions: [],
  filters: {
    status: null,
    paymentMethod: null,
    dateRange: {
      from: null,
      to: null
    },
    searchQuery: ''
  },
  wallets: {},
  activeWallet: null,
  userRole: null,
  userEmail: null,
  isLoading: false,
  error: null
};

// Create the store with middleware
export const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => ({
      ...initialState as TransactionState,
      
      // Add a new transaction
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions]
        }));
      },
      
      // Update an existing transaction
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }));
      },
      
      // Set all transactions
      setTransactions: (transactions) => {
        set({
          transactions,
          filteredTransactions: transactions
        });
      },
      
      // Set filters
      setFilters: (filters) => {
        set((state) => {
          const newFilters = {
            ...state.filters,
            ...filters
          };
          
          // Apply filters
          let filtered = [...state.transactions];
          
          if (newFilters.status) {
            filtered = filtered.filter(t => t.status === newFilters.status);
          }
          
          if (newFilters.paymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === newFilters.paymentMethod as PaymentMethod);
          }
          
          if (newFilters.dateRange.from) {
            filtered = filtered.filter(t => new Date(t.date) >= newFilters.dateRange.from!);
          }
          
          if (newFilters.dateRange.to) {
            filtered = filtered.filter(t => new Date(t.date) <= newFilters.dateRange.to!);
          }
          
          if (newFilters.searchQuery) {
            const query = newFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
              t.id.toLowerCase().includes(query) ||
              t.customer.toLowerCase().includes(query) ||
              (t.customerEmail && t.customerEmail.toLowerCase().includes(query)) ||
              t.amount.includes(query)
            );
          }
          
          return {
            filters: newFilters,
            filteredTransactions: filtered
          };
        });
      },
      
      // Reset filters
      resetFilters: () => {
        set((state) => ({
          filters: {
            status: null,
            paymentMethod: null,
            dateRange: {
              from: null,
              to: null
            },
            searchQuery: ''
          },
          filteredTransactions: state.transactions
        }));
      },
      
      // Set user role
      setUserRole: (role, email) => set({ 
        userRole: role,
        userEmail: email 
      }),
  
      // Clear user data
      clearUserData: () => set({ 
        userRole: null,
        userEmail: null 
      }),
  
      // Reset user role to null
      resetUserRole: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        set({ 
          userRole: null,
          userEmail: null 
        });
      },
  
      // Check if user is authenticated
      isAuthenticated: () => {
        const state = get();
        return state.userEmail !== null && state.userRole !== null;
      },
      
      // Transfer funds between wallets
      transferFunds: (fromWalletId, toWalletId, amount, description) => {
        const state = get();
        const fromWallet = state.wallets[fromWalletId];
        const toWallet = state.wallets[toWalletId];
        
        if (!fromWallet || !toWallet) {
          return false;
        }
        
        if (fromWallet.balance < amount) {
          return false;
        }
        
        const transferDate = new Date().toISOString();
        const transferId = `T-${Math.random().toString(36).substring(2, 10)}`;
        
        const debitTransaction: Transaction = {
          id: `${transferId}-D`,
          date: transferDate,
          amount: `-₹${amount.toFixed(2)}`,
          customer: `Transfer to ${toWallet.owner}`,
          status: 'successful',
          paymentMethod: 'wallet',
          description: description || 'Wallet transfer',
          paymentDetails: {}
        };
        
        const creditTransaction: Transaction = {
          id: `${transferId}-C`,
          date: transferDate,
          amount: `₹${amount.toFixed(2)}`,
          customer: `Transfer from ${fromWallet.owner}`,
          status: 'successful',
          paymentMethod: 'wallet',
          description: description || 'Wallet transfer',
          paymentDetails: {}
        };
        
        set((state) => ({
          wallets: {
            ...state.wallets,
            [fromWalletId]: {
              ...fromWallet,
              balance: fromWallet.balance - amount,
              transactions: [debitTransaction, ...fromWallet.transactions]
            },
            [toWalletId]: {
              ...toWallet,
              balance: toWallet.balance + amount,
              transactions: [creditTransaction, ...toWallet.transactions]
            }
          }
        }));
        
        return true;
      }
    }),
    { name: 'transaction-store' }
  )
);

// Add some initial transactions for testing
const initializeStore = () => {
  const { addTransaction } = useTransactionStore.getState();
  
  // Generate 20 random transactions
  for (let i = 0; i < 20; i++) {
    addTransaction(generateRandomTransaction());
  }
};

// Run initialization if needed (for demo/testing)
if (process.env.NODE_ENV === 'development' && useTransactionStore.getState().transactions.length === 0) {
  initializeStore();
}

export * from './types';
