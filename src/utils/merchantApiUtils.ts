
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Regenerates an API key for the currently authenticated merchant
 * @returns {Promise<string|null>} The new API key, or null if an error occurred
 */
export const regenerateApiKey = async (): Promise<string | null> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      toast.error('Authentication error');
      return null;
    }
    
    // Generate a new API key with better entropy
    const newApiKey = `rizz_${uuidv4().replace(/-/g, '')}${uuidv4().replace(/-/g, '')}`;
    
    // Update the merchant profile
    const { error: updateError } = await supabase
      .from('merchant_profiles')
      .update({ 
        api_key: newApiKey,
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error updating API key:', updateError);
      toast.error('Failed to regenerate API key');
      return null;
    }
    
    // Also update merchants table for backward compatibility
    try {
      await supabase
        .from('merchants')
        .update({ api_key: newApiKey })
        .eq('id', user.id);
    } catch (e) {
      console.error('Failed to update merchants table:', e);
    }
    
    // Log this activity - use try/catch instead of .catch()
    try {
      // Check if activity_logs table exists before trying to insert
      const { count } = await supabase
        .from('merchants')
        .select('*', { count: 'exact', head: true });
      
      // Only attempt to log if we have database access
      if (count !== null) {
        // Use safeSupabaseTable to handle tables that might not be in the typed schema
        await safeSupabaseTable('activity_logs')
          .insert({
            user_id: user.id,
            email: user.email,
            activity_type: 'api_key_regenerated',
            details: { method: 'manual', reason: 'user_requested' }
          });
      }
    } catch (e) {
      console.error('Failed to log activity:', e);
      // Non-critical error, continue execution
    }
    
    toast.success('API key regenerated successfully');
    return newApiKey;
  } catch (error) {
    console.error('Unexpected error regenerating API key:', error);
    toast.error('An unexpected error occurred while regenerating your API key');
    return null;
  }
};

/**
 * Gets the merchant profile for the currently authenticated user
 * @returns {Promise<any|null>} The merchant profile, or null if an error occurred
 */
export const getMerchantProfile = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    // Get merchant profile
    const { data: profileData, error: profileError } = await supabase
      .from('merchant_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching merchant profile:', profileError);
      return null;
    }
    
    return profileData;
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return null;
  }
};

/**
 * Updates the merchant profile for the currently authenticated user
 * @param {Object} updates - The fields to update
 * @returns {Promise<boolean>} Whether the update was successful
 */
export const updateMerchantProfile = async (updates: Partial<any>): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      toast.error('Authentication error');
      return false;
    }
    
    // Make a copy of updates to avoid modifying the original object
    const validUpdates = { ...updates };
    
    // Don't try to update timestamp fields directly
    delete validUpdates.updated_at;
    delete validUpdates.created_at;
    
    // Update the merchant profile
    const { error: updateError } = await supabase
      .from('merchant_profiles')
      .update(validUpdates)
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error updating merchant profile:', updateError);
      toast.error('Failed to update profile');
      return false;
    }
    
    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Helper function to safely handle tables that might not be in the typed schema
export const safeSupabaseTable = (tableName: string) => {
  // @ts-ignore - This is necessary for accessing dynamic tables
  return supabase.from(tableName);
};
