
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const WebhookPage: React.FC = () => {
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
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          toast.error('Authentication error');
          setIsLoading(false);
          return;
        }

        if (!user) {
          console.error('No authenticated user found');
          toast.error('Please log in to access webhook features');
          setIsLoading(false);
          return;
        }
        
        // Fetch from merchant_profiles instead of merchants
        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching merchant profile:', error);
          toast.error('Could not retrieve your merchant profile');
        } else if (data) {
          // Generate or retrieve an API key
          const apiKey = await generateOrRetrieveApiKey(user.id);
          setApiKey(apiKey);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching API key:', err);
        setIsLoading(false);
      }
    };
    
    const generateOrRetrieveApiKey = async (userId: string) => {
      try {
        // Check if user already has an API key
        const { data, error } = await supabase.rpc('get_or_create_api_key', { 
          user_id: userId 
        });
        
        if (error) {
          console.error('Error with API key:', error);
          toast.error('Could not generate API key');
          return null;
        }
        
        return data;
      } catch (err) {
        console.error('Error generating API key:', err);
        return null;
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

export default WebhookPage;
