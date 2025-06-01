
import { handleWebhookCallback, WebhookPayload } from './handler';

export interface BankWebhookConfig {
  bankName: string;
  signatureHeader: string;
  secretKey: string;
  statusMapping: Record<string, 'success' | 'failed' | 'pending'>;
}

// Bank-specific configurations
export const BANK_CONFIGS: Record<string, BankWebhookConfig> = {
  'hdfc-bank': {
    bankName: 'HDFC Bank',
    signatureHeader: 'x-hdfc-signature',
    secretKey: process.env.HDFC_WEBHOOK_SECRET || '',
    statusMapping: {
      'SUCCESS': 'success',
      'FAILED': 'failed',
      'PENDING': 'pending'
    }
  },
  'sbm-bank': {
    bankName: 'SBM Bank',
    signatureHeader: 'x-sbm-signature',
    secretKey: process.env.SBM_WEBHOOK_SECRET || '',
    statusMapping: {
      'COMPLETED': 'success',
      'DECLINED': 'failed',
      'PROCESSING': 'pending'
    }
  },
  'icici-bank': {
    bankName: 'ICICI Bank',
    signatureHeader: 'x-icici-signature',
    secretKey: process.env.ICICI_WEBHOOK_SECRET || '',
    statusMapping: {
      'APPROVED': 'success',
      'REJECTED': 'failed',
      'INITIATED': 'pending'
    }
  }
};

export const processBankWebhook = async (
  bankSlug: string, 
  rawPayload: any, 
  headers: Record<string, string>
): Promise<{ success: boolean; message: string }> => {
  try {
    const config = BANK_CONFIGS[bankSlug];
    if (!config) {
      throw new Error(`Unsupported bank: ${bankSlug}`);
    }

    // Validate signature if available
    const signature = headers[config.signatureHeader];
    if (signature && config.secretKey) {
      // Implement signature validation here
      console.log(`Validating signature for ${config.bankName}`);
    }

    // Transform bank-specific payload to standard format
    const standardPayload: WebhookPayload = {
      transaction_id: rawPayload.transaction_id || rawPayload.txnId || rawPayload.orderId,
      status: config.statusMapping[rawPayload.status] || 'pending',
      amount: parseFloat(rawPayload.amount || rawPayload.txnAmount || '0'),
      currency: rawPayload.currency || 'INR',
      payment_method: rawPayload.payment_method || 'bank_transfer',
      payment_id: rawPayload.payment_id || rawPayload.bankRefNo,
      processor_response: rawPayload,
      error_message: rawPayload.error_message || rawPayload.failureReason,
      timestamp: rawPayload.timestamp || new Date().toISOString()
    };

    // Process the webhook
    const result = await handleWebhookCallback(standardPayload);
    console.log(`${config.bankName} webhook processed:`, result);

    return result;

  } catch (error) {
    console.error(`Error processing ${bankSlug} webhook:`, error);
    return { success: false, message: error.message };
  }
};
