
import { supabase } from '@/integrations/supabase/client';

interface WebhookHit {
  source: string;
  payload: any;
  headers: any;
  clientIP?: string;
}

interface UpiWebhookPayload {
  utr_number: string;
  amount: number;
  status: 'success' | 'failed';
  transaction_id?: string;
  customer_name?: string;
  customer_email?: string;
  timestamp?: string;
}

export class WebhookService {
  static async logWebhookHit(webhookData: WebhookHit) {
    try {
      // Use existing api_request_logs table instead of webhook_hits
      const { error } = await supabase
        .from('api_request_logs')
        .insert({
          endpoint_url: '/webhook/' + webhookData.source,
          request_id: `webhook_${Date.now()}`,
          http_method: 'POST',
          request_headers: webhookData.headers,
          request_body: webhookData.payload,
          ip_address: webhookData.clientIP,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log webhook hit:', error);
      }
    } catch (error) {
      console.error('Error logging webhook hit:', error);
    }
  }

  static async processUpiWebhook(payload: UpiWebhookPayload) {
    const { utr_number, amount, status, transaction_id } = payload;

    // Validate required fields
    if (!utr_number || !amount || !status) {
      throw new Error('Missing required webhook fields: utr_number, amount, status');
    }

    // Check for duplicate webhook using api_request_logs
    const { data: existingWebhook } = await supabase
      .from('api_request_logs')
      .select('id')
      .contains('request_body', { utr_number })
      .limit(1)
      .maybeSingle();

    if (existingWebhook) {
      console.log('Duplicate webhook detected for UTR:', utr_number);
    }

    // Find matching transaction by UTR and amount
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .contains('payment_details', { utr_number })
      .eq('amount', amount);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!transactions || transactions.length === 0) {
      console.log('No matching transaction found for UTR:', utr_number, 'Amount:', amount);
      return { success: false, message: 'No matching transaction found' };
    }

    const transaction = transactions[0];

    // Update transaction status
    const updateData = {
      status: status === 'success' ? 'successful' : 'failed',
      processing_state: status === 'success' ? 'completed' : 'failed',
      processing_timeline: [
        ...(Array.isArray(transaction.processing_timeline) ? transaction.processing_timeline : []),
        {
          stage: status === 'success' ? 'completed' : 'failed',
          timestamp: new Date().toISOString(),
          message: `Webhook received: ${status}`,
          utr_number
        }
      ]
    };

    const { error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transaction.id);

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    console.log(`Transaction ${transaction.id} updated to ${status} via webhook`);

    return {
      success: true,
      transactionId: transaction.id,
      status: updateData.status
    };
  }

  static async processBankWebhook(bankCode: string, payload: any) {
    // Bank-specific webhook processing logic
    console.log(`Processing ${bankCode} webhook:`, payload);
    
    // This would contain bank-specific logic for different webhook formats
    // For now, treating as UPI-like webhook
    return await this.processUpiWebhook(payload);
  }
}
