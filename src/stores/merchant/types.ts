export interface Merchant {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role: 'admin' | 'merchant';
  id?: string;
  upiSettings?: UpiSettings;
  bankAccounts?: BankAccount[];
  pricing?: PricingStructure;
  apiKey?: string;
}

export interface UpiSettings {
  upiId: string;
  name: string;
  enabled: boolean;
  allowManualVerification: boolean;
  customWebhookUrl?: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  isVerified: boolean;
  isPrimary?: boolean;
}

export interface PricingStructure {
  transactionFee: number; // percentage
  fixedFee: number; // fixed amount in rupees
  monthlyFee: number; // monthly subscription fee
}

export interface MerchantStore {
  isAuthenticated: boolean;
  currentMerchant: Merchant | null;
  merchants: Merchant[];
  loading: boolean;
  
  // Auth actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Merchant management
  addMerchant: (merchant: Merchant) => void;
  updateMerchantDetails: (merchant: Partial<Merchant>) => void;
  changePassword: (username: string, currentPassword: string, newPassword: string) => boolean;
  
  // Settings actions
  updateMerchantPricing: (merchantUsername: string, pricing: PricingStructure) => void;
  updateMerchantUpiSettings: (settings: UpiSettings) => void;
}
