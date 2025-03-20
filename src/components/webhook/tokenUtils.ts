
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode, jwtEncode } from './jwtHelper';

// Create a webhook token
export const createWebhookToken = (userEmail: string): string => {
  // Create a token with user email and an expiration date (1 year)
  const now = new Date();
  const expiration = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  const tokenData = {
    id: uuidv4(),
    email: userEmail,
    exp: Math.floor(expiration.getTime() / 1000),
    iat: Math.floor(now.getTime() / 1000)
  };
  
  return jwtEncode(tokenData);
};

// Validate a webhook token
export const validateWebhookToken = (token: string): { 
  valid: boolean; 
  email?: string;
  error?: string;
} => {
  try {
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { valid: false, error: 'Token expired' };
    }
    
    // Token is valid
    return { valid: true, email: decoded.email };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
};
