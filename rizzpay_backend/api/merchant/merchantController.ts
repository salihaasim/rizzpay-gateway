
import { Request, Response } from 'express';
import { MerchantService } from '../../services/MerchantService';

export class MerchantController {
  static async createMerchant(req: Request, res: Response) {
    try {
      const result = await MerchantService.createMerchantProfile(req.body);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Create merchant error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getMerchant(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const merchant = await MerchantService.getMerchantProfile(merchantId);
      
      res.json({
        success: true,
        data: merchant
      });

    } catch (error) {
      console.error('Get merchant error:', error);
      res.status(404).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  static async updateMerchant(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const result = await MerchantService.updateMerchantProfile(merchantId, req.body);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Update merchant error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async addMerchantAccount(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const accountData = { ...req.body, merchant_id: merchantId };
      
      const result = await MerchantService.addMerchantAccount(accountData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Add merchant account error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getMerchantAccounts(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const accounts = await MerchantService.getMerchantAccounts(merchantId);
      
      res.json({
        success: true,
        data: accounts
      });

    } catch (error) {
      console.error('Get merchant accounts error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  static async generateApiKey(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const result = await MerchantService.generateApiKey(merchantId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Generate API key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getWalletBalance(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const balance = await MerchantService.getMerchantWalletBalance(merchantId);
      
      res.json({
        success: true,
        balance
      });

    } catch (error) {
      console.error('Get wallet balance error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateVerificationStatus(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const { status, notes } = req.body;
      
      const result = await MerchantService.updateMerchantVerificationStatus(
        merchantId, 
        status, 
        notes
      );
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Update verification status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
