
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { regenerateApiKey, getMerchantProfile } from '@/utils/merchantApiUtils';
import { useTransactionStore } from '@/stores/transactionStore';

const DeveloperIntegration: React.FC = () => {
  const { userEmail } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const fetchMerchantApiKey = async () => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get the merchant profile which includes the API key
      const profileData = await getMerchantProfile();
      
      if (profileData?.api_key) {
        setApiKey(profileData.api_key);
        console.log('API key retrieved successfully from profile');
      } else {
        console.log('No API key found in profile, will regenerate');
        await handleRegenerateApiKey();
      }
    } catch (err) {
      console.error('Error fetching API key:', err);
      toast.error('Failed to retrieve API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    try {
      setIsRegenerating(true);
      const newApiKey = await regenerateApiKey();
      
      if (newApiKey) {
        setApiKey(newApiKey);
        toast.success('API key regenerated successfully');
      } else {
        toast.error('Failed to regenerate API key');
      }
    } catch (err) {
      console.error('Error regenerating API key:', err);
      toast.error('Failed to regenerate API key');
    } finally {
      setIsRegenerating(false);
    }
  };
  
  useEffect(() => {
    fetchMerchantApiKey();
  }, [userEmail]);
  
  return (
    <div className="container px-4 pt-6 pb-16 mx-auto">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Developer Integration</h1>
          <p className="text-muted-foreground">Integrate RizzPay with your website or application</p>
        </div>
        
        {!isLoading && apiKey && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateApiKey}
            disabled={isRegenerating}
            className="mt-4 md:mt-0"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Key
              </>
            )}
          </Button>
        )}
      </div>
      
      {!userEmail ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please login as a merchant to access developer integration features.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="server-api">Server API</TabsTrigger>
            <TabsTrigger value="events">Event Callbacks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Secure keys to authenticate your integration with our payment API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                  <code className="text-sm font-mono break-all">{apiKey}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (apiKey) {
                        navigator.clipboard.writeText(apiKey);
                        toast.success('API Key copied to clipboard');
                      }
                    }}
                  >
                    <span className="sr-only">Copy API Key</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep this API key secret. Never share it or include it in client-side code.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhook" className="space-y-6">
            <WebhookIntegration 
              apiKey={apiKey} 
              onRegenerateApiKey={handleRegenerateApiKey}
              isRegenerating={isRegenerating}
            />
          </TabsContent>
          
          <TabsContent value="server-api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Server API Reference</CardTitle>
                <CardDescription>
                  Integrate with our server APIs for advanced payment processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Create Payment</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Initiate a payment request
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
                      POST /api/payments/create
                    </pre>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Required Parameters:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1">
                        <li>amount: number (in smallest currency unit)</li>
                        <li>currency: string (e.g., "INR")</li>
                        <li>customer_id: string</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Verify Payment</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Verify a payment's status
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
                      GET /api/payments/verify/:payment_id
                    </pre>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Required Parameters:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1">
                        <li>payment_id: string</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Retrieve Transactions</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Get a list of transactions
                    </p>
                    <pre className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
                      GET /api/transactions?limit=10&offset=0
                    </pre>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Optional Parameters:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1">
                        <li>limit: number (default: 10)</li>
                        <li>offset: number (default: 0)</li>
                        <li>status: string (e.g., "success", "pending", "failed")</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Callbacks</CardTitle>
                <CardDescription>
                  Configure callback URLs for payment events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Success URL</label>
                    <input 
                      type="url" 
                      placeholder="https://your-website.com/payment/success" 
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL to redirect users after successful payment
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Failure URL</label>
                    <input 
                      type="url" 
                      placeholder="https://your-website.com/payment/failure" 
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL to redirect users after failed payment
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook Notification URL</label>
                    <input 
                      type="url" 
                      placeholder="https://your-website.com/webhooks/payment" 
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL to send server-to-server notifications
                    </p>
                  </div>
                  
                  <Button type="submit">Save Callback Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DeveloperIntegration;
