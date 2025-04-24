
/**
 * RizzPay Gambling Mode - API Routes
 * Defines the API endpoints for gambling mode functionality
 */

interface GamblingModeApiConfig {
  baseUrl: string;
  apiVersion: string;
  requiresToken: boolean;
}

// API Endpoint Configuration
export const gamblingModeApiConfig: GamblingModeApiConfig = {
  baseUrl: '/gambling_mode',
  apiVersion: 'v1',
  requiresToken: true
};

// API Routes
export const GAMBLING_API_ROUTES = {
  // Admin Routes
  ENABLE_GAMBLING_MODE: '/admin/gambling/enable',
  DISABLE_GAMBLING_MODE: '/admin/gambling/disable',
  UPDATE_GAMBLING_SETTINGS: '/admin/gambling/settings',
  GET_GAMBLING_MERCHANTS: '/admin/gambling/merchants',
  
  // Merchant Routes
  GET_GAMBLING_STATUS: '/gambling/status',
  
  // Payment Routes
  CREATE_GAMBLING_DEPOSIT: '/gambling/deposit',
  CREATE_GAMBLING_WITHDRAWAL: '/gambling/withdraw',
  GENERATE_STATIC_QR: '/gambling/qr/static',
  GENERATE_DYNAMIC_QR: '/gambling/qr/dynamic',
  CHECK_GAMBLING_PAYMENT_STATUS: '/gambling/payment/status',
  
  // Payout Routes
  QUEUE_GAMBLING_PAYOUT: '/gambling/payout/queue',
  GAMBLING_PAYOUT_STATUS: '/gambling/payout/status',
  
  // Risk Control Routes
  BLOCK_IP: '/gambling/risk/block-ip',
  UNBLOCK_IP: '/gambling/risk/unblock-ip',
  CHECK_SUSPICIOUS_ACTIVITY: '/gambling/risk/check-activity'
};

/**
 * Generate a complete API URL for gambling mode endpoints
 */
export const getGamblingApiUrl = (endpoint: string): string => {
  const { baseUrl, apiVersion } = gamblingModeApiConfig;
  return `${baseUrl}/${apiVersion}${endpoint}`;
};

/**
 * Check if a given URL path matches any gambling mode API route
 */
export const isGamblingModeApiRoute = (path: string): boolean => {
  return path.startsWith(gamblingModeApiConfig.baseUrl);
};

/**
 * Get authentication requirements for a gambling mode API route
 */
export const getRouteAuthRequirements = (route: string): {
  requiresAuth: boolean;
  requiredRole?: 'admin' | 'merchant';
} => {
  // Admin routes require admin authentication
  if (route.includes('/admin/')) {
    return {
      requiresAuth: true,
      requiredRole: 'admin'
    };
  }
  
  // All other gambling routes require authentication
  return {
    requiresAuth: true
  };
};
