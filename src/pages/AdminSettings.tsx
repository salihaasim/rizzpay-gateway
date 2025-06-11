
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import BankAPISettings from '@/components/admin/settings/BankAPISettings';
import BankCallbackSettings from '@/components/admin/settings/BankCallbackSettings';
import RoleManagement from '@/components/admin/settings/RoleManagement';
import AdminApiManagement from '@/pages/AdminApiManagement';
import { Settings, Shield, KeyRound, Link, Users, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Settings | RizzPay Admin</title>
      </Helmet>
      <div className="space-y-6 bg-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Settings</h1>
          <p className="text-slate-600">
            Manage your platform settings and configurations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="admin-tabs-list grid w-full grid-cols-6">
            <TabsTrigger value="general" className="admin-tabs-trigger flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="admin-tabs-trigger flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="bank-api" className="admin-tabs-trigger flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Bank API
            </TabsTrigger>
            <TabsTrigger value="callbacks" className="admin-tabs-trigger flex items-center gap-2">
              <Link className="h-4 w-4" />
              Callbacks
            </TabsTrigger>
            <TabsTrigger value="api-management" className="admin-tabs-trigger flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API Management
            </TabsTrigger>
            <TabsTrigger value="roles" className="admin-tabs-trigger flex items-center gap-2">
              <Users className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 bg-white">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 bg-white">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="bank-api" className="space-y-4 bg-white">
            <BankAPISettings />
          </TabsContent>

          <TabsContent value="callbacks" className="space-y-4 bg-white">
            <BankCallbackSettings />
          </TabsContent>

          <TabsContent value="api-management" className="space-y-4 bg-white">
            <AdminApiManagement />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4 bg-white">
            <RoleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
