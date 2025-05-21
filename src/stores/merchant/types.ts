
// Interface for bank accounts
export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isPrimary: boolean;
}

// Interface for UPI settings
export interface UpiSettings {
  upiId: string;
  name: string;
  enabled: boolean;
  allowManualVerification: boolean;
  customWebhookUrl?: string;
}

// Interface for pricing structure
export interface PricingStructure {
  transactionFee: number;
  fixedFee: number;
  monthlyFee: number;
}

export interface Merchant {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role?: 'admin' | 'merchant';
  id?: string;
  upiSettings?: UpiSettings;
  bankAccounts?: BankAccount[];
  pricing?: PricingStructure;
  apiKey?: string;
}

export interface MerchantStore {
  isAuthenticated: boolean;
  currentMerchant: Merchant | null;
  merchants: Merchant[];
  loading: boolean;
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addMerchant: (merchant: Merchant) => void;
  updateMerchantDetails: (merchant: Partial<Merchant>) => void;
  changePassword: (username: string, currentPassword: string, newPassword: string) => boolean;
  updateMerchantPricing: (merchantUsername: string, pricing: PricingStructure) => void;
  updateMerchantUpiSettings: (settings: UpiSettings) => void;
}
