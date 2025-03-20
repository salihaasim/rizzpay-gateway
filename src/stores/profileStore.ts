
import { create } from 'zustand';

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  profile: {
    [key: string]: string;
  };
  updateProfile: (data: Partial<ProfileState>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  firstName: 'Rahul',
  lastName: 'Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  company: 'Sharma Enterprises',
  profile: {},
  updateProfile: (data) => set((state) => ({
    ...state,
    ...data,
  })),
}));
