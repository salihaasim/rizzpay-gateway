
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector = ({ activeRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <Tabs
      defaultValue="merchant"
      value={activeRole}
      onValueChange={onRoleChange}
      className="mb-6"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="merchant" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          Merchant
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Admin
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RoleSelector;
