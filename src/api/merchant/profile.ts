
// Merchant profile API functions
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

export interface MerchantProfile {
  id: string;
  businessName: string;
  businessType: string;
  contactEmail: string;
  contactPhone: string;
  apiKey?: string;
  isActive: boolean;
  verificationStatus: string;
}

export const getMerchantProfile = async (userId: string): Promise<MerchantProfile | null> => {
  try {
    const { data, error } = await supabase()
      .from('merchant_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data ? {
      id: data.id,
      businessName: data.business_name,
      businessType: data.business_type,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      apiKey: data.api_key,
      isActive: data.is_active,
      verificationStatus: data.verification_status
    } : null;
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return null;
  }
};

export const updateMerchantProfile = async (
  userId: string, 
  profileData: Partial<MerchantProfile>
): Promise<boolean> => {
  try {
    // Convert camelCase to snake_case for database
    const dbData: Record<string, any> = {};
    
    if (profileData.businessName) dbData.business_name = profileData.businessName;
    if (profileData.businessType) dbData.business_type = profileData.businessType;
    if (profileData.contactEmail) dbData.contact_email = profileData.contactEmail;
    if (profileData.contactPhone) dbData.contact_phone = profileData.contactPhone;
    
    const { error } = await supabase()
      .from('merchant_profiles')
      .update(dbData)
      .eq('id', userId);
      
    if (error) throw error;
    
    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    toast.error('Failed to update profile');
    return false;
  }
};

export const generateApiKey = async (userId: string): Promise<string | null> => {
  try {
    // Call the Supabase function to generate API key
    const { data, error } = await supabase()
      .rpc('get_or_create_api_key', {
        user_id: userId
      });
      
    if (error) throw error;
    
    if (data === 'INACTIVE_ACCOUNT') {
      toast.error('Your account is not active. Please complete KYC verification.');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error generating API key:', error);
    toast.error('Failed to generate API key');
    return null;
  }
};
