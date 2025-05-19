
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { Edit, Building, Bell, Shield, CreditCard, HelpCircle, Users, FileText } from 'lucide-react';
import ProfileEditForm from '@/components/settings/ProfileEditForm';
import BusinessInfoForm from '@/components/settings/BusinessInfoForm';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  // Check if we're on a sub-route of settings
  const isSubRoute = path !== '/settings';
  
  // Determine which tab is active based on route
  let activeTab = 'general';
  if (path.includes('/profile-edit')) activeTab = 'profile';
  else if (path.includes('/business-info')) activeTab = 'business';
  else if (path.includes('/notifications')) activeTab = 'notifications';
  else if (path.includes('/security-settings')) activeTab = 'security';
  else if (path.includes('/payment-methods')) activeTab = 'payment';
  else if (path.includes('/team-access')) activeTab = 'team';
  else if (path.includes('/documents')) activeTab = 'documents';
  else if (path.includes('/help')) activeTab = 'help';

  // If we're on a sub-route, render the appropriate component
  if (isSubRoute) {
    return (
      <div className="container py-10">
        <Routes>
          <Route path="/profile-edit" element={<ProfileEditForm />} />
          <Route path="/business-info" element={<BusinessInfoForm />} />
          <Route path="/notifications" element={<NotificationSettings />} />
          <Route path="/security-settings" element={<SecuritySettings />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    );
  }

  // Settings cards with navigation
  const settingsCards = [
    {
      id: 'profile',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: <Edit className="h-5 w-5" />,
      path: '/settings/profile-edit'
    },
    {
      id: 'business',
      title: 'Business Information',
      description: 'Update your business details',
      icon: <Building className="h-5 w-5" />,
      path: '/settings/business-info'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Manage how you receive notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/settings/notifications'
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure security options and passwords',
      icon: <Shield className="h-5 w-5" />,
      path: '/settings/security-settings'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage your payment methods',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/settings/payment-methods'
    },
    {
      id: 'team',
      title: 'Team Access',
      description: 'Manage team members and permissions',
      icon: <Users className="h-5 w-5" />,
      path: '/settings/team-access'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'View and manage your documents',
      icon: <FileText className="h-5 w-5" />,
      path: '/settings/documents'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help or contact support',
      icon: <HelpCircle className="h-5 w-5" />,
      path: '/settings/help'
    }
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="general" value={activeTab} className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {settingsCards.slice(0, 3).map(card => (
                <Card 
                  key={card.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(card.path)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {card.icon}
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {settingsCards.slice(3, 6).map(card => (
                <Card 
                  key={card.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(card.path)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {card.icon}
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/settings/payment-methods')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {settingsCards.slice(6).map(card => (
                <Card 
                  key={card.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(card.path)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {card.icon}
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
