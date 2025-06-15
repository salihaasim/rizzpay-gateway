
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerMerchantWebhook } from "@/api/webhook/merchant";

const genSecret = () => {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    "rizz"
  );
};

export default function WebhookRegistrationBox({
  merchantId,
  initialUrl,
  initialSecret,
}: {
  merchantId: string;
  initialUrl?: string;
  initialSecret?: string;
}) {
  const [webhookUrl, setWebhookUrl] = useState(initialUrl ?? "");
  const [webhookSecret, setWebhookSecret] = useState(initialSecret ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await registerMerchantWebhook({
        merchantId,
        webhookUrl,
        webhookSecret: webhookSecret || undefined,
      });
      if (result.success) {
        toast.success("Webhook registered successfully");
      } else {
        toast.error("Failed: " + (result.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="webhook-url">Merchant Webhook URL</Label>
      <Input
        id="webhook-url"
        value={webhookUrl}
        placeholder="https://yourdomain.com/webhook"
        onChange={e => setWebhookUrl(e.target.value)}
      />
      <Label htmlFor="webhook-secret" className="mt-2">Webhook Secret</Label>
      <div className="flex gap-2">
        <Input
          id="webhook-secret"
          type="text"
          value={webhookSecret}
          placeholder="Auto-generated or custom secret"
          readOnly
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setWebhookSecret(genSecret())}
        >
          Generate
        </Button>
      </div>
      <Button
        className="mt-3"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Webhook"
        )}
      </Button>
    </div>
  );
}
