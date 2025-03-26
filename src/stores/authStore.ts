
import { create } from 'zustand';
import { toast } from 'sonner';
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
        console.log('User authenticated:', userData.user.email);
      } else {
        set({ isAuthenticated: false, user: null, loading: false });
        console.log('No active session found');
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
        toast.error(error.message);
        return { error };
      }
      
      set({ isAuthenticated: true, user: data.user });
      toast.success(`Welcome back, ${data.user?.email}`);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
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
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return { error };
    }
  },
  
  // Logout method
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
      toast.success('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  },
}));

// Initialize auth check
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useAuth.getState().checkAuth();
  }, 100);
}
