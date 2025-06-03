
import { supabase } from '../config/supabase';
import { PayoutService } from './PayoutService';

export interface WebhookPayload {
  payout_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  utr_number?: string;
  bank_reference_id?: string;
  failure_reason?: string;
  timestamp: string;
  bank_response?: any;
}

export class WebhookService {
  static async processPayoutWebhook(payload: WebhookPayload) {
    try {
      console.log('Processing payout webhook:', payload);
      
      const { payout_id, status, utr_number, bank_reference_id, failure_reason } = payload;
      
      // Update payout status
      await PayoutService.updatePayoutStatus(payout_id, status, {
        utr_number,
        bank_reference_id,
        failure_reason,
        updated_at: new Date().toISOString()
      });
      
      // Log webhook activity
      await this.logWebhookActivity(payload);
      
      // Send notification to merchant if configured
      await this.notifyMerchant(payout_id);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        payout_id
      };
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }
  
  private static async logWebhookActivity(payload: WebhookPayload) {
    try {
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payload.payout_id,
          webhook_type: 'status_update',
          payload: payload as any,
          response_code: 200,
          delivered: true
        });
    } catch (error) {
      console.error('Error logging webhook activity:', error);
    }
  }
  
  private static async notifyMerchant(payoutId: string) {
    try {
      // Get payout details and merchant webhook URL
      const { data: payout } = await supabase
        .from('payout_requests')
        .select('*, merchant_payout_settings!inner(webhook_url)')
        .eq('id', payoutId)
        .single();
      
      if (!payout?.merchant_payout_settings?.webhook_url) return;
      
      const webhookPayload = {
        event: 'payout.status_updated',
        payout_id: payout.id,
        status: payout.status,
        amount: payout.amount,
        currency: payout.currency,
        utr_number: payout.utr_number,
        timestamp: new Date().toISOString()
      };
      
      // Send webhook to merchant
      const response = await fetch(payout.merchant_payout_settings.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RizzPay-Event': 'payout.status_updated'
        },
        body: JSON.stringify(webhookPayload)
      });
      
      console.log(`Merchant webhook sent: ${response.status}`);
      
    } catch (error) {
      console.error('Error notifying merchant:', error);
    }
  }
}
