import { supabase } from '../config/supabase';
import { PayoutService } from './PayoutService';
import { WebhookService } from './WebhookService';
import { AESEncryption } from '../utils/aesEncryption';
import { BankEncryptionService } from '../config/bankEncryption';

interface BankConfig {
  name: string;
  apiUrl: string;
  supportedMethods: string[];
  processingTime: string;
  baseFee: number;
  percentageFee: number;
  maxAmount: number;
  minAmount: number;
  encryptionRequired: boolean;
}

const BANK_CONFIGS: Record<string, BankConfig> = {
  'hdfc': {
    name: 'HDFC Bank',
    apiUrl: 'https://api.hdfcbank.com/payout/v1',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '2-4 hours',
    baseFee: 5,
    percentageFee: 0.005,
    maxAmount: 1000000,
    minAmount: 1,
    encryptionRequired: true
  },
  'sbm': {
    name: 'SBM Bank',
    apiUrl: 'https://api.sbmbank.com/payouts/v2',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '1-2 hours',
    baseFee: 3,
    percentageFee: 0.003,
    maxAmount: 500000,
    minAmount: 1,
    encryptionRequired: false
  },
  'icici': {
    name: 'ICICI Bank',
    apiUrl: 'https://api.icicibank.com/payout/v1',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '1-3 hours',
    baseFee: 4,
    percentageFee: 0.004,
    maxAmount: 2000000,
    minAmount: 1,
    encryptionRequired: true
  },
  'canara': {
    name: 'Canara Bank',
    apiUrl: 'https://api.canarabank.com/payout/v1',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '1-4 hours',
    baseFee: 6,
    percentageFee: 0.006,
    maxAmount: 2000000,
    minAmount: 1,
    encryptionRequired: true
  }
};

export class EnhancedBankIntegrationService {
  static getBankConfig(bankCode: string): BankConfig | null {
    return BANK_CONFIGS[bankCode] || null;
  }

  static getSupportedBanks() {
    return Object.entries(BANK_CONFIGS).map(([code, config]) => ({
      code,
      config
    }));
  }

  static calculateProcessingFee(amount: number, method: string, bankCode: string): number {
    const bankConfig = this.getBankConfig(bankCode);
    if (!bankConfig) return 0;

    const baseFee = bankConfig.baseFee;
    const percentageFee = bankConfig.percentageFee * amount;

    return Math.max(baseFee, percentageFee);
  }

  static async initiatePayout(payoutData: any, bankCode: string) {
    try {
      const bankConfig = this.getBankConfig(bankCode);
      if (!bankConfig) {
        throw new Error(`Unsupported bank: ${bankCode}`);
      }

      // Validate amount limits
      if (payoutData.amount < bankConfig.minAmount || payoutData.amount > bankConfig.maxAmount) {
        throw new Error(`Amount must be between ${bankConfig.minAmount} and ${bankConfig.maxAmount}`);
      }

      // Prepare API payload
      let apiPayload = {
        ...payoutData,
        bank_code: bankCode,
        timestamp: new Date().toISOString()
      };

      // Apply encryption if required
      if (bankConfig.encryptionRequired && BankEncryptionService.isEncryptionRequired(bankCode)) {
        apiPayload = await this.encryptPayoutData(apiPayload, bankCode);
      }

      // Log API request
      await this.logApiRequest(payoutData.id, bankCode, 'initiate_payout', apiPayload);

      // Call bank API with encrypted data
      const bankResponse = await this.callBankAPI(bankConfig, apiPayload, bankCode);

      if (bankResponse.success) {
        // Update payout status to processing
        await PayoutService.updatePayoutStatus(payoutData.id, 'processing', {
          bank_reference_id: bankResponse.reference_id,
          encryption_used: bankConfig.encryptionRequired
        });

        return {
          success: true,
          message: `Encrypted payout initiated via ${bankConfig.name}`,
          reference_id: bankResponse.reference_id,
          estimated_completion: bankResponse.estimated_completion,
          encrypted: bankConfig.encryptionRequired
        };
      } else {
        // Update payout status to failed
        await PayoutService.updatePayoutStatus(payoutData.id, 'failed', {
          failure_reason: bankResponse.error_message
        });

        return {
          success: false,
          message: bankResponse.error_message
        };
      }

    } catch (error) {
      console.error('Bank integration error:', error);
      
      // Update payout status to failed
      await PayoutService.updatePayoutStatus(payoutData.id, 'failed', {
        failure_reason: (error as Error).message
      });

      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  private static async encryptPayoutData(payoutData: any, bankCode: string) {
    try {
      // Generate merchant token
      const merchantToken = `merchant_${payoutData.merchant_id}_${Date.now()}`;
      const encryptedToken = AESEncryption.encryptMerchantToken(
        merchantToken,
        payoutData.merchant_id,
        bankCode
      );

      // Encrypt sensitive payout data
      const encryptedPayout = AESEncryption.encryptPayoutData(payoutData, bankCode);

      return {
        encrypted_payout_data: encryptedPayout.encryptedData,
        payout_iv: encryptedPayout.iv,
        encrypted_merchant_token: encryptedToken.encryptedData,
        token_iv: encryptedToken.iv,
        bank_code: bankCode,
        encryption_algorithm: 'AES-256-CBC',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${(error as Error).message}`);
    }
  }

  private static async callBankAPI(bankConfig: BankConfig, payoutData: any, bankCode: string) {
    try {
      console.log(`Calling ${bankConfig.name} API with ${bankConfig.encryptionRequired ? 'encrypted' : 'plain'} data:`, payoutData.id);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enhanced simulation based on encryption
      const success = bankConfig.encryptionRequired ? 
        payoutData.encrypted_payout_data ? payoutData.amount < 100000 : false : // Encrypted banks require encryption
        payoutData.amount < 100000; // Non-encrypted banks work normally

      if (success) {
        const referencePrefix = bankConfig.encryptionRequired ? 'ENC_' : 'REG_';
        return {
          success: true,
          reference_id: `${referencePrefix}${bankConfig.name.toUpperCase()}_${Date.now()}`,
          estimated_completion: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          encryption_status: bankConfig.encryptionRequired ? 'encrypted' : 'plain'
        };
      } else {
        return {
          success: false,
          error_message: bankConfig.encryptionRequired && !payoutData.encrypted_payout_data ? 
            'Encryption required but not provided' : 
            'Amount exceeds daily limit'
        };
      }

    } catch (error) {
      console.error('Bank API call error:', error);
      return {
        success: false,
        error_message: 'Bank API communication failed'
      };
    }
  }

  private static async logApiRequest(payoutId: string, bankCode: string, operation: string, requestData: any) {
    try {
      // Mask sensitive data in logs
      const maskedData = { ...requestData };
      if (maskedData.encrypted_payout_data) {
        maskedData.encrypted_payout_data = '***ENCRYPTED***';
      }
      if (maskedData.encrypted_merchant_token) {
        maskedData.encrypted_merchant_token = '***ENCRYPTED***';
      }

      await supabase
        .from('api_request_logs')
        .insert({
          request_id: `${operation}_${payoutId}`,
          endpoint_url: `/payout/${operation}`,
          http_method: 'POST',
          request_body: maskedData as any,
          bank_api_endpoint: `${bankCode}_${operation}`,
          bank_request_id: payoutId,
          ip_address: '127.0.0.1'
        });
    } catch (error) {
      console.error('Error logging API request:', error);
    }
  }

  static async processWebhook(bankCode: string, webhookData: any, headers: any) {
    try {
      const bankConfig = this.getBankConfig(bankCode);
      if (!bankConfig) {
        throw new Error(`Unsupported bank: ${bankCode}`);
      }

      // Log webhook receipt
      await this.logWebhookReceipt(bankCode, webhookData, headers);

      // Decrypt webhook data if encrypted
      let processedWebhookData = webhookData;
      if (bankConfig.encryptionRequired && BankEncryptionService.shouldEncryptWebhook(bankCode)) {
        if (webhookData.encrypted_data && webhookData.iv) {
          const decryptionResult = AESEncryption.decrypt(
            webhookData.encrypted_data,
            webhookData.iv,
            bankCode
          );

          if (decryptionResult.success) {
            processedWebhookData = decryptionResult.data;
          } else {
            throw new Error(`Webhook decryption failed: ${decryptionResult.error}`);
          }
        }
      }

      // Process the webhook using WebhookService
      const result = await WebhookService.processPayoutWebhook(processedWebhookData);

      return {
        ...result,
        decryption_used: bankConfig.encryptionRequired && !!webhookData.encrypted_data
      };

    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  private static async logWebhookReceipt(bankCode: string, webhookData: any, headers: any) {
    try {
      // Mask encrypted data in logs
      const maskedData = { ...webhookData };
      if (maskedData.encrypted_data) {
        maskedData.encrypted_data = '***ENCRYPTED***';
      }

      await supabase
        .from('api_request_logs')
        .insert({
          request_id: `webhook_${bankCode}_${Date.now()}`,
          endpoint_url: `/webhook/${bankCode}`,
          http_method: 'POST',
          request_headers: headers as any,
          request_body: maskedData as any,
          bank_api_endpoint: `${bankCode}_webhook`,
          ip_address: headers['x-forwarded-for'] || '127.0.0.1'
        });
    } catch (error) {
      console.error('Error logging webhook receipt:', error);
    }
  }

  static async getBankStatus(bankCode: string) {
    const bankConfig = this.getBankConfig(bankCode);
    if (!bankConfig) {
      return { status: 'unavailable', message: 'Bank not supported' };
    }

    return {
      status: 'operational',
      name: bankConfig.name,
      processingTime: bankConfig.processingTime,
      supportedMethods: bankConfig.supportedMethods,
      encryptionRequired: bankConfig.encryptionRequired,
      encryptionStatus: bankConfig.encryptionRequired ? 'AES-256-CBC' : 'none'
    };
  }
}
