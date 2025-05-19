
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const DeveloperPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate API key fetch or generation
    const fetchApiKey = () => {
      // In a real app, this would come from your backend
      const mockApiKey = "rzp_test_" + Math.random().toString(36).substring(2, 15);
      setApiKey(mockApiKey);
    };
    
    fetchApiKey();
  }, []);

  const handleRegenerateApiKey = () => {
    setIsGenerating(true);
    
    // Simulate API call to regenerate key
    setTimeout(() => {
      const newApiKey = "rzp_test_" + Math.random().toString(36).substring(2, 15);
      setApiKey(newApiKey);
      setIsGenerating(false);
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Integration</h1>
            <p className="text-muted-foreground mt-2">
              Integrate RizzPay's payment solutions into your applications.
            </p>
          </div>

          <Tabs defaultValue="webhook" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="webhook">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Integration</CardTitle>
                  <CardDescription>
                    Set up webhooks to receive real-time payment notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebhookIntegration 
                    apiKey={apiKey} 
                    onRegenerateApiKey={handleRegenerateApiKey}
                    isRegenerating={isGenerating}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>
                    Access our RESTful API endpoints for payment processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The RizzPay API documentation will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="docs">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Comprehensive guides to help you integrate our payment solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our developer documentation is being updated. Check back soon for more information.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DeveloperPage;
