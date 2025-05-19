
import { create } from 'zustand';
import { TransactionState, Transaction, UserRole, Wallet } from './types';

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initialize the transaction store with default values
export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  filters: {
    status: null,
    paymentMethod: null,
    dateRange: {
      from: null,
      to: null,
    },
    searchQuery: '',
  },
  wallets: {},
  activeWallet: null,
  userRole: null,
  userEmail: null,
  isLoading: false,
  error: null,

  // Add a new transaction to the store
  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      filteredTransactions: [transaction, ...state.filteredTransactions],
    }));
  },

  // Update an existing transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => {
    set((state) => {
      const updatedTransactions = state.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      );
      
      const updatedFilteredTransactions = state.filteredTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      );
      
      return {
        transactions: updatedTransactions,
        filteredTransactions: updatedFilteredTransactions,
      };
    });
  },

  // Set all transactions
  setTransactions: (transactions: Transaction[]) => {
    set(() => ({
      transactions,
      filteredTransactions: transactions,
    }));
  },

  // Update filters and apply them to transactions
  setFilters: (filters) => {
    set((state) => {
      const newFilters = { ...state.filters, ...filters };
      
      // Apply filters to transactions
      let filtered = [...state.transactions];
      
      if (newFilters.status) {
        filtered = filtered.filter((t) => t.status === newFilters.status);
      }
      
      if (newFilters.paymentMethod) {
        filtered = filtered.filter((t) => t.paymentMethod === newFilters.paymentMethod);
      }
      
      if (newFilters.dateRange.from) {
        filtered = filtered.filter(
          (t) => new Date(t.date) >= (newFilters.dateRange.from as Date)
        );
      }
      
      if (newFilters.dateRange.to) {
        filtered = filtered.filter(
          (t) => new Date(t.date) <= (newFilters.dateRange.to as Date)
        );
      }
      
      if (newFilters.searchQuery) {
        const query = newFilters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.customer.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        );
      }
      
      return {
        filters: newFilters,
        filteredTransactions: filtered,
      };
    });
  },

  // Reset filters to default values
  resetFilters: () => {
    set((state) => ({
      filters: {
        status: null,
        paymentMethod: null,
        dateRange: {
          from: null,
          to: null,
        },
        searchQuery: '',
      },
      filteredTransactions: state.transactions,
    }));
  },

  // Set the current user's role
  setUserRole: (role, email) => {
    set({ userRole: role, userEmail: email });
    
    if (role && email) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Initialize wallet for the user if it doesn't exist
      const store = get();
      store.initializeWallet(email);
    }
  },

  // Clear user data when logging out
  clearUserData: () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    set({ userRole: null, userEmail: null });
  },

  // Reset user role (used for logout)
  resetUserRole: () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    set({ userRole: null, userEmail: null, activeWallet: null });
  },

  // Check if the user is authenticated
  isAuthenticated: () => {
    const state = get();
    return !!state.userRole && !!state.userEmail;
  },

  // Initialize a wallet for a user
  initializeWallet: (owner: string) => {
    set((state) => {
      if (state.wallets[owner]) {
        // Wallet already exists for this user
        return state;
      }
      
      // Create a new wallet for the user
      return {
        wallets: {
          ...state.wallets,
          [owner]: {
            id: generateId(),
            owner,
            balance: 0,
            transactions: []
          }
        },
        activeWallet: state.activeWallet || owner,
      };
    });
  },
  
  // Add funds to a wallet
  depositToWallet: (owner: string, amount: number, description: string, paymentDetails = {}) => {
    const state = get();
    
    // Initialize wallet if it doesn't exist
    if (!state.wallets[owner]) {
      state.initializeWallet(owner);
    }
    
    const transactionId = generateId();
    const now = new Date();
    
    // Create the transaction
    const transaction: Transaction = {
      id: transactionId,
      date: now.toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      customer: owner,
      status: 'successful',
      paymentMethod: 'wallet',
      walletTransactionType: 'deposit',
      createdBy: owner,
      paymentDetails: {
        ...paymentDetails,
        walletId: state.wallets[owner].id,
      }
    };
    
    // Add the transaction to the list
    state.addTransaction(transaction);
    
    // Update wallet balance
    set((state) => ({
      wallets: {
        ...state.wallets,
        [owner]: {
          ...state.wallets[owner],
          balance: state.wallets[owner].balance + amount,
          transactions: [transaction, ...state.wallets[owner].transactions]
        }
      }
    }));
    
    return transactionId;
  },
  
  // Withdraw funds from a wallet
  withdrawFromWallet: (owner: string, amount: number, description: string) => {
    const state = get();
    
    // Check if wallet exists
    if (!state.wallets[owner]) {
      console.error(`Wallet does not exist for ${owner}`);
      return false;
    }
    
    // Check if sufficient funds
    if (state.wallets[owner].balance < amount) {
      console.error('Insufficient funds');
      return false;
    }
    
    const transactionId = generateId();
    const now = new Date();
    
    // Create the transaction
    const transaction: Transaction = {
      id: transactionId,
      date: now.toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      customer: owner,
      status: 'successful',
      paymentMethod: 'wallet',
      walletTransactionType: 'withdrawal',
      createdBy: owner,
      paymentDetails: {
        walletId: state.wallets[owner].id,
      }
    };
    
    // Add the transaction
    state.addTransaction(transaction);
    
    // Update wallet balance
    set((state) => ({
      wallets: {
        ...state.wallets,
        [owner]: {
          ...state.wallets[owner],
          balance: state.wallets[owner].balance - amount,
          transactions: [transaction, ...state.wallets[owner].transactions]
        }
      }
    }));
    
    return true;
  },
  
  // Get the balance for a specific wallet
  getWalletBalance: (owner: string) => {
    const state = get();
    if (!state.wallets[owner]) {
      state.initializeWallet(owner);
      return 0;
    }
    return state.wallets[owner].balance;
  },
  
  // Transfer funds between wallets
  transferFunds: (fromWalletId: string, toWalletId: string, amount: number, description: string) => {
    const state = get();
    
    if (!state.wallets[fromWalletId]) {
      console.error(`Source wallet ${fromWalletId} does not exist`);
      return false;
    }
    
    if (!state.wallets[toWalletId]) {
      console.error(`Destination wallet ${toWalletId} does not exist`);
      return false;
    }
    
    if (state.wallets[fromWalletId].balance < amount) {
      console.error('Insufficient funds for transfer');
      return false;
    }
    
    const transactionId = generateId();
    const now = new Date();
    
    // Create the outgoing transaction
    const outgoingTx: Transaction = {
      id: `${transactionId}-out`,
      date: now.toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      customer: toWalletId, // The recipient
      status: 'successful',
      paymentMethod: 'wallet',
      walletTransactionType: 'transfer_out',
      description: description || `Transfer to ${toWalletId}`,
      createdBy: fromWalletId,
      paymentDetails: {
        walletId: state.wallets[fromWalletId].id,
      }
    };
    
    // Create the incoming transaction
    const incomingTx: Transaction = {
      id: `${transactionId}-in`,
      date: now.toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      customer: fromWalletId, // The sender
      status: 'successful',
      paymentMethod: 'wallet',
      walletTransactionType: 'transfer_in',
      description: description || `Transfer from ${fromWalletId}`,
      createdBy: fromWalletId,
      paymentDetails: {
        walletId: state.wallets[toWalletId].id,
      }
    };
    
    // Add transactions
    state.addTransaction(outgoingTx);
    state.addTransaction(incomingTx);
    
    // Update wallet balances
    set((state) => ({
      wallets: {
        ...state.wallets,
        [fromWalletId]: {
          ...state.wallets[fromWalletId],
          balance: state.wallets[fromWalletId].balance - amount,
          transactions: [outgoingTx, ...state.wallets[fromWalletId].transactions]
        },
        [toWalletId]: {
          ...state.wallets[toWalletId],
          balance: state.wallets[toWalletId].balance + amount,
          transactions: [incomingTx, ...state.wallets[toWalletId].transactions]
        }
      }
    }));
    
    return true;
  }
}));
