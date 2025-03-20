
// Instamojo API integration utility
// This is a frontend implementation - in a production app, the API key and auth token
// should be handled through a backend for security

// Instamojo API endpoints
const INSTAMOJO_TEST_API = 'https://test.instamojo.com/api/1.1';
const INSTAMOJO_PROD_API = 'https://api.instamojo.com/api/1.1';

// Use test API by default (should be changed to PROD for production)
const API_ENDPOINT = INSTAMOJO_TEST_API;

// Interface for payment request data
export interface InstamojoPaymentRequest {
  purpose: string;
  amount: string;
  buyer_name: string;
  email?: string;
  phone?: string;
  redirect_url?: string;
  webhook_url?: string;
  allow_repeated_payments?: boolean;
}

// Interface for payment response
export interface InstamojoPaymentResponse {
  success: boolean;
  payment_request?: {
    id: string;
    longurl: string;
    status: string;
  };
  message?: string;
}

// Create a payment request with Instamojo
export const createInstamojoPayment = async (
  paymentData: InstamojoPaymentRequest
): Promise<InstamojoPaymentResponse> => {
  try {
    // In a real implementation, this request would be made through your backend
    // to protect your API credentials
    
    // Simulate API call for demo purposes
    console.log('Creating Instamojo payment request:', paymentData);
    
    // Simulate successful payment request creation
    const simulatedResponse: InstamojoPaymentResponse = {
      success: true,
      payment_request: {
        id: 'INST_' + Math.random().toString(36).substring(2, 12),
        longurl: `https://test.instamojo.com/demo/payment/${Math.random().toString(36).substring(2, 12)}`,
        status: 'Pending'
      }
    };
    
    // Store payment request in localStorage for demo purposes
    // In production, you would track this in your database
    localStorage.setItem(`instamojo_payment_${simulatedResponse.payment_request?.id}`, JSON.stringify({
      ...paymentData,
      payment_id: simulatedResponse.payment_request?.id,
      created_at: new Date().toISOString(),
      status: 'Pending'
    }));
    
    return simulatedResponse;
  } catch (error) {
    console.error('Error creating Instamojo payment:', error);
    return {
      success: false,
      message: 'Failed to create payment request'
    };
  }
};

// Handle Instamojo webhook callback
export const handleInstamojoWebhook = (webhookData: any): boolean => {
  try {
    // Webhook data would include payment_id, status, etc.
    const { payment_id, status } = webhookData;
    
    // In production, you would verify the webhook signature
    
    // Update payment status in your database
    console.log('Instamojo webhook received:', webhookData);
    
    // For demo: update local storage entry
    const paymentDataStr = localStorage.getItem(`instamojo_payment_${payment_id}`);
    if (paymentDataStr) {
      const paymentData = JSON.parse(paymentDataStr);
      paymentData.status = status;
      localStorage.setItem(`instamojo_payment_${payment_id}`, JSON.stringify(paymentData));
    }
    
    return true;
  } catch (error) {
    console.error('Error processing Instamojo webhook:', error);
    return false;
  }
};

// Get payment status from Instamojo
export const getInstamojoPaymentStatus = async (paymentRequestId: string): Promise<string> => {
  try {
    // In production, this would be a real API call to Instamojo
    console.log('Checking payment status for:', paymentRequestId);
    
    // For demo: check local storage
    const paymentDataStr = localStorage.getItem(`instamojo_payment_${paymentRequestId}`);
    if (paymentDataStr) {
      const paymentData = JSON.parse(paymentDataStr);
      return paymentData.status || 'Unknown';
    }
    
    return 'Not Found';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return 'Error';
  }
};
