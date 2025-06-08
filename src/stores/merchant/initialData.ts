
import { Merchant } from './types';

// Initial merchant data
export const initialMerchants: Merchant[] = [
  {
    username: 'merchant',
    password: 'password',
    fullName: 'Demo Merchant',
    email: 'merchant@rizzpay.com',
    role: 'merchant',
    id: 'merchant-001',
    upiSettings: {
      upiId: 'merchant@rizzpay',
      name: 'Demo Merchant',
      enabled: true,
      allowManualVerification: true
    },
    bankAccounts: [],
    pricing: {
      transactionFee: 1.0,
      fixedFee: 5,
      monthlyFee: 499
    },
    apiKey: 'rizz_api_key_demo_merchant'
  },
  {
    username: 'rizzpay',
    password: 'rizzpay123',
    fullName: 'Admin User',
    email: 'admin@rizzpay.com',
    role: 'admin',
    id: 'admin-001',
    upiSettings: {
      upiId: 'admin@rizzpay',
      name: 'Admin User',
      enabled: true,
      allowManualVerification: true
    },
    bankAccounts: [],
    pricing: {
      transactionFee: 0,
      fixedFee: 0,
      monthlyFee: 0
    },
    apiKey: 'rizz_api_key_admin'
  }
];
