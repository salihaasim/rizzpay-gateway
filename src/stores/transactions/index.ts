
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionStore } from './types';
import { createTransactionSlice } from './transactionSlice';
import { createUserRoleSlice } from './userRoleSlice';
import { createWalletSlice } from './walletStore';

// Re-export types and utils for easy access
export * from './types';
export * from './utils';

// Create the store with appropriate initialization
export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      ...createTransactionSlice(set, get),
      ...createUserRoleSlice(set, get),
      ...createWalletSlice(set, get)
    }),
    {
      name: 'transactions-storage',
      // Use getStorage to safely handle localStorage in SSR or tests
      getStorage: () => ({
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch (e) {
            // In case localStorage is not available (e.g. in a non-browser environment like SSR)
            console.warn('LocalStorage not available:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (e) {
            console.warn('LocalStorage not available:', e);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (e) {
            console.warn('LocalStorage not available:', e);
          }
        },
      })
    }
  )
);
