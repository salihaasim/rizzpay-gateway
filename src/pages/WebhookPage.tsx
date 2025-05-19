
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase } from '@/utils/supabaseClient';
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
        const { data, error } = await supabase()
          .from('merchants')
          .select('api_key')
          .eq('email', userEmail)
          .single();
        
        if (error) {
          console.error('Error fetching merchant API key:', error);
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
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl">Rizzpay Gateway</CardTitle>
            <CardDescription>
              Integrate the Rizzpay payment gateway with your website or application
            </CardDescription>
          </CardHeader>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <WebhookIntegration apiKey={apiKey} />
        )}
      </div>
    </div>
  );
};

export default WebhookPage;
