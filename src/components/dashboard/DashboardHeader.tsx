import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, UserCog } from 'lucide-react';

interface DashboardHeaderProps {
  merchantName: string;
  userRole: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardHeader = ({ 
  merchantName, 
  userRole, 
  activeTab, 
  onTabChange 
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {merchantName}</h1>
        <p className="text-muted-foreground">
          Your {userRole === 'admin' ? 'admin' : 'merchant'} dashboard and overview.
        </p>
      </div>
      
      {userRole === 'admin' && (
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="admin">
              <UserCog className="mr-2 h-4 w-4" />
              Admin View
            </TabsTrigger>
            <TabsTrigger value="merchant">
              <Building2 className="mr-2 h-4 w-4" />
              Merchant View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default DashboardHeader;
