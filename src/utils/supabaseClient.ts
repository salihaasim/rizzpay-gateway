
import { createClient } from '@supabase/supabase-js';

// Supabase client with public anon key (safe to use in client-side code)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Helper function to check if Supabase connection is working
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Attempt to get user to check connection
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase client error:', error);
    return false;
  }
};

// Function to sync transaction to Supabase
export const syncTransactionToSupabase = async (transaction: any) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({
        id: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        payment_method: transaction.paymentMethod,
        status: transaction.status,
        customer: transaction.customer,
        created_by: transaction.createdBy,
        processing_state: transaction.processingState,
        detailed_status: transaction.detailedStatus,
        raw_amount: transaction.rawAmount,
        payment_details: transaction.paymentDetails,
        processing_timeline: transaction.processingTimeline,
        wallet_transaction_type: transaction.walletTransactionType,
        description: transaction.description
      });

    if (error) {
      console.error('Error syncing transaction:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in syncTransactionToSupabase:', error);
    return false;
  }
};

// Function to fetch transactions from Supabase
export const fetchTransactionsFromSupabase = async (userEmail?: string) => {
  try {
    let query = supabase
      .from('transactions')
      .select('*');
    
    // Filter by user email if provided
    if (userEmail) {
      query = query.or(`created_by.eq.${userEmail},customer.eq.${userEmail}`);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      paymentMethod: transaction.payment_method,
      status: transaction.status,
      customer: transaction.customer,
      createdBy: transaction.created_by,
      processingState: transaction.processing_state,
      detailedStatus: transaction.detailed_status,
      rawAmount: transaction.raw_amount,
      paymentDetails: transaction.payment_details,
      processingTimeline: transaction.processing_timeline,
      walletTransactionType: transaction.wallet_transaction_type,
      description: transaction.description
    }));
  } catch (error) {
    console.error('Error in fetchTransactionsFromSupabase:', error);
    return [];
  }
};
