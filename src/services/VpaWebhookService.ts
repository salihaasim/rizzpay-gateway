
import { supabase } from '@/integrations/supabase/client';

export interface VpaPaymentWebhook {
  vpaAddress: string;
  amount: number;
  senderVpa: string;
  transactionRef: string;
  bankReference: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export class VpaWebhookService {
  static async processVpaPayment(webhook: VpaPaymentWebhook) {
    try {
      console.log('Processing VPA payment webhook:', webhook);

      // Log the incoming payment - fix the column names and types
      const { data: logData, error: logError } = await supabase
        .from('vpa_payment_logs')
        .insert({
          vpa_address: webhook.vpaAddress,
          transaction_ref: webhook.transactionRef,
          amount: webhook.amount,
          sender_vpa: webhook.senderVpa,
          bank_reference: webhook.bankReference,
          webhook_payload: webhook as any, // Cast to any to match Json type
          processing_status: 'received'
        })
        .select()
        .single();

      if (logError) throw logError;

      // Find the merchant by VPA
      const merchant = await this.findMerchantByVpa(webhook.vpaAddress);
      if (!merchant) {
        throw new Error(`No merchant found for VPA: ${webhook.vpaAddress}`);
      }

      // Update log with merchant info
      await supabase
        .from('vpa_payment_logs')
        .update({
          merchant_id: merchant.id,
          processing_status: 'processing'
        })
        .eq('id', logData.id);

      if (webhook.status === 'success') {
        // Create transaction record
        const transactionId = await this.createTransaction(merchant, webhook);
        
        // Update merchant wallet
        await this.updateMerchantWallet(merchant.id, webhook.amount);

        // Update log as processed
        await supabase
          .from('vpa_payment_logs')
          .update({
            matched_transaction_id: transactionId,
            processing_status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', logData.id);

        return { success: true, transactionId };
      } else {
        // Handle failed payment
        await supabase
          .from('vpa_payment_logs')
          .update({
            processing_status: 'failed'
          })
          .eq('id', logData.id);

        return { success: false, reason: 'Payment failed at bank level' };
      }
    } catch (error) {
      console.error('VPA webhook processing error:', error);
      throw error;
    }
  }

  private static async findMerchantByVpa(vpaAddress: string) {
    const { data, error } = await supabase
      .from('vpa_mappings')
      .select(`
        merchant_id,
        merchant_profiles!inner(*)
      `)
      .eq('vpa_address', vpaAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data?.merchant_profiles;
  }

  private static async createTransaction(merchant: any, webhook: VpaPaymentWebhook) {
    const transactionId = `VPA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        merchant_id: merchant.id,
        amount: webhook.amount,
        currency: 'INR',
        payment_method: 'UPI_VPA',
        status: 'successful',
        assigned_vpa: webhook.vpaAddress,
        vpa_payment_ref: webhook.transactionRef,
        payment_source: 'vpa',
        customer_name: 'UPI Customer',
        description: `VPA Payment via ${webhook.senderVpa}`,
        payment_details: {
          senderVpa: webhook.senderVpa,
          bankReference: webhook.bankReference,
          paymentMode: 'VPA'
        }
      });

    if (error) throw error;
    return transactionId;
  }

  private static async updateMerchantWallet(merchantId: string, amount: number) {
    // This would integrate with your existing wallet management system
    console.log(`Updating wallet for merchant ${merchantId} with amount ${amount}`);
    
    // For now, just log the wallet update
    // In production, you'd call your wallet service here
  }

  static async getVpaPaymentHistory(merchantId: string) {
    const { data, error } = await supabase
      .from('vpa_payment_logs')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
