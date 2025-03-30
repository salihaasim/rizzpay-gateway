
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface MerchantCredentials {
  username: string;
  password: string;
  fullName: string;
  pricing?: {
    transactionFee: number; // percentage
    fixedFee: number; // in rupees
    monthlyFee: number; // in rupees
  };
}

interface MerchantAuthState {
  isAuthenticated: boolean;
  currentMerchant: MerchantCredentials | null;
  merchants: MerchantCredentials[];
  loading: boolean;
  addMerchant: (merchant: MerchantCredentials) => void;
  updateMerchantPricing: (username: string, pricing: MerchantCredentials['pricing']) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useMerchantAuth = create<MerchantAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentMerchant: null,
      merchants: [
        // Default merchant for testing
        {
          username: 'merchant',
          password: 'password',
          fullName: 'Demo Merchant',
          pricing: {
            transactionFee: 2.5,
            fixedFee: 5,
            monthlyFee: 499
          }
        }
      ],
      loading: false,

      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant]
        }));
        toast.success('Merchant registered successfully');
      },

      updateMerchantPricing: (username, pricing) => {
        set((state) => ({
          merchants: state.merchants.map(m => 
            m.username === username ? { ...m, pricing } : m
          )
        }));
        toast.success('Merchant pricing updated successfully');
      },

      login: (username, password) => {
        const { merchants } = get();
        const merchant = merchants.find(
          m => m.username === username && m.password === password
        );

        if (merchant) {
          set({ isAuthenticated: true, currentMerchant: merchant });
          toast.success(`Welcome back, ${merchant.fullName}`);
          return true;
        }

        toast.error('Invalid credentials');
        return false;
      },

      logout: () => {
        // Optimized logout - clear only necessary state
        set({ 
          isAuthenticated: false, 
          currentMerchant: null 
        });
        toast.success('Logged out successfully');
      }
    }),
    {
      name: 'merchant-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
