
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { Transaction, PaymentDetails } from '@/stores/transactionStore';
import { loadRazorpayScript } from './razorpayLoader';

// Process payment using Razorpay checkout
export const processRazorpayPayment = async (
  orderData: {
    orderId: string,
    transactionId: string,
    amount: number,
    currency: string,
    customerName: string,
    customerEmail?: string,
    description?: string
  }
): Promise<Transaction | null> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway');
      return null;
    }
    
    console.log('Processing Razorpay payment with order ID:', orderData.orderId);
    
    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(orderData.amount * 100);
    
    // Return a promise that resolves when payment completes
    return new Promise((resolve, reject) => {
      const options = {
        key: "rzp_test_JXIkZl2p0iUbRw", // Using the Razorpay Key ID
        amount: amountInPaise,
        currency: orderData.currency,
        name: "Rizzpay",
        description: orderData.description || "Payment Processing",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail || '',
        },
        theme: {
          color: "#2563eb", // Primary color
        },
        modal: {
          confirm_close: true,
          ondismiss: function() {
            console.log('Razorpay payment dismissed by user');
            toast.info('Payment cancelled');
            reject(new Error('Payment cancelled by user'));
          }
        },
        handler: async function(response: any) {
          try {
            console.log('Razorpay payment successful:', response);
            
            // Update transaction in database
            const { data, error } = await supabase()
              .from('transactions')
              .update({
                status: 'successful',
                processing_state: 'completed',
                payment_details: {
                  processor: 'Razorpay',
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amountInPaise: amountInPaise
                },
                processing_timeline: [
                  {
                    stage: 'initiated',
                    timestamp: new Date().toISOString(),
                    message: `Payment of ${orderData.amount} ${orderData.currency} initiated via Razorpay`
                  },
                  {
                    stage: 'completed',
                    timestamp: new Date().toISOString(),
                    message: `Payment successfully processed via Razorpay (ID: ${response.razorpay_payment_id})`
                  }
                ]
              })
              .eq('id', orderData.transactionId)
              .select()
              .single();
            
            if (error) {
              console.error('Error updating transaction after Razorpay payment:', error);
              toast.error('Payment completed but error updating records');
              reject(error);
              return;
            }
            
            // Create a properly typed PaymentDetails object from the JSON data
            const paymentDetailsFromDB = data.payment_details as Record<string, any>;
            const typedPaymentDetails: PaymentDetails = {
              processor: paymentDetailsFromDB?.processor as string,
              cardNumber: paymentDetailsFromDB?.cardNumber as string,
              cardHolderName: paymentDetailsFromDB?.cardHolderName as string,
              razorpay_payment_id: paymentDetailsFromDB?.razorpay_payment_id as string,
              razorpay_order_id: paymentDetailsFromDB?.razorpay_order_id as string,
              razorpay_signature: paymentDetailsFromDB?.razorpay_signature as string
            };
            
            // Format transaction for return
            const transaction: Transaction = {
              id: data.id,
              date: new Date(data.date).toISOString(),
              amount: `${data.currency === 'INR' ? '₹' : data.currency} ${data.amount}`,
              rawAmount: parseFloat(data.amount.toString()),
              paymentMethod: data.payment_method,
              status: 'successful',
              customer: data.customer_name,
              processingState: 'completed',
              paymentDetails: typedPaymentDetails
            };
            
            toast.success('Payment successful!');
            resolve(transaction);
          } catch (error) {
            console.error('Error processing Razorpay success:', error);
            reject(error);
          }
        }
      };
      
      console.log('Opening Razorpay checkout with options:', options);
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        reject(new Error(response.error.description));
      });
      razorpay.open();
    });
  } catch (error) {
    console.error('Error processing Razorpay payment:', error);
    toast.error('Payment processing failed');
    return null;
  }
};
