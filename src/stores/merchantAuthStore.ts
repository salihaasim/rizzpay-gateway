
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface MerchantCredentials {
  id?: string; // Added ID field to fix type errors
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
  changePassword: (username: string, currentPassword: string, newPassword: string) => boolean;
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
            transactionFee: 1.0, // Updated to 1.0% as requested
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
          role: merchant.role || 'merchant',
          // Set default pricing for new merchants if not specified
          pricing: merchant.pricing || {
            transactionFee: 1.0, // Default 1.0% transaction fee
            fixedFee: 5,
            monthlyFee: 499
          }
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
        
        console.log("Attempting login with:", username, password);
        console.log("Available merchants:", merchants);
        
        const merchant = merchants.find(
          m => m.username === username && m.password === password
        );

        if (merchant) {
          console.log("Login successful for:", merchant);
          // Update state immediately on successful login
          set({ 
            isAuthenticated: true, 
            currentMerchant: merchant,
            loading: false
          });
          toast.success(`Welcome back, ${merchant.fullName}`);
          return true;
        }

        console.log("Login failed: No matching credentials found");
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
      },
      
      changePassword: (username, currentPassword, newPassword) => {
        const { merchants } = get();
        const merchantIndex = merchants.findIndex(
          m => m.username === username && m.password === currentPassword
        );
        
        if (merchantIndex === -1) {
          toast.error('Current password is incorrect');
          return false;
        }
        
        set((state) => ({
          merchants: state.merchants.map((m, index) => 
            index === merchantIndex ? { ...m, password: newPassword } : m
          )
        }));
        
        toast.success('Password changed successfully');
        return true;
      }
    }),
    {
      name: 'merchant-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentMerchant: state.currentMerchant,
        merchants: state.merchants
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Store rehydrated successfully");
        }
      }
    }
  )
);
