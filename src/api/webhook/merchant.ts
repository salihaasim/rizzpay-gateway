
import { supabase } from "@/utils/supabaseClient";

export const registerMerchantWebhook = async ({
  merchantId,
  webhookUrl,
  webhookSecret,
}: {
  merchantId: string;
  webhookUrl: string;
  webhookSecret?: string;
}) => {
  // POST to /api/webhook/register (handled by backend)
  const res = await fetch("/api/webhook/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      webhook_url: webhookUrl,
      webhook_secret: webhookSecret,
    }),
  });
  return await res.json();
};

export const fetchMerchantWebhookLogs = async (merchantId: string) => {
  // GET /api/webhook/logs/:merchantId (handled by backend)
  const res = await fetch(`/api/webhook/logs/${merchantId}`);
  return await res.json();
};
