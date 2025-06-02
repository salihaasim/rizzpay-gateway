
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const MerchantUrlBank = () => {
  const { currentMerchant } = useMerchantAuth();
  const [merchantUrl, setMerchantUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate unique merchant URL based on merchant ID and some randomization
  const generateMerchantUrl = () => {
    if (!currentMerchant) return '';
    
    const baseUrl = 'https://api.rizzpay.co.in/merchant';
    const merchantId = currentMerchant.username || 'demo';
    const uniqueId = Math.random().toString(36).substring(2, 8);
    
    return `${baseUrl}/${merchantId}-${uniqueId}`;
  };

  useEffect(() => {
    // Generate initial URL when component mounts
    if (currentMerchant && !merchantUrl) {
      setMerchantUrl(generateMerchantUrl());
    }
  }, [currentMerchant]);

  const handleRegenerateUrl = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUrl = generateMerchantUrl();
      setMerchantUrl(newUrl);
      setIsGenerating(false);
      toast.success('New merchant URL generated successfully');
    }, 1000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(merchantUrl);
    toast.success('Merchant URL copied to clipboard');
  };

  const handleTestUrl = () => {
    window.open(merchantUrl, '_blank');
  };

  const webhookExamples = [
    {
      name: "Payment Webhook",
      url: `${merchantUrl}/webhook/payment`,
      description: "Receive payment status updates"
    },
    {
      name: "Settlement Webhook", 
      url: `${merchantUrl}/webhook/settlement`,
      description: "Get settlement notifications"
    },
    {
      name: "Refund Webhook",
      url: `${merchantUrl}/webhook/refund`, 
      description: "Handle refund confirmations"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Merchant URL Bank
          </CardTitle>
          <CardDescription>
            Your unique merchant URL for API integrations and webhook endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merchant-url">Your Unique Merchant URL</Label>
            <div className="flex gap-2">
              <Input 
                id="merchant-url"
                value={merchantUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyUrl}
                title="Copy URL"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRegenerateUrl}
                disabled={isGenerating}
                title="Regenerate URL"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleTestUrl}
                title="Test URL"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">How to use your Merchant URL:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use this URL as your base endpoint for all API calls</li>
              <li>• Configure webhooks using the predefined endpoints below</li>
              <li>• This URL is unique to your merchant account</li>
              <li>• Keep this URL secure and don't share it publicly</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predefined Webhook Endpoints</CardTitle>
          <CardDescription>
            Ready-to-use webhook URLs for different event types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhookExamples.map((webhook, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{webhook.name}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(webhook.url);
                      toast.success(`${webhook.name} URL copied`);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{webhook.description}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">
                  {webhook.url}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Code examples using your unique merchant URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">JavaScript Example</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`// Using your merchant URL for API calls
const MERCHANT_URL = "${merchantUrl}";

// Create payment
const response = await fetch(\`\${MERCHANT_URL}/api/payments\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    amount: 1000,
    currency: 'INR',
    customer_email: 'customer@example.com'
  })
});`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">cURL Example</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST "${merchantUrl}/api/payments" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "amount": 1000,
    "currency": "INR",
    "customer_email": "customer@example.com"
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantUrlBank;
