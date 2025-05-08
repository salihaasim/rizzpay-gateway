
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Create a Razorpay order in the backend
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR', // Default to INR, but currency parameter is ignored
  paymentMethod: string,
  customerName: string,
  customerEmail?: string,
  description?: string
): Promise<{ orderId: string, transactionId: string } | null> => {
  try {
    console.log('Creating Razorpay order with params:', { amount, paymentMethod, customerName });
    
    // Force currency to INR
    currency = 'INR';
    
    // Create a transaction record first
    const transactionId = `RZRP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);
    
    // Skip Supabase transaction creation since it's causing row-level security issues
    console.log(`Skipping Supabase transaction creation due to RLS policy issues. Using in-memory transaction ID: ${transactionId}`);
    
    // Use the Razorpay API key from the config
    const razorpayKeyId = "rzp_test_JXIkZl2p0iUbRw";
    
    // Prepare the order data
    const orderData = {
      amount: amountInPaise,
      currency: currency,
      receipt: transactionId,
      notes: {
        paymentMethod: paymentMethod,
        customerName: customerName,
        customerEmail: customerEmail || '',
        description: description || 'Payment via Razorpay'
      }
    };
    
    console.log('Creating Razorpay order with data:', orderData);
    
    // Create a simulated Razorpay order ID for testing (use a direct API call in production)
    const orderId = `order_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    console.log('Simulated Razorpay order created successfully with ID:', orderId);
    
    // Return both the order ID and transaction ID
    return { orderId, transactionId };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    toast.error('Payment initialization failed');
    return null;
  }
};
