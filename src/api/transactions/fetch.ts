
// Transaction API functions for fetching data
import { supabase } from '@/utils/supabaseClient';
import { Transaction } from '@/stores/transactions/types';
import { toast } from 'sonner';

export const fetchTransactions = async (
  merchantId: string,
  options?: {
    limit?: number;
    offset?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
  }
): Promise<Transaction[]> => {
  try {
    let query = supabase()
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false });
      
    // Apply filters
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    if (options?.paymentMethod) {
      query = query.eq('payment_method', options.paymentMethod);
    }
    
    if (options?.startDate) {
      query = query.gte('date', options.startDate);
    }
    
    if (options?.endDate) {
      query = query.lte('date', options.endDate);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map to Transaction objects
    return data.map(item => ({
      id: item.id,
      amount: `₹${parseFloat(item.amount).toFixed(2)}`,
      date: item.date,
      customer: item.customer_name || 'Unknown',
      customerEmail: item.customer_email,
      status: item.status,
      paymentMethod: item.payment_method,
      description: item.description,
      processingState: item.processing_state,
      processingTimeline: item.processing_timeline,
      paymentDetails: item.payment_details
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast.error('Failed to fetch transactions');
    return [];
  }
};

export const getTransactionById = async (
  transactionId: string
): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase()
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      amount: `₹${parseFloat(data.amount).toFixed(2)}`,
      date: data.date,
      customer: data.customer_name || 'Unknown',
      customerEmail: data.customer_email,
      status: data.status,
      paymentMethod: data.payment_method,
      description: data.description,
      processingState: data.processing_state,
      processingTimeline: data.processing_timeline,
      paymentDetails: data.payment_details
    };
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    return null;
  }
};
