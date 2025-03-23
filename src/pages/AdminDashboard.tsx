
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Wallet, ShieldCheck, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { userRole } = useTransactionStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('merchants');
  
  // Redirect non-admin users
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="content-wrapper">
          <Card className="max-w-md mx-auto text-center border-0 shadow-md overflow-hidden">
            <CardContent className="pt-10 pb-8 px-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You don't have permission to access the admin dashboard.
                Please contact your administrator for access.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-wrapper">
        <div className="page-header">
          <div>
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 -ml-3"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="page-title">
                <ShieldCheck className="h-6 w-6 inline-block mr-2 text-primary" />
                Admin Dashboard
              </h1>
            </div>
            <p className="page-description">
              Manage merchants and monitor wallet balances
            </p>
          </div>
        </div>
        
        <Card className="dashboard-card border border-border/50 mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Platform Overview</CardTitle>
            <CardDescription>
              Manage your platform's merchants and finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="merchants" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 max-w-md">
                <TabsTrigger value="merchants" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Merchants
                </TabsTrigger>
                <TabsTrigger value="wallets" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallets
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="merchants" className="space-y-4">
                <AdminMerchantsList />
              </TabsContent>
              
              <TabsContent value="wallets" className="space-y-4">
                <AdminMerchantsList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
