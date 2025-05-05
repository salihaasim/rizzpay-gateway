
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
    <div className="page-header">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {merchantName}! Here's your payment overview</p>
      </div>
      
      {userRole === 'admin' && (
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
      )}
    </div>
  );
};

export default DashboardHeader;
