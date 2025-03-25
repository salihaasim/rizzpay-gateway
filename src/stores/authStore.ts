
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// Define the store state type
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create the store
export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  
  // Check authentication status
  checkAuth: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({ isAuthenticated: true, user: userData.user, loading: false });
      } else {
        set({ isAuthenticated: false, user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
  
  // Login method
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      set({ isAuthenticated: true, user: data.user });
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  },
  
  // Register method
  register: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        return { error };
      }
      
      // Note: User may need to verify email depending on Supabase settings
      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error };
    }
  },
  
  // Logout method
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));

// Initialize auth check
if (typeof window !== 'undefined') {
  useAuth.getState().checkAuth();
}
