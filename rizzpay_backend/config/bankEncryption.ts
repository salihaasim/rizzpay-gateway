
export interface BankEncryptionConfig {
  bankCode: string;
  bankName: string;
  encryptionRequired: boolean;
  algorithm: string;
  keyLength: number;
  ivLength: number;
  signatureMethod: string;
  encryptedFields: string[];
  responseEncryption: boolean;
  webhookEncryption: boolean;
}

export const BANK_ENCRYPTION_CONFIGS: Record<string, BankEncryptionConfig> = {
  'canara': {
    bankCode: 'canara',
    bankName: 'Canara Bank',
    encryptionRequired: true,
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    signatureMethod: 'HMAC-SHA256',
    encryptedFields: ['amount', 'account_number', 'ifsc_code', 'beneficiary_name', 'merchant_token'],
    responseEncryption: true,
    webhookEncryption: true
  },
  'hdfc': {
    bankCode: 'hdfc',
    bankName: 'HDFC Bank',
    encryptionRequired: true,
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    signatureMethod: 'HMAC-SHA256',
    encryptedFields: ['amount', 'account_number', 'merchant_token'],
    responseEncryption: false,
    webhookEncryption: true
  },
  'sbm': {
    bankCode: 'sbm',
    bankName: 'SBM Bank',
    encryptionRequired: false,
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    signatureMethod: 'HMAC-SHA256',
    encryptedFields: ['merchant_token'],
    responseEncryption: false,
    webhookEncryption: false
  },
  'icici': {
    bankCode: 'icici',
    bankName: 'ICICI Bank',
    encryptionRequired: true,
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    signatureMethod: 'HMAC-SHA256',
    encryptedFields: ['amount', 'account_number', 'ifsc_code', 'merchant_token'],
    responseEncryption: true,
    webhookEncryption: true
  }
};

export class BankEncryptionService {
  static getEncryptionConfig(bankCode: string): BankEncryptionConfig | null {
    return BANK_ENCRYPTION_CONFIGS[bankCode] || null;
  }

  static isEncryptionRequired(bankCode: string): boolean {
    const config = this.getEncryptionConfig(bankCode);
    return config ? config.encryptionRequired : false;
  }

  static shouldEncryptField(bankCode: string, fieldName: string): boolean {
    const config = this.getEncryptionConfig(bankCode);
    return config ? config.encryptedFields.includes(fieldName) : false;
  }

  static shouldEncryptWebhook(bankCode: string): boolean {
    const config = this.getEncryptionConfig(bankCode);
    return config ? config.webhookEncryption : false;
  }

  static shouldEncryptResponse(bankCode: string): boolean {
    const config = this.getEncryptionConfig(bankCode);
    return config ? config.responseEncryption : false;
  }
}
