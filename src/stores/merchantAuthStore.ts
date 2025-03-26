
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface MerchantCredentials {
  username: string;
  password: string;
  fullName: string;
}

interface MerchantAuthState {
  isAuthenticated: boolean;
  currentMerchant: MerchantCredentials | null;
  merchants: MerchantCredentials[];
  loading: boolean;
  addMerchant: (merchant: MerchantCredentials) => void;
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
          fullName: 'Demo Merchant'
        }
      ],
      loading: false,

      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant]
        }));
        toast.success('Merchant registered successfully');
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
        set({ isAuthenticated: false, currentMerchant: null });
        toast.success('Logged out successfully');
      }
    }),
    {
      name: 'merchant-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
