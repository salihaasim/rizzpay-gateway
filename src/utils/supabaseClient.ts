
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Create a singleton Supabase client with lazy initialization
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Default Supabase URL and key from environment or hardcoded values
// In production, these should be in environment variables
const SUPABASE_URL = "https://mogqmymxnienxqactuym.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZ3FteW14bmllbnhxYWN0dXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzEwNTgsImV4cCI6MjA1ODEwNzA1OH0.Z2bzbA8aQQha2NhgA0M1F2R56Ewv8npqRgCj2S_70h4";

export const supabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY;
  
  // Create real Supabase client with the provided credentials
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  return supabaseInstance;
};

// Helper function to check if Supabase connection is working
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Attempt to get user to check connection
    const { data, error } = await supabase().auth.getUser();
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
    const { error } = await supabase()
      .from('transactions')
      .upsert({
        id: transaction.id,
        merchant_id: transaction.createdBy,
        amount: parseFloat(transaction.amount.replace(/[^0-9.-]+/g, '')),
        payment_method: transaction.paymentMethod,
        status: transaction.status,
        customer_name: transaction.customer,
        date: transaction.date,
        description: transaction.description,
        processing_state: transaction.processingState,
        payment_details: transaction.paymentDetails,
        processing_timeline: transaction.processingTimeline
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
    let query = supabase()
      .from('transactions')
      .select('*');
    
    // Filter by user email if provided
    if (userEmail) {
      query = query.eq('merchant_id', userEmail);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return (data || []).map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: `₹${transaction.amount}`,
      paymentMethod: transaction.payment_method,
      status: transaction.status,
      customer: transaction.customer_name,
      createdBy: transaction.merchant_id,
      processingState: transaction.processing_state,
      paymentDetails: transaction.payment_details,
      processingTimeline: transaction.processing_timeline,
      description: transaction.description
    }));
  } catch (error) {
    console.error('Error in fetchTransactionsFromSupabase:', error);
    return [];
  }
};
