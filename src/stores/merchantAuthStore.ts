import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoCredentials } from '@/components/role/roleConstants';

// Interface for bank accounts
interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isPrimary: boolean;
}

// Interface for UPI settings
interface UpiSettings {
  upiId: string;
  name: string;
  enabled: boolean;
  allowManualVerification: boolean;
  customWebhookUrl?: string;
}

// Interface for pricing structure
interface PricingStructure {
  transactionFee: number;
  fixedFee: number;
  monthlyFee: number;
}

interface Merchant {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role?: 'admin' | 'merchant';
  id?: string;
  upiSettings?: UpiSettings;
  bankAccounts?: BankAccount[];
  pricing?: PricingStructure;
  apiKey?: string;
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
  changePassword: (username: string, currentPassword: string, newPassword: string) => boolean;
  updateMerchantPricing: (merchantUsername: string, pricing: PricingStructure) => void;
  updateMerchantUpiSettings: (settings: UpiSettings) => void;
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
          role: 'merchant',
          id: 'merchant-001',
          upiSettings: {
            upiId: 'merchant@rizzpay',
            name: 'Demo Merchant',
            enabled: true,
            allowManualVerification: true
          },
          bankAccounts: [],
          pricing: {
            transactionFee: 1.0,
            fixedFee: 5,
            monthlyFee: 499
          },
          apiKey: 'rizz_api_key_demo_merchant'
        }
      ],
      loading: false,
      
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
              role: 'admin',
              id: 'admin-001',
              apiKey: 'rizz_api_key_admin'
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
        
        // Redirect to home page after logout
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
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

        // Also update the merchant in the merchants array
        set(state => ({
          merchants: state.merchants.map(m => 
            m.username === state.currentMerchant?.username 
              ? { ...m, ...merchant }
              : m
          )
        }));
      },
      
      changePassword: (username, currentPassword, newPassword) => {
        // Verify current password
        const merchant = get().merchants.find(
          m => m.username === username && m.password === currentPassword
        );
        
        if (!merchant) return false;
        
        // Update password in merchants array
        set(state => ({
          merchants: state.merchants.map(m => 
            m.username === username
              ? { ...m, password: newPassword }
              : m
          )
        }));
        
        // If this is the current merchant, update currentMerchant as well
        if (get().currentMerchant?.username === username) {
          set(state => ({
            currentMerchant: { ...state.currentMerchant!, password: newPassword }
          }));
        }
        
        return true;
      },
      
      updateMerchantPricing: (merchantUsername, pricing) => {
        set(state => ({
          merchants: state.merchants.map(merchant => 
            merchant.username === merchantUsername
              ? { ...merchant, pricing }
              : merchant
          )
        }));
        
        // Also update current merchant if applicable
        if (get().currentMerchant?.username === merchantUsername) {
          set(state => ({
            currentMerchant: { 
              ...state.currentMerchant!, 
              pricing 
            }
          }));
        }
      },
      
      updateMerchantUpiSettings: (settings) => {
        if (!get().isAuthenticated || !get().currentMerchant) return;
        
        const updatedMerchant = {
          ...get().currentMerchant,
          upiSettings: settings
        };
        
        set({ currentMerchant: updatedMerchant });
        
        // Also update in merchants array
        set(state => ({
          merchants: state.merchants.map(m => 
            m.username === state.currentMerchant?.username 
              ? { ...m, upiSettings: settings }
              : m
          )
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
