
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionState } from './types';
import { createTransactionSlice } from './transactionSlice';
import { createUserRoleSlice } from './userRoleSlice';

// Storage implementation that handles JSON parsing/stringify
const customStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
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
    }),
    {
      name: 'rizzpay-transaction-store',
      storage: customStorage,
    }
  )
);
