
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Building2, UserCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all settings, merchants, and transactions. Monitor and manage the entire system.',
    icon: <Building2 className="h-8 w-8 text-primary" />,
    permissions: ['View all transactions', 'Manage merchants', 'System settings', 'Analytics access']
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'Accept payments, manage your store, and view transaction history for your business.',
    icon: <Users className="h-8 w-8 text-primary" />,
    permissions: ['Process payments', 'View your transactions', 'Business settings', 'Financial reports']
  },
  {
    id: 'client',
    name: 'Client',
    description: 'Make payments, view your transaction history, and manage your payment methods.',
    icon: <UserCircle className="h-8 w-8 text-primary" />,
    permissions: ['Make payments', 'View your transactions', 'Manage payment methods', 'View receipts']
  }
];

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const navigate = useNavigate();

  const handleContinue = () => {
    toast.success(`Logged in as ${selectedRole}`);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="shadow-lg border-0 overflow-hidden glass">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <CardDescription>
            Choose how you want to use FlowPay today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="admin"
            value={selectedRole}
            onValueChange={setSelectedRole}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
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
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6 pb-6 flex justify-end">
          <Button 
            onClick={handleContinue}
            className="rounded-full px-8 shadow-md transition-all"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSelector;
