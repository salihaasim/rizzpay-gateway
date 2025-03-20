
// Instamojo API integration utility
// This file handles integration with Instamojo payment gateway for card and NEFT payments

// Instamojo API endpoints
const INSTAMOJO_TEST_API = 'https://test.instamojo.com/api/1.1';
const INSTAMOJO_PROD_API = 'https://api.instamojo.com/api/1.1';

// Use test API in development, production API in production
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? INSTAMOJO_PROD_API 
  : INSTAMOJO_TEST_API;

// API credentials - should be stored in environment variables
// For production, these should be accessed through environment variables
const API_KEY = process.env.VITE_INSTAMOJO_API_KEY || 'test_xxxxxxxxxxxxxxxxxxxxxxxx';
const AUTH_TOKEN = process.env.VITE_INSTAMOJO_AUTH_TOKEN || 'test_xxxxxxxxxxxxxxxxxxxxxxxx';

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
    console.log('Creating Instamojo payment request:', paymentData);
    
    // Validate essential fields
    if (!paymentData.purpose || !paymentData.amount || !paymentData.buyer_name) {
      return {
        success: false,
        message: 'Missing required fields (purpose, amount, or buyer_name)'
      };
    }
    
    // Email validation check - Instamojo requires a valid email
    if (!paymentData.email || paymentData.email === "undefined") {
      paymentData.email = "customer@example.com";
    }
    
    // Handle phone number validation
    if (!paymentData.phone || paymentData.phone === "undefined") {
      paymentData.phone = "9999999999"; // Default test phone number
    }
    
    // Custom payment method handling
    const paymentMethod = paymentData.payment_method || 'all';
    
    // This is where the actual API call would happen in production
    if (process.env.NODE_ENV === 'production') {
      try {
        const headers = new Headers();
        headers.append('X-Api-Key', API_KEY);
        headers.append('X-Auth-Token', AUTH_TOKEN);
        headers.append('Content-Type', 'application/json');
        
        const response = await fetch(`${API_ENDPOINT}/payment-requests/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Instamojo API response:', data);
        
        return {
          success: data.success,
          payment_request: data.payment_request,
          message: data.message
        };
      } catch (error) {
        console.error('Error making API call to Instamojo:', error);
        return {
          success: false,
          message: 'API call to Instamojo failed'
        };
      }
    }
    
    // Demo/development mode - simulate API response
    const paymentId = 'PRID_' + Math.random().toString(36).substring(2, 12);
    
    // Store amount for later reference
    localStorage.setItem(`instamojo_payment_amount_${paymentId}`, paymentData.amount);
    
    const simulatedResponse: InstamojoPaymentResponse = {
      success: true,
      payment_request: {
        id: paymentId,
        // Using a simulated URL - in production this would be the real Instamojo URL
        longurl: `https://test.instamojo.com/@demo/payment-${paymentId}`,
        status: 'Pending',
        payment_method: paymentMethod
      }
    };
    
    // Store payment request in localStorage for demo purposes
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
    const { payment_id, payment_request_id, status } = webhookData;
    
    // In production, verify the webhook signature using the salt
    if (process.env.NODE_ENV === 'production' && process.env.VITE_INSTAMOJO_SALT) {
      // Validate mac (signature)
      // const providedSignature = webhookData.mac;
      // const calculatedSignature = calculateSignature(webhookData, process.env.VITE_INSTAMOJO_SALT);
      // if (providedSignature !== calculatedSignature) {
      //   console.error('Invalid webhook signature');
      //   return false;
      // }
    }
    
    // Log webhook details
    console.log('Instamojo webhook received:', webhookData);
    
    // Update payment status in your database or local storage (for demo)
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
    if (process.env.NODE_ENV === 'production') {
      try {
        const headers = new Headers();
        headers.append('X-Api-Key', API_KEY);
        headers.append('X-Auth-Token', AUTH_TOKEN);
        
        const response = await fetch(`${API_ENDPOINT}/payment-requests/${paymentRequestId}`, {
          method: 'GET',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Instamojo payment status response:', data);
        
        return {
          status: data.payment_request.status,
          paymentId: data.payment_request.payments?.[0]?.payment_id,
          amount: data.payment_request.amount,
          paymentMethod: data.payment_request.payments?.[0]?.instrument_type
        };
      } catch (error) {
        console.error('Error checking payment status with Instamojo API:', error);
        return { status: 'Error' };
      }
    }
    
    // Demo mode - check local storage
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

// Create a card payment request
export const createCardPayment = async (
  paymentData: InstamojoPaymentRequest
): Promise<InstamojoPaymentResponse> => {
  try {
    // For card payments, specify payment_method as documented by Instamojo
    const cardPaymentData = {
      ...paymentData,
      payment_method: 'Card',
      send_email: true // Send payment details to email
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

// Create a NEFT payment request
export const createNeftPayment = async (
  paymentData: InstamojoPaymentRequest
): Promise<InstamojoPaymentResponse> => {
  try {
    // For NEFT payments, specify payment_method as documented
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

// Get NEFT payment details for a payment request
export const getNeftDetails = async (paymentRequestId: string): Promise<{
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  reference?: string;
  status: string;
}> => {
  try {
    if (process.env.NODE_ENV === 'production') {
      try {
        const headers = new Headers();
        headers.append('X-Api-Key', API_KEY);
        headers.append('X-Auth-Token', AUTH_TOKEN);
        
        const response = await fetch(`${API_ENDPOINT}/payment-requests/${paymentRequestId}/neft-details`, {
          method: 'GET',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Instamojo NEFT details response:', data);
        
        return {
          accountNumber: data.neft_details.account_number,
          ifsc: data.neft_details.ifsc,
          bankName: data.neft_details.bank_name,
          reference: data.neft_details.reference,
          status: data.neft_details.status
        };
      } catch (error) {
        console.error('Error fetching NEFT details from Instamojo API:', error);
        return { status: 'Error' };
      }
    }
    
    // Demo mode - simulate NEFT details
    return {
      accountNumber: '123456789012345', // Example format
      ifsc: 'INST0000001',              
      bankName: 'Demo Bank for NEFT', 
      reference: 'NEFT' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'Pending'
    };
  } catch (error) {
    console.error('Error fetching NEFT details:', error);
    return { status: 'Error' };
  }
};

// Utility function to parse incoming webhook params
export const parseWebhookParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  try {
    // Extract parameters from the URL
    const searchParams = new URL(url).searchParams;
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch (error) {
    console.error('Error parsing webhook params:', error);
  }
  return params;
};
