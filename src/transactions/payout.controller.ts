
import { Request, Response } from 'express';
import { PayoutService } from './payout.service';

export class PayoutController {
  static async createPayoutRequest(req: Request, res: Response) {
    try {
      const { merchantId, amount, beneficiaryName, accountNumber, ifscCode, upiId, payoutMethod } = req.body;

      // Validate required fields
      if (!merchantId || !amount || !payoutMethod) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: merchantId, amount, payoutMethod'
        });
      }

      // Validate payout method specific fields
      if (payoutMethod === 'bank_transfer' && (!beneficiaryName || !accountNumber || !ifscCode)) {
        return res.status(400).json({
          success: false,
          message: 'Bank transfer requires: beneficiaryName, accountNumber, ifscCode'
        });
      }

      if (payoutMethod === 'upi' && !upiId) {
        return res.status(400).json({
          success: false,
          message: 'UPI payout requires: upiId'
        });
      }

      const payoutRequest = await PayoutService.createPayout({
        merchantId,
        amount,
        beneficiaryName,
        accountNumber,
        ifscCode,
        upiId,
        payoutMethod
      });

      res.status(201).json({
        success: true,
        message: 'Payout request created successfully',
        data: payoutRequest
      });
    } catch (error) {
      console.error('Payout creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payout request',
        error: error.message
      });
    }
  }

  static async getPayoutRequests(req: Request, res: Response) {
    try {
      const { merchantId, status, page = 1, limit = 20 } = req.query;

      const filters = {
        merchantId: merchantId as string,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const result = await PayoutService.getPayouts(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get payouts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payout requests',
        error: error.message
      });
    }
  }

  static async updatePayoutStatus(req: Request, res: Response) {
    try {
      const { payoutId } = req.params;
      const { status, utrNumber, failureReason, adminNotes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const result = await PayoutService.updatePayoutStatus(payoutId, {
        status,
        utrNumber,
        failureReason,
        adminNotes
      });

      res.status(200).json({
        success: true,
        message: 'Payout status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Update payout status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payout status',
        error: error.message
      });
    }
  }
}
