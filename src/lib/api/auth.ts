
import { supabase } from './supabase';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Function to change password in Supabase (if connected)
export const changePasswordSupabase = async (data: ChangePasswordData) => {
  try {
    // First, verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user?.email || '',
      password: data.currentPassword
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // If current password is correct, update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw new Error(error.message || 'Failed to change password. Please try again.');
  }
};

// Function to change password in the local storage-based auth system
export const changePassword = async (data: ChangePasswordData) => {
  try {
    // Get the current user from merchantAuthStore
    const store = useMerchantAuth.getState();
    const currentMerchant = store.currentMerchant;
    
    if (!currentMerchant) {
      throw new Error('You must be logged in to change your password');
    }
    
    // Try to change password in Supabase first (if connected)
    try {
      const supabaseResult = await changePasswordSupabase(data);
      if (supabaseResult.success) {
        // If Supabase password change was successful, also update local storage
        const success = store.changePassword(
          currentMerchant.username,
          data.currentPassword,
          data.newPassword
        );
        
        if (!success) {
          // This is an edge case where Supabase update worked but local update failed
          console.warn('Password updated in Supabase but failed in local storage');
          return { success: true, warning: 'You may need to log in again' };
        }
        
        return { success: true };
      }
    } catch (e) {
      // If there's a Supabase error, fall back to local storage
      console.log('Supabase update failed, using local storage instead:', e);
    }
    
    // If we get here, try local storage only
    const success = store.changePassword(
      currentMerchant.username,
      data.currentPassword,
      data.newPassword
    );
    
    if (!success) {
      throw new Error('Current password is incorrect');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw new Error(error.message || 'Failed to change password. Please try again.');
  }
};
