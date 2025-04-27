
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { regenerateApiKey, getMerchantProfile } from '@/utils/merchantApiUtils';

const WebhookPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-1">Webhook Setup</h1>
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
              Please login as a merchant to access webhook features.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="integration" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Webhook Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integration" className="space-y-6">
            <WebhookIntegration 
              apiKey={apiKey} 
              onRegenerateApiKey={handleRegenerateApiKey}
              isRegenerating={isRegenerating}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Settings</CardTitle>
                <CardDescription>Configure your webhook endpoints and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Advanced webhook settings will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Activity Logs</CardTitle>
                <CardDescription>View recent webhook events and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Webhook logs will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WebhookPage;
