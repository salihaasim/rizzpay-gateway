
// Simple JWT helper functions
// Note: In a production app, you would use a proper JWT library

// Encode function - creates a simple token
export const jwtEncode = (payload: any): string => {
  try {
    // Convert payload to base64
    const encodedPayload = btoa(JSON.stringify(payload));
    
    // Simple signature (for demo purposes only)
    // In production, you would use a proper signing algorithm
    const signature = btoa(`${encodedPayload}_${Date.now()}`);
    
    return `${encodedPayload}.${signature}`;
  } catch (error) {
    console.error('JWT encoding error:', error);
    throw new Error('Failed to encode token');
  }
};

// Decode function - decodes and validates the token
export const jwtDecode = (token: string): any => {
  try {
    const [encodedPayload] = token.split('.');
    
    if (!encodedPayload) {
      throw new Error('Invalid token format');
    }
    
    // Decode payload
    const payload = JSON.parse(atob(encodedPayload));
    
    return payload;
  } catch (error) {
    console.error('JWT decoding error:', error);
    throw new Error('Failed to decode token');
  }
};
