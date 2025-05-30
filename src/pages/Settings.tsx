import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileEditForm from '../components/settings/ProfileEditForm';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import BusinessInfoForm from '../components/settings/BusinessInfoForm';
import { useMerchantAuth } from '../stores/merchantAuthStore';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentMerchant, loading } = useMerchantAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !currentMerchant) {
      navigate('/auth');
    }
  }, [currentMerchant, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!currentMerchant) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <Helmet>
        <title>Settings | RizzPay</title>
      </Helmet>
      <div className="container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4 sm:w-[600px] w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileEditForm merchant={currentMerchant} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings merchant={currentMerchant} />
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessInfoForm merchant={currentMerchant} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings merchant={currentMerchant} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
