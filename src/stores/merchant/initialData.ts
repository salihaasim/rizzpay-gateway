
import { Merchant } from './types';

// Initial merchant data
export const initialMerchants: Merchant[] = [
  {
    username: 'merchant',
    password: 'password',
    fullName: 'Demo Merchant',
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
  }
];
