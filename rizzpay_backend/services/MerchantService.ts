
import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface MerchantProfile {
  id?: string;
  business_name: string;
  business_type: string;
  contact_email: string;
  contact_phone: string;
  business_address: string;
  pan_number: string;
  gst_number?: string;
  verification_status?: string;
  is_active?: boolean;
}

export interface MerchantAccount {
  merchant_id: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  bank_name: string;
  branch_name?: string;
  account_type?: string;
  is_primary?: boolean;
  daily_limit?: number;
  monthly_limit?: number;
}

export class MerchantService {
  static async createMerchantProfile(data: MerchantProfile) {
    try {
      const merchantId = data.id || uuidv4();
      
      const { data: merchant, error } = await supabase
        .from('merchant_profiles')
        .insert({
          id: merchantId,
          business_name: data.business_name,
          business_type: data.business_type,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          business_address: data.business_address,
          pan_number: data.pan_number,
          gst_number: data.gst_number,
          verification_status: 'pending',
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        merchant_id: merchantId,
        message: 'Merchant profile created successfully'
      };

    } catch (error) {
      console.error('Error creating merchant profile:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async getMerchantProfile(merchantId: string) {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('id', merchantId)
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error fetching merchant profile:', error);
      throw new Error(`Merchant not found: ${merchantId}`);
    }
  }

  static async updateMerchantProfile(merchantId: string, updates: Partial<MerchantProfile>) {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('id', merchantId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Merchant profile updated successfully',
        data
      };

    } catch (error) {
      console.error('Error updating merchant profile:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async addMerchantAccount(data: MerchantAccount) {
    try {
      const { data: account, error } = await supabase
        .from('merchant_accounts')
        .insert({
          merchant_id: data.merchant_id,
          account_number: data.account_number,
          ifsc_code: data.ifsc_code,
          account_holder_name: data.account_holder_name,
          bank_name: data.bank_name,
          branch_name: data.branch_name,
          account_type: data.account_type || 'current',
          is_primary: data.is_primary || false,
          daily_limit: data.daily_limit,
          monthly_limit: data.monthly_limit,
          status: 'active',
          is_verified: false
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Merchant account added successfully',
        account_id: account.id
      };

    } catch (error) {
      console.error('Error adding merchant account:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async getMerchantAccounts(merchantId: string) {
    try {
      const { data, error } = await supabase
        .from('merchant_accounts')
        .select('*')
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error fetching merchant accounts:', error);
      throw new Error(`Failed to fetch accounts: ${(error as Error).message}`);
    }
  }

  static async updateMerchantVerificationStatus(
    merchantId: string, 
    status: string, 
    notes?: string
  ) {
    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .update({
          verification_status: status,
          is_active: status === 'approved'
        })
        .eq('id', merchantId);

      if (error) throw error;

      return {
        success: true,
        message: `Merchant verification status updated to ${status}`
      };

    } catch (error) {
      console.error('Error updating verification status:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async generateApiKey(merchantId: string) {
    try {
      const { data, error } = await supabase.rpc('get_or_create_api_key', {
        user_id: merchantId
      });

      if (error) throw error;

      if (data === 'INACTIVE_ACCOUNT') {
        throw new Error('Merchant account is inactive');
      }

      return {
        success: true,
        api_key: data,
        message: 'API key generated successfully'
      };

    } catch (error) {
      console.error('Error generating API key:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async getMerchantWalletBalance(merchantId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_merchant_wallet_balance', {
        merchant_uuid: merchantId
      });

      if (error) throw error;
      return data || 0;

    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }
}
