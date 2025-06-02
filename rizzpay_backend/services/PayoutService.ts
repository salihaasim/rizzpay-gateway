
import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface PayoutRequest {
  id?: string;
  merchant_id: string;
  amount: number;
  currency: string;
  payout_method: string;
  beneficiary_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  description?: string;
  priority?: number;
  processing_fee?: number;
  gst_amount?: number;
  net_amount?: number;
}

export interface PayoutResponse {
  success: boolean;
  payout_id?: string;
  message: string;
  status?: string;
  tracking_id?: string;
}

export class PayoutService {
  static async createPayoutRequest(data: PayoutRequest): Promise<PayoutResponse> {
    try {
      const payoutId = data.id || uuidv4();
      
      // Calculate fees and net amount
      const processingFee = this.calculateProcessingFee(data.amount, data.payout_method);
      const gstAmount = processingFee * 0.18;
      const netAmount = data.amount - processingFee - gstAmount;

      const { data: payout, error } = await supabase
        .from('payout_requests')
        .insert({
          id: payoutId,
          merchant_id: data.merchant_id,
          amount: data.amount,
          currency: data.currency || 'INR',
          payout_method: data.payout_method,
          status: 'pending',
          beneficiary_name: data.beneficiary_name,
          account_number: data.account_number,
          ifsc_code: data.ifsc_code,
          bank_name: data.bank_name,
          upi_id: data.upi_id,
          description: data.description,
          priority: data.priority || 3,
          processing_fee: processingFee,
          gst_amount: gstAmount,
          net_amount: netAmount,
          retry_count: 0,
          max_retries: 3
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        payout_id: payoutId,
        message: 'Payout request created successfully',
        status: 'pending'
      };

    } catch (error) {
      console.error('Error creating payout request:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  static async getPayoutStatus(payoutId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', payoutId)
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error fetching payout status:', error);
      throw new Error(`Payout not found: ${payoutId}`);
    }
  }

  static async getMerchantPayouts(merchantId: string, filters: {
    page: number;
    limit: number;
    status?: string;
    method?: string;
  }) {
    try {
      let query = supabase
        .from('payout_requests')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.method) {
        query = query.eq('payout_method', filters.method);
      }

      const { data, error, count } = await query
        .range(
          (filters.page - 1) * filters.limit,
          filters.page * filters.limit - 1
        );

      if (error) throw error;

      return {
        payouts: data,
        total: count,
        page: filters.page,
        limit: filters.limit
      };

    } catch (error) {
      console.error('Error fetching merchant payouts:', error);
      throw new Error(`Failed to fetch payouts: ${(error as Error).message}`);
    }
  }

  static async updatePayoutStatus(
    payoutId: string, 
    status: string, 
    additionalData?: any
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.failed_at = new Date().toISOString();
      } else if (status === 'processing') {
        updateData.processing_started_at = new Date().toISOString();
      }

      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const { error } = await supabase
        .from('payout_requests')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating payout status:', error);
      throw new Error(`Failed to update payout: ${(error as Error).message}`);
    }
  }

  private static calculateProcessingFee(amount: number, method: string): number {
    // Base fee structure
    const baseFees = {
      'bank_transfer': 5,
      'upi': 2,
      'wallet': 1
    };

    const percentageFees = {
      'bank_transfer': 0.005, // 0.5%
      'upi': 0.003, // 0.3%
      'wallet': 0.002 // 0.2%
    };

    const baseFee = baseFees[method as keyof typeof baseFees] || 5;
    const percentageFee = (percentageFees[method as keyof typeof percentageFees] || 0.005) * amount;

    return Math.max(baseFee, percentageFee);
  }

  static async retryFailedPayout(payoutId: string): Promise<PayoutResponse> {
    try {
      const { data: payout, error: fetchError } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', payoutId)
        .single();

      if (fetchError || !payout) {
        throw new Error('Payout request not found');
      }

      if (payout.retry_count >= payout.max_retries) {
        throw new Error('Maximum retry attempts exceeded');
      }

      // Update retry count and status
      const { error: updateError } = await supabase
        .from('payout_requests')
        .update({
          status: 'pending',
          retry_count: payout.retry_count + 1,
          next_retry_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', payoutId);

      if (updateError) throw updateError;

      return {
        success: true,
        payout_id: payoutId,
        message: 'Payout retry initiated successfully',
        status: 'pending'
      };

    } catch (error) {
      console.error('Error retrying payout:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }
}
