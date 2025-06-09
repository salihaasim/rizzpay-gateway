
/**
 * Comprehensive validation utilities for RizzPay
 * Contains business-specific validation functions
 */

// PAN validation (Format: AAAAA9999A)
export const validate_pan = (pan: string): { isValid: boolean; error?: string } => {
  if (!pan) {
    return { isValid: false, error: 'PAN number is required' };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  if (!panRegex.test(pan.toUpperCase())) {
    return { isValid: false, error: 'Invalid PAN format. Expected format: AAAAA9999A' };
  }

  return { isValid: true };
};

// GST validation (15 digit alphanumeric)
export const validate_gst = (gst: string): { isValid: boolean; error?: string } => {
  if (!gst) {
    return { isValid: false, error: 'GST number is required' };
  }

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstRegex.test(gst.toUpperCase())) {
    return { isValid: false, error: 'Invalid GST format. Expected 15-digit alphanumeric GST number' };
  }

  return { isValid: true };
};

// Email validation (RFC compliant)
export const validate_email = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

// Phone validation (Indian format)
export const validate_phone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check for Indian mobile numbers (10 digits starting with 6-9)
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  if (!indianMobileRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid Indian mobile number. Must be 10 digits starting with 6-9' };
  }

  return { isValid: true };
};

// IFSC Code validation
export const validate_ifsc = (ifsc: string): { isValid: boolean; error?: string } => {
  if (!ifsc) {
    return { isValid: false, error: 'IFSC code is required' };
  }

  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return { isValid: false, error: 'Invalid IFSC format. Expected format: ABCD0123456' };
  }

  return { isValid: true };
};

// Bank Account Number validation
export const validate_account_number = (accountNumber: string): { isValid: boolean; error?: string } => {
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }

  const cleanAccountNumber = accountNumber.replace(/\s/g, '');
  
  if (cleanAccountNumber.length < 9 || cleanAccountNumber.length > 18) {
    return { isValid: false, error: 'Account number must be between 9 and 18 digits' };
  }

  if (!/^\d+$/.test(cleanAccountNumber)) {
    return { isValid: false, error: 'Account number must contain only digits' };
  }

  return { isValid: true };
};

// Amount validation for payments
export const validate_amount = (amount: number | string): { isValid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount > 200000) {
    return { isValid: false, error: 'Amount cannot exceed ₹2,00,000 per transaction' };
  }

  // Check for more than 2 decimal places
  if (amount.toString().split('.')[1]?.length > 2) {
    return { isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }

  return { isValid: true };
};

// UPI ID validation
export const validate_upi_id = (upiId: string): { isValid: boolean; error?: string } => {
  if (!upiId) {
    return { isValid: false, error: 'UPI ID is required' };
  }

  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  
  if (!upiRegex.test(upiId)) {
    return { isValid: false, error: 'Invalid UPI ID format' };
  }

  return { isValid: true };
};

// Business validation helper
export const validate_business_form = (data: {
  businessName: string;
  businessType: string;
  pan: string;
  gst?: string;
  email: string;
  phone: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.businessName || data.businessName.length < 2) {
    errors.businessName = 'Business name must be at least 2 characters';
  }

  if (!data.businessType) {
    errors.businessType = 'Business type is required';
  }

  const panValidation = validate_pan(data.pan);
  if (!panValidation.isValid) {
    errors.pan = panValidation.error!;
  }

  if (data.gst) {
    const gstValidation = validate_gst(data.gst);
    if (!gstValidation.isValid) {
      errors.gst = gstValidation.error!;
    }
  }

  const emailValidation = validate_email(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  const phoneValidation = validate_phone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate secure transaction ID
export const generate_transaction_id = (prefix: string = 'RP'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${timestamp}${randomPart}`;
};

// Generate secure API key
export const generate_api_key = (prefix: string = 'rizz_'): string => {
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}_${randomPart1}_${randomPart2}`;
};

// Validate API key format
export const validate_api_key = (apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey) {
    return { isValid: false, error: 'API key is required' };
  }

  if (!apiKey.startsWith('rizz_')) {
    return { isValid: false, error: 'Invalid API key format' };
  }

  if (apiKey.length < 20) {
    return { isValid: false, error: 'API key is too short' };
  }

  return { isValid: true };
};
