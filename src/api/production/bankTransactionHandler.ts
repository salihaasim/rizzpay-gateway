
import { supabase } from '@/integrations/supabase/client';

export interface BankTransactionData {
  transaction_id: string;
  utr_number?: string;
  merchant_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  amount: number;
  currency?: string;
  transaction_type: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  bank_reference_number?: string;
  remitter_account?: string;
  beneficiary_account?: string;
  remitter_ifsc?: string;
  beneficiary_ifsc?: string;
  bank_charges?: number;
  gst_amount?: number;
  remarks?: string;
  bank_response?: any;
}

export interface UTRLogData {
  utr_number: string;
  bank_transaction_id?: string;
  webhook_payload: any;
  webhook_source: string;
  webhook_signature?: string;
  processing_status?: string;
  error_message?: string;
}

export const createBankTransaction = async (transactionData: BankTransactionData) => {
  try {
    const { data, error } = await supabase
      .from('bank_transactions')
      .insert({
        transaction_id: transactionData.transaction_id,
        utr_number: transactionData.utr_number,
        merchant_id: transactionData.merchant_id,
        customer_name: transactionData.customer_name,
        customer_email: transactionData.customer_email,
        customer_phone: transactionData.customer_phone,
        amount: transactionData.amount,
        currency: transactionData.currency || 'INR',
        transaction_type: transactionData.transaction_type,
        status: transactionData.status,
        bank_reference_number: transactionData.bank_reference_number,
        remitter_account: transactionData.remitter_account,
        beneficiary_account: transactionData.beneficiary_account,
        remitter_ifsc: transactionData.remitter_ifsc,
        beneficiary_ifsc: transactionData.beneficiary_ifsc,
        bank_charges: transactionData.bank_charges || 0,
        gst_amount: transactionData.gst_amount || 0,
        net_amount: transactionData.amount - (transactionData.bank_charges || 0) - (transactionData.gst_amount || 0),
        remarks: transactionData.remarks,
        bank_response: transactionData.bank_response
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating bank transaction:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateBankTransactionStatus = async (
  transactionId: string, 
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
  additionalData?: Partial<BankTransactionData>
) => {
  try {
    const updateData: any = { status };
    
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    if (status === 'completed') {
      updateData.settlement_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('bank_transactions')
      .update(updateData)
      .eq('transaction_id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating bank transaction:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const logUTRWebhook = async (utrData: UTRLogData) => {
  try {
    const { data, error } = await supabase
      .from('utr_logs')
      .insert({
        utr_number: utrData.utr_number,
        bank_transaction_id: utrData.bank_transaction_id,
        webhook_payload: utrData.webhook_payload,
        webhook_source: utrData.webhook_source,
        webhook_signature: utrData.webhook_signature,
        processing_status: utrData.processing_status || 'received',
        error_message: utrData.error_message
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error logging UTR webhook:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const processUTRCallback = async (webhookPayload: any, bankSource: string) => {
  try {
    // Extract UTR from webhook payload (format varies by bank)
    const utr = webhookPayload.utr || webhookPayload.utr_number || webhookPayload.transactionId;
    
    if (!utr) {
      throw new Error('UTR not found in webhook payload');
    }

    // Log the UTR webhook first
    await logUTRWebhook({
      utr_number: utr,
      webhook_payload: webhookPayload,
      webhook_source: bankSource,
      processing_status: 'processing'
    });

    // Find existing bank transaction by UTR
    const { data: existingTransaction, error: findError } = await supabase
      .from('bank_transactions')
      .select('*')
      .eq('utr_number', utr)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw findError;
    }

    let transactionResult;
    
    if (existingTransaction) {
      // Update existing transaction
      const status = webhookPayload.status === 'SUCCESS' || webhookPayload.status === 'COMPLETED' ? 'completed' : 
                    webhookPayload.status === 'FAILED' || webhookPayload.status === 'DECLINED' ? 'failed' : 
                    'processing';

      transactionResult = await updateBankTransactionStatus(
        existingTransaction.transaction_id,
        status,
        {
          webhook_received_at: new Date().toISOString(),
          bank_response: webhookPayload
        }
      );
    } else {
      // Create new transaction from webhook
      const newTransactionData: BankTransactionData = {
        transaction_id: webhookPayload.transaction_id || `TXN_${Date.now()}`,
        utr_number: utr,
        merchant_id: webhookPayload.merchant_id || 'unknown',
        customer_name: webhookPayload.customer_name || 'Unknown Customer',
        customer_email: webhookPayload.customer_email,
        amount: parseFloat(webhookPayload.amount || '0'),
        transaction_type: webhookPayload.transaction_type || 'UPI',
        status: webhookPayload.status === 'SUCCESS' || webhookPayload.status === 'COMPLETED' ? 'completed' : 
                webhookPayload.status === 'FAILED' || webhookPayload.status === 'DECLINED' ? 'failed' : 
                'processing',
        bank_response: webhookPayload,
        webhook_received_at: new Date().toISOString()
      };

      transactionResult = await createBankTransaction(newTransactionData);
    }

    // Update UTR log with success status
    await supabase
      .from('utr_logs')
      .update({ 
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        bank_transaction_id: transactionResult.data?.id
      })
      .eq('utr_number', utr)
      .eq('processing_status', 'processing');

    return { success: true, transaction: transactionResult.data };

  } catch (error) {
    console.error('Error processing UTR callback:', error);
    
    // Update UTR log with error status
    if (webhookPayload.utr || webhookPayload.utr_number) {
      await supabase
        .from('utr_logs')
        .update({ 
          processing_status: 'failed',
          error_message: (error as Error).message,
          processed_at: new Date().toISOString()
        })
        .eq('utr_number', webhookPayload.utr || webhookPayload.utr_number)
        .eq('processing_status', 'processing');
    }

    return { success: false, error: (error as Error).message };
  }
};
