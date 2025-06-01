
import { supabase } from '@/integrations/supabase/client';

export interface WebhookPayload {
  transaction_id: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  payment_method: string;
  payment_id?: string;
  processor_response?: any;
  error_message?: string;
  timestamp: string;
}

export const handleWebhookCallback = async (payload: WebhookPayload) => {
  try {
    console.log('Processing webhook callback:', payload);

    // Validate required fields
    if (!payload.transaction_id || !payload.status) {
      throw new Error('Missing required fields: transaction_id or status');
    }

    // Get the existing transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', payload.transaction_id)
      .single();

    if (fetchError || !transaction) {
      throw new Error(`Transaction not found: ${payload.transaction_id}`);
    }

    // Map webhook status to internal status
    const internalStatus = payload.status === 'success' ? 'successful' : 
                          payload.status === 'failed' ? 'failed' : 'pending';

    // Safely handle processing timeline - ensure it's an array
    const existingTimeline = Array.isArray(transaction.processing_timeline) 
      ? transaction.processing_timeline 
      : [];

    // Update processing timeline
    const updatedTimeline = [
      ...existingTimeline,
      {
        stage: internalStatus === 'successful' ? 'completed' : 
               internalStatus === 'failed' ? 'declined' : 'processing',
        timestamp: new Date().toISOString(),
        message: `Webhook received: ${payload.status}`,
        details: payload.processor_response
      }
    ];

    // Safely handle payment details - ensure it's an object
    const existingPaymentDetails = transaction.payment_details && 
                                 typeof transaction.payment_details === 'object' &&
                                 !Array.isArray(transaction.payment_details)
      ? transaction.payment_details as Record<string, any>
      : {};

    // Update payment details
    const updatedPaymentDetails = {
      ...existingPaymentDetails,
      webhookReceived: true,
      paymentId: payload.payment_id,
      processorResponse: payload.processor_response,
      errorMessage: payload.error_message
    };

    // Update the transaction
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: internalStatus,
        processing_state: internalStatus === 'successful' ? 'completed' : 
                         internalStatus === 'failed' ? 'declined' : 'processing',
        processing_timeline: updatedTimeline,
        payment_details: updatedPaymentDetails
      })
      .eq('id', payload.transaction_id);

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    console.log(`Transaction ${payload.transaction_id} updated successfully`);
    return { success: true, message: 'Transaction updated successfully' };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return { success: false, message: (error as Error).message };
  }
};

export const validateWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  // Implement signature validation based on your bank's webhook security
  // This is a placeholder - replace with actual signature validation
  try {
    // Example: HMAC-SHA256 validation
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
};
