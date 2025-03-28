
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const WebhookSetup: React.FC = () => {
  const { userEmail } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMerchantApiKey = async () => {
      if (!userEmail) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase()
          .from('merchants')
          .select('api_key')
          .eq('email', userEmail)
          .single();
        
        if (error) {
          console.error('Error fetching merchant API key:', error);
          toast.error('Could not retrieve your API key');
        } else if (data) {
          setApiKey(data.api_key);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching API key:', err);
        setIsLoading(false);
      }
    };
    
    fetchMerchantApiKey();
  }, [userEmail]);
  
  return (
    <div className="container px-4 pt-6 pb-16 mx-auto">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Webhook Setup</h1>
          <p className="text-muted-foreground">Integrate Rizzpay with your website or application</p>
        </div>
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
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integration" className="space-y-6">
            <WebhookIntegration apiKey={apiKey} />
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
        </Tabs>
      )}
    </div>
  );
};

export default WebhookSetup;
