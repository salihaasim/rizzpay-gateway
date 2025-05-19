
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionStore } from './types';
import { createTransactionSlice, TransactionSlice } from './transactionSlice';
import { createUserRoleSlice, UserRoleSlice } from './userRoleSlice';
import { createWalletSlice, WalletSlice } from './walletStore';

// Re-export types and utils for easy access
export * from './types';
export * from './utils';

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      ...createTransactionSlice(set, get),
      ...createUserRoleSlice(set, get),
      ...createWalletSlice(set, get)
    }),
    {
      name: 'transactions-storage',
    }
  )
);
