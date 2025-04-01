import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Users, 
  Wallet, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Activity,
  Percent,
  Settings
} from 'lucide-react';
import { adminUI } from '@/styles/rizzpay-ui';
import { useProfileStore } from '@/stores/profileStore';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const AdminDashboard = () => {
  const { userRole } = useTransactionStore();
  const { currentMerchant } = useMerchantAuth();
  const { merchants } = useProfileStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the active section from the URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes('/admin/merchants')) return 'merchants';
    if (path.includes('/admin/escrow')) return 'escrow';
    if (path.includes('/admin/transactions')) return 'transactions';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveSection() === 'dashboard' ? 'merchants' : 'wallets');
  
  // Redirect non-admin users
  const isAdmin = currentMerchant?.role === 'admin' || userRole === 'admin';
  
  if (!isAdmin) {
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
  
  // Determine what content to show based on the path
  const renderContent = () => {
    const section = getActiveSection();
    
    switch (section) {
      case 'merchants':
        return <AdminMerchantsList />;
      case 'escrow':
        return <EscrowAccount />;
      case 'transactions':
        return (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Transaction Management</CardTitle>
              <CardDescription>Monitor and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Transaction management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Analytics Dashboard</CardTitle>
              <CardDescription>Platform performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Admin Settings</CardTitle>
              <CardDescription>Configure platform settings and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Admin settings interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        // Dashboard view - show overview
        return (
          <>
            {/* Admin Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <Card className="border border-border/50 shadow-sm">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Merchants</p>
                      <h3 className="text-3xl font-bold mt-1">{merchants.length}</h3>
                      <p className="text-xs text-emerald-500 mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
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
                        <TrendingUp className="w-3 h-3 mr-1" />
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
                        <TrendingUp className="w-3 h-3 mr-1" />
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
                      <p className="text-muted-foreground text-sm">Success Rate</p>
                      <h3 className="text-3xl font-bold mt-1">98.2%</h3>
                      <p className="text-xs text-emerald-500 mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        2.3% this month
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Percent className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <Card className="border border-border/50 shadow-sm xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Transaction Overview</CardTitle>
                  <CardDescription>
                    Month-to-date transaction performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <Activity className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
                  <CardDescription>
                    Distribution by payment type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
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
                    <EscrowAccount />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        );
    }
  };
  
  const title = () => {
    const section = getActiveSection();
    switch (section) {
      case 'merchants': return 'Merchant Management';
      case 'escrow': return 'Escrow Account';
      case 'transactions': return 'Transaction Management';
      case 'analytics': return 'Analytics Dashboard';
      case 'settings': return 'Admin Settings';
      default: return 'Admin Dashboard';
    }
  };
  
  const description = () => {
    const section = getActiveSection();
    switch (section) {
      case 'merchants': return 'Manage merchant accounts and permissions';
      case 'escrow': return 'Monitor and manage the platform escrow account';
      case 'transactions': return 'Monitor and manage payment transactions';
      case 'analytics': return 'Platform performance metrics and insights';
      case 'settings': return 'Configure platform settings and permissions';
      default: return 'Manage merchants and monitor platform performance';
    }
  };
  
  const icon = () => {
    const section = getActiveSection();
    switch (section) {
      case 'merchants': return <Users className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
      case 'escrow': return <Wallet className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
      case 'transactions': return <CreditCard className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
      case 'analytics': return <BarChart3 className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
      case 'settings': return <Settings className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
      default: return <ShieldCheck className="h-6 w-6 inline-block mr-2 text-[#9970e2]" />;
    }
  };
  
  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {icon()}
              {title()}
            </h1>
            <p className="text-muted-foreground mt-1">
              {description()}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Merchant View
            </Button>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
