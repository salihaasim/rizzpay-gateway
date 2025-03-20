
// Instamojo API integration utility
// This is a frontend implementation - in a production app, the API key and auth token
// should be handled through a backend for security

// Instamojo API endpoints
const INSTAMOJO_TEST_API = 'https://test.instamojo.com/api/1.1';
const INSTAMOJO_PROD_API = 'https://api.instamojo.com/api/1.1';

// Use test API by default (should be changed to PROD for production)
const API_ENDPOINT = INSTAMOJO_TEST_API;

// Test credentials - in production, these would be stored securely in environment variables
// and accessed through a backend API
const TEST_API_KEY = 'test_xxxxxxxxxxxxxxxxxxxxxxxx';
const TEST_AUTH_TOKEN = 'test_xxxxxxxxxxxxxxxxxxxxxxxx';

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
  payment_method?: string; // For specifying 'NEFT' or 'Card'
  send_email?: boolean;
  send_sms?: boolean;
}

// Interface for payment response
export interface InstamojoPaymentResponse {
  success: boolean;
  payment_request?: {
    id: string;
    longurl: string;
    status: string;
    payment_method?: string;
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
    
    // For demonstration purposes, we'll simulate the API call
    // In production, you would make a real API call to Instamojo
    console.log('Creating Instamojo payment request:', paymentData);
    
    // Custom payment method handling
    const paymentMethod = paymentData.payment_method || 'all';
    
    // In a real implementation, you would make an actual API call:
    /*
    const response = await fetch(`${API_ENDPOINT}/payment-requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': TEST_API_KEY,
        'X-Auth-Token': TEST_AUTH_TOKEN,
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return {
      success: data.success,
      payment_request: data.payment_request,
      message: data.message
    };
    */
    
    // Simulate API response
    const simulatedResponse: InstamojoPaymentResponse = {
      success: true,
      payment_request: {
        id: 'PRID_' + Math.random().toString(36).substring(2, 12),
        longurl: `https://test.instamojo.com/@yourbusiness/payment/${Math.random().toString(36).substring(2, 12)}`,
        status: 'Pending',
        payment_method: paymentMethod
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
    const { payment_id, payment_request_id, status } = webhookData;
    
    // In production, you would verify the webhook signature using the salt
    // const providedSignature = webhookData.mac;
    // const calculatedSignature = calculateSignature(webhookData, WEBHOOK_SALT);
    // if (providedSignature !== calculatedSignature) return false;
    
    // Update payment status in your database
    console.log('Instamojo webhook received:', webhookData);
    
    // For demo: update local storage entry
    const paymentRequestId = payment_request_id || payment_id;
    const paymentDataStr = localStorage.getItem(`instamojo_payment_${paymentRequestId}`);
    if (paymentDataStr) {
      const paymentData = JSON.parse(paymentDataStr);
      paymentData.status = status;
      paymentData.payment_id = payment_id;
      localStorage.setItem(`instamojo_payment_${paymentRequestId}`, JSON.stringify(paymentData));
    }
    
    return true;
  } catch (error) {
    console.error('Error processing Instamojo webhook:', error);
    return false;
  }
};

// Get payment status from Instamojo
export const getInstamojoPaymentStatus = async (paymentRequestId: string): Promise<{
  status: string;
  paymentId?: string;
  amount?: string;
  paymentMethod?: string;
}> => {
  try {
    // In a real implementation, you would check the payment status from Instamojo API:
    /*
    const response = await fetch(`${API_ENDPOINT}/payment-requests/${paymentRequestId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': TEST_API_KEY,
        'X-Auth-Token': TEST_AUTH_TOKEN,
      }
    });
    
    const data = await response.json();
    
    return {
      status: data.payment_request.status,
      paymentId: data.payment_request.payments?.[0]?.payment_id,
      amount: data.payment_request.amount,
      paymentMethod: data.payment_request.payments?.[0]?.instrument_type
    };
    */
    
    // For demo: check local storage
    const paymentDataStr = localStorage.getItem(`instamojo_payment_${paymentRequestId}`);
    if (paymentDataStr) {
      const paymentData = JSON.parse(paymentDataStr);
      return {
        status: paymentData.status || 'Pending',
        paymentId: paymentData.payment_id,
        amount: paymentData.amount,
        paymentMethod: paymentData.payment_method
      };
    }
    
    return { status: 'Not Found' };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { status: 'Error' };
  }
};

// Helper function to calculate webhook signature (for use in production)
const calculateSignature = (data: any, salt: string): string => {
  // In a real implementation, you would calculate the HMAC signature
  // This is just a placeholder
  return 'calculated_signature';
};

// Create a NEFT payment request
export const createNeftPayment = async (
  paymentData: InstamojoPaymentRequest
): Promise<InstamojoPaymentResponse> => {
  try {
    // Add NEFT-specific parameters
    const neftPaymentData = {
      ...paymentData,
      payment_method: 'NEFT',
      send_email: true // Send NEFT details to email
    };
    
    return await createInstamojoPayment(neftPaymentData);
  } catch (error) {
    console.error('Error creating NEFT payment:', error);
    return {
      success: false,
      message: 'Failed to create NEFT payment request'
    };
  }
};

// Create a card payment request
export const createCardPayment = async (
  paymentData: InstamojoPaymentRequest
): Promise<InstamojoPaymentResponse> => {
  try {
    // Add card-specific parameters
    const cardPaymentData = {
      ...paymentData,
      payment_method: 'Card'
    };
    
    return await createInstamojoPayment(cardPaymentData);
  } catch (error) {
    console.error('Error creating card payment:', error);
    return {
      success: false,
      message: 'Failed to create card payment request'
    };
  }
};

// Get NEFT payment details for a payment request
export const getNeftDetails = async (paymentRequestId: string): Promise<{
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  reference?: string;
  status: string;
}> => {
  try {
    // In a real implementation, you would fetch NEFT details from Instamojo API
    /*
    const response = await fetch(`${API_ENDPOINT}/payment-requests/${paymentRequestId}/neft-details`, {
      method: 'GET',
      headers: {
        'X-Api-Key': TEST_API_KEY,
        'X-Auth-Token': TEST_AUTH_TOKEN,
      }
    });
    
    const data = await response.json();
    
    return {
      accountNumber: data.neft_details.account_number,
      ifsc: data.neft_details.ifsc,
      bankName: data.neft_details.bank_name,
      reference: data.neft_details.reference,
      status: data.neft_details.status
    };
    */
    
    // Simulate NEFT details for demonstration
    return {
      accountNumber: '123456789012345',
      ifsc: 'INST0000001',
      bankName: 'Instamojo Bank',
      reference: 'NEFT' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'Pending'
    };
  } catch (error) {
    console.error('Error fetching NEFT details:', error);
    return { status: 'Error' };
  }
};
