
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, RefreshCw, Key, Code, Book, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const DeveloperPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const apiKey = currentMerchant?.apiKey || 'rizz_api_key_demo_merchant';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const regenerateApiKey = () => {
    toast.success('API key regenerated successfully');
  };

  const testWebhook = () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }
    toast.success('Test webhook sent successfully');
  };

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/payments',
      description: 'Create a new payment',
      example: `{
  "amount": 1000,
  "currency": "INR",
  "description": "Payment for order #123",
  "customer_email": "customer@example.com"
}`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/payments/{id}',
      description: 'Get payment details',
      example: 'GET /api/v1/payments/pay_12345'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/refunds',
      description: 'Create a refund',
      example: `{
  "payment_id": "pay_12345",
  "amount": 500,
  "reason": "Customer request"
}`
    }
  ];

  const webhookEvents = [
    {
      event: 'payment.created',
      description: 'Triggered when a new payment is created'
    },
    {
      event: 'payment.completed',
      description: 'Triggered when a payment is successfully completed'
    },
    {
      event: 'payment.failed',
      description: 'Triggered when a payment fails'
    },
    {
      event: 'refund.created',
      description: 'Triggered when a refund is created'
    }
  ];

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Developer Center</h1>
          <p className="text-sm text-muted-foreground">API keys, documentation, and integration tools</p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              API Documentation
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for secure integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Live API Key</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          readOnly
                          className="pr-20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="h-6 w-6"
                          >
                            {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(apiKey)}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" onClick={regenerateApiKey}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep your API key secure. Do not share it in publicly accessible areas.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Security Best Practices</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Never expose API keys in client-side code</li>
                      <li>• Use environment variables to store API keys</li>
                      <li>• Regenerate keys if compromised</li>
                      <li>• Restrict API access by IP whitelist</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Integration</CardTitle>
                  <CardDescription>Basic example to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono">
                    <div className="text-green-400"># Using cURL</div>
                    <div className="mt-2">
                      curl -X POST https://api.rizzpay.com/v1/payments \<br/>
                      &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}" \<br/>
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                      &nbsp;&nbsp;-d '{`{`}<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;"amount": 1000,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;"currency": "INR",<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;"description": "Test payment"<br/>
                      &nbsp;&nbsp;{`}`}'
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>Configure webhooks to receive real-time event notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://your-site.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button onClick={testWebhook} variant="outline">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook Events</Label>
                    <div className="space-y-2">
                      {webhookEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Badge variant="outline" className="mb-1">{event.event}</Badge>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-[#0052FF]">Save Webhook Configuration</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhook Security</CardTitle>
                  <CardDescription>Verify webhook authenticity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono">
                    <div className="text-green-400"># Webhook signature verification (Node.js)</div>
                    <div className="mt-2">
                      const crypto = require('crypto');<br/>
                      const signature = req.headers['x-rizzpay-signature'];<br/>
                      const payload = JSON.stringify(req.body);<br/>
                      const secret = 'your_webhook_secret';<br/><br/>
                      const expectedSignature = crypto<br/>
                      &nbsp;&nbsp;.createHmac('sha256', secret)<br/>
                      &nbsp;&nbsp;.update(payload)<br/>
                      &nbsp;&nbsp;.digest('hex');
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Available API endpoints and their usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                        <div className="bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono">
                          <pre>{endpoint.example}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SDKs & Libraries</CardTitle>
                  <CardDescription>Official SDKs for popular programming languages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Node.js</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                        npm install rizzpay-node
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Documentation
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Python</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                        pip install rizzpay-python
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Documentation
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">PHP</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                        composer require rizzpay/rizzpay-php
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Documentation
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Java</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
                        com.rizzpay:rizzpay-java
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Documentation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle>API Testing</CardTitle>
                <CardDescription>Test your integration with our sandbox environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Test Mode</h4>
                    <p className="text-sm text-blue-700">
                      Use the sandbox environment for testing. No real money will be processed.
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline">Sandbox Base URL</Badge>
                      <code className="ml-2 text-sm">https://sandbox-api.rizzpay.com</code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Test API Call</Label>
                    <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono">
                      <div className="text-green-400"># Test payment creation</div>
                      <div className="mt-2">
                        curl -X POST https://sandbox-api.rizzpay.com/v1/payments \<br/>
                        &nbsp;&nbsp;-H "Authorization: Bearer test_api_key" \<br/>
                        &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                        &nbsp;&nbsp;-d '{`{`}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"amount": 100,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"currency": "INR",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"description": "Test payment"<br/>
                        &nbsp;&nbsp;{`}`}'
                      </div>
                    </div>
                  </div>

                  <Button className="bg-[#0052FF]">
                    Run Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DeveloperPage;
