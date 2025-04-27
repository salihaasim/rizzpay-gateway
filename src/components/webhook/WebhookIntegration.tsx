
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CopyIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface WebhookIntegrationProps {
  apiKey: string | null;
  onRegenerateApiKey?: () => void;
  isRegenerating?: boolean;
}

const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({ 
  apiKey,
  onRegenerateApiKey,
  isRegenerating = false
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Function to copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedField(field);
        toast.success(`Copied ${field} to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error(`Failed to copy ${field}`);
      }
    );
  };
  
  const baseUrl = window.location.origin;
  const webhookEndpoint = `${baseUrl}/api/webhook`;

  const htmlCode = `<form action="${webhookEndpoint}" method="POST">
  <input type="hidden" name="token" value="${apiKey || 'YOUR_API_KEY'}" />
  <input type="hidden" name="amount" value="100.00" />
  <input type="hidden" name="currency" value="INR" />
  <input type="hidden" name="customer_name" value="John Doe" />
  <input type="hidden" name="customer_email" value="john@example.com" />
  <input type="hidden" name="callback_url" value="https://yourwebsite.com/payment-callback" />
  <button type="submit">Pay with RizzPay</button>
</form>`;

  const jsCode = `// Function to initiate payment
async function initiateRizzpayPayment(paymentDetails) {
  try {
    const response = await fetch("${webhookEndpoint}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "${apiKey || 'YOUR_API_KEY'}",
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || "INR",
        customer_name: paymentDetails.customerName,
        customer_email: paymentDetails.customerEmail,
        callback_url: paymentDetails.callbackUrl
      }),
    });

    const result = await response.json();
    
    if (result.status === "success") {
      // Redirect to the payment page
      window.location.href = result.paymentUrl;
    } else {
      console.error("Payment initiation failed:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}`;

  const urlCode = `${webhookEndpoint}?token=${apiKey || 'YOUR_API_KEY'}&amount=100.00&currency=INR&customer_name=John+Doe&customer_email=john@example.com&callback_url=https://yourwebsite.com/payment-callback`;
  
  // If no API key is available
  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            API Key Not Available
          </CardTitle>
          <CardDescription>
            We couldn't retrieve or generate your API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No API key found. Please contact support to get your API key or refresh the page to generate one.
          </p>
          
          {onRegenerateApiKey && (
            <Button 
              onClick={onRegenerateApiKey}
              disabled={isRegenerating}
              className="mt-4"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate API Key
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>
            Use this key to authenticate your webhook requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p

-3 bg-secondary rounded-md">
            <code className="text-sm font-mono break-all">{apiKey}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(apiKey, 'API Key')}
            >
              <CopyIcon className="h-4 w-4" />
              <span className="sr-only">Copy API Key</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Keep this API key secret. Never share it or include it in client-side code.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Methods</CardTitle>
          <CardDescription>
            Choose the method that best suits your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML Form</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="direct">Direct URL</TabsTrigger>
            </TabsList>
            <TabsContent value="html" className="mt-4 space-y-4">
              <div className="relative">
                <SyntaxHighlighter
                  language="html"
                  style={nord}
                  customStyle={{ borderRadius: '0.5rem' }}
                >
                  {htmlCode}
                </SyntaxHighlighter>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(htmlCode, 'HTML Code')}
                >
                  {copiedField === 'HTML Code' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add this HTML form to your website to create a payment button.
              </p>
            </TabsContent>
            <TabsContent value="js" className="mt-4 space-y-4">
              <div className="relative">
                <SyntaxHighlighter
                  language="javascript"
                  style={nord}
                  customStyle={{ borderRadius: '0.5rem' }}
                >
                  {jsCode}
                </SyntaxHighlighter>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(jsCode, 'JS Code')}
                >
                  {copiedField === 'JS Code' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this JavaScript function to programmatically initiate payments.
              </p>
            </TabsContent>
            <TabsContent value="direct" className="mt-4 space-y-4">
              <div className="relative">
                <SyntaxHighlighter
                  language="markup"
                  style={nord}
                  customStyle={{ borderRadius: '0.5rem' }}
                >
                  {urlCode}
                </SyntaxHighlighter>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(urlCode, 'URL')}
                >
                  {copiedField === 'URL' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Make a direct GET request to our webhook endpoint.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default WebhookIntegration;
