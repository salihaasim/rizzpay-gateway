
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
  role?: 'admin' | 'merchant'; // Added role field
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
          role: 'merchant',
          pricing: {
            transactionFee: 2.5,
            fixedFee: 5,
            monthlyFee: 499
          }
        },
        // Default admin account
        {
          username: 'admin',
          password: 'admin',
          fullName: 'Admin User',
          role: 'admin'
        },
        // New admin account with requested credentials
        {
          username: 'rizzpay',
          password: 'rizzpay123',
          fullName: 'RizzPay Admin',
          role: 'admin'
        }
      ],
      loading: false,

      addMerchant: (merchant) => {
        // Set default role to merchant if not specified
        const merchantWithRole = {
          ...merchant,
          role: merchant.role || 'merchant'
        };
        
        set((state) => ({
          merchants: [...state.merchants, merchantWithRole]
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
