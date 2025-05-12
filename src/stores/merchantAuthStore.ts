
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoCredentials } from '@/components/role/roleConstants';

interface Merchant {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role?: 'admin' | 'merchant';
}

interface MerchantStore {
  isAuthenticated: boolean;
  currentMerchant: Merchant | null;
  merchants: Merchant[];
  loading: boolean;
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addMerchant: (merchant: Merchant) => void;
  updateMerchantDetails: (merchant: Partial<Merchant>) => void;
}

export const useMerchantAuth = create<MerchantStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentMerchant: null,
      merchants: [
        {
          username: 'merchant',
          password: 'password',
          fullName: 'Demo Merchant',
          role: 'merchant'
        }
      ],
      loading: true,
      
      login: (username, password) => {
        console.log("Attempting login with:", username, password);
        
        // Check for demo admin credentials
        if (username === demoCredentials.admin.username && 
            password === demoCredentials.admin.password) {
          
          console.log("Demo admin credentials match, setting admin user");
          set({
            isAuthenticated: true,
            currentMerchant: {
              username: username,
              password: password,
              fullName: 'Admin User',
              email: 'admin@rizzpay.com',
              role: 'admin'
            },
            loading: false
          });
          return true;
        }
        
        // Regular merchant authentication
        console.log("Available merchants:", get().merchants);
        const merchant = get().merchants.find(
          m => m.username === username && m.password === password
        );
        
        if (merchant) {
          console.log("Login successful for:", merchant);
          set({
            isAuthenticated: true,
            currentMerchant: merchant,
            loading: false
          });
          return true;
        }
        
        console.log("Login failed: No matching credentials found");
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          currentMerchant: null
        });
      },
      
      addMerchant: (merchant) => {
        set(state => ({
          merchants: [...state.merchants, merchant]
        }));
      },
      
      updateMerchantDetails: (merchant) => {
        if (!get().isAuthenticated || !get().currentMerchant) return;
        
        set(state => ({
          currentMerchant: {
            ...state.currentMerchant!,
            ...merchant
          }
        }));
      }
    }),
    {
      name: 'merchant-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);
