
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Send, RefreshCw, Code, ExternalLink, Webhook, ArrowUpRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const PayoutApiPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [payoutData, setPayoutData] = useState({
    amount: '',
    beneficiaryName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    payoutMethod: 'bank_transfer'
  });
  const [callbackUrl, setCallbackUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleCreatePayout = () => {
    if (!payoutData.amount) {
      toast.error('Amount is required');
      return;
    }
    
    if (payoutData.payoutMethod === 'bank_transfer' && (!payoutData.beneficiaryName || !payoutData.accountNumber || !payoutData.ifscCode)) {
      toast.error('Bank transfer requires beneficiary name, account number, and IFSC code');
      return;
    }
    
    if (payoutData.payoutMethod === 'upi' && !payoutData.upiId) {
      toast.error('UPI payout requires UPI ID');
      return;
    }

    toast.success('Payout request created successfully');
  };

  const testCallback = () => {
    if (!callbackUrl) {
      toast.error('Please enter callback URL');
      return;
    }
    toast.success('Callback test sent successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const payoutEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/payouts',
      description: 'Create a new payout request',
      example: `{
  "merchant_id": "merchant_123",
  "amount": 1000,
  "currency": "INR",
  "payout_method": "bank_transfer",
  "beneficiary_name": "John Doe",
  "account_number": "1234567890",
  "ifsc_code": "HDFC0001234",
  "description": "Salary payment"
}`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/payouts/{id}',
      description: 'Get payout status',
      example: 'GET /api/v1/payouts/payout_12345'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/payouts/upi',
      description: 'Create UPI payout',
      example: `{
  "merchant_id": "merchant_123",
  "amount": 500,
  "currency": "INR",
  "upi_id": "user@paytm",
  "description": "UPI transfer"
}`
    },
    {
      method: 'POST',
      endpoint: '/api/v1/payouts/{id}/retry',
      description: 'Retry failed payout',
      example: 'POST /api/v1/payouts/payout_12345/retry'
    }
  ];

  const webhookEvents = [
    {
      event: 'payout.created',
      description: 'Triggered when a payout request is created',
      payload: `{
  "event": "payout.created",
  "payout_id": "payout_12345",
  "merchant_id": "merchant_123",
  "amount": 1000,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}`
    },
    {
      event: 'payout.processing',
      description: 'Triggered when payout starts processing',
      payload: `{
  "event": "payout.processing",
  "payout_id": "payout_12345",
  "status": "processing",
  "updated_at": "2024-01-01T00:05:00Z"
}`
    },
    {
      event: 'payout.completed',
      description: 'Triggered when payout is successfully completed',
      payload: `{
  "event": "payout.completed",
  "payout_id": "payout_12345",
  "status": "completed",
  "utr_number": "UTR123456789",
  "completed_at": "2024-01-01T00:10:00Z"
}`
    },
    {
      event: 'payout.failed',
      description: 'Triggered when payout fails',
      payload: `{
  "event": "payout.failed",
  "payout_id": "payout_12345",
  "status": "failed",
  "failure_reason": "Invalid account number",
  "failed_at": "2024-01-01T00:08:00Z"
}`
    }
  ];

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Payout API</h1>
          <p className="text-sm text-muted-foreground">Comprehensive payout management and API integration</p>
        </div>

        <Tabs defaultValue="create-payout" className="space-y-6">
          <TabsList>
            <TabsTrigger value="create-payout" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Create Payout
            </TabsTrigger>
            <TabsTrigger value="api-docs" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              API Documentation
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="callbacks" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Callbacks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create-payout">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Payout Request</CardTitle>
                  <CardDescription>Test payout functionality with live API integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (INR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000"
                        value={payoutData.amount}
                        onChange={(e) => setPayoutData({...payoutData, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payout-method">Payout Method</Label>
                      <Select 
                        value={payoutData.payoutMethod} 
                        onValueChange={(value) => setPayoutData({...payoutData, payoutMethod: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="upi">UPI Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {payoutData.payoutMethod === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beneficiary-name">Beneficiary Name</Label>
                        <Input
                          id="beneficiary-name"
                          placeholder="John Doe"
                          value={payoutData.beneficiaryName}
                          onChange={(e) => setPayoutData({...payoutData, beneficiaryName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          placeholder="1234567890"
                          value={payoutData.accountNumber}
                          onChange={(e) => setPayoutData({...payoutData, accountNumber: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc-code">IFSC Code</Label>
                        <Input
                          id="ifsc-code"
                          placeholder="HDFC0001234"
                          value={payoutData.ifscCode}
                          onChange={(e) => setPayoutData({...payoutData, ifscCode: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {payoutData.payoutMethod === 'upi' && (
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="user@paytm"
                        value={payoutData.upiId}
                        onChange={(e) => setPayoutData({...payoutData, upiId: e.target.value})}
                      />
                    </div>
                  )}

                  <Button onClick={handleCreatePayout} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Create Payout Request
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated API Call</CardTitle>
                  <CardDescription>Copy this code to integrate payout functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => {
                        const curlCommand = `curl -X POST https://api.rizzpay.com/v1/payouts \\
  -H "Authorization: Bearer ${currentMerchant?.apiKey || 'your-api-key'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_id": "${currentMerchant?.id || 'merchant_123'}",
    "amount": ${payoutData.amount || 1000},
    "currency": "INR",
    "payout_method": "${payoutData.payoutMethod}",
    ${payoutData.payoutMethod === 'bank_transfer' 
      ? `"beneficiary_name": "${payoutData.beneficiaryName || 'John Doe'}",
    "account_number": "${payoutData.accountNumber || '1234567890'}",
    "ifsc_code": "${payoutData.ifscCode || 'HDFC0001234'}"` 
      : `"upi_id": "${payoutData.upiId || 'user@paytm'}"`
    }
  }'`;
                        copyToClipboard(curlCommand);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <div>
                      <div className="text-green-400"># cURL Example</div>
                      <div className="mt-2">
                        <div>curl -X POST https://api.rizzpay.com/v1/payouts \</div>
                        <div>&nbsp;&nbsp;-H "Authorization: Bearer {currentMerchant?.apiKey || 'your-api-key'}" \</div>
                        <div>&nbsp;&nbsp;-H "Content-Type: application/json" \</div>
                        <div>&nbsp;&nbsp;-d '{'{'}</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;"merchant_id": "{currentMerchant?.id || 'merchant_123'}",</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;"amount": {payoutData.amount || 1000},</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;"currency": "INR",</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;"payout_method": "{payoutData.payoutMethod}",</div>
                        {payoutData.payoutMethod === 'bank_transfer' ? (
                          <>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;"beneficiary_name": "{payoutData.beneficiaryName || 'John Doe'}",</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;"account_number": "{payoutData.accountNumber || '1234567890'}",</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;"ifsc_code": "{payoutData.ifscCode || 'HDFC0001234'}"</div>
                          </>
                        ) : (
                          <div>&nbsp;&nbsp;&nbsp;&nbsp;"upi_id": "{payoutData.upiId || 'user@paytm'}"</div>
                        )}
                        <div>&nbsp;&nbsp;{'}'}'</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-docs">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payout API Endpoints</CardTitle>
                  <CardDescription>Complete reference for payout API integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {payoutEndpoints.map((endpoint, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(endpoint.example)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                        <div className="bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                          <pre>{endpoint.example}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>Set up webhooks to receive payout status updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://your-site.com/webhook/payout"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button onClick={() => toast.success('Webhook URL saved')} variant="outline">
                        Save
                      </Button>
                      <Button onClick={() => toast.success('Test webhook sent')} variant="outline">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Webhook Security</h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      All webhooks are signed with your webhook secret. Verify the signature to ensure authenticity.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhook Events</CardTitle>
                  <CardDescription>Available payout webhook events and their payloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webhookEvents.map((event, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{event.event}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(event.payload)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                          <pre>{event.payload}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="callbacks">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Callback URL Configuration</CardTitle>
                  <CardDescription>Configure callback URLs for payout status updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="callback-url">Callback URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="callback-url"
                        placeholder="https://your-site.com/callback/payout"
                        value={callbackUrl}
                        onChange={(e) => setCallbackUrl(e.target.value)}
                      />
                      <Button onClick={() => toast.success('Callback URL saved')} variant="outline">
                        Save
                      </Button>
                      <Button onClick={testCallback} variant="outline">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Success Callback</h4>
                      <code className="block bg-muted p-2 rounded text-xs">
                        {callbackUrl || 'https://your-site.com/callback/payout'}?status=success&payout_id=payout_123&utr=UTR123456789
                      </code>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Failure Callback</h4>
                      <code className="block bg-muted p-2 rounded text-xs">
                        {callbackUrl || 'https://your-site.com/callback/payout'}?status=failed&payout_id=payout_123&reason=Invalid+account
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Callback Implementation Example</CardTitle>
                  <CardDescription>Sample code to handle payout callbacks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-green-400"># Node.js Express Example</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(`app.post('/callback/payout', (req, res) => {
  const { status, payout_id, utr, reason } = req.query;
  
  if (status === 'success') {
    // Handle successful payout
    console.log(\`Payout \${payout_id} completed with UTR: \${utr}\`);
    // Update your database
    updatePayoutStatus(payout_id, 'completed', utr);
  } else if (status === 'failed') {
    // Handle failed payout
    console.log(\`Payout \${payout_id} failed: \${reason}\`);
    // Update your database
    updatePayoutStatus(payout_id, 'failed', null, reason);
  }
  
  res.status(200).send('Callback received');
});`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>app.post('/callback/payout', (req, res) =&gt; {'{'}</div>
                      <div>&nbsp;&nbsp;const {'{'} status, payout_id, utr, reason {'}'} = req.query;</div>
                      <div className="mt-2"></div>
                      <div>&nbsp;&nbsp;if (status === 'success') {'{'}</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;// Handle successful payout</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;console.log(`Payout ${'${payout_id}'} completed with UTR: ${'${utr}'}`);</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;updatePayoutStatus(payout_id, 'completed', utr);</div>
                      <div>&nbsp;&nbsp;{'}'} else if (status === 'failed') {'{'}</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;// Handle failed payout</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;console.log(`Payout ${'${payout_id}'} failed: ${'${reason}'}`);</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;updatePayoutStatus(payout_id, 'failed', null, reason);</div>
                      <div>&nbsp;&nbsp;{'}'}</div>
                      <div className="mt-2"></div>
                      <div>&nbsp;&nbsp;res.status(200).send('Callback received');</div>
                      <div>{'}'});</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PayoutApiPage;
