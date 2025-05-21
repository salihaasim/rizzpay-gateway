
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoleInfo {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RoleTabsProps {
  roles: RoleInfo[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleTabs = ({ roles, selectedRole, onRoleChange }: RoleTabsProps) => {
  return (
    <Tabs defaultValue={selectedRole} onValueChange={onRoleChange}>
      <TabsList className="grid grid-cols-2 w-full">
        {roles.map((role) => (
          <TabsTrigger key={role.id} value={role.id}>
            {role.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {roles.map((role) => (
        <TabsContent key={role.id} value={role.id} className="mt-4">
          <div className="p-4 rounded-lg bg-secondary/20">
            <h3 className="font-medium text-lg">{role.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            <div className="mt-3">
              <h4 className="text-xs uppercase font-semibold text-muted-foreground">Permissions:</h4>
              <ul className="mt-1 space-y-1">
                {role.permissions.map((permission, i) => (
                  <li key={i} className="text-xs flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {permission.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RoleTabs;
