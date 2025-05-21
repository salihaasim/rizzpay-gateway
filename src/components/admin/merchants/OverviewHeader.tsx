
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet, CreditCard } from 'lucide-react';

const OverviewHeader: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform's merchants and finances
        </p>
      </div>
      
      <Tabs defaultValue="merchants" className="mb-6">
        <TabsList>
          <TabsTrigger value="merchants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Merchants
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="payment-links" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Links
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OverviewHeader;
