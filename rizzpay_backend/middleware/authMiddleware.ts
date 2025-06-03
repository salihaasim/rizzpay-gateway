
import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../services/MerchantService';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
    business_name: string;
    is_active: boolean;
  };
}

export const authenticateApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return next(createError('API key is required', 401));
    }
    
    if (!apiKey.startsWith('rizz_')) {
      return next(createError('Invalid API key format', 401));
    }
    
    const merchant = await MerchantService.validateMerchantApiKey(apiKey);
    
    if (!merchant) {
      return next(createError('Invalid or inactive API key', 401));
    }
    
    req.merchant = merchant;
    next();
    
  } catch (error) {
    next(createError('Authentication failed', 401));
  }
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return next(createError('Access token is required', 401));
    }
    
    // In production, verify JWT token here
    // For now, we'll just check if it's not empty
    if (token === 'admin-token') {
      next();
    } else {
      next(createError('Invalid access token', 401));
    }
    
  } catch (error) {
    next(createError('Token verification failed', 401));
  }
};
