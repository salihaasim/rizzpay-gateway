
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactionStore } from '@/stores/transactionStore';

interface DashboardHeaderProps {
  merchantName: string;
  userRole: string;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardHeader = ({
  merchantName,
  userRole,
  activeTab,
  onTabChange
}: DashboardHeaderProps) => {
  return (
    <div className="page-header mb-6">
      <h1 className="text-2xl font-bold mb-1">Welcome, {merchantName}</h1>
      <p className="text-muted-foreground">Here's your payment overview</p>
      
      {userRole === 'admin' && (
        <div className="mt-4">
          <Tabs 
            defaultValue="admin" 
            value={activeTab}
            onValueChange={onTabChange}
            className="w-[180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="merchant">Merchant</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
