import { supabase } from '../config/supabase';
import { PayoutService } from './PayoutService';
import crypto from "crypto";

export interface WebhookPayload {
  payout_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  utr_number?: string;
  bank_reference_id?: string;
  failure_reason?: string;
  timestamp: string;
  bank_response?: any;
}

interface MerchantWebhookSettings {
  webhook_url: string;
  webhook_secret?: string;
}

// Send webhook (W2, W3, W5)
async function sendMerchantWebhook(
  payload: any,
  merchantSetting: MerchantWebhookSettings,
  attempt = 1
): Promise<{ delivered: boolean; response_code: number; response_body: string }> {
  const { webhook_url, webhook_secret } = merchantSetting;
  const body = JSON.stringify(payload);

  // Compute SHA-256 signature (W5)
  let signature = "";
  if (webhook_secret) {
    signature = crypto.createHmac("sha256", webhook_secret)
      .update(body)
      .digest("hex");
  }

  try {
    const res = await fetch(webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RizzPay-Event": payload.event || "payout.status_updated",
        ...(signature ? { "X-RizzPay-Signature": signature } : {}),
      },
      body,
    });

    if (res.ok) {
      return {
        delivered: true,
        response_code: res.status,
        response_body: await res.text(),
      };
    } else {
      // Retry logic (W3): up to 3 tries with exponential backoff
      if (attempt < 3) {
        const backoff = Math.pow(2, attempt) * 1000;
        await new Promise((rs) => setTimeout(rs, backoff));
        return await sendMerchantWebhook(payload, merchantSetting, attempt + 1);
      }
      return {
        delivered: false,
        response_code: res.status,
        response_body: await res.text(),
      };
    }
  } catch (err: any) {
    if (attempt < 3) {
      const backoff = Math.pow(2, attempt) * 1000;
      await new Promise((rs) => setTimeout(rs, backoff));
      return await sendMerchantWebhook(payload, merchantSetting, attempt + 1);
    }
    return {
      delivered: false,
      response_code: 0,
      response_body: err.message || "Network error",
    };
  }
}

export class WebhookService {
  static async processPayoutWebhook(payload: WebhookPayload) {
    try {
      console.log('Processing payout webhook:', payload);
      
      const { payout_id, status, utr_number, bank_reference_id, failure_reason } = payload;
      
      // Update payout status
      await PayoutService.updatePayoutStatus(payout_id, status, {
        utr_number,
        bank_reference_id,
        failure_reason,
        updated_at: new Date().toISOString()
      });
      
      // Log webhook activity
      await this.logWebhookActivity(payload);
      
      // Send notification to merchant if configured
      await this.notifyMerchant(payout_id);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        payout_id
      };
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }
  
  private static async logWebhookActivity(payload: WebhookPayload) {
    try {
      await supabase
        .from('payout_webhooks')
        .insert({
          payout_request_id: payload.payout_id,
          webhook_type: 'status_update',
          payload: payload as any,
          response_code: 200,
          delivered: true
        });
    } catch (error) {
      console.error('Error logging webhook activity:', error);
    }
  }
  
  private static async notifyMerchant(payoutId: string) {
    try {
      // Get payout + merchant webhook settings
      const { data: payout } = await supabase
        .from("payout_requests")
        .select("*, merchant_payout_settings!inner(webhook_url,webhook_secret)")
        .eq("id", payoutId)
        .single();

      if (
        !payout ||
        !payout.merchant_payout_settings?.webhook_url
      )
        return;

      const { webhook_url, webhook_secret } = payout.merchant_payout_settings;

      const webhookPayload = {
        event: "payout.status_updated",
        payout_id: payout.id,
        status: payout.status,
        amount: payout.amount,
        currency: payout.currency,
        utr_number: payout.utr_number,
        timestamp: new Date().toISOString(),
      };

      // Send webhook with retry/signature logic
      const delivery = await sendMerchantWebhook(webhookPayload, {
        webhook_url,
        webhook_secret,
      });

      // Log delivery
      await supabase.from("payout_webhooks").insert({
        payout_request_id: payout.id,
        webhook_type: "status_update",
        payload: webhookPayload,
        response_code: delivery.response_code,
        delivered: delivery.delivered,
        response_body: delivery.response_body,
      });
    } catch (error) {
      console.error("Error notifying merchant (W2):", error);
    }
  }
}
