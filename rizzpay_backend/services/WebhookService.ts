
import { supabase } from '../config/supabase';
import { PayoutService } from './PayoutService';

export interface WebhookPayload {
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

export class WebhookService {
  static async processPayoutWebhook(payload: WebhookPayload) {
    try {
      console.log('Processing payout webhook:', payload);

      const { payout_id, status, utr_number, bank_reference_id, failure_reason } = payload;

      // Validate required fields
      if (!payout_id || !status) {
        throw new Error('Missing required webhook fields');
      }

      // Get existing payout
      const existingPayout = await PayoutService.getPayoutStatus(payout_id);
      if (!existingPayout) {
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

      // Update payout status
      await PayoutService.updatePayoutStatus(payout_id, status, updateData);

      // Log webhook activity
      await this.logWebhookActivity(payout_id, 'status_update', payload, 200, true);

      // Create ledger entry if completed
      if (status === 'completed') {
        await this.createLedgerEntry(existingPayout);
      }

      return {
        success: true,
        message: 'Webhook processed successfully',
        payout_id,
        processed_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Webhook processing error:', error);
      
      // Log failed webhook
      await this.logWebhookActivity(
        payload.payout_id, 
        'status_update', 
        payload, 
        500, 
        false, 
        (error as Error).message
      );

      return {
        success: false,
        message: (error as Error).message,
        processed_at: new Date().toISOString()
      };
    }
  }

  private static async logWebhookActivity(
    payoutId: string,
    webhookType: string,
    payload: any,
    responseCode: number,
    delivered: boolean,
    responseBody?: string
  ) {
    try {
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payoutId,
          webhook_type: webhookType,
          payload: payload as any,
          response_code: responseCode,
          response_body: responseBody,
          delivered
        });
    } catch (error) {
      console.error('Error logging webhook activity:', error);
    }
  }

  private static async createLedgerEntry(payout: any) {
    try {
      // Get current wallet balance
      const { data, error } = await supabase.rpc('get_merchant_wallet_balance', {
        merchant_uuid: payout.merchant_id
      });

      if (error) throw error;
      const currentBalance = data || 0;

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

  static async sendMerchantWebhook(payoutId: string, merchantWebhookUrl?: string) {
    if (!merchantWebhookUrl) return;

    try {
      const payout = await PayoutService.getPayoutStatus(payoutId);
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

      await this.logWebhookActivity(
        payoutId,
        'merchant_notification',
        webhookPayload,
        response.status,
        response.ok,
        await response.text()
      );

    } catch (error) {
      console.error('Error sending merchant webhook:', error);
    }
  }
}
