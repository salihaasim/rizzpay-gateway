
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet, ArrowRight, Link } from 'lucide-react';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminPlatformOverview = () => {
  const [activeTab, setActiveTab] = useState('merchants');
  const navigate = useNavigate();
  
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Platform Overview</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => navigate('/admin/whitelist')}
          >
            Merchant Whitelist <ArrowRight className="h-3 w-3" />
          </Button>
        </CardTitle>
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
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="merchants" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Payment Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="merchants" className="space-y-4">
            <AdminMerchantsList />
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            <EscrowAccount />
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Payment Collection Links</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage payment collection links to easily request payments from customers.
              </p>
              <Button 
                onClick={() => navigate('/payment?mode=generate-links')}
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link className="h-4 w-4 mr-2" />
                Create Payment Links
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPlatformOverview;
