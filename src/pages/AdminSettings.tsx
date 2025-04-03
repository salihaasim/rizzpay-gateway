
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminLayout from '@/components/admin/AdminLayout';

// Import refactored components
import RoleManagement from '@/components/admin/settings/RoleManagement';
import BankAPISettings from '@/components/admin/settings/BankAPISettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';

// Main Admin Settings page
const AdminSettings = () => {
  const navigate = useNavigate();
  const { currentMerchant } = useMerchantAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Small delay to ensure the store is properly loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }
  
  // Redirect non-admin users
  if (currentMerchant?.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
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
          <Button onClick={() => navigate("/admin")}>Save Settings</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
