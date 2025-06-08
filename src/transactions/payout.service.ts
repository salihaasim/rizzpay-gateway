
import { supabase } from '@/integrations/supabase/client';
import { generateTransactionId } from '@/utils/formatUtils';

interface PayoutRequest {
  merchantId: string;
  amount: number;
  beneficiaryName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  payoutMethod: 'bank_transfer' | 'upi';
}

interface PayoutFilters {
  merchantId?: string;
  status?: string;
  page: number;
  limit: number;
}

interface PayoutUpdate {
  status: string;
  utrNumber?: string;
  failureReason?: string;
  adminNotes?: string;
}

export class PayoutService {
  static async createPayout(data: PayoutRequest) {
    // Check merchant wallet balance
    const balance = await this.getMerchantBalance(data.merchantId);
    
    if (balance < data.amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Calculate processing fees (2% of amount)
    const processingFee = data.amount * 0.02;
    const gstAmount = processingFee * 0.18;
    const netAmount = data.amount - processingFee - gstAmount;

    const payoutData = {
      id: generateTransactionId(),
      merchant_id: data.merchantId,
      amount: data.amount,
      processing_fee: processingFee,
      gst_amount: gstAmount,
      net_amount: netAmount,
      payout_method: data.payoutMethod,
      beneficiary_name: data.beneficiaryName,
      account_number: data.accountNumber,
      ifsc_code: data.ifscCode,
      upi_id: data.upiId,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data: payout, error } = await supabase
      .from('payout_requests')
      .insert(payoutData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payout: ${error.message}`);
    }

    // Log to payout ledger
    await this.logPayoutLedger({
      merchantId: data.merchantId,
      payoutRequestId: payout.id,
      amount: data.amount,
      transactionType: 'payout_request',
      description: `Payout request created - ${data.payoutMethod}`
    });

    return payout;
  }

  static async getPayouts(filters: PayoutFilters) {
    let query = supabase
      .from('payout_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.merchantId) {
      query = query.eq('merchant_id', filters.merchantId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query
      .range(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit - 1
      );

    if (error) {
      throw new Error(`Failed to fetch payouts: ${error.message}`);
    }

    return {
      payouts: data,
      total: count,
      page: filters.page,
      limit: filters.limit
    };
  }

  static async updatePayoutStatus(payoutId: string, update: PayoutUpdate) {
    const updateData: any = {
      status: update.status,
      updated_at: new Date().toISOString()
    };

    if (update.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      updateData.utr_number = update.utrNumber || `UTR${Date.now()}`;
    }

    if (update.status === 'failed') {
      updateData.failed_at = new Date().toISOString();
      updateData.failure_reason = update.failureReason;
    }

    if (update.adminNotes) {
      updateData.internal_notes = update.adminNotes;
    }

    const { data: payout, error } = await supabase
      .from('payout_requests')
      .update(updateData)
      .eq('id', payoutId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update payout: ${error.message}`);
    }

    // Log status change to ledger
    await this.logPayoutLedger({
      merchantId: payout.merchant_id,
      payoutRequestId: payoutId,
      amount: payout.amount,
      transactionType: `payout_${update.status}`,
      description: `Payout ${update.status} - ${update.utrNumber || update.failureReason || ''}`
    });

    return payout;
  }

  private static async getMerchantBalance(merchantId: string): Promise<number> {
    // Simplified balance calculation
    // In production, use proper wallet balance tracking
    const { data: successfulTxns } = await supabase
      .from('transactions')
      .select('amount')
      .eq('merchant_id', merchantId)
      .eq('status', 'successful');

    const { data: completedPayouts } = await supabase
      .from('payout_requests')
      .select('amount')
      .eq('merchant_id', merchantId)
      .eq('status', 'completed');

    const totalIncome = successfulTxns?.reduce((sum, txn) => sum + (txn.amount || 0), 0) || 0;
    const totalPayouts = completedPayouts?.reduce((sum, payout) => sum + (payout.amount || 0), 0) || 0;

    return Math.max(totalIncome - totalPayouts, 0);
  }

  private static async logPayoutLedger(data: {
    merchantId: string;
    payoutRequestId: string;
    amount: number;
    transactionType: string;
    description: string;
  }) {
    const currentBalance = await this.getMerchantBalance(data.merchantId);
    
    await supabase
      .from('payout_ledger')
      .insert({
        merchant_id: data.merchantId,
        payout_request_id: data.payoutRequestId,
        amount: data.amount,
        transaction_type: data.transactionType,
        description: data.description,
        balance_before: currentBalance,
        balance_after: currentBalance - (data.transactionType.includes('request') ? data.amount : 0)
      });
  }
}
