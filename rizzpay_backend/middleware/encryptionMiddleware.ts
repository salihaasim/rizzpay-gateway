
import { Request, Response, NextFunction } from 'express';
import { AESEncryption } from '../utils/aesEncryption';
import { BankEncryptionService } from '../config/bankEncryption';

export interface EncryptedRequest extends Request {
  bankCode?: string;
  encryptedData?: any;
  originalBody?: any;
}

export const encryptionMiddleware = (bankCode?: string) => {
  return async (req: EncryptedRequest, res: Response, next: NextFunction) => {
    try {
      // Extract bank code from request if not provided
      const requestBankCode = bankCode || req.headers['x-bank-code'] as string || req.body.bank_code;
      
      if (!requestBankCode) {
        return next();
      }

      req.bankCode = requestBankCode;

      // Check if encryption is required for this bank
      if (!BankEncryptionService.isEncryptionRequired(requestBankCode)) {
        return next();
      }

      // Store original body
      req.originalBody = { ...req.body };

      // Encrypt sensitive fields in request body
      if (req.body && Object.keys(req.body).length > 0) {
        const encryptedBody = await encryptSensitiveFields(req.body, requestBankCode);
        req.body = encryptedBody;
      }

      next();
    } catch (error) {
      console.error('Encryption middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Encryption processing failed',
        error: (error as Error).message
      });
    }
  };
};

export const decryptionMiddleware = (bankCode?: string) => {
  return async (req: EncryptedRequest, res: Response, next: NextFunction) => {
    try {
      const requestBankCode = bankCode || req.headers['x-bank-code'] as string;
      
      if (!requestBankCode || !BankEncryptionService.shouldEncryptWebhook(requestBankCode)) {
        return next();
      }

      // Decrypt webhook data if encrypted
      if (req.body.encrypted_data && req.body.iv) {
        const decryptionResult = AESEncryption.decrypt(
          req.body.encrypted_data,
          req.body.iv,
          requestBankCode
        );

        if (decryptionResult.success) {
          req.body = decryptionResult.data;
        } else {
          throw new Error(decryptionResult.error);
        }
      }

      next();
    } catch (error) {
      console.error('Decryption middleware error:', error);
      res.status(400).json({
        success: false,
        message: 'Decryption failed',
        error: (error as Error).message
      });
    }
  };
};

async function encryptSensitiveFields(data: any, bankCode: string): Promise<any> {
  const config = BankEncryptionService.getEncryptionConfig(bankCode);
  if (!config) return data;

  const result = { ...data };
  
  for (const field of config.encryptedFields) {
    if (result[field] !== undefined) {
      try {
        const encrypted = AESEncryption.encrypt(result[field], bankCode);
        result[`${field}_encrypted`] = encrypted.encryptedData;
        result[`${field}_iv`] = encrypted.iv;
        delete result[field]; // Remove original field
      } catch (error) {
        console.error(`Failed to encrypt field ${field}:`, error);
      }
    }
  }

  return result;
}

export const logEncryptedRequest = (req: EncryptedRequest, res: Response, next: NextFunction) => {
  if (req.bankCode && BankEncryptionService.isEncryptionRequired(req.bankCode)) {
    console.log(`Encrypted request to ${req.bankCode}:`, {
      method: req.method,
      url: req.url,
      bankCode: req.bankCode,
      hasEncryptedData: !!req.body.encrypted_data,
      timestamp: new Date().toISOString()
    });
  }
  next();
};
