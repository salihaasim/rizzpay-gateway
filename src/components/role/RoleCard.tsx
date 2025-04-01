
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: string[];
}

interface RoleCardProps {
  role: RolePermission;
}

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  return (
    <TabsContent
      key={role.id}
      value={role.id}
      className="mt-0 animate-fade-in"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center mt-4">
        <div className="min-w-[80px] flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            {role.icon}
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
          <p className="text-muted-foreground">{role.description}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {role.permissions.map((permission, idx) => (
              <div key={idx} className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                <span className="text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default RoleCard;
