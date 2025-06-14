
import { Request, Response } from "express";
import { WebhookService } from "../services/WebhookService";
import { supabase } from "../config/supabase";

// Webhook registration (W1)
export const registerWebhook = async (req: Request, res: Response) => {
  try {
    const { merchant_id, webhook_url, webhook_secret } = req.body;
    if (!merchant_id || !webhook_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Upsert merchant_payout_settings
    const { error } = await supabase
      .from("merchant_payout_settings")
      .upsert(
        { merchant_id, webhook_url, webhook_secret },
        { onConflict: "merchant_id" }
      );
    if (error) throw error;
    res.json({ success: true, message: "Webhook registered" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Webhook log viewing (W4)
export const getWebhookLogs = async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.params;
    const { data, error } = await supabase
      .from("payout_webhooks")
      .select("*")
      .eq("merchant_id", merchantId)
      .order("sent_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ logs: data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
