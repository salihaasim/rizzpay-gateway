
// This file contains the main transaction store implementation
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Transaction, TransactionStatus, PaymentMethod, TransactionState, UserRole, Wallet, PaymentProcessingState } from './types';
import { createTransactionSlice, TransactionSlice } from './transactionSlice';
import { createUserRoleSlice, UserRoleSlice } from './userRoleSlice';
import { createWalletSlice, WalletSlice } from './walletStore';

// Create the store
export const useTransactionStore = create<TransactionState>((set, get) => {
  // Create slices
  const transactionSlice = createTransactionSlice(set, get);
  const userRoleSlice = createUserRoleSlice(set, get);
  const walletSlice = createWalletSlice(set, get);
  
  return {
    // Spread transaction slice
    ...transactionSlice,
    
    // Spread user role slice
    ...userRoleSlice,
    
    // Spread wallet slice
    ...walletSlice,
    
    // Additional utility functions
    getSuccessfulTransactions: () => {
      return get().transactions.filter(
        (transaction) => transaction.status === 'successful'
      );
    },
    
    getPendingTransactions: () => {
      return get().transactions.filter(
        (transaction) => transaction.status === 'pending'
      );
    },
    
    getFailedTransactions: () => {
      return get().transactions.filter(
        (transaction) => transaction.status === 'failed'
      );
    },
    
    getRefundedTransactions: () => {
      return get().transactions.filter(
        (transaction) => transaction.status === 'refunded'
      );
    },
    
    removeTransaction: (id) => {
      set((state) => ({
        transactions: state.transactions.filter((transaction) => transaction.id !== id),
      }));
    }
  };
});

// Export types for use in other modules
export type { 
  UserRole, 
  TransactionStatus, 
  PaymentMethod,
  Transaction,
  Wallet,
  PaymentProcessingState
};

// Export from ./types to make them available
export * from './types';
