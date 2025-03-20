import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CopyIcon, CheckIcon, CodeIcon, RefreshCwIcon, ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { createWebhookToken, validateWebhookToken } from '@/components/webhook/tokenUtils';

const WebhookIntegration: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [webhookToken, setWebhookToken] = useState<string>('');
  const [regenerating, setRegenerating] = useState(false);
  const { userEmail } = useTransactionStore();

  React.useEffect(() => {
    if (!webhookToken && userEmail) {
      const token = createWebhookToken(userEmail);
      setWebhookToken(token);
    }
  }, [userEmail, webhookToken]);

  const handleRegenerate = () => {
    if (!userEmail) return;
    
    setRegenerating(true);
    setTimeout(() => {
      const token = createWebhookToken(userEmail);
      setWebhookToken(token);
      setRegenerating(false);
      toast.success('Webhook token regenerated');
    }, 800);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast.success(`${type} copied to clipboard!`);
      
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    }).catch(() => {
      toast.error('Failed to copy. Please try again.');
    });
  };

  const webhookEndpoint = `${window.location.origin}/api/webhook`;
  
  const htmlCode = `<form action="${webhookEndpoint}" method="POST">
  <input type="hidden" name="token" value="${webhookToken}" />
  <input type="hidden" name="amount" value="100.00" />
  <input type="hidden" name="currency" value="INR" />
  <input type="hidden" name="description" value="Payment for Product X" />
  <input type="hidden" name="customer_name" value="John Doe" />
  <input type="hidden" name="customer_email" value="john@example.com" />
  <input type="hidden" name="callback_url" value="https://yourwebsite.com/payment-callback" />
  <button type="submit">Pay Now</button>
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
        token: "${webhookToken}",
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || "INR",
        description: paymentDetails.description,
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
}

// Example usage
document.getElementById("payment-button").addEventListener("click", () => {
  initiateRizzpayPayment({
    amount: "100.00",
    currency: "INR",
    description: "Payment for Product X",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    callbackUrl: "https://yourwebsite.com/payment-callback"
  });
});`;

  const exampleRequestUrl = `${webhookEndpoint}?token=${webhookToken}&amount=100.00&currency=INR&description=Product+Purchase&customer_name=John+Doe&customer_email=john@example.com&callback_url=https://yourwebsite.com/payment-callback`;

  const apiDocumentation = [
    { param: 'token', required: true, description: 'Your unique webhook token (found on this page)' },
    { param: 'amount', required: true, description: 'Payment amount (e.g., 100.00)' },
    { param: 'currency', required: false, description: 'Currency code (default: INR)' },
    { param: 'description', required: false, description: 'Payment description or purpose' },
    { param: 'customer_name', required: true, description: 'Name of the customer making payment' },
    { param: 'customer_email', required: false, description: 'Email of the customer (recommended)' },
    { param: 'callback_url', required: false, description: 'URL to redirect after payment completion' },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <CodeIcon className="h-5 w-5 mr-2" />
          Webhook Integration
        </CardTitle>
        <CardDescription>
          Integrate Rizzpay with your website or application
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Your Webhook Token</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              disabled={regenerating || !userEmail}
            >
              {regenerating ? (
                <>
                  <RefreshCwIcon className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCwIcon className="h-3.5 w-3.5 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
          
          <div className="flex">
            <Input
              value={webhookToken || 'Please login to generate a token'}
              readOnly
              className="font-mono text-sm"
              disabled={!userEmail}
            />
            <Button
              onClick={() => copyToClipboard(webhookToken, 'Token')}
              variant="outline"
              size="icon"
              className="ml-2"
              disabled={!webhookToken}
            >
              {copied === 'Token' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This token is used to authenticate webhook requests to your account. Keep it secure.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Webhook Endpoint</h3>
          <div className="flex">
            <Input
              value={webhookEndpoint}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={() => copyToClipboard(webhookEndpoint, 'Endpoint')}
              variant="outline"
              size="icon"
              className="ml-2"
            >
              {copied === 'Endpoint' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is the endpoint where your website should send payment requests.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Integration Examples</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-medium">HTML Form Example</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(htmlCode, 'HTML')}
                className="h-6 text-xs"
              >
                {copied === 'HTML' ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" /> Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={htmlCode}
              readOnly
              className="font-mono text-xs h-32 resize-none bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-medium">JavaScript Example</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(jsCode, 'JS')}
                className="h-6 text-xs"
              >
                {copied === 'JS' ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" /> Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={jsCode}
              readOnly
              className="font-mono text-xs h-40 resize-none bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-medium">Example Request URL</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(exampleRequestUrl, 'URL')}
                className="h-6 text-xs"
              >
                {copied === 'URL' ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" /> Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={exampleRequestUrl}
              readOnly
              className="font-mono text-xs h-16 resize-none bg-muted overflow-auto whitespace-pre-wrap"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">API Parameters</h3>
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium">Parameter</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Required</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiDocumentation.map((param, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <td className="px-4 py-2 text-xs font-mono">{param.param}</td>
                    <td className="px-4 py-2 text-xs">
                      {param.required ? (
                        <span className="text-red-500">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-2">
        <p className="text-xs text-muted-foreground">
          Need more help? Check out our 
          <Button variant="link" className="h-auto p-0 px-1 text-xs" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              documentation <ExternalLinkIcon className="h-3 w-3 inline" />
            </a>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default WebhookIntegration;

