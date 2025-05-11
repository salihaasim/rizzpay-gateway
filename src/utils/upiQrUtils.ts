
/**
 * Generate a UPI URL for payment
 * @param upiId The UPI ID to send payment to
 * @param amount The payment amount
 * @param description Description of the payment
 * @returns A UPI URL string that can be used to generate a QR code
 */
export const generateUpiUrl = (upiId: string, amount: number, description: string = ''): string => {
  const encodedDesc = encodeURIComponent(description);
  return `upi://pay?pa=${upiId}&pn=${encodedDesc}&am=${amount}&cu=INR`;
};

/**
 * Validate a UPI ID format
 * @param upiId The UPI ID to validate
 * @returns Boolean indicating if the UPI ID is valid
 */
export const validateUpiId = (upiId: string): boolean => {
  // Basic validation - UPI ID should contain @ symbol
  // In production, more sophisticated validation might be needed
  return upiId.includes('@') && upiId.length >= 3;
};

/**
 * Get display name from UPI ID
 * @param upiId The UPI ID
 * @returns The username part of the UPI ID
 */
export const getUpiDisplayName = (upiId: string): string => {
  if (!upiId || !upiId.includes('@')) return upiId;
  return upiId.split('@')[0];
};

/**
 * Get bank name from UPI ID
 * @param upiId The UPI ID
 * @returns The bank part of the UPI ID or empty string if not found
 */
export const getUpiBankName = (upiId: string): string => {
  if (!upiId || !upiId.includes('@')) return '';
  const bankPart = upiId.split('@')[1];
  
  // Map common UPI handles to bank names
  const bankMap: Record<string, string> = {
    'okaxis': 'Axis Bank',
    'okhdfcbank': 'HDFC Bank',
    'okicici': 'ICICI Bank',
    'oksbi': 'State Bank of India',
    'okbizaxis': 'Axis Bank Business',
    'upi': 'UPI',
    'ybl': 'PhonePe',
    'paytm': 'Paytm',
    'gpay': 'Google Pay'
  };
  
  // Try to match known banks
  for (const [handle, bankName] of Object.entries(bankMap)) {
    if (bankPart.includes(handle)) {
      return bankName;
    }
  }
  
  return bankPart; // Return the raw bank part if no match
};
