
import crypto from 'crypto';

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
}

export interface DecryptionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class AESEncryption {
  private static readonly ALGORITHM = 'aes-256-cbc';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits

  /**
   * Derive encryption key from environment variable
   */
  private static getEncryptionKey(bankCode?: string): Buffer {
    let keyString = process.env.AES_ENCRYPTION_KEY;
    
    // Use bank-specific key if available
    if (bankCode) {
      const bankKeyEnv = `${bankCode.toUpperCase()}_BANK_AES_KEY`;
      keyString = process.env[bankKeyEnv] || keyString;
    }
    
    if (!keyString) {
      throw new Error('AES encryption key not found in environment variables');
    }
    
    // Create a 256-bit key from the string
    return crypto.scryptSync(keyString, 'salt', this.KEY_LENGTH);
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(data: any, bankCode?: string): EncryptionResult {
    try {
      const key = this.getEncryptionKey(bankCode);
      const iv = crypto.randomBytes(this.IV_LENGTH);
      
      const cipher = crypto.createCipher(this.ALGORITHM, key);
      cipher.setAutoPadding(true);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      return {
        encryptedData: encrypted,
        iv: iv.toString('base64')
      };
    } catch (error) {
      throw new Error(`AES encryption failed: ${(error as Error).message}`);
    }
  }

  /**
   * Decrypt encrypted data
   */
  static decrypt(encryptedData: string, iv: string, bankCode?: string): DecryptionResult {
    try {
      const key = this.getEncryptionKey(bankCode);
      const ivBuffer = Buffer.from(iv, 'base64');
      
      const decipher = crypto.createDecipher(this.ALGORITHM, key);
      decipher.setAutoPadding(true);
      
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return {
        success: true,
        data: JSON.parse(decrypted)
      };
    } catch (error) {
      return {
        success: false,
        error: `AES decryption failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Encrypt payout request data
   */
  static encryptPayoutData(payoutData: {
    amount: number;
    account_number: string;
    ifsc_code: string;
    beneficiary_name: string;
    [key: string]: any;
  }, bankCode: string): EncryptionResult {
    const sensitiveData = {
      amount: payoutData.amount,
      account_number: payoutData.account_number,
      ifsc_code: payoutData.ifsc_code,
      beneficiary_name: payoutData.beneficiary_name,
      timestamp: new Date().toISOString()
    };
    
    return this.encrypt(sensitiveData, bankCode);
  }

  /**
   * Encrypt merchant token
   */
  static encryptMerchantToken(token: string, merchantId: string, bankCode: string): EncryptionResult {
    const tokenData = {
      token,
      merchant_id: merchantId,
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    return this.encrypt(tokenData, bankCode);
  }

  /**
   * Generate encrypted signature for API requests
   */
  static generateSignature(data: any, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  /**
   * Validate encrypted signature
   */
  static validateSignature(data: any, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(data, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}
