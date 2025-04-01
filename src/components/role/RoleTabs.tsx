
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleCard from './RoleCard';

interface RoleInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: string[];
}

interface RoleTabsProps {
  roles: RoleInfo[];
  selectedRole: string;
  onRoleChange: (value: string) => void;
}

const RoleTabs: React.FC<RoleTabsProps> = ({ roles, selectedRole, onRoleChange }) => {
  return (
    <Tabs
      defaultValue="admin"
      value={selectedRole}
      onValueChange={onRoleChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 mb-8">
        {roles.map((role) => (
          <TabsTrigger
            key={role.id}
            value={role.id}
            className="py-3 data-[state=active]:shadow-md transition-all"
          >
            {role.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </Tabs>
  );
};

export default RoleTabs;
