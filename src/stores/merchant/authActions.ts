
import { Merchant, PricingStructure, UpiSettings } from './types';

// Authentication and merchant management actions
export const createAuthActions = (set: any, get: any) => ({
  login: (username: string, password: string) => {
    console.log("Attempting login with:", username, password);
    
    // Check for demo admin credentials
    if (username === 'rizzpay' && password === 'rizzpay123') {
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
      console.log("Merchant auth login successful");
      return true;
    }
    
    // Regular merchant authentication
    console.log("Available merchants:", get().merchants);
    const merchant = get().merchants.find(
      (m: Merchant) => m.username === username && m.password === password
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
    
    // Always redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
});

// Merchant management actions
export const createMerchantActions = (set: any, get: any) => ({
  addMerchant: (merchant: Merchant) => {
    set((state: any) => ({
      merchants: [...state.merchants, merchant]
    }));
  },
  
  updateMerchantDetails: (merchant: Partial<Merchant>) => {
    if (!get().isAuthenticated || !get().currentMerchant) return;
    
    set((state: any) => ({
      currentMerchant: {
        ...state.currentMerchant!,
        ...merchant
      }
    }));

    // Also update the merchant in the merchants array
    set((state: any) => ({
      merchants: state.merchants.map((m: Merchant) => 
        m.username === state.currentMerchant?.username 
          ? { ...m, ...merchant }
          : m
      )
    }));
  },
  
  changePassword: (username: string, currentPassword: string, newPassword: string) => {
    // Verify current password
    const merchant = get().merchants.find(
      (m: Merchant) => m.username === username && m.password === currentPassword
    );
    
    if (!merchant) return false;
    
    // Update password in merchants array
    set((state: any) => ({
      merchants: state.merchants.map((m: Merchant) => 
        m.username === username
          ? { ...m, password: newPassword }
          : m
      )
    }));
    
    // If this is the current merchant, update currentMerchant as well
    if (get().currentMerchant?.username === username) {
      set((state: any) => ({
        currentMerchant: { ...state.currentMerchant!, password: newPassword }
      }));
    }
    
    return true;
  }
});

// Settings management actions
export const createSettingsActions = (set: any, get: any) => ({
  updateMerchantPricing: (merchantUsername: string, pricing: PricingStructure) => {
    set((state: any) => ({
      merchants: state.merchants.map((merchant: Merchant) => 
        merchant.username === merchantUsername
          ? { ...merchant, pricing }
          : merchant
      )
    }));
    
    // Also update current merchant if applicable
    if (get().currentMerchant?.username === merchantUsername) {
      set((state: any) => ({
        currentMerchant: { 
          ...state.currentMerchant!, 
          pricing 
        }
      }));
    }
  },
  
  updateMerchantUpiSettings: (settings: UpiSettings) => {
    if (!get().isAuthenticated || !get().currentMerchant) return;
    
    const updatedMerchant = {
      ...get().currentMerchant,
      upiSettings: settings
    };
    
    set({ currentMerchant: updatedMerchant });
    
    // Also update in merchants array
    set((state: any) => ({
      merchants: state.merchants.map((m: Merchant) => 
        m.username === state.currentMerchant?.username 
          ? { ...m, upiSettings: settings }
          : m
      )
    }));
  }
});
