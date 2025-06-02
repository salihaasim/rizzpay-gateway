
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    req.user = {
      id: user.id,
      email: user.email || '',
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

export const authenticateApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required'
      });
    }
    
    const { data: merchant, error } = await supabase
      .from('merchant_profiles')
      .select('id, contact_email, is_active')
      .eq('api_key', apiKey)
      .single();
    
    if (error || !merchant || !merchant.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    req.user = {
      id: merchant.id,
      email: merchant.contact_email,
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'API key verification failed'
    });
  }
};
