import { supabase } from '../config/supabase';

export interface BankConfig {
  name: string;
  apiEndpoint: string;
  supportedMethods: string[];
  processingTime: string;
  fees: {
    neft: number;
    rtgs: number;
    imps: number;
    upi: number;
  };
}

export interface PayoutRequest {
  id: string;
  amount: number;
  currency: string;
  beneficiary_name: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  payout_method: string;
  merchant_id?: string;
}

export interface BankResponse {
  success: boolean;
  bank_reference_id?: string;
  transaction_id?: string;
  status: string;
  message: string;
  estimated_completion?: string;
}
import { BankApiGateway, BankPayoutParams, BankAPIResult } from '@/services/BankApiGateway';

export class BankIntegrationService {
  private static bankConfigs: Record<string, BankConfig> = {
    'hdfc': {
      name: 'HDFC Bank',
      apiEndpoint: 'https://api.hdfcbank.com/payout/v1',
      supportedMethods: ['bank_transfer', 'upi'],
      processingTime: '30 minutes - 2 hours',
      fees: {
        neft: 5,
        rtgs: 25,
        imps: 5,
        upi: 2
      }
    },
    'icici': {
      name: 'ICICI Bank',
      apiEndpoint: 'https://api.icicibank.com/payout/v2',
      supportedMethods: ['bank_transfer', 'upi', 'wallet'],
      processingTime: '15 minutes - 1 hour',
      fees: {
        neft: 4,
        rtgs: 20,
        imps: 4,
        upi: 1.5
      }
    },
    'axis': {
      name: 'Axis Bank',
      apiEndpoint: 'https://api.axisbank.com/payout/v1',
      supportedMethods: ['bank_transfer', 'upi'],
      processingTime: '1 - 3 hours',
      fees: {
        neft: 6,
        rtgs: 30,
        imps: 6,
        upi: 2.5
      }
    }
  };
  
  static async initiatePayout(payoutRequest: PayoutRequest, bankCode: string = 'hdfc'): Promise<BankResponse> {
    try {
      console.log(`Initiating payout via ${bankCode}:`, payoutRequest);
      
      const bankConfig = this.bankConfigs[bankCode];
      if (!bankConfig) {
        throw new Error(`Unsupported bank: ${bankCode}`);
      }

      // Update payout status to processing
      await supabase
        .from('payout_requests')
        .update({
          status: 'processing',
          processing_started_at: new Date().toISOString()
        })
        .eq('id', payoutRequest.id);

      // Use new API gateway:
      const gatewayParams: BankPayoutParams = {
        payoutId: payoutRequest.id,
        amount: payoutRequest.amount,
        currency: payoutRequest.currency,
        beneficiaryName: payoutRequest.beneficiary_name,
        accountNumber: payoutRequest.account_number,
        ifscCode: payoutRequest.ifsc_code,
        upiId: payoutRequest.upi_id,
        payoutMethod: payoutRequest.payout_method,
        merchantId: payoutRequest.merchant_id as any,
      };
      const apiResult: BankAPIResult = await BankApiGateway.initiatePayout(gatewayParams, bankCode as any);

      // Update payout with bank response
      await supabase
        .from('payout_requests')
        .update({
          bank_reference_id: apiResult.referenceId,
          status: apiResult.success && apiResult.status === 'accepted' ? 'processing' : 'failed',
          failure_reason: apiResult.success ? null : apiResult.message
        })
        .eq('id', payoutRequest.id);

      return {
        success: apiResult.success,
        bank_reference_id: apiResult.referenceId,
        transaction_id: apiResult.transactionId,
        status: apiResult.status,
        message: apiResult.message,
        estimated_completion: apiResult.estimatedCompletion
      };

    } catch (error) {
      console.error('Payout initiation error:', error);

      // Update payout status to failed
      await supabase
        .from('payout_requests')
        .update({
          status: 'failed',
          failed_at: new Date().toISOString(),
          failure_reason: (error as Error).message
        })
        .eq('id', payoutRequest.id);

      return {
        success: false,
        status: 'failed',
        message: (error as Error).message
      };
    }
  }
  
  private static async simulateBankAPICall(
    payoutRequest: PayoutRequest, 
    bankConfig: BankConfig
  ): Promise<BankResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        success: true,
        bank_reference_id: `${bankConfig.name.substring(0, 4).toUpperCase()}${Date.now()}`,
        transaction_id: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'accepted',
        message: 'Payout initiated successfully',
        estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      };
    } else {
      const errors = [
        'Insufficient funds in source account',
        'Invalid beneficiary account details',
        'Bank service temporarily unavailable',
        'Daily transaction limit exceeded'
      ];
      
      return {
        success: false,
        status: 'rejected',
        message: errors[Math.floor(Math.random() * errors.length)]
      };
    }
  }
  
  static async checkPayoutStatus(bankReferenceId: string, bankCode: string = 'hdfc'): Promise<BankResponse> {
    try {
      const bankConfig = this.bankConfigs[bankCode];
      if (!bankConfig) {
        throw new Error(`Unsupported bank: ${bankCode}`);
      }
      
      // Simulate status check API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate various status responses
      const statuses = ['processing', 'completed', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      let response: BankResponse = {
        success: true,
        bank_reference_id: bankReferenceId,
        status: randomStatus,
        message: `Transaction is ${randomStatus}`
      };
      
      if (randomStatus === 'completed') {
        response.transaction_id = `UTR${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      } else if (randomStatus === 'failed') {
        response.message = 'Transaction failed due to technical error';
        response.success = false;
      }
      
      return response;
      
    } catch (error) {
      return {
        success: false,
        status: 'error',
        message: (error as Error).message
      };
    }
  }
  
  static getBankConfig(bankCode: string): BankConfig | null {
    return this.bankConfigs[bankCode] || null;
  }
  
  static getSupportedBanks(): Array<{code: string; config: BankConfig}> {
    return Object.entries(this.bankConfigs).map(([code, config]) => ({ code, config }));
  }
  
  static calculateProcessingFee(amount: number, method: string, bankCode: string = 'hdfc'): number {
    const bankConfig = this.bankConfigs[bankCode];
    if (!bankConfig) return 0;
    
    const methodFees = {
      'bank_transfer': bankConfig.fees.neft,
      'upi': bankConfig.fees.upi
    };
    
    const baseFee = methodFees[method as keyof typeof methodFees] || 5;
    const percentageFee = amount * 0.005; // 0.5% of amount
    
    return Math.max(baseFee, Math.min(percentageFee, 100)); // Min 5, Max 100
  }
}
