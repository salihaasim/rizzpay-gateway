
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpiPluginCode from '@/components/upi/UpiPluginCode';
import { CreditCard } from 'lucide-react';

const UpiPluginPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UPI Plugin</h1>
            <p className="text-muted-foreground mt-2">
              Integrate UPI payments directly into your website with our plugin.
            </p>
          </div>

          <Tabs defaultValue="integration" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integration">
              <UpiPluginCode />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    UPI Plugin Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your UPI plugin appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced settings for the UPI plugin will be available soon.
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

export default UpiPluginPage;
