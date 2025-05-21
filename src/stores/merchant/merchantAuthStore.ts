
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MerchantStore } from './types';
import { initialMerchants } from './initialData';
import { 
  createAuthActions, 
  createMerchantActions, 
  createSettingsActions 
} from './authActions';

export const useMerchantAuth = create<MerchantStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentMerchant: null,
      merchants: initialMerchants,
      loading: false,
      
      // Auth actions
      ...createAuthActions(set, get),
      
      // Merchant management actions
      ...createMerchantActions(set, get),
      
      // Settings actions
      ...createSettingsActions(set, get)
    }),
    {
      name: 'merchant-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);
