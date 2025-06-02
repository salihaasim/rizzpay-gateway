
import { Request, Response } from 'express';
import { PayoutService } from '../../services/PayoutService';
import { WebhookService } from '../../services/WebhookService';
import { MerchantService } from '../../services/MerchantService';

export class PayoutController {
  static async createPayout(req: Request, res: Response) {
    try {
      const { merchant_id } = req.body;
      
      // Validate merchant exists and is active
      const merchant = await MerchantService.getMerchantProfile(merchant_id);
      if (!merchant || !merchant.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inactive merchant'
        });
      }

      // Check wallet balance
      const walletBalance = await MerchantService.getMerchantWalletBalance(merchant_id);
      if (walletBalance < req.body.amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }

      const result = await PayoutService.createPayoutRequest(req.body);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Create payout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getPayoutStatus(req: Request, res: Response) {
    try {
      const { payoutId } = req.params;
      const payout = await PayoutService.getPayoutStatus(payoutId);
      
      res.json({
        success: true,
        data: payout
      });

    } catch (error) {
      console.error('Get payout status error:', error);
      res.status(404).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  static async getMerchantPayouts(req: Request, res: Response) {
    try {
      const { merchantId } = req.params;
      const { page = 1, limit = 20, status, method } = req.query;

      const filters = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string,
        method: method as string
      };

      const result = await PayoutService.getMerchantPayouts(merchantId, filters);
      
      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      console.error('Get merchant payouts error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  static async retryPayout(req: Request, res: Response) {
    try {
      const { payoutId } = req.params;
      const result = await PayoutService.retryFailedPayout(payoutId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Retry payout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      const result = await WebhookService.processPayoutWebhook(req.body);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
