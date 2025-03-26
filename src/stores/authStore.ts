
import { create } from 'zustand';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { persist } from 'zustand/middleware';

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

// Create the store with persistence to prevent losing auth state on page refresh
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: true,
      
      // Check authentication status
      checkAuth: async () => {
        try {
          set({ loading: true });
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
          set({ loading: true });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            set({ loading: false });
            toast.error(error.message);
            return { error };
          }
          
          set({ isAuthenticated: true, user: data.user, loading: false });
          toast.success(`Welcome back, ${data.user?.email}`);
          return { error: null };
        } catch (error) {
          set({ loading: false });
          console.error('Login error:', error);
          toast.error('Login failed. Please try again.');
          return { error };
        }
      },
      
      // Register method
      register: async (email, password, fullName) => {
        try {
          set({ loading: true });
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
            set({ loading: false });
            toast.error(error.message);
            return { error };
          }
          
          set({ loading: false });
          toast.success('Registration successful! Please check your email to verify your account.');
          return { error: null };
        } catch (error) {
          set({ loading: false });
          console.error('Registration error:', error);
          toast.error('Registration failed. Please try again.');
          return { error };
        }
      },
      
      // Logout method
      logout: async () => {
        try {
          set({ loading: true });
          await supabase.auth.signOut();
          set({ isAuthenticated: false, user: null, loading: false });
          toast.success('You have been logged out');
        } catch (error) {
          set({ loading: false });
          console.error('Logout error:', error);
          toast.error('Logout failed. Please try again.');
        }
      },
    }),
    {
      name: 'auth-storage', // name for the storage
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);

// Initialize auth check with proper error handling
if (typeof window !== 'undefined') {
  // Delay to ensure DOM is fully loaded
  setTimeout(() => {
    useAuth.getState().checkAuth().catch(error => {
      console.error('Failed to check authentication status:', error);
    });
  }, 200);
}
