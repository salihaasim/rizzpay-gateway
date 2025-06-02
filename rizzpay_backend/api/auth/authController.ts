
import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';
import { loginSchema, registerSchema } from '../../validators/authValidators';
import { generateApiKey } from '../../utils/apiKeyGenerator';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          error: error.message
        });
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      res.json({
        success: true,
        data: {
          user: data.user,
          profile,
          session: data.session
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            business_name: validatedData.businessName,
            contact_phone: validatedData.phone
          }
        }
      });
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      // Create merchant profile
      if (data.user) {
        const apiKey = generateApiKey();
        
        await supabase
          .from('merchant_profiles')
          .insert({
            id: data.user.id,
            business_name: validatedData.businessName,
            business_type: validatedData.businessType,
            contact_email: validatedData.email,
            contact_phone: validatedData.phone,
            business_address: validatedData.address,
            pan_number: validatedData.panNumber,
            gst_number: validatedData.gstNumber,
            api_key: apiKey,
            verification_status: 'pending',
            is_active: false
          });
      }
      
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: { user: data.user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }
  
  static async logout(req: Request, res: Response) {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }
}
