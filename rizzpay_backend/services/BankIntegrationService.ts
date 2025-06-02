
import { supabase } from '../config/supabase';
import { PaymentService } from './PaymentService';

const BANK_CONFIGS = {
  'hdfc-bank': {
    bankName: 'HDFC Bank',
    statusMapping: {
      'SUCCESS': 'successful',
      'FAILED': 'failed',
      'PENDING': 'pending'
    }
  },
  'sbm-bank': {
    bankName: 'SBM Bank',
    statusMapping: {
      'COMPLETED': 'successful',
      'DECLINED': 'failed',
      'PROCESSING': 'pending'
    }
  },
  'icici-bank': {
    bankName: 'ICICI Bank',
    statusMapping: {
      'APPROVED': 'successful',
      'REJECTED': 'failed',
      'INITIATED': 'pending'
    }
  }
};

export class BankIntegrationService {
  static async processWebhook(bankSlug: string, webhookData: any, headers: any) {
    const bankConfig = BANK_CONFIGS[bankSlug];
    
    if (!bankConfig) {
      throw new Error('Unsupported bank');
    }
    
    const transactionId = webhookData.transaction_id || webhookData.txnId || webhookData.orderId;
    const rawStatus = webhookData.status || webhookData.txnStatus;
    
    if (!transactionId || !rawStatus) {
      throw new Error('Missing required webhook data');
    }
    
    const paymentStatus = bankConfig.statusMapping[rawStatus] || 'pending';
    
    // Update transaction
    await PaymentService.updateTransactionStatus(transactionId, paymentStatus, {
      payment_details: {
        bankName: bankConfig.bankName,
        paymentId: webhookData.payment_id || webhookData.bankRefNo,
        processorResponse: webhookData,
        webhookReceived: true,
        webhookTimestamp: new Date().toISOString()
      }
    });
    
    // If successful, credit merchant wallet
    if (paymentStatus === 'successful') {
      await this.creditMerchantWallet(transactionId, webhookData);
    }
    
    return {
      success: true,
      message: `${bankConfig.bankName} webhook processed successfully`,
      transactionId,
      paymentStatus
    };
  }
  
  private static async creditMerchantWallet(transactionId: string, webhookData: any) {
    // Get transaction details
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (!transaction) return;
    
    // Create wallet transaction
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: transaction.merchant_id,
        amount: transaction.amount,
        currency: transaction.currency || 'INR',
        transaction_type: 'credit',
        source: 'payment',
        reference_id: transaction.id,
        status: 'completed',
        description: `Payment received from ${transaction.customer_name || 'customer'}`,
        metadata: {
          payment_method: transaction.payment_method,
          customer_email: transaction.customer_email
        }
      });
  }
}
