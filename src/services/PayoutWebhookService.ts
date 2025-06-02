
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PayoutWebhookPayload {
  payout_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  utr_number?: string;
  bank_reference_id?: string;
  failure_reason?: string;
  processing_fee?: number;
  bank_charges?: number;
  timestamp: string;
  bank_response?: any;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  payout_id?: string;
  processed_at: string;
}

export class PayoutWebhookService {
  static async processStatusUpdate(payload: PayoutWebhookPayload): Promise<WebhookResponse> {
    try {
      console.log('Processing payout webhook:', payload);
      
      const { payout_id, status, utr_number, bank_reference_id, failure_reason, bank_response } = payload;
      
      // Get current payout request
      const { data: existingPayout, error: fetchError } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', payout_id)
        .single();
      
      if (fetchError || !existingPayout) {
        throw new Error(`Payout request not found: ${payout_id}`);
      }
      
      // Prepare update data
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (utr_number) updateData.utr_number = utr_number;
      if (bank_reference_id) updateData.bank_reference_id = bank_reference_id;
      if (failure_reason) updateData.failure_reason = failure_reason;
      
      // Set completion/failure timestamps
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.failed_at = new Date().toISOString();
      } else if (status === 'processing') {
        updateData.processing_started_at = new Date().toISOString();
      }
      
      // Update payout request
      const { error: updateError } = await supabase
        .from('payout_requests')
        .update(updateData)
        .eq('id', payout_id);
      
      if (updateError) throw updateError;
      
      // Log webhook activity
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payout_id,
          webhook_type: 'status_update',
          payload: payload,
          response_code: 200,
          delivered: true
        });
      
      // Create ledger entry if completed
      if (status === 'completed') {
        await this.createLedgerEntry(existingPayout);
      }
      
      return {
        success: true,
        message: 'Payout status updated successfully',
        payout_id,
        processed_at: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Webhook processing error:', error);
      
      // Log failed webhook
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payload.payout_id,
          webhook_type: 'status_update',
          payload: payload,
          response_code: 500,
          response_body: (error as Error).message,
          delivered: false
        });
      
      return {
        success: false,
        message: (error as Error).message,
        processed_at: new Date().toISOString()
      };
    }
  }
  
  private static async createLedgerEntry(payout: any) {
    try {
      // Get current wallet balance
      const currentBalance = await this.getMerchantBalance(payout.merchant_id);
      
      await supabase
        .from('payout_ledger')
        .insert({
          payout_request_id: payout.id,
          merchant_id: payout.merchant_id,
          transaction_type: 'debit',
          amount: payout.amount,
          balance_before: currentBalance,
          balance_after: currentBalance - payout.amount,
          description: `Payout completed - ${payout.payout_method}`,
          reference_id: payout.utr_number || payout.bank_reference_id
        });
    } catch (error) {
      console.error('Error creating ledger entry:', error);
    }
  }
  
  private static async getMerchantBalance(merchantId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_merchant_wallet_balance', {
        merchant_uuid: merchantId
      });
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting merchant balance:', error);
      return 0;
    }
  }
  
  static async sendWebhookNotification(payoutId: string, merchantWebhookUrl?: string) {
    if (!merchantWebhookUrl) return;
    
    try {
      const { data: payout } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', payoutId)
        .single();
      
      if (!payout) return;
      
      const webhookPayload = {
        event: 'payout.status_updated',
        payout_id: payout.id,
        status: payout.status,
        amount: payout.amount,
        currency: payout.currency,
        utr_number: payout.utr_number,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(merchantWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RizzPay-Event': 'payout.status_updated'
        },
        body: JSON.stringify(webhookPayload)
      });
      
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payoutId,
          webhook_type: 'status_update',
          payload: webhookPayload,
          response_code: response.status,
          response_body: await response.text(),
          delivered: response.ok
        });
      
    } catch (error) {
      console.error('Error sending webhook notification:', error);
    }
  }
}
