
import { supabase } from '../config/supabase';
import { PayoutService } from './PayoutService';
import { WebhookService } from './WebhookService';

interface BankConfig {
  name: string;
  apiUrl: string;
  supportedMethods: string[];
  processingTime: string;
  baseFee: number;
  percentageFee: number;
  maxAmount: number;
  minAmount: number;
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
    minAmount: 1
  },
  'sbm': {
    name: 'SBM Bank',
    apiUrl: 'https://api.sbmbank.com/payouts/v2',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '1-2 hours',
    baseFee: 3,
    percentageFee: 0.003,
    maxAmount: 500000,
    minAmount: 1
  },
  'icici': {
    name: 'ICICI Bank',
    apiUrl: 'https://api.icicibank.com/payout/v1',
    supportedMethods: ['bank_transfer', 'upi'],
    processingTime: '1-3 hours',
    baseFee: 4,
    percentageFee: 0.004,
    maxAmount: 2000000,
    minAmount: 1
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

      // Log API request
      await this.logApiRequest(payoutData.id, bankCode, 'initiate_payout', payoutData);

      // Simulate bank API call (replace with actual bank integration)
      const bankResponse = await this.callBankAPI(bankConfig, payoutData);

      if (bankResponse.success) {
        // Update payout status to processing
        await PayoutService.updatePayoutStatus(payoutData.id, 'processing', {
          bank_reference_id: bankResponse.reference_id
        });

        return {
          success: true,
          message: `Payout initiated via ${bankConfig.name}`,
          reference_id: bankResponse.reference_id,
          estimated_completion: bankResponse.estimated_completion
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

  private static async callBankAPI(bankConfig: BankConfig, payoutData: any) {
    try {
      // This is a mock implementation - replace with actual bank API calls
      console.log(`Calling ${bankConfig.name} API for payout:`, payoutData.id);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure based on amount (for testing)
      const success = payoutData.amount < 100000; // Fail for amounts >= 1 lakh

      if (success) {
        return {
          success: true,
          reference_id: `${bankConfig.name.toUpperCase()}_${Date.now()}`,
          estimated_completion: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
        };
      } else {
        return {
          success: false,
          error_message: 'Amount exceeds daily limit'
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
      await supabase
        .from('api_request_logs')
        .insert({
          request_id: `${operation}_${payoutId}`,
          endpoint_url: `/payout/${operation}`,
          http_method: 'POST',
          request_body: requestData as any,
          bank_api_endpoint: `${bankCode}_${operation}`,
          bank_request_id: payoutId,
          ip_address: '127.0.0.1' // This should come from the actual request
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

      // Process the webhook using WebhookService
      const result = await WebhookService.processPayoutWebhook(webhookData);

      return result;

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
      await supabase
        .from('api_request_logs')
        .insert({
          request_id: `webhook_${bankCode}_${Date.now()}`,
          endpoint_url: `/webhook/${bankCode}`,
          http_method: 'POST',
          request_headers: headers as any,
          request_body: webhookData as any,
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

    // Mock bank status check - replace with actual health check
    return {
      status: 'operational',
      name: bankConfig.name,
      processingTime: bankConfig.processingTime,
      supportedMethods: bankConfig.supportedMethods
    };
  }
}
