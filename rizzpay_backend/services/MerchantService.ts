
import { supabase } from '../config/supabase';

export class MerchantService {
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
      return null;
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
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  }

  static async validateMerchantApiKey(apiKey: string) {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('id, is_active, business_name')
        .eq('api_key', apiKey)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error validating API key:', error);
      return null;
    }
  }

  static async updateMerchantBalance(merchantId: string, amount: number, operation: 'debit' | 'credit') {
    try {
      // This would integrate with a proper wallet/ledger system
      console.log(`${operation} operation: ${amount} for merchant: ${merchantId}`);
      
      // For now, we'll just log the operation
      // In production, this would update actual wallet balances
      return true;
    } catch (error) {
      console.error('Error updating merchant balance:', error);
      return false;
    }
  }
}
