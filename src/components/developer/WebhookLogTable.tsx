
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMerchantWebhookLogs } from "@/api/webhook/merchant";
import { Loader2 } from "lucide-react";

type WebhookLog = {
  id: string;
  sent_at: string;
  webhook_type: string;
  delivered: boolean;
  response_code: number;
  response_body?: string;
  payload: any;
};

export default function WebhookLogTable({ merchantId }: { merchantId: string }) {
  const [logs, setLogs] = useState<WebhookLog[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantId) return;
    setLoading(true);
    fetchMerchantWebhookLogs(merchantId)
      .then(res => setLogs(res.logs || []))
      .finally(() => setLoading(false));
  }, [merchantId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Webhook Deliveries</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No webhook logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-1">Time</th>
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Delivered</th>
                  <th className="text-left py-1">Code</th>
                  <th className="text-left py-1">Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.sent_at).toLocaleString()}</td>
                    <td>{log.webhook_type}</td>
                    <td>
                      <span className={log.delivered ? "text-green-600" : "text-red-600"}>
                        {log.delivered ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{log.response_code ?? "-"}</td>
                    <td>
                      <pre className="max-w-[200px] overflow-x-auto bg-muted p-1 rounded">
                        {JSON.stringify(log.payload, null, 1)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
