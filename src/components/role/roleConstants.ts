
// Demo credentials
export const demoCredentials = {
  admin: {
    username: 'rizzpay',
    password: 'rizzpay123'
  },
  merchant: {
    username: 'merchant',
    password: 'password'
  }
};

// Role definitions
export const roles = {
  admin: {
    name: 'Admin',
    description: 'Full access to all features and settings',
    permissions: [
      'manage_merchants',
      'view_all_transactions',
      'manage_settings',
      'access_admin_dashboard'
    ]
  },
  merchant: {
    name: 'Merchant',
    description: 'Access to merchant dashboard and features',
    permissions: [
      'view_own_transactions',
      'manage_own_settings',
      'access_merchant_dashboard'
    ]
  }
};
