
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  profile: {
    [key: string]: string;
  };
  merchants: Merchant[];
  updateProfile: (data: Partial<ProfileState>) => void;
  addMerchant: (merchant: Omit<Merchant, 'id' | 'createdAt'>) => Merchant;
  removeMerchant: (id: string) => void;
  getMerchantByEmail: (email: string) => Merchant | undefined;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      company: 'Sharma Enterprises',
      profile: {},
      merchants: [],
      
      updateProfile: (data) => set((state) => ({
        ...state,
        ...data,
      })),
      
      addMerchant: (merchant) => {
        const newMerchant: Merchant = {
          id: `merchant_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          ...merchant
        };
        
        set((state) => ({
          merchants: [...state.merchants, newMerchant]
        }));
        
        return newMerchant;
      },
      
      removeMerchant: (id) => set((state) => ({
        merchants: state.merchants.filter(merchant => merchant.id !== id)
      })),
      
      getMerchantByEmail: (email) => {
        const state = get();
        return state.merchants.find(merchant => merchant.email === email);
      }
    }),
    {
      name: 'profile-storage',
    }
  )
);
