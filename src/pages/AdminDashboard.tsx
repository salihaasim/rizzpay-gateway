
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Wallet } from 'lucide-react';

const AdminDashboard = () => {
  const { userRole } = useTransactionStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('merchants');
  
  // Redirect non-admin users
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container px-4 pt-20 pb-16 mx-auto">
          <Card className="max-w-md mx-auto text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin dashboard.
              </p>
              <Button onClick={() => navigate('/')}>
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
      
      <div className="container px-4 pt-20 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage merchants and monitor wallet balances
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="merchants" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
