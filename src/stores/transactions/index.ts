
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionState } from './types';
import { createTransactionSlice } from './transactionSlice';
import { createUserRoleSlice } from './userRoleSlice';

// Storage implementation that handles JSON parsing/stringify
const customStorage = {
  getItem: (name: string) => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn('LocalStorage not available:', error);
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('LocalStorage not available:', error);
    }
  }
};

// Create the store with proper persist configuration
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      ...createTransactionSlice(set, get),
      ...createUserRoleSlice(set, get),
      
      // Adding missing wallet properties
      wallets: {},
      
      initializeWallet: (email: string) => {
        const state = get();
        if (!state.wallets[email]) {
          set((state) => ({
            wallets: {
              ...state.wallets,
              [email]: {
                balance: 0,
                currency: 'INR',
                transactions: []
              }
            }
          }));
        }
      },
      
      getWalletBalance: (email: string) => {
        const state = get();
        return state.wallets[email]?.balance || 0;
      },
      
      depositToWallet: (email: string, amount: number, paymentMethod: string) => {
        const state = get();
        const transactionId = `wallet_in_${Date.now()}`;
        
        // Initialize wallet if not exists
        if (!state.wallets[email]) {
          state.initializeWallet(email);
        }
        
        // Create transaction
        const transaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount: `₹${amount.toFixed(2)}`,
          paymentMethod,
          status: 'successful',
          customer: email,
          createdBy: state.userEmail || undefined,
          description: `Wallet deposit of ₹${amount}`,
          walletTransactionType: 'deposit'
        };
        
        // Add transaction to the store
        state.addTransaction(transaction);
        
        // Update wallet balance
        set((state) => ({
          wallets: {
            ...state.wallets,
            [email]: {
              ...state.wallets[email],
              balance: (state.wallets[email]?.balance || 0) + amount,
              transactions: [
                transactionId,
                ...(state.wallets[email]?.transactions || [])
              ]
            }
          }
        }));
        
        return transactionId;
      },
      
      withdrawFromWallet: (email: string, amount: number, paymentMethod: string) => {
        const state = get();
        const balance = state.getWalletBalance(email);
        
        if (amount > balance) {
          throw new Error('Insufficient funds');
        }
        
        const transactionId = `wallet_out_${Date.now()}`;
        
        // Create transaction
        const transaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount: `₹${amount.toFixed(2)}`,
          paymentMethod,
          status: 'successful',
          customer: email,
          createdBy: state.userEmail || undefined,
          description: `Wallet withdrawal of ₹${amount}`,
          walletTransactionType: 'withdrawal'
        };
        
        // Add transaction to the store
        state.addTransaction(transaction);
        
        // Update wallet balance
        set((state) => ({
          wallets: {
            ...state.wallets,
            [email]: {
              ...state.wallets[email],
              balance: state.wallets[email].balance - amount,
              transactions: [
                transactionId,
                ...(state.wallets[email]?.transactions || [])
              ]
            }
          }
        }));
        
        return transactionId;
      },
      
      transferFunds: (fromEmail: string, toEmail: string, amount: number, description?: string) => {
        const state = get();
        const balance = state.getWalletBalance(fromEmail);
        
        if (amount > balance) {
          throw new Error('Insufficient funds');
        }
        
        // Initialize wallets if not exists
        if (!state.wallets[fromEmail]) {
          state.initializeWallet(fromEmail);
        }
        if (!state.wallets[toEmail]) {
          state.initializeWallet(toEmail);
        }
        
        const transactionId = `transfer_${Date.now()}`;
        
        // Create transaction
        const transaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount: `₹${amount.toFixed(2)}`,
          paymentMethod: 'wallet_transfer',
          status: 'successful',
          customer: fromEmail,
          createdBy: state.userEmail || undefined,
          description: description || `Transfer to ${toEmail}`,
          walletTransactionType: 'transfer',
          paymentDetails: {
            recipientEmail: toEmail
          }
        };
        
        // Add transaction to the store
        state.addTransaction(transaction);
        
        // Update wallets balances
        set((state) => ({
          wallets: {
            ...state.wallets,
            [fromEmail]: {
              ...state.wallets[fromEmail],
              balance: state.wallets[fromEmail].balance - amount,
              transactions: [
                transactionId,
                ...(state.wallets[fromEmail]?.transactions || [])
              ]
            },
            [toEmail]: {
              ...state.wallets[toEmail],
              balance: (state.wallets[toEmail]?.balance || 0) + amount,
              transactions: [
                transactionId,
                ...(state.wallets[toEmail]?.transactions || [])
              ]
            }
          }
        }));
        
        return transactionId;
      }
    }),
    {
      name: 'rizzpay-transaction-store',
      storage: customStorage,
    }
  )
);

// Re-export all types from types.ts
export * from './types';
