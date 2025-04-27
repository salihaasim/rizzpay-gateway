import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Copy, 
  Check, 
  CreditCard, 
  ArrowRight, 
  Link,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WebhookIntegrationProps {
  apiKey: string | null;
}

const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({ apiKey }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  
  const paymentLinkRef = useRef<HTMLInputElement>(null);
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
    
    toast.success('Copied to clipboard!');
  };
  
  const handleRegenerateApiKey = async () => {
    try {
      setIsRegeneratingKey(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('Authentication error. Please login again.');
        setIsRegeneratingKey(false);
        return;
      }
      
      // Generate a new API key
      const newApiKey = `rizz_${crypto.randomUUID().replace(/-/g, '')}`;
      
      // Update the merchant profile with the new API key
      const { error: updateError } = await supabase
        .from('merchant_profiles')
        .update({ api_key: newApiKey })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating API key:', updateError);
        toast.error('Failed to regenerate API key');
      } else {
        toast.success('API key has been regenerated');
        // Force reload of the page to get the new API key
        window.location.reload();
      }
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsRegeneratingKey(false);
    }
  };
  
  const generatePaymentLink = async () => {
    if (!apiKey) {
      toast.error('No API key available. Please check your merchant settings.');
      return;
    }
    
    if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!customerName) {
      toast.error('Customer name is required');
      return;
    }
    
    setIsGeneratingLink(true);
    
    try {
      const webhookUrl = `${window.location.origin}/api/webhook`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: apiKey,
          amount: parseFloat(paymentAmount),
          customer_name: customerName,
          customer_email: customerEmail || undefined,
          description: paymentDescription || 'Payment via link',
          callback_url: `${window.location.origin}/payment/success`
        })
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setPaymentLink(result.paymentUrl);
        setTransactionId(result.transactionId);
        toast.success('Payment link generated successfully!');
      } else {
        toast.error(`Failed to generate payment link: ${result.message}`);
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };
  
  const handleCopyPaymentLink = () => {
    if (paymentLink && paymentLinkRef.current) {
      paymentLinkRef.current.select();
      handleCopy(paymentLink, 'payment-link');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="webhook" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="webhook" className="text-xs md:text-sm">Webhook Integration</TabsTrigger>
          <TabsTrigger value="code-examples" className="text-xs md:text-sm">Code Examples</TabsTrigger>
          <TabsTrigger value="payment-links" className="text-xs md:text-sm">Payment Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Integration</CardTitle>
              <CardDescription>
                Use Rizzpay's webhook to receive payments on your website or application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Your API Key</Label>
                  {apiKey && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRegenerateApiKey}
                      disabled={isRegeneratingKey}
                    >
                      {isRegeneratingKey ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex">
                  <Input
                    type="text"
                    value={apiKey || ''}
                    readOnly
                    className="font-mono text-sm flex-1"
                    placeholder="No API key found"
                  />
                  {apiKey && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(apiKey, 'api-key')}
                      className="ml-2"
                    >
                      {copied === 'api-key' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {!apiKey && (
                  <p className="text-sm text-red-500 mt-1">
                    No API key found. Please reload the page or contact support for assistance.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex">
                  <Input
                    type="text"
                    value={`${window.location.origin}/api/webhook`}
                    readOnly
                    className="font-mono text-sm flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(`${window.location.origin}/api/webhook`, 'webhook-url')}
                    className="ml-2"
                  >
                    {copied === 'webhook-url' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">How to Use</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Send a POST request to the webhook URL with the following parameters:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">token</code>: Your API key</li>
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">amount</code>: Payment amount (e.g. 100.00)</li>
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">customer_name</code>: Name of customer</li>
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">customer_email</code>: Email of customer (optional)</li>
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">description</code>: Payment description (optional)</li>
                  <li><code className="text-xs bg-muted-foreground/20 px-1 rounded">callback_url</code>: URL to redirect after payment (optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code-examples">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Example code snippets to integrate with our payment API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">JavaScript/Node.js</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(jsExample, 'js-example')}
                  >
                    {copied === 'js-example' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>{jsExample}</code>
                </pre>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Python</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(pythonExample, 'python-example')}
                  >
                    {copied === 'python-example' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>{pythonExample}</code>
                </pre>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base">PHP</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(phpExample, 'php-example')}
                  >
                    {copied === 'php-example' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>{phpExample}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-links">
          <Card>
            <CardHeader>
              <CardTitle>Payment Links</CardTitle>
              <CardDescription>
                Create payment links to share with your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentLink ? (
                <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-base">Payment Link Generated</Label>
                    <div className="flex">
                      <Input
                        ref={paymentLinkRef}
                        type="text"
                        value={paymentLink}
                        readOnly
                        className="font-mono text-sm flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyPaymentLink}
                        className="ml-2"
                      >
                        {copied === 'payment-link' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Transaction ID</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{transactionId}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaymentLink(null);
                        setTransactionId(null);
                      }}
                    >
                      Create Another Link
                    </Button>
                    
                    <Button
                      onClick={() => {
                        if (paymentLink) {
                          window.open(paymentLink, '_blank');
                        }
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Open Payment Page
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (INR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email (Optional)</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="Enter customer email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Enter payment description"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={generatePaymentLink}
                    disabled={isGeneratingLink || !apiKey}
                  >
                    {isGeneratingLink ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Link...
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Generate Payment Link
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const jsExample = `// JavaScript/Node.js Example
const fetch = require('node-fetch');

async function createPayment() {
  try {
    const response = await fetch('https://yourdomain.com/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: 'YOUR_API_KEY',
        amount: 100.00,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        description: 'Payment for Product X',
        callback_url: 'https://yourdomain.com/payment-callback'
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Payment URL:', data.paymentUrl);
      console.log('Transaction ID:', data.transactionId);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createPayment();`;

const pythonExample = `# Python Example
import requests
import json

def create_payment():
    try:
        payload = {
            'token': 'YOUR_API_KEY',
            'amount': 100.00,
            'customer_name': 'John Doe',
            'customer_email': 'john@example.com',
            'description': 'Payment for Product X',
            'callback_url': 'https://yourdomain.com/payment-callback'
        }
        
        response = requests.post(
            'https://yourdomain.com/api/webhook',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        data = response.json()
        
        if data['status'] == 'success':
            print('Payment URL:', data['paymentUrl'])
            print('Transaction ID:', data['transactionId'])
        else:
            print('Error:', data['message'])
    except Exception as e:
        print('Error:', str(e))

create_payment()`;

const phpExample = `<?php
// PHP Example
function createPayment() {
    $payload = array(
        'token' => 'YOUR_API_KEY',
        'amount' => 100.00,
        'customer_name' => 'John Doe',
        'customer_email' => 'john@example.com',
        'description' => 'Payment for Product X',
        'callback_url' => 'https://yourdomain.com/payment-callback'
    );
    
    $ch = curl_init('https://yourdomain.com/api/webhook');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if ($data['status'] === 'success') {
        echo 'Payment URL: ' . $data['paymentUrl'] . "\n";
        echo 'Transaction ID: ' . $data['transactionId'] . "\n";
    } else {
        echo 'Error: ' . $data['message'] . "\n";
    }
}

createPayment();
?>`;

export default WebhookIntegration;
