
import { toast } from 'sonner';

// Helper for displaying transaction status updates
export const showTransactionNotification = (
  status: 'success' | 'error' | 'info',
  message: string,
  details?: string
) => {
  switch (status) {
    case 'success':
      toast.success(message, { description: details });
      break;
    case 'error':
      toast.error(message, { description: details });
      break;
    case 'info':
      toast.info(message, { description: details });
      break;
  }
};

// Function to simulate a successful payment callback
// This is used for testing only, when the real payment gateway
// isn't available or we want to bypass it
export const simulateSuccessfulPayment = (transactionId: string) => {
  // Create a simulated webhook event
  const simulatedEvent = new CustomEvent('payment_callback', {
    detail: {
      transaction_id: transactionId,
      status: 'success',
      gateway: 'instamojo',
      payment_id: `pmt_${Math.random().toString(36).substring(2, 10)}`,
      amount: localStorage.getItem(`instamojo_payment_amount_${transactionId}`) || '0'
    }
  });
  
  // Dispatch the event
  window.dispatchEvent(simulatedEvent);
  
  // Show a notification
  showTransactionNotification(
    'success',
    'Payment Successful',
    'Your test payment has been processed successfully'
  );
  
  // Redirect to the success page
  window.location.href = `/dashboard?transaction_id=${transactionId}&status=success`;
};
