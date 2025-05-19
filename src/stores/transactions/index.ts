// This file contains the main transaction store implementation
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
  Transaction,
  TransactionState,
  TransactionStatus,
  PaymentProcessingState,
  PaymentMethod,
  PaymentDetails,
  WalletTransactionType
} from './types';

interface Wallet {
  id: string;
  balance: number;
  transactions: Transaction[];
  owner: string;
}

// Create the store
export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  wallets: {},
  userRole: null,
  userEmail: null,
  
  setUserRole: (role, email) => {
    set({ userRole: role, userEmail: email });
    
    // Initialize wallet if it doesn't exist
    if (email && !get().wallets[email]) {
      get().initializeWallet(email);
    }
  },
  
  resetUserRole: () => {
    set({ userRole: null, userEmail: null });
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
  },
  
  clearUserData: () => {
    set({ transactions: [], userRole: null, userEmail: null });
  },
  
  isAuthenticated: () => {
    return get().userEmail !== null && get().userRole !== null;
  },
  
  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },
  
  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((transaction) => 
        transaction.id === id ? { ...transaction, ...updates } : transaction
      ),
    }));
  },
  
  clearTransactions: () => {
    set({ transactions: [] });
  },
  
  // Wallet functionality
  initializeWallet: (email) => {
    set((state) => {
      if (state.wallets[email]) return state;
      
      return {
        wallets: {
          ...state.wallets,
          [email]: {
            balance: 0,
            currency: 'INR',
            transactions: []
          }
        }
      };
    });
  },
  
  getWalletBalance: (email) => {
    const wallet = get().wallets[email];
    return wallet ? wallet.balance : 0;
  },
  
  depositToWallet: (email, amount, paymentMethod) => {
    const transaction: Transaction = {
      id: `deposit_${uuidv4().substring(0, 8)}`,
      date: new Date().toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      paymentMethod,
      status: 'successful',
      customer: email,
      createdBy: email,
      description: 'Wallet deposit',
      processingState: 'completed',
      walletTransactionType: 'deposit',
      rawAmount: amount
    };
    
    // Add transaction to store
    get().addTransaction(transaction);
    
    // Update wallet balance
    set((state) => {
      const wallet = state.wallets[email] || { balance: 0, currency: 'INR', transactions: [] };
      
      return {
        wallets: {
          ...state.wallets,
          [email]: {
            ...wallet,
            balance: wallet.balance + amount
          }
        }
      };
    });
    
    return transaction.id;
  },
  
  withdrawFromWallet: (email, amount, paymentMethod) => {
    const wallet = get().wallets[email];
    
    if (!wallet) {
      toast.error('Wallet not found');
      return '';
    }
    
    if (wallet.balance < amount) {
      toast.error('Insufficient wallet balance');
      return '';
    }
    
    const transaction: Transaction = {
      id: `withdraw_${uuidv4().substring(0, 8)}`,
      date: new Date().toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      paymentMethod,
      status: 'successful',
      customer: email,
      createdBy: email,
      description: 'Wallet withdrawal',
      processingState: 'completed',
      walletTransactionType: 'withdrawal',
      rawAmount: amount
    };
    
    // Add transaction to store
    get().addTransaction(transaction);
    
    // Update wallet balance
    set((state) => {
      return {
        wallets: {
          ...state.wallets,
          [email]: {
            ...wallet,
            balance: wallet.balance - amount
          }
        }
      };
    });
    
    return transaction.id;
  },
  
  transferFunds: (fromEmail, toEmail, amount, description = 'Fund transfer') => {
    const fromWallet = get().wallets[fromEmail];
    
    if (!fromWallet) {
      toast.error('Source wallet not found');
      return '';
    }
    
    if (fromWallet.balance < amount) {
      toast.error('Insufficient wallet balance');
      return '';
    }
    
    // Create transactions
    const transactionId = `transfer_${uuidv4().substring(0, 8)}`;
    const senderTransaction: Transaction = {
      id: `${transactionId}_out`,
      date: new Date().toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      paymentMethod: 'wallet',
      status: 'successful',
      customer: toEmail,
      createdBy: fromEmail,
      description: `Transfer to ${toEmail}: ${description}`,
      processingState: 'completed',
      walletTransactionType: 'transfer',
      rawAmount: amount
    };
    
    const receiverTransaction: Transaction = {
      id: `${transactionId}_in`,
      date: new Date().toISOString(),
      amount: `₹${amount.toFixed(2)}`,
      paymentMethod: 'wallet',
      status: 'successful',
      customer: fromEmail,
      createdBy: fromEmail,
      description: `Transfer from ${fromEmail}: ${description}`,
      processingState: 'completed',
      walletTransactionType: 'transfer',
      rawAmount: amount
    };
    
    // Add transactions to store
    get().addTransaction(senderTransaction);
    get().addTransaction(receiverTransaction);
    
    // Update wallets
    set((state) => {
      // Initialize receiver wallet if it doesn't exist
      if (!state.wallets[toEmail]) {
        get().initializeWallet(toEmail);
      }
      
      const toWallet = state.wallets[toEmail] || { balance: 0, currency: 'INR', transactions: [] };
      
      return {
        wallets: {
          ...state.wallets,
          [fromEmail]: {
            ...fromWallet,
            balance: fromWallet.balance - amount
          },
          [toEmail]: {
            ...toWallet,
            balance: toWallet.balance + amount
          }
        }
      };
    });
    
    return transactionId;
  }
}));

// Export types from the types file
export * from './types';
