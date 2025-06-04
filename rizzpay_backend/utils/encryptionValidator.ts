
import { AESEncryption } from './aesEncryption';
import { BankEncryptionService } from '../config/bankEncryption';

export interface EncryptionTestResult {
  success: boolean;
  bankCode: string;
  testType: string;
  duration: number;
  error?: string;
}

export class EncryptionValidator {
  /**
   * Test AES encryption/decryption for a specific bank
   */
  static async testBankEncryption(bankCode: string): Promise<EncryptionTestResult> {
    const startTime = Date.now();
    
    try {
      const testData = {
        amount: 1000.50,
        account_number: "1234567890",
        ifsc_code: "HDFC0001234",
        beneficiary_name: "Test Beneficiary"
      };

      // Test encryption
      const encrypted = AESEncryption.encryptPayoutData(testData, bankCode);
      
      // Test decryption
      const decrypted = AESEncryption.decrypt(encrypted.encryptedData, encrypted.iv, bankCode);
      
      if (!decrypted.success) {
        throw new Error(decrypted.error);
      }

      // Validate decrypted data matches original
      const originalAmount = testData.amount;
      const decryptedAmount = decrypted.data.amount;
      
      if (originalAmount !== decryptedAmount) {
        throw new Error('Decrypted data does not match original');
      }

      return {
        success: true,
        bankCode,
        testType: 'payout_encryption',
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        bankCode,
        testType: 'payout_encryption',
        duration: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }

  /**
   * Test merchant token encryption for a bank
   */
  static async testTokenEncryption(bankCode: string): Promise<EncryptionTestResult> {
    const startTime = Date.now();
    
    try {
      const testToken = 'test_merchant_token_12345';
      const testMerchantId = 'merchant_67890';

      // Test token encryption
      const encrypted = AESEncryption.encryptMerchantToken(testToken, testMerchantId, bankCode);
      
      // Test token decryption
      const decrypted = AESEncryption.decrypt(encrypted.encryptedData, encrypted.iv, bankCode);
      
      if (!decrypted.success) {
        throw new Error(decrypted.error);
      }

      // Validate token matches
      if (decrypted.data.token !== testToken) {
        throw new Error('Decrypted token does not match original');
      }

      return {
        success: true,
        bankCode,
        testType: 'token_encryption',
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        bankCode,
        testType: 'token_encryption',
        duration: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }

  /**
   * Run comprehensive encryption tests for all banks
   */
  static async runAllTests(): Promise<EncryptionTestResult[]> {
    const results: EncryptionTestResult[] = [];
    const bankCodes = ['canara', 'hdfc', 'sbm', 'icici'];

    for (const bankCode of bankCodes) {
      // Test payout encryption
      const payoutTest = await this.testBankEncryption(bankCode);
      results.push(payoutTest);

      // Test token encryption
      const tokenTest = await this.testTokenEncryption(bankCode);
      results.push(tokenTest);

      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Validate bank compliance requirements
   */
  static validateBankCompliance(bankCode: string): {
    compliant: boolean;
    requirements: string[];
    missing: string[];
  } {
    const config = BankEncryptionService.getEncryptionConfig(bankCode);
    const requirements: string[] = [];
    const missing: string[] = [];

    if (!config) {
      return {
        compliant: false,
        requirements: ['Bank configuration'],
        missing: ['Bank configuration not found']
      };
    }

    // Check encryption requirements
    if (config.encryptionRequired) {
      requirements.push('AES-256-CBC encryption');
      
      // Check if encryption key is available
      const keyEnvVar = `${bankCode.toUpperCase()}_BANK_AES_KEY`;
      if (!process.env[keyEnvVar] && !process.env.AES_ENCRYPTION_KEY) {
        missing.push(`Encryption key (${keyEnvVar})`);
      }
    }

    // Check signature requirements
    if (config.signatureMethod) {
      requirements.push(`${config.signatureMethod} signature`);
    }

    // Check webhook encryption
    if (config.webhookEncryption) {
      requirements.push('Webhook encryption support');
    }

    return {
      compliant: missing.length === 0,
      requirements,
      missing
    };
  }

  /**
   * Performance benchmark for encryption operations
   */
  static async benchmarkEncryption(iterations: number = 100): Promise<{
    avgEncryptionTime: number;
    avgDecryptionTime: number;
    totalOperations: number;
  }> {
    const testData = { test: 'performance benchmark data' };
    let totalEncryptTime = 0;
    let totalDecryptTime = 0;

    for (let i = 0; i < iterations; i++) {
      // Benchmark encryption
      const encryptStart = Date.now();
      const encrypted = AESEncryption.encrypt(testData);
      totalEncryptTime += Date.now() - encryptStart;

      // Benchmark decryption
      const decryptStart = Date.now();
      AESEncryption.decrypt(encrypted.encryptedData, encrypted.iv);
      totalDecryptTime += Date.now() - decryptStart;
    }

    return {
      avgEncryptionTime: totalEncryptTime / iterations,
      avgDecryptionTime: totalDecryptTime / iterations,
      totalOperations: iterations * 2
    };
  }
}
