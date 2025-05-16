
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileEditForm from '@/components/settings/ProfileEditForm';
import BusinessInfoForm from '@/components/settings/BusinessInfoForm';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';

const Settings = () => {
  const { currentMerchant } = useMerchantAuth();
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  if (!currentMerchant) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex min-h-screen">
        <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-4">
            <div className="border-b">
              <TabsList className="bg-transparent -mb-px">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="business" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Business Information
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="profile" className="space-y-4 mt-4">
              <ProfileEditForm />
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4 mt-4">
              <BusinessInfoForm />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-4">
              <SecuritySettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
