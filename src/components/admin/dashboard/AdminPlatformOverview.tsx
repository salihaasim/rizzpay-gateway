
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet } from 'lucide-react';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';

const AdminPlatformOverview = () => {
  const [activeTab, setActiveTab] = useState('merchants');
  
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Platform Overview</CardTitle>
        <CardDescription>
          Manage your platform's merchants and finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="merchants" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="merchants" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="merchants" className="space-y-4">
            <AdminMerchantsList />
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            <EscrowAccount />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPlatformOverview;
