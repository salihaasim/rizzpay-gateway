
import { supabase } from '@/integrations/supabase/client';

export interface PaymentLink {
  id?: string;
  merchant_id: string;
  amount: number;
  currency?: string;
  description?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  payment_methods?: string[];
  status?: string;
  expires_at?: string;
  redirect_url?: string;
  webhook_url?: string;
  metadata?: any;
}

export class PaymentLinkService {
  static async createPaymentLink(linkData: PaymentLink) {
    // Generate unique payment link ID
    const linkId = `pl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const { data, error } = await supabase
      .from('payment_links')
      .insert({
        id: linkId,
        ...linkData,
        payment_methods: JSON.stringify(linkData.payment_methods || ['upi', 'card']),
        metadata: JSON.stringify(linkData.metadata || {}),
        expires_at: linkData.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours default
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }

    return data;
  }

  static async getPaymentLink(linkId: string) {
    const { data, error } = await supabase
      .from('payment_links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (error) {
      console.error('Error fetching payment link:', error);
      throw error;
    }

    return data;
  }

  static async updatePaymentLinkStatus(linkId: string, status: string, transactionId?: string) {
    const updateData: any = { status };
    
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
      if (transactionId) {
        updateData.transaction_id = transactionId;
      }
    }

    const { data, error } = await supabase
      .from('payment_links')
      .update(updateData)
      .eq('id', linkId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment link:', error);
      throw error;
    }

    return data;
  }

  static async getMerchantPaymentLinks(merchantId: string, status?: string) {
    let query = supabase
      .from('payment_links')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching merchant payment links:', error);
      throw error;
    }

    return data;
  }
}
