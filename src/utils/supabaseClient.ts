
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { supabase as supabaseImport } from '@/integrations/supabase/client';

// Use imported supabase client to ensure singleton usage
export const supabase = () => supabaseImport;

// More efficient connection checks with better caching
let connectionStatus: boolean | null = null;
let connectionCheckTimeout: ReturnType<typeof setTimeout> | null = null;
let connectionCheckPromise: Promise<boolean> | null = null;
const CONNECTION_CHECK_INTERVAL = 120000; // Check every 2 minutes (increased from 1 minute)

// Helper function to check if Supabase connection is working with better debouncing
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // Return cached status if available and recent
  if (connectionStatus !== null && connectionCheckPromise) {
    return connectionCheckPromise;
  }
  
  // Clear any existing timeout
  if (connectionCheckTimeout) {
    clearTimeout(connectionCheckTimeout);
  }
  
  // Create a new connection check promise
  connectionCheckPromise = new Promise(async (resolve) => {
    try {
      // Simple ping to check connection - optimized to be lighter
      const { error } = await supabase()
        .from('transactions')
        .select('id', { head: true })
        .limit(1)
        .maybeSingle();
        
      connectionStatus = !error;
      
      // Schedule reset of connection status after interval
      connectionCheckTimeout = setTimeout(() => {
        connectionStatus = null;
        connectionCheckPromise = null;
      }, CONNECTION_CHECK_INTERVAL);
      
      resolve(connectionStatus);
    } catch (error) {
      console.error('Supabase connection error:', error);
      connectionStatus = false;
      resolve(false);
      
      // Shorter reset period on errors
      connectionCheckTimeout = setTimeout(() => {
        connectionStatus = null;
        connectionCheckPromise = null;
      }, 30000); // 30 seconds on error
    }
  });
  
  return connectionCheckPromise;
};

// More efficient transaction synchronization
export const syncTransactionToSupabase = async (transaction: any) => {
  try {
    // First check if we're connected before attempting sync
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.warn('Skipping Supabase sync due to connection issues');
      return false;
    }
    
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
        processing_timeline: transaction.processingTimeline,
        currency: 'INR'
      }, { onConflict: 'id' });

    return !error;
  } catch (error) {
    console.error('Error in syncTransactionToSupabase:', error);
    return false;
  }
};

// Add a safe method to handle custom tables that might not exist in the typed schema
export const safeSupabaseTable = (tableName: string) => {
  // @ts-ignore - This is necessary for accessing dynamic tables
  return supabase().from(tableName);
};

// Improved caching for transactions with longer cache time
let cachedTransactions: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 600000; // 10 minutes cache (increased from 5 minutes)

export const fetchTransactionsFromSupabase = async (userEmail?: string) => {
  // Use cached transactions if available and not expired
  const now = Date.now();
  if (cachedTransactions.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    if (!userEmail) return cachedTransactions;
    return cachedTransactions.filter(t => t.createdBy === userEmail);
  }
  
  try {
    // Check connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.warn('Using cached transactions due to connection issues');
      if (!userEmail) return cachedTransactions;
      return cachedTransactions.filter(t => t.createdBy === userEmail);
    }
    
    let query = supabase()
      .from('transactions')
      .select('*');
    
    // Filter by user email if provided
    if (userEmail) {
      query = query.eq('merchant_id', userEmail);
    }
    
    const { data, error } = await query
      .order('date', { ascending: false })
      .limit(100); // Limit to recent 100 to improve performance
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return cachedTransactions; // Return previously cached transactions on error
    }
    
    const formattedTransactions = (data || []).map(transaction => ({
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
    
    // Update cache
    cachedTransactions = formattedTransactions;
    lastFetchTime = now;
    
    return formattedTransactions;
  } catch (error) {
    console.error('Error in fetchTransactionsFromSupabase:', error);
    return cachedTransactions; // Return cached data on error
  }
};
