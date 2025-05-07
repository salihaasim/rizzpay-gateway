
/**
 * SLAM Engine - Smart Labeling & Masking Module
 * Types and interfaces for transaction obfuscation
 */

export interface UpiHandle {
  handle: string;
  bank: string;
  daily_limit: number;
  used_today: number;
  is_active: boolean;
  last_used_at: string | null;
}

export interface MaskingRule {
  pattern: string | RegExp;
  replacement: string;
  priority: number;
}

export interface ObfuscationConfig {
  enable_upi_rotation: boolean;
  enable_label_rewriting: boolean;
  enable_merchant_obfuscation: boolean;
  enable_dashboard_cleaning: boolean;
  restricted_terms: string[];
  allowed_payment_labels: string[];
  rotation_frequency: 'per_transaction' | 'daily' | 'weekly';
}

export interface TransactionMaskingResult {
  originalValues: {
    payeeName: string;
    description: string;
    upiId: string;
    merchantName: string;
  };
  maskedValues: {
    payeeName: string;
    description: string;
    upiId: string;
    merchantName: string;
  };
  maskingApplied: boolean;
}
