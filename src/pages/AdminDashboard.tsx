
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Wallet, ShieldCheck, AlertTriangle, LineChart, CreditCard, DollarSign } from 'lucide-react';
import { adminUI } from '@/styles/rizzpay-ui';

const AdminDashboard = () => {
  const { userRole } = useTransactionStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('merchants');
  
  // Redirect non-admin users
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
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
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShieldCheck className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage merchants and monitor platform performance
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Merchant View
            </Button>
          </div>
        </div>
        
        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Merchants</p>
                  <h3 className="text-3xl font-bold mt-1">24</h3>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    12.5% this month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#9970e2]/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#9970e2]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <h3 className="text-3xl font-bold mt-1">₹1.2M</h3>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    8.2% this month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Transactions</p>
                  <h3 className="text-3xl font-bold mt-1">5,698</h3>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    15.3% this month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Wallets</p>
                  <h3 className="text-3xl font-bold mt-1">19</h3>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    4.8% this month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-border/50 shadow-sm">
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
    </AdminLayout>
  );
};

export default AdminDashboard;
