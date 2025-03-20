
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';

const WebhookPage: React.FC = () => {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl">API Integration</CardTitle>
            <CardDescription>
              Integrate the Rizzpay payment gateway with your website or application
            </CardDescription>
          </CardHeader>
        </Card>
        
        <WebhookIntegration />
      </div>
    </div>
  );
};

export default WebhookPage;
