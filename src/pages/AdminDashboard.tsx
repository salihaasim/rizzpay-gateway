
import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminSectionHeader from '@/components/admin/dashboard/AdminSectionHeader';
import AdminSectionContent from '@/components/admin/dashboard/AdminSectionContent';

const AdminDashboard = () => {
  const { userRole } = useTransactionStore();
  const { currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the active section from the URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes('/admin/merchants')) return 'merchants';
    if (path.includes('/admin/escrow')) return 'escrow';
    if (path.includes('/admin/pricing')) return 'pricing';
    if (path.includes('/admin/transactions')) return 'transactions';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/whitelist')) return 'whitelist';
    return 'dashboard';
  };
  
  // Determine admin access
  const isAdmin = currentMerchant?.role === 'admin' || userRole === 'admin';
  
  // If not admin, show access denied message
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
  
  const activeSection = getActiveSection();
  
  return (
    <AdminLayout>
      <div>
        <AdminSectionHeader section={activeSection} />
        <AdminSectionContent section={activeSection} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
