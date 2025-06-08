
import { supabase } from '../config/supabase';
import { BankIntegrationService } from './BankIntegrationService';

// Generate unique RizzPay transaction ID
const generateRizzPayTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `RP${timestamp}${randomPart}`.toUpperCase();
};

export class PaymentService {
  static async createPayment(data: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerName: string;
    customerEmail?: string;
    description?: string;
    merchantId: string;
  }) {
    const transactionId = generateRizzPayTransactionId();
    
    // Create transaction record
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        merchant_id: data.merchantId,
        amount: data.amount,
        currency: data.currency,
        payment_method: data.paymentMethod,
        status: 'pending',
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        description: data.description,
        processing_state: 'initiated',
        processing_timeline: [{
          stage: 'initiated',
          timestamp: new Date().toISOString(),
          message: 'Payment request created'
        }]
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    
    return transaction;
  }
  
  static async processWebhook(bankSlug: string, webhookData: any, headers: any) {
    return await BankIntegrationService.processWebhook(bankSlug, webhookData, headers);
  }
  
  static async getPaymentStatus(transactionId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (error) {
      throw new Error(`Transaction not found: ${error.message}`);
    }
    
    return data;
  }
  
  static async getTransactions(merchantId: string, filters: {
    page: number;
    limit: number;
    status?: string;
    paymentMethod?: string;
  }) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false });
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod);
    }
    
    const { data, error, count } = await query
      .range(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit - 1
      );
    
    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    
    return {
      transactions: data,
      total: count,
      page: filters.page,
      limit: filters.limit
    };
  }
  
  static async updateTransactionStatus(
    transactionId: string,
    status: string,
    additionalData?: any
  ) {
    const { error } = await supabase
      .from('transactions')
      .update({
        status,
        processing_state: status === 'successful' ? 'completed' : 
                          status === 'failed' ? 'declined' : 'processing',
        ...additionalData
      })
      .eq('id', transactionId);
    
    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }
}
