
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Helmet } from 'react-helmet';

// Import refactored components
import RoleManagement from '@/components/admin/settings/RoleManagement';
import BankAPISettings from '@/components/admin/settings/BankAPISettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';

// Main Admin Settings page
const AdminSettings = () => {
  const navigate = useNavigate();
  const { currentMerchant } = useMerchantAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is admin
    if (currentMerchant && currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard', { replace: true });
    }
  }, [currentMerchant, navigate]);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      toast.success("Settings saved successfully");
      setIsLoading(false);
    }, 600);
  };
  
  // Show access denied if not admin
  if (currentMerchant && currentMerchant.role !== 'admin') {
    return null; // Will redirect via useEffect
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Settings | RizzPay</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system settings, roles, and integrations
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="api">Bank API</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <BankAPISettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
