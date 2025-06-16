
import { supabase } from '@/integrations/supabase/client';

export interface WalletTransaction {
  merchant_id: string;
  transaction_type: 'credit' | 'debit' | 'freeze' | 'unfreeze';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  metadata?: any;
  created_by?: string;
}

export class WalletTransactionService {
  static async createWalletTransaction(transactionData: WalletTransaction) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        ...transactionData,
        metadata: JSON.stringify(transactionData.metadata || {})
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating wallet transaction:', error);
      throw error;
    }

    return data;
  }

  static async getMerchantWalletHistory(merchantId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching wallet history:', error);
      throw error;
    }

    return data;
  }

  static async getCurrentBalance(merchantId: string): Promise<number> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('balance_after')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current balance:', error);
      return 0;
    }

    return data?.balance_after || 0;
  }

  static async processWalletCredit(merchantId: string, amount: number, referenceType: string, referenceId: string, description?: string) {
    const currentBalance = await this.getCurrentBalance(merchantId);
    const newBalance = currentBalance + amount;

    return await this.createWalletTransaction({
      merchant_id: merchantId,
      transaction_type: 'credit',
      amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      reference_type: referenceType,
      reference_id: referenceId,
      description: description || `Credit from ${referenceType}`
    });
  }

  static async processWalletDebit(merchantId: string, amount: number, referenceType: string, referenceId: string, description?: string) {
    const currentBalance = await this.getCurrentBalance(merchantId);
    
    if (currentBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    const newBalance = currentBalance - amount;

    return await this.createWalletTransaction({
      merchant_id: merchantId,
      transaction_type: 'debit',
      amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      reference_type: referenceType,
      reference_id: referenceId,
      description: description || `Debit for ${referenceType}`
    });
  }
}
