
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { useTransactionStore } from '@/stores/transactionStore';

const DeveloperPage = () => {
  const { userEmail } = useTransactionStore();
  
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
                  <WebhookIntegration apiKey="YOUR_API_KEY" />
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
